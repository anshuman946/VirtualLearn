export class WebRTCManager {
  private localStream: MediaStream | null = null
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private remoteStreams: Map<string, MediaStream> = new Map()
  private onRemoteStreamCallback?: (userId: string, stream: MediaStream) => void
  private onUserDisconnectedCallback?: (userId: string) => void

  constructor() {
    this.setupEventHandlers()
  }

  async initializeLocalStream(video = true, audio = true): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 640, height: 480 } : false,
        audio: audio,
      })
      return this.localStream
    } catch (error) {
      console.error("Failed to get user media:", error)
      throw error
    }
  }

  async createPeerConnection(userId: string, isInitiator = false): Promise<RTCPeerConnection> {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }

    const peerConnection = new RTCPeerConnection(configuration)
    this.peerConnections.set(userId, peerConnection)

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!)
      })
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      this.remoteStreams.set(userId, remoteStream)
      this.onRemoteStreamCallback?.(userId, remoteStream)
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage(userId, {
          type: "ice-candidate",
          candidate: event.candidate,
        })
      }
    }

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
        this.handleUserDisconnected(userId)
      }
    }

    if (isInitiator) {
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      this.sendSignalingMessage(userId, {
        type: "offer",
        offer: offer,
      })
    }

    return peerConnection
  }

  async handleSignalingMessage(userId: string, message: any) {
    const peerConnection = this.peerConnections.get(userId)
    if (!peerConnection) return

    switch (message.type) {
      case "offer":
        await peerConnection.setRemoteDescription(message.offer)
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        this.sendSignalingMessage(userId, {
          type: "answer",
          answer: answer,
        })
        break

      case "answer":
        await peerConnection.setRemoteDescription(message.answer)
        break

      case "ice-candidate":
        await peerConnection.addIceCandidate(message.candidate)
        break
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = enabled
      }
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = enabled
      }
    }
  }

  private handleUserDisconnected(userId: string) {
    const peerConnection = this.peerConnections.get(userId)
    if (peerConnection) {
      peerConnection.close()
      this.peerConnections.delete(userId)
    }
    this.remoteStreams.delete(userId)
    this.onUserDisconnectedCallback?.(userId)
  }

  private sendSignalingMessage(userId: string, message: any) {
    // This would typically send through WebSocket or Socket.IO
    // Implementation depends on your signaling server
    console.log("Sending signaling message:", { userId, message })
  }

  onRemoteStream(callback: (userId: string, stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback
  }

  onUserDisconnected(callback: (userId: string) => void) {
    this.onUserDisconnectedCallback = callback
  }

  cleanup() {
    this.peerConnections.forEach((pc) => pc.close())
    this.peerConnections.clear()
    this.remoteStreams.clear()
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }
  }

  private setupEventHandlers() {
    // Handle page unload
    window.addEventListener("beforeunload", () => {
      this.cleanup()
    })
  }
}
