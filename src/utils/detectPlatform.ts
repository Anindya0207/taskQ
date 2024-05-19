const detectPlatform = () => {
  if (!navigator?.userAgent) return 'MOBILE';
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    return 'MOBILE_BROWSER';
  }
  return 'WEB_BROWSER';
};

export default detectPlatform;