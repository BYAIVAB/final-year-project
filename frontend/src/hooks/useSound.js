import { useRef, useCallback } from 'react'

const SOUNDS_ENABLED = import.meta.env.VITE_ENABLE_SOUNDS === 'true'

export const useSound = () => {
  const typingSoundRef = useRef(null)
  const sentSoundRef = useRef(null)

  // Initialize audio on first use
  const initAudio = useCallback(() => {
    if (!SOUNDS_ENABLED) return

    if (!typingSoundRef.current) {
      // For typing, we'll use a simple beep sound
      // In production, you'd load actual sound files
      typingSoundRef.current = {
        play: () => {
          // Play typing sound
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = 800
          oscillator.type = 'sine'
          gainNode.gain.value = 0.1
          
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.05)
        },
        stop: () => {}
      }
    }

    if (!sentSoundRef.current) {
      sentSoundRef.current = {
        play: () => {
          // Play message sent sound
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = 1000
          oscillator.type = 'sine'
          gainNode.gain.value = 0.15
          
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.1)
        }
      }
    }
  }, [])

  const playTyping = useCallback(() => {
    if (!SOUNDS_ENABLED) return
    initAudio()
    try {
      typingSoundRef.current?.play()
    } catch (err) {
      console.warn('Could not play typing sound:', err)
    }
  }, [initAudio])

  const stopTyping = useCallback(() => {
    if (!SOUNDS_ENABLED) return
    try {
      typingSoundRef.current?.stop()
    } catch (err) {
      // Ignore
    }
  }, [])

  const playMessageSent = useCallback(() => {
    if (!SOUNDS_ENABLED) return
    initAudio()
    try {
      sentSoundRef.current?.play()
    } catch (err) {
      console.warn('Could not play sent sound:', err)
    }
  }, [initAudio])

  return {
    playTyping,
    stopTyping,
    playMessageSent
  }
}
