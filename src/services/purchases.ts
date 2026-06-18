export type PurchaseResult = {
  success: boolean;
  message: string;
};

export async function purchaseRemoveAds(): Promise<PurchaseResult> {
  return {
    success: false,
    message: 'Chức năng mua gói Remove Ads chưa được cài đặt.',
  };
}

export async function restorePurchases(): Promise<PurchaseResult> {
  return {
    success: false,
    message: 'Chức năng khôi phục giao dịch chưa được cài đặt.',
  };
}