import { useEffect, useRef } from 'react'

const MouseStalker = () => {
  const stalkerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!stalkerRef.current) return
      stalkerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  return (
    <div
      ref={stalkerRef}
      className="mouse-stalker fixed top-0 left-0 w-4 h-4 rounded-full bg-orange-500 pointer-events-none z-50"
    />
  )
}
export default MouseStalker
