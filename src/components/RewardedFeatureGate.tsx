import React, {
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RewardedGateKey,
} from '../config/adsConfig';

import {
  isRewardedFeatureUnlocked,
  watchRewardedAdAndUnlock,
} from '../services/adUnlocks';

type Props = PropsWithChildren<{
  gateKey: RewardedGateKey;
  featureKey: string;
  title?: string;
  message?: string;
}>;

export default function RewardedFeatureGate({
  gateKey,
  featureKey,
  title,
  message,
  children,
}: Props) {
  const {t} =
    useTranslation();

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUnlocked, setIsUnlocked] =
    useState(false);

  const [isWatching, setIsWatching] =
    useState(false);

  useEffect(() => {
    let active = true;

    isRewardedFeatureUnlocked(
      gateKey,
      featureKey,
    )
      .then(result => {
        if (active) {
          setIsUnlocked(result);
        }
      })
      .catch(() => {
        if (active) {
          setIsUnlocked(true);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    featureKey,
    gateKey,
  ]);

  const unlock = async () => {
    if (isWatching) {
      return;
    }

    setIsWatching(true);

    try {
      const success =
        await watchRewardedAdAndUnlock(
          gateKey,
          featureKey,
        );

      if (success) {
        setIsUnlocked(true);
        return;
      }

      Alert.alert(
        t(
          'ads.rewardUnavailableTitle',
          {
            defaultValue:
              'Ad not ready',
          },
        ),
        t(
          'ads.rewardUnavailableMessage',
          {
            defaultValue:
              'The rewarded ad is not ready yet. Please try again in a moment.',
          },
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to unlock rewarded feature:',
        error,
      );

      Alert.alert(
        t(
          'ads.rewardErrorTitle',
          {
            defaultValue:
              'Unable to unlock',
          },
        ),
        t(
          'ads.rewardErrorMessage',
          {
            defaultValue:
              'Please check your connection and try again.',
          },
        ),
      );
    } finally {
      setIsWatching(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>
          ✦
        </Text>
      </View>

      <Text style={styles.title}>
        {title ??
          t(
            'ads.rewardGateTitle',
            {
              defaultValue:
                'Unlock advanced insight',
            },
          )}
      </Text>

      <Text style={styles.message}>
        {message ??
          t(
            'ads.rewardGateMessage',
            {
              defaultValue:
                'Watch one rewarded ad to unlock this advanced section for 24 hours.',
            },
          )}
      </Text>

      <Pressable
        disabled={isWatching}
        style={[
          styles.button,
          isWatching &&
            styles.buttonDisabled,
        ]}
        onPress={unlock}>
        <Text style={styles.buttonText}>
          {isWatching
            ? t(
                'ads.loadingAd',
                {
                  defaultValue:
                    'Loading ad...',
                },
              )
            : t(
                'ads.watchReward',
                {
                  defaultValue:
                    'Watch ad to unlock',
                },
              )}
        </Text>
      </Pressable>

      <Text style={styles.smallText}>
        {t(
          'ads.rewardGateSmallPrint',
          {
            defaultValue:
              'Premium users and ad-free users will not see this step.',
          },
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    alignItems: 'center',
    backgroundColor: '#17243A',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 22,
  },

  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.15)',
    borderWidth: 1,
    borderColor:
      'rgba(215,175,94,0.35)',
    borderRadius: 16,
  },

  icon: {
    color: '#F0D18B',
    fontSize: 24,
    fontWeight: '900',
  },

  title: {
    color: '#FFF7E5',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },

  message: {
    color: '#C8CFD9',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 7,
  },

  button: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D7AF5E',
    borderRadius: 14,
    paddingHorizontal: 18,
    marginTop: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#17243A',
    fontSize: 10,
    fontWeight: '900',
  },

  smallText: {
    color: '#9CA7B7',
    fontSize: 8.5,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 10,
  },
});
