"use client"

import { useState, useEffect } from "react"
import { VoiceInteraction } from "@/lib/voice-interaction"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface VoiceAssistantProps {
  onTranscript: (text: string) => void
  onSpeakResponse: (text: string) => void
  isEnabled?: boolean
}

export function VoiceAssistant({ onTranscript, onSpeakResponse, isEnabled = true }: VoiceAssistantProps) {
  const [voiceInteraction] = useState(() => new VoiceInteraction())
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsSupported(voiceInteraction.isSupported)

    voiceInteraction.onTranscript((transcript) => {
      onTranscript(transcript)
      setIsListening(false)
    })

    voiceInteraction.onError((error) => {
      setError(error)
      setIsListening(false)
    })

    return () => {
      voiceInteraction.stopListening()
      voiceInteraction.stopSpeaking()
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      voiceInteraction.stopListening()
      setIsListening(false)
    } else {
      const started = voiceInteraction.startListening()
      setIsListening(started)
      if (started) {
        setError(null)
      }
    }
  }

  const speakText = async (text: string) => {
    if (isSpeaking) {
      voiceInteraction.stopSpeaking()
      setIsSpeaking(false)
      return
    }

    try {
      setIsSpeaking(true)
      await voiceInteraction.speak(text, { rate: 0.9, pitch: 1.1 })
      setIsSpeaking(false)
      onSpeakResponse(text)
    } catch (error) {
      console.error("Speech synthesis error:", error)
      setIsSpeaking(false)
      setError("Failed to speak text")
    }
  }

  if (!isEnabled || !isSupported) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={toggleListening}
        className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>

      <Button
        variant={isSpeaking ? "default" : "outline"}
        size="sm"
        onClick={() => speakText("Hello! I'm ready to help you with your studies.")}
        disabled={isSpeaking}
      >
        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      {isListening && (
        <Badge variant="secondary" className="animate-pulse">
          Listening...
        </Badge>
      )}

      {isSpeaking && (
        <Badge variant="secondary" className="animate-pulse">
          Speaking...
        </Badge>
      )}

      {error && (
        <Badge variant="destructive" className="text-xs">
          {error}
        </Badge>
      )}
    </div>
  )
}
