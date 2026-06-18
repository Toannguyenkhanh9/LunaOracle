export async function initializeAds(): Promise<void> {
  console.info('Quảng cáo chưa được khởi tạo.');
}

export async function showInterstitialAd(): Promise<boolean> {
  console.info('Interstitial chưa được cài đặt.');
  return false;
}

export async function showRewardedAd(): Promise<boolean> {
  console.info('Rewarded ad chưa được cài đặt.');
  return false;
}