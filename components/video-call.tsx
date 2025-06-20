"use client"

import { useEffect, useRef, useState } from "react"
import { WebRTCManager } from "@/lib/webrtc"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, VideoOff, Mic, MicOff } from "lucide-react"

interface VideoCallProps {
  roomId: string
  userId: string
  participants: Array<{ id: string; name: string; avatar?: string }>
}

export function VideoCall({ roomId, userId, participants }: VideoCallProps) {
  const [webrtc] = useState(() => new WebRTCManager())
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

  useEffect(() => {
    initializeCall()

    return () => {
      webrtc.cleanup()
    }
  }, [])

  const initializeCall = async () => {
    try {
      const stream = await webrtc.initializeLocalStream(isVideoEnabled, isAudioEnabled)
      setLocalStream(stream)

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Set up remote stream handler
      webrtc.onRemoteStream((userId, stream) => {
        setRemoteStreams((prev) => new Map(prev.set(userId, stream)))

        const videoElement = remoteVideoRefs.current.get(userId)
        if (videoElement) {
          videoElement.srcObject = stream
        }
      })

      // Initialize peer connections for existing participants
      participants.forEach((participant) => {
        if (participant.id !== userId) {
          webrtc.createPeerConnection(participant.id, true)
        }
      })
    } catch (error) {
      console.error("Failed to initialize call:", error)
    }
  }

  const toggleVideo = () => {
    const newState = !isVideoEnabled
    setIsVideoEnabled(newState)
    webrtc.toggleVideo(newState)
  }

  const toggleAudio = () => {
    const newState = !isAudioEnabled
    setIsAudioEnabled(newState)
    webrtc.toggleAudio(newState)
  }

  return (
    <div className="bg-black p-4 grid grid-cols-2 gap-4 h-64">
      {/* Local video */}
      <div className="relative bg-gray-800 rounded-lg overflow-hidden">
        <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">You</div>
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            size="sm"
            variant={isVideoEnabled ? "default" : "destructive"}
            onClick={toggleVideo}
            className="h-8 w-8 p-0"
          >
            {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant={isAudioEnabled ? "default" : "destructive"}
            onClick={toggleAudio}
            className="h-8 w-8 p-0"
          >
            {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Remote videos */}
      {participants.slice(0, 3).map((participant) => {
        if (participant.id === userId) return null

        return (
          <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={(el) => {
                if (el) {
                  remoteVideoRefs.current.set(participant.id, el)
                  const stream = remoteStreams.get(participant.id)
                  if (stream) {
                    el.srcObject = stream
                  }
                }
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!remoteStreams.has(participant.id) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {participant.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
