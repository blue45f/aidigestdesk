import React, { useEffect, useRef, useState } from 'react'

export const IntroSplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('has-seen-aidigest-intro')
    }
    return true
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('has-seen-aidigest-intro', 'true')
    }, 3000)

    return () => clearTimeout(timer)
  }, [isVisible])

  // Neural Connection Network Canvas Animation
  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // AI neural nodes
    const nodes: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      color: string
      alpha: number
      pulseSpeed: number
      pulseVal: number
    }> = []

    const colors = [
      'rgba(6, 182, 212, ', // Cyan 500
      'rgba(16, 185, 129, ', // Emerald 500
      'rgba(139, 92, 246, ', // Violet 500
    ]

    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)] ?? 'rgba(6, 182, 212, ',
        alpha: Math.random() * 0.4 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseVal: Math.random() * Math.PI,
      })
    }

    const draw = () => {
      ctx.fillStyle = '#06070a' // Cyber black
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // Draw faint cyber neural coordinate circles
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(centerX, centerY, 220, 0, Math.PI * 2)
      ctx.stroke()

      // Draw nodes
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        n.pulseVal += n.pulseSpeed

        // Wrap edges
        if (n.x < 0) n.x = width
        if (n.x > width) n.x = 0
        if (n.y < 0) n.y = height
        if (n.y > height) n.y = 0

        const currentAlpha = n.alpha + Math.sin(n.pulseVal) * 0.15

        ctx.fillStyle = n.color + currentAlpha + ')'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw synapse connections
      ctx.lineWidth = 0.5
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i]
          const nj = nodes[j]
          if (!ni || !nj) continue

          const dx = ni.x - nj.x
          const dy = ni.y - nj.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            const alphaVal = (1 - dist / 130) * 0.18
            ctx.strokeStyle = `rgba(6, 182, 212, ${alphaVal})`
            ctx.beginPath()
            ctx.moveTo(ni.x, ni.y)
            ctx.lineTo(nj.x, nj.y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="ai-splash-overlay">
      <canvas ref={canvasRef} className="ai-splash-canvas" />

      {/* Cyber Grid Background */}
      <div className="ai-splash-grid-lines" />

      <div className="ai-splash-content">
        {/* Core Glowing CPU/Core Ring */}
        <div className="ai-splash-cpu-wrapper">
          <div className="ai-splash-cpu-ring-outer" />
          <div className="ai-splash-cpu-ring-inner" />
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ai-splash-cpu-icon"
          >
            {/* Sparkles / AI light concept */}
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
          </svg>
        </div>

        {/* Neural Text */}
        <h1 className="ai-splash-title">
          AIDigestDesk<span className="ai-splash-beta">Beta</span>
        </h1>
        <p className="ai-splash-subtitle">AI & LLM Curation Portal</p>

        {/* Shifting Neural Process Code */}
        <div className="ai-splash-process">
          <span className="ai-process-text font-mono">Initializing Intelligence Vector...</span>
        </div>
      </div>

      <style>{`
        .ai-splash-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #06070a;
          overflow: hidden;
          user-select: none;
          animation: aiFadeOut 0.8s cubic-bezier(0.16, 1, 0.3, 1) 2.7s forwards;
        }

        .ai-splash-canvas {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .ai-splash-grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.015) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: center;
          pointer-events: none;
        }

        .ai-splash-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .ai-splash-cpu-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 96px;
          height: 96px;
          background: rgba(10, 15, 26, 0.9);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 50%;
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.2);
          animation: aiPopIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ai-splash-cpu-ring-outer {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px dashed rgba(6, 182, 212, 0.4);
          animation: aiRotateClockwise 12s linear infinite;
        }

        .ai-splash-cpu-ring-inner {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px dotted rgba(16, 185, 129, 0.3);
          animation: aiRotateCounterClockwise 8s linear infinite;
        }

        .ai-splash-cpu-icon {
          color: #06b6d4;
          filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.8));
          animation: aiScalePulse 2s ease-in-out infinite;
        }

        .ai-splash-title {
          margin-top: 2rem;
          font-size: 2.25rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          transform: translateY(12px);
          animation: aiTextReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }

        .ai-splash-beta {
          padding: 1px 6px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0;
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 999px;
          text-transform: uppercase;
        }

        .ai-splash-subtitle {
          margin-top: 0.6rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: #94a3b8;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(12px);
          animation: aiTextReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
        }

        .ai-splash-process {
          margin-top: 2rem;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: rgba(6, 182, 212, 0.5);
          opacity: 0;
          animation: aiFadeIn 1s ease-in 1.2s forwards;
        }

        @keyframes aiPopIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes aiRotateClockwise {
          to { transform: rotate(360deg); }
        }

        @keyframes aiRotateCounterClockwise {
          to { transform: rotate(-360deg); }
        }

        @keyframes aiScalePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }

        @keyframes aiTextReveal {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes aiFadeIn {
          to { opacity: 1; }
        }

        @keyframes aiFadeOut {
          to { opacity: 0; visibility: hidden; filter: blur(20px); }
        }
      `}</style>
    </div>
  )
}
