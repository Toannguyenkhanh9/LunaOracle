import React, {
  type PropsWithChildren,
} from 'react';

import RewardedFeatureGate
  from './RewardedFeatureGate';

import type {
  RewardedGateKey,
} from '../config/adsConfig';

type Props = PropsWithChildren<{
  featureKey: string;
  title?: string;
  message?: string;
}>;

export default function TarotPremiumGate({
  featureKey,
  title,
  message,
  children,
}: Props) {
  return (
    <RewardedFeatureGate
      gateKey={
        'tarotAdvanced' as RewardedGateKey
      }
      featureKey={featureKey}
      title={
        title ??
        'Unlock advanced Tarot'
      }
      message={
        message ??
        'Watch one rewarded ad to unlock this Tarot spread for 24 hours. Premium users can open it anytime.'
      }>
      {children}
    </RewardedFeatureGate>
  );
}
