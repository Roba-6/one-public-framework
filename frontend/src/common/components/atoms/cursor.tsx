import { useEffect, useRef, useState } from 'react'

import clickCursor from '@/assets/images/cursor-click.gif'
import defaultCursor from '@/assets/images/cursor-default.gif'

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null)

  const mouseX = useRef(0)
  const mouseY = useRef(0)

  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
    }

    const handleDown = () => {
      setIsClicking(true)
    }

    const handleUp = () => {
      setIsClicking(false)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)

    let raf = 0

    const render = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `
          translate(
            ${mouseX.current - 2}px,
            ${mouseY.current - 2}px
          )
        `
      }

      raf = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)

      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="
        fixed
        left-0
        top-0
        pointer-events-none
        z-[2147483647]
      "
    >
      <img
        src={isClicking ? clickCursor : defaultCursor}
        alt=""
        width={24}
        height={24}
      />
    </div>
  )
}

export default Cursor
