import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
} from 'react-native';

import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

import {
  ADS_CONFIG,
} from '../config/adsConfig';

import {
  shouldShowBannerAds,
} from '../services/adController';

type Props = {
  visible?: boolean;
};

export default function SmallBannerAd({
  visible = true,
}: Props) {
  const [canShow, setCanShow] =
    useState(false);

  useEffect(() => {
    let active = true;

    shouldShowBannerAds()
      .then(result => {
        if (active) {
          setCanShow(
            visible && result,
          );
        }
      })
      .catch(() => {
        if (active) {
          setCanShow(false);
        }
      });

    return () => {
      active = false;
    };
  }, [visible]);

  if (
    !visible ||
    !canShow ||
    !ADS_CONFIG.enabled ||
    !ADS_CONFIG.bannerEnabled
  ) {
    return null;
  }

  return (
    <View>
      <BannerAd
        unitId={
          ADS_CONFIG.adUnitIds.banner
        }
        size={
          BannerAdSize.ANCHORED_ADAPTIVE_BANNER
        }
        requestOptions={{
          requestNonPersonalizedAdsOnly:
            true,
        }}
      />
    </View>
  );
}
