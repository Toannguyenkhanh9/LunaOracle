import React, {
  useCallback,
  useState,
} from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  claimDailyMoonDust,
  getMoonDustClaimPreview,
  getMoonDustRewardState,
  type MoonDustRewardState,
} from '../services/moonDustRewards';

type NavigationLike = {
  navigate: (
    routeName: string,
  ) => void;
};

type Preview = {
  alreadyClaimed: boolean;
  nextStreak: number;
  moonDust: number;
};

export default function MoonDustMiniCard() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    state,
    setState,
  ] =
    useState<MoonDustRewardState | undefined>();

  const [
    preview,
    setPreview,
  ] =
    useState<Preview | undefined>();

  const load = useCallback(
    async () => {
      const [
        nextState,
        nextPreview,
      ] =
        await Promise.all([
          getMoonDustRewardState(),
          getMoonDustClaimPreview(),
        ]);

      setState(nextState);
      setPreview(nextPreview);
    },
    [],
  );

  useFocusEffect(
    useCallback(
      () => {
        void load();
      },
      [load],
    ),
  );

  const claim = async () => {
    const result =
      await claimDailyMoonDust();

    setState(result.state);
    setPreview(
      await getMoonDustClaimPreview(),
    );
  };

  if (!state || !preview) {
    return (
      <View style={styles.card}>
        <Text style={styles.loading}>
          {t('common.loading', {
            defaultValue: 'Loading...',
          })}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>
            {t(
              'moonDust.eyebrow',
              {
                defaultValue:
                  'Daily Reward',
              },
            )}
          </Text>

          <Text style={styles.title}>
            {t(
              'moonDust.homeTitle',
              {
                defaultValue:
                  'Moon Dust',
              },
            )}
          </Text>
        </View>

        <View style={styles.balancePill}>
          <Text style={styles.balanceValue}>
            {state.balance}
          </Text>

          <Text style={styles.balanceLabel}>
            ✦
          </Text>
        </View>
      </View>

      <Text style={styles.message}>
        {preview.alreadyClaimed
          ? t(
              'moonDust.claimedToday',
              {
                defaultValue:
                  'Reward claimed today. Come back tomorrow to continue your streak.',
              },
            )
          : t(
              'moonDust.readyMessage',
              {
                amount:
                  preview.moonDust,
                streak:
                  preview.nextStreak,
                defaultValue:
                  `Claim ${preview.moonDust} Moon Dust for day ${preview.nextStreak}.`,
              },
            )}
      </Text>

      <View style={styles.statRow}>
        <Stat
          label={t(
            'moonDust.streak',
            {
              defaultValue:
                'Streak',
            },
          )}
          value={`${state.currentStreak}`}
        />

        <Stat
          label={t(
            'moonDust.best',
            {
              defaultValue:
                'Best',
            },
          )}
          value={`${state.bestStreak}`}
        />

        <Stat
          label={t(
            'moonDust.earned',
            {
              defaultValue:
                'Earned',
            },
          )}
          value={`${state.totalEarned}`}
        />
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[
            styles.claimButton,
            preview.alreadyClaimed &&
              styles.claimButtonDisabled,
          ]}
          disabled={
            preview.alreadyClaimed
          }
          onPress={claim}>
          <Text style={styles.claimText}>
            {preview.alreadyClaimed
              ? t(
                  'moonDust.claimed',
                  {
                    defaultValue:
                      'Claimed',
                  },
                )
              : t(
                  'moonDust.claim',
                  {
                    defaultValue:
                      'Claim Reward',
                  },
                )}
          </Text>
        </Pressable>

        <Pressable
          style={styles.openButton}
          onPress={() =>
            navigation.navigate(
              'MoonDustRewards',
            )
          }>
          <Text style={styles.openText}>
            {t(
              'moonDust.openRewards',
              {
                defaultValue:
                  'Rewards',
              },
            )}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: '#1B1537',
    borderRadius: 28,
    padding: 16,
    marginTop: 16,
  },

  loading: {
    color: '#F8EBCB',
    fontWeight: '800',
    textAlign: 'center',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  eyebrow: {
    color: '#D9B76E',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  title: {
    color: '#FFF8EA',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 3,
  },

  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217,183,110,0.15)',
    borderWidth: 1,
    borderColor: '#D9B76E',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 'auto',
  },

  balanceValue: {
    color: '#FFF8EA',
    fontSize: 18,
    fontWeight: '900',
    marginRight: 5,
  },

  balanceLabel: {
    color: '#D9B76E',
    fontSize: 14,
    fontWeight: '900',
  },

  message: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 10,
  },

  statRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 13,
  },

  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 4,
  },

  statValue: {
    color: '#FFF8EA',
    fontSize: 19,
    fontWeight: '900',
  },

  statLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  claimButton: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    backgroundColor: '#D9B76E',
    borderRadius: 16,
    marginRight: 8,
  },

  claimButtonDisabled: {
    backgroundColor: '#EEE6F4',
  },

  claimText: {
    color: '#1B1537',
    fontSize: 12,
    fontWeight: '900',
  },

  openButton: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 16,
  },

  openText: {
    color: '#F8EBCB',
    fontSize: 12,
    fontWeight: '900',
  },
});
