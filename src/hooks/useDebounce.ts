import { useRef, useCallback } from 'react'

const useDebounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debounced = useCallback((...args: T) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      fn(...args)
    }, delay)
  }, [fn, delay])

  // cleanup on unmount
  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  return { debounced, cancel }
}

export default useDebounce