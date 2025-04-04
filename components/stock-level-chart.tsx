"use client"

import { useEffect, useRef } from "react"

export default function StockLevelChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const categories = ["Analgésicos", "Antibióticos", "Anti-inflamatórios", "Antialérgicos", "Vitaminas"]
    const stockLevels = [75, 45, 60, 80, 90]
    const maxStock = 100

    // Colors
    const barColors = [
      "rgba(16, 185, 129, 0.8)", // Green
      "rgba(245, 158, 11, 0.8)", // Amber
      "rgba(239, 68, 68, 0.8)", // Red
      "rgba(59, 130, 246, 0.8)", // Blue
      "rgba(139, 92, 246, 0.8)", // Purple
    ]

    // Calculate bar width and spacing
    const barWidth = (canvas.width - 40) / categories.length - 20
    const startX = 30

    // Draw bars
    for (let i = 0; i < categories.length; i++) {
      const x = startX + i * (barWidth + 20)
      const barHeight = (stockLevels[i] / maxStock) * (canvas.height - 60)
      const y = canvas.height - 30 - barHeight

      // Draw bar
      ctx.fillStyle = barColors[i]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw category label
      ctx.fillStyle = "#6B7280"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(categories[i], x + barWidth / 2, canvas.height - 10)

      // Draw stock level
      ctx.fillStyle = "#111827"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${stockLevels[i]}%`, x + barWidth / 2, y - 5)
    }

    // Draw y-axis
    ctx.strokeStyle = "#E5E7EB"
    ctx.beginPath()
    ctx.moveTo(20, 10)
    ctx.lineTo(20, canvas.height - 30)
    ctx.lineTo(canvas.width - 10, canvas.height - 30)
    ctx.stroke()

    // Draw y-axis labels
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const value = i * 25
      const y = canvas.height - 30 - (value / maxStock) * (canvas.height - 60)
      ctx.fillText(`${value}%`, 15, y + 4)

      // Draw horizontal grid line
      ctx.strokeStyle = "#F3F4F6"
      ctx.beginPath()
      ctx.moveTo(20, y)
      ctx.lineTo(canvas.width - 10, y)
      ctx.stroke()
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  )
}

