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

import TarotCardImage
  from '../components/TarotCardImage';

import LunaShareButton
  from '../components/LunaShareButton';

import {
  buildPremiumDeepReading,
  getPremiumDeepReadingCost,
  unlockPremiumDeepReadingWithMoonDust,
  type PremiumDeepReading,
  type PremiumDeepReadingType,
} from '../services/premiumDeepReading';

const TYPES:
PremiumDeepReadingType[] = [
  'tarot',
  'love',
  'year',
  'birthChart',
];

export default function PremiumDeepReadingScreen() {
  const {t} =
    useTranslation();

  const [
    type,
    setType,
  ] =
    useState<PremiumDeepReadingType>(
      'tarot',
    );

  const [
    reading,
    setReading,
  ] =
    useState<PremiumDeepReading | undefined>();

  const load = useCallback(
    async (
      nextType = type,
    ) => {
      setReading(
        await buildPremiumDeepReading(
          nextType,
        ),
      );
    },
    [type],
  );

  useFocusEffect(
    useCallback(
      () => {
        void load();
      },
      [load],
    ),
  );

  const switchType =
    async (
      nextType: PremiumDeepReadingType,
    ) => {
      setType(nextType);
      await load(nextType);
    };

  const unlock = async () => {
    const success =
      await unlockPremiumDeepReadingWithMoonDust();

    if (!success) {
      Alert.alert(
        t(
          'premiumDeepReading.notEnoughTitle',
          {
            defaultValue:
              'Not enough Moon Dust',
          },
        ),
        t(
          'premiumDeepReading.notEnoughMessage',
          {
            cost:
              getPremiumDeepReadingCost(),
            defaultValue:
              `You need ${getPremiumDeepReadingCost()} Moon Dust to unlock deep readings.`,
          },
        ),
      );

      return;
    }

    Alert.alert(
      t(
        'premiumDeepReading.unlockedTitle',
        {
          defaultValue:
            'Unlocked',
        },
      ),
      t(
        'premiumDeepReading.unlockedMessage',
        {
          defaultValue:
            'Premium deep readings are now available on this device.',
        },
      ),
    );

    await load();
  };

  if (!reading) {
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

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'premiumDeepReading.eyebrow',
            {
              defaultValue:
                'Premium',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'premiumDeepReading.title',
            {
              defaultValue:
                'Premium Deep Reading',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'premiumDeepReading.subtitle',
            {
              defaultValue:
                'Long-form local readings with deeper patterns, shadow notes, timing, and action guidance.',
            },
          )}
        </Text>

        <View style={styles.typeRow}>
          {TYPES.map(item => (
            <Pressable
              key={item}
              style={[
                styles.typeChip,
                type === item &&
                  styles.typeChipActive,
              ]}
              onPress={() =>
                switchType(item)
              }>
              <Text
                style={[
                  styles.typeText,
                  type === item &&
                    styles.typeTextActive,
                ]}>
                {t(
                  `premiumDeepReading.types.${item}.tab`,
                  {
                    defaultValue:
                      item,
                  },
                )}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroLabel}>
              {t(
                reading.titleId,
                {
                  defaultValue:
                    'Deep Reading',
                },
              )}
            </Text>

            <Text style={styles.heroScore}>
              {reading.score}
            </Text>

            <Text style={styles.heroText}>
              {t(
                reading.summaryId,
                {
                  card:
                    reading.draw.card.name,
                  defaultValue:
                    'A deeper interpretation is ready.',
                },
              )}
            </Text>
          </View>

          <TarotCardImage
            cardId={
              reading.draw.card.id ??
              reading.draw.card.name
            }
            title={
              reading.draw.card.name
            }
            reversed={
              reading.draw.orientation ===
              'reversed'
            }
            width={88}
            height={140}
          />
        </View>

        {!reading.unlocked ? (
          <View style={styles.lockCard}>
            <Text style={styles.lockTitle}>
              {t(
                'premiumDeepReading.lockTitle',
                {
                  defaultValue:
                    'Unlock full reading',
                },
              )}
            </Text>

            <Text style={styles.lockText}>
              {t(
                'premiumDeepReading.lockMessage',
                {
                  cost:
                    getPremiumDeepReadingCost(),
                  defaultValue:
                    `Use ${getPremiumDeepReadingCost()} Moon Dust to unlock all deep reading sections on this device.`,
                },
              )}
            </Text>

            <Pressable
              style={styles.unlockButton}
              onPress={unlock}>
              <Text style={styles.unlockText}>
                {t(
                  'premiumDeepReading.unlockButton',
                  {
                    cost:
                      getPremiumDeepReadingCost(),
                    defaultValue:
                      `Unlock · ${getPremiumDeepReadingCost()} ✦`,
                  },
                )}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {reading.sections.map(section => (
          <View
            key={section.id}
            style={[
              styles.sectionCard,
              section.locked &&
                styles.sectionLocked,
            ]}>
            <Text style={styles.sectionTitle}>
              {t(
                section.titleId,
                {
                  defaultValue:
                    section.id,
                },
              )}
            </Text>

            <Text style={styles.sectionBody}>
              {section.locked
                ? t(
                    'premiumDeepReading.lockedSection',
                    {
                      defaultValue:
                        'Unlock Premium Deep Reading to view this section.',
                    },
                  )
                : t(
                    section.bodyId,
                    {
                      card:
                        reading.draw.card.name,
                      score:
                        reading.score,
                      defaultValue:
                        'This section gives deeper reflective guidance.',
                    },
                  )}
            </Text>
          </View>
        ))}

        <LunaShareButton
          data={{
            variant: 'forecast',
            title:
              t(
                reading.titleId,
                {
                  defaultValue:
                    'Premium Deep Reading',
                },
              ),
            subtitle:
              t(
                'premiumDeepReading.title',
                {
                  defaultValue:
                    'Premium Deep Reading',
                },
              ),
            message:
              t(
                reading.summaryId,
                {
                  card:
                    reading.draw.card.name,
                  defaultValue:
                    'A deeper interpretation is ready.',
                },
              ),
            score:
              reading.score,
            cardId:
              reading.draw.card.id ??
              reading.draw.card.name,
            cardName:
              reading.draw.card.name,
            reversed:
              reading.draw.orientation ===
              'reversed',
            badge: 'PREMIUM',
            tags: [
              'premium',
              type,
              'luna',
            ],
          }}
        />

        <Text style={styles.notice}>
          {t(
            'premiumDeepReading.notice',
            {
              defaultValue:
                'This is a local premium-style reading system. Connect the unlock to IAP when your store products are ready.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
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

  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 14,
  },

  typeChip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  typeChipActive: {
    backgroundColor: COLORS.night,
  },

  typeText: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  typeTextActive: {
    color: '#F8EBCB',
  },

  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 16,
    marginTop: 8,
  },

  heroCopy: {
    flex: 1,
    paddingRight: 14,
  },

  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  heroScore: {
    color: '#FFF8EA',
    fontSize: 48,
    fontWeight: '900',
    marginTop: 5,
  },

  heroText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 7,
  },

  lockCard: {
    backgroundColor: '#FFF8EA',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 22,
    padding: 15,
    marginTop: 14,
  },

  lockTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },

  lockText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  unlockButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: COLORS.gold,
    borderRadius: 16,
    marginTop: 12,
  },

  unlockText: {
    color: COLORS.night,
    fontSize: 13,
    fontWeight: '900',
  },

  sectionCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 15,
    marginTop: 12,
  },

  sectionLocked: {
    opacity: 0.7,
  },

  sectionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
  },

  sectionBody: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 21,
    fontWeight: '800',
    marginTop: 7,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
