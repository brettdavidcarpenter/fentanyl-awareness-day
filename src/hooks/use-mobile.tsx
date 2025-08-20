import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Enhanced mobile detection for real devices vs browser preview
export function useIsRealMobile() {
  const [isRealMobile, setIsRealMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkRealMobile = () => {
      const userAgent = navigator.userAgent
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent)
      const isAndroidDevice = /Android/.test(userAgent)
      const isMobileUA = /Mobi|Android/i.test(userAgent)
      const isNarrowViewport = window.innerWidth < MOBILE_BREAKPOINT
      
      // Real mobile if: touch device + mobile UA + narrow viewport + not desktop browser preview
      const realMobile = isTouchDevice && (isIOSDevice || isAndroidDevice || isMobileUA) && isNarrowViewport
      
      console.log('Mobile detection:', {
        userAgent,
        isTouchDevice,
        isIOSDevice,
        isAndroidDevice,
        isMobileUA,
        isNarrowViewport,
        realMobile,
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight
      })
      
      setIsRealMobile(realMobile)
    }

    checkRealMobile()
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkRealMobile)
    window.addEventListener("resize", checkRealMobile)
    
    return () => {
      mql.removeEventListener("change", checkRealMobile)
      window.removeEventListener("resize", checkRealMobile)
    }
  }, [])

  return !!isRealMobile
}
