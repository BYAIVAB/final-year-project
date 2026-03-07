import { useEffect, useRef } from 'react'

export const useAutoScroll = (dependencies = []) => {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, dependencies)

  return scrollRef
}
