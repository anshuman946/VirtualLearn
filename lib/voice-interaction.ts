import type { SpeechRecognition } from "speech-recognition"

export class VoiceInteraction {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis
  private isListening = false
  private onTranscriptCallback?: (transcript: string) => void
  private onErrorCallback?: (error: string) => void

  constructor() {
    this.synthesis = window.speechSynthesis
    this.initializeSpeechRecognition()
  }

  private initializeSpeechRecognition() {
    if ("webkitSpeechRecognition" in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
    } else if ("SpeechRecognition" in window) {
      this.recognition = new (window as any).SpeechRecognition()
    }

    if (this.recognition) {
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = "en-US"

      this.recognition.onresult = (event) => {
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }

        if (finalTranscript) {
          this.onTranscriptCallback?.(finalTranscript.trim())
        }
      }

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        this.onErrorCallback?.(event.error)
        this.isListening = false
      }

      this.recognition.onend = () => {
        this.isListening = false
      }
    }
  }

  startListening(): boolean {
    if (!this.recognition) {
      this.onErrorCallback?.("Speech recognition not supported")
      return false
    }

    if (this.isListening) {
      return true
    }

    try {
      this.recognition.start()
      this.isListening = true
      return true
    } catch (error) {
      console.error("Failed to start speech recognition:", error)
      this.onErrorCallback?.("Failed to start listening")
      return false
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Speech synthesis not supported"))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options.rate || 1
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(event.error))

      // Try to use a more natural voice
      const voices = this.synthesis.getVoices()
      const preferredVoice = voices.find(
        (voice) => voice.name.includes("Google") || voice.name.includes("Microsoft") || voice.lang.startsWith("en"),
      )

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      this.synthesis.speak(utterance)
    })
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  onTranscript(callback: (transcript: string) => void) {
    this.onTranscriptCallback = callback
  }

  onError(callback: (error: string) => void) {
    this.onErrorCallback = callback
  }

  get isSupported(): boolean {
    return !!(this.recognition && this.synthesis)
  }

  get listening(): boolean {
    return this.isListening
  }
}
