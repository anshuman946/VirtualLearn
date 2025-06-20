"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Pen, Eraser, Square, Circle, Minus, Type, Palette, RotateCcw, Download, Users } from "lucide-react"

interface WhiteboardProps {
  roomId: string
  isEnabled?: boolean
  onDrawingChange?: (data: any) => void
}

interface DrawingData {
  type: "draw" | "erase" | "shape" | "text"
  points: { x: number; y: number }[]
  color: string
  size: number
  tool: string
  timestamp: number
}

export function CollaborativeWhiteboard({ roomId, isEnabled = true, onDrawingChange }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser" | "rectangle" | "circle" | "line" | "text">("pen")
  const [currentColor, setCurrentColor] = useState("#000000")
  const [currentSize, setCurrentSize] = useState(2)
  const [drawingData, setDrawingData] = useState<DrawingData[]>([])
  const [activeUsers, setActiveUsers] = useState<string[]>(["You"])

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500"]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set default styles
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEnabled) return

    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isEnabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineWidth = currentSize
    ctx.strokeStyle = currentTool === "eraser" ? "#FFFFFF" : currentColor
    ctx.globalCompositeOperation = currentTool === "eraser" ? "destination-out" : "source-over"

    ctx.lineTo(x, y)
    ctx.stroke()

    // Emit drawing data for real-time collaboration
    const drawingPoint: DrawingData = {
      type: currentTool === "eraser" ? "erase" : "draw",
      points: [{ x, y }],
      color: currentColor,
      size: currentSize,
      tool: currentTool,
      timestamp: Date.now(),
    }

    onDrawingChange?.(drawingPoint)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setDrawingData([])

    onDrawingChange?.({ type: "clear", timestamp: Date.now() })
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `whiteboard-${roomId}-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const selectTool = (tool: typeof currentTool) => {
    setCurrentTool(tool)
  }

  if (!isEnabled) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Whiteboard is disabled for this room</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          {/* Drawing Tools */}
          <div className="flex items-center space-x-1">
            <Button variant={currentTool === "pen" ? "default" : "outline"} size="sm" onClick={() => selectTool("pen")}>
              <Pen className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => selectTool("eraser")}
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Shape Tools */}
          <div className="flex items-center space-x-1">
            <Button
              variant={currentTool === "rectangle" ? "default" : "outline"}
              size="sm"
              onClick={() => selectTool("rectangle")}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "circle" ? "default" : "outline"}
              size="sm"
              onClick={() => selectTool("circle")}
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => selectTool("line")}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => selectTool("text")}
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Colors */}
          <div className="flex items-center space-x-1">
            <Palette className="h-4 w-4 text-gray-500" />
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded border-2 ${currentColor === color ? "border-gray-800" : "border-gray-300"}`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Size */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={currentSize}
              onChange={(e) => setCurrentSize(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-sm text-gray-600 w-6">{currentSize}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Active Users */}
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-500" />
            <Badge variant="secondary">{activeUsers.length} active</Badge>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Actions */}
          <Button variant="outline" size="sm" onClick={clearCanvas}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCanvas}>
            <Download className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  )
}
