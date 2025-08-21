export interface MobileInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  userAgent: string;
}

export const getMobileInfo = (): MobileInfo => {
  const userAgent = navigator.userAgent || '';
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isChrome = /Chrome/.test(userAgent);

  return {
    isMobile,
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    userAgent
  };
};

export const getMobileOptimizedCanvasOptions = (mobileInfo: MobileInfo) => {
  const baseOptions = {
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    imageTimeout: mobileInfo.isMobile ? 20000 : 15000, // Longer timeout for mobile
    logging: false,
  };

  if (mobileInfo.isMobile) {
    return {
      ...baseOptions,
      scale: mobileInfo.isIOS ? 2 : 2.5, // Lower scale for iOS Safari
      foreignObjectRendering: false, // Disable for mobile compatibility
      removeContainer: true,
      scrollX: 0,
      scrollY: 0,
    };
  }

  return {
    ...baseOptions,
    scale: 3,
    foreignObjectRendering: false,
  };
};