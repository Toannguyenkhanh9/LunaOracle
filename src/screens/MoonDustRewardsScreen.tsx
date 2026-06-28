import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import MoonDustRewardCard
  from '../components/MoonDustRewardCard';

import LunaShareButton
  from '../components/LunaShareButton';

import {
  MOON_DUST_MILESTONES,
  claimDailyMoonDust,
  getMoonDustClaimPreview,
  getMoonDustRewardState,
  type MoonDustClaimResult,
  type MoonDustRewardState,
} from '../services/moonDustRewards';

type Preview = {
  alreadyClaimed: boolean;
  nextStreak: number;
  moonDust: number;
};

export default function MoonDustRewardsScreen() {
  const {t} =
    useTranslation();

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

  const [
    lastClaim,
    setLastClaim,
  ] =
    useState<MoonDustClaimResult | undefined>();

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

    setLastClaim(result);
    setState(result.state);
    setPreview(
      await getMoonDustClaimPreview(),
    );

    if (result.alreadyClaimed) {
      Alert.alert(
        t(
          'moonDust.claimed',
          {
            defaultValue:
              'Claimed',
          },
        ),
        t(
          'moonDust.alreadyClaimedMessage',
          {
            defaultValue:
              'You already claimed today’s Moon Dust.',
          },
        ),
      );

      return;
    }

    const unlockText =
      result.reward.unlocks
        .map(unlock =>
          t(
            unlock.titleKey,
            {
              defaultValue:
                unlock.titleFallback,
            },
          ),
        )
        .join(', ');

    Alert.alert(
      t(
        'moonDust.claimSuccessTitle',
        {
          defaultValue:
            'Moon Dust claimed',
        },
      ),
      unlockText
        ? t(
            'moonDust.claimSuccessWithUnlock',
            {
              amount:
                result.reward.moonDust,
              unlock:
                unlockText,
              defaultValue:
                `You earned ${result.reward.moonDust} Moon Dust and unlocked ${unlockText}.`,
            },
          )
        : t(
            'moonDust.claimSuccess',
            {
              amount:
                result.reward.moonDust,
              defaultValue:
                `You earned ${result.reward.moonDust} Moon Dust.`,
            },
          ),
    );
  };

  if (!state || !preview) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            {t('common.loading', {
              defaultValue: 'Loading...',
            })}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const nextMilestone =
    MOON_DUST_MILESTONES.find(
      item =>
        item.day >
        state.currentStreak,
    );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
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
            'moonDust.title',
            {
              defaultValue:
                'Moon Dust Rewards',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'moonDust.subtitle',
            {
              defaultValue:
                'Claim Moon Dust each day, keep your streak, and unlock mystical rewards.',
            },
          )}
        </Text>

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>
              {t(
                'moonDust.balance',
                {
                  defaultValue:
                    'Balance',
                },
              )}
            </Text>

            <Text style={styles.balance}>
              {state.balance}
              <Text style={styles.balanceIcon}>
                {' '}✦
              </Text>
            </Text>
          </View>

          <View style={styles.streakOrb}>
            <Text style={styles.streakValue}>
              {state.currentStreak}
            </Text>

            <Text style={styles.streakLabel}>
              {t(
                'moonDust.streak',
                {
                  defaultValue:
                    'Streak',
                },
              )}
            </Text>
          </View>
        </View>

        <View style={styles.claimCard}>
          <Text style={styles.claimTitle}>
            {preview.alreadyClaimed
              ? t(
                  'moonDust.claimedTodayTitle',
                  {
                    defaultValue:
                      'Today is complete',
                  },
                )
              : t(
                  'moonDust.readyTitle',
                  {
                    defaultValue:
                      'Daily reward ready',
                  },
                )}
          </Text>

          <Text style={styles.claimMessage}>
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

          <Pressable
            disabled={
              preview.alreadyClaimed
            }
            style={[
              styles.claimButton,
              preview.alreadyClaimed &&
                styles.claimButtonDisabled,
            ]}
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

          {lastClaim?.reward.unlocks
            .length ? (
            <View style={styles.unlockBox}>
              <Text style={styles.unlockTitle}>
                {t(
                  'moonDust.newUnlock',
                  {
                    defaultValue:
                      'New unlock',
                  },
                )}
              </Text>

              {lastClaim.reward.unlocks.map(
                unlock => (
                  <Text
                    key={unlock.id}
                    style={styles.unlockText}>
                    ✦{' '}
                    {t(
                      unlock.titleKey,
                      {
                        defaultValue:
                          unlock.titleFallback,
                      },
                    )}
                  </Text>
                ),
              )}
            </View>
          ) : null}
        </View>

        <View style={styles.statsRow}>
          <StatBox
            label={t(
              'moonDust.best',
              {
                defaultValue:
                  'Best',
              },
            )}
            value={`${state.bestStreak}`}
          />

          <StatBox
            label={t(
              'moonDust.earned',
              {
                defaultValue:
                  'Earned',
              },
            )}
            value={`${state.totalEarned}`}
          />

          <StatBox
            label={t(
              'moonDust.unlocked',
              {
                defaultValue:
                  'Unlocked',
              },
            )}
            value={`${state.unlockedIds.length}`}
          />
        </View>

        <LunaShareButton
          data={{
            variant: 'achievement',
            title:
              t(
                'moonDust.shareTitle',
                {
                  defaultValue:
                    'My Moon Dust Streak',
                },
              ),
            subtitle:
              t(
                'moonDust.shareSubtitle',
                {
                  defaultValue:
                    'Luna Oracle Daily Reward',
                },
              ),
            message:
              t(
                'moonDust.shareMessage',
                {
                  streak:
                    state.currentStreak,
                  balance:
                    state.balance,
                  defaultValue:
                    `I have a ${state.currentStreak}-day Luna Oracle streak and ${state.balance} Moon Dust.`,
                },
              ),
            score:
              state.currentStreak,
            badge: 'STREAK',
            tags: [
              'streak',
              'moondust',
              'luna',
            ],
          }}
        />

        <Text style={styles.sectionTitle}>
          {t(
            'moonDust.milestones',
            {
              defaultValue:
                'Milestones',
            },
          )}
        </Text>

        {MOON_DUST_MILESTONES.map(
          milestone => (
            <MoonDustRewardCard
              key={milestone.day}
              milestone={milestone}
              active={
                nextMilestone?.day ===
                milestone.day
              }
              unlocked={
                milestone.unlock
                  ? state.unlockedIds.includes(
                      milestone.unlock.id,
                    )
                  : state.currentStreak >=
                    milestone.day
              }
            />
          ),
        )}

        <Text style={styles.notice}>
          {t(
            'moonDust.notice',
            {
              defaultValue:
                'Moon Dust is stored locally on this device. It is designed for motivation and app engagement.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  night: '#1B1537',
  purple: '#6E4DA8',
  gold: '#D9B76E',
  text: '#282236',
  muted: '#756D7D',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.muted,
    fontWeight: '800',
  },

  content: {
    padding: 18,
    paddingBottom: 110,
  },

  eyebrow: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 16,
  },

  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  balance: {
    color: '#FFF8EA',
    fontSize: 50,
    fontWeight: '900',
    marginTop: 3,
  },

  balanceIcon: {
    color: COLORS.gold,
    fontSize: 26,
  },

  streakOrb: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217,183,110,0.14)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 52,
    marginLeft: 'auto',
  },

  streakValue: {
    color: '#FFF8EA',
    fontSize: 40,
    fontWeight: '900',
  },

  streakLabel: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  claimCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },

  claimTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },

  claimMessage: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  claimButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    backgroundColor: COLORS.gold,
    borderRadius: 17,
    marginTop: 14,
  },

  claimButtonDisabled: {
    backgroundColor: '#EEE6F4',
  },

  claimText: {
    color: COLORS.night,
    fontSize: 14,
    fontWeight: '900',
  },

  unlockBox: {
    backgroundColor: '#F4ECFF',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },

  unlockTitle: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  unlockText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 6,
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 14,
  },

  statBox: {
    flex: 1,
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 5,
  },

  statValue: {
    color: COLORS.purple,
    fontSize: 22,
    fontWeight: '900',
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 12,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
  },
});
