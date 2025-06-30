
export const isAdminMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('admin') || urlParams.has('debug');
};
