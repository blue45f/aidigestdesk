import { useEffect, useRef, useState } from 'react'

interface SynapseNode {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  alpha: number
}

export default function IntroSplashScreen() {
  // 세션당 1회만 재생 — WebView 재로드 시 2.7s 스플래시 반복을 막아 첫 콘텐츠 도달을 빠르게.
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return sessionStorage.getItem('aidigest:intro') !== '1'
    } catch {
      return true
    }
  })
  const [isFading, setIsFading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!isVisible) return
    const fadeTimer = setTimeout(() => setIsFading(true), 2000)
    const destroyTimer = setTimeout(() => {
      setIsVisible(false)
      try {
        sessionStorage.setItem('aidigest:intro', '1')
      } catch {
        /* sessionStorage 불가 환경은 매번 재생(허용) */
      }
    }, 2700)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(destroyTimer)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const nodes: SynapseNode[] = []
    const colors = [
      'rgba(147, 51, 234, ', // Purple
      'rgba(59, 130, 246, ', // Royal Blue
      'rgba(16, 185, 129, ', // Emerald (AI energy)
    ]

    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
        r: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)] ?? colors[0]!,
        alpha: Math.random() * 0.5 + 0.3,
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    let frameCount = 0
    const render = () => {
      frameCount++
      ctx.fillStyle = '#080512' // Deep Cyber Space background
      ctx.fillRect(0, 0, width, height)

      // Network lines & nodes
      nodes.forEach((n, idx) => {
        if (!n) return
        n.x += n.vx
        n.y += n.vy

        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.color + n.alpha + ')'
        ctx.fill()

        for (let j = idx + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          if (!n2) continue
          const dx = n.x - n2.x
          const dy = n.y - n2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 90) {
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(n2.x, n2.y)
            const lineAlpha = (1 - dist / 90) * 0.15 * Math.min(n.alpha, n2.alpha)
            ctx.strokeStyle = `rgba(147, 51, 234, ${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      // Main Text
      const text = 'AI DIGEST'
      ctx.font = '900 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.letterSpacing = '6px'
      ctx.fillStyle = '#ffffff'
      
      ctx.shadowBlur = 12
      ctx.shadowColor = 'rgba(147, 51, 234, 0.6)'

      const progress = Math.min(frameCount / 40, 1)
      const currentText = text.substring(0, Math.floor(text.length * progress))
      ctx.fillText(currentText, width / 2, height / 2)
      ctx.shadowBlur = 0

      // Sub
      ctx.font = '500 10px monospace'
      ctx.letterSpacing = '2px'
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'
      ctx.fillText('AI SUMMARY CONSOLE', width / 2, height / 2 + 32)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080512',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
