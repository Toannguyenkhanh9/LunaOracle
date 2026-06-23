import React, {
  useCallback,
  useState,
} from 'react';

import {
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
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  buildTransitToday,
  getTransitPointLabel,
  type TransitAspect,
  type TransitTodayResult,
} from '../services/transitToday';

import {
  ensureDefaultBirthProfile,
  getActiveBirthProfile,
} from '../services/birthProfiles';

import {
  getZodiacSymbol,
} from '../services/astroBirthChart';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function TransitTodayScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    result,
    setResult,
  ] =
    useState<TransitTodayResult | undefined>();

  const load = useCallback(
    async () => {
      const profile =
        (await getActiveBirthProfile()) ??
        (await ensureDefaultBirthProfile());

      setResult(
        buildTransitToday(profile),
      );
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

  if (!result) {
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

  const moon =
    result.transitChart.points.moon;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t('lunaAdvanced.transit.eyebrow', {
            defaultValue: 'Transits',
          })}
        </Text>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>
              {t('lunaAdvanced.transit.title', {
                defaultValue: 'Transit Today',
              })}
            </Text>

            <Text style={styles.subtitle}>
              {t('lunaAdvanced.transit.subtitleFor', {
                name: result.profile.name,
                date: result.displayDate,
                defaultValue: `${result.profile.name} • ${result.displayDate}`,
              })}
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() =>
              navigation.navigate(
                'BirthProfiles',
              )
            }>
            <Text style={styles.profileText}>
              {t('lunaAdvanced.common.profile', {
                defaultValue: 'Profile',
              })}
            </Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>
            {t('lunaAdvanced.transit.moonToday', {
              defaultValue: 'Moon today',
            })}
          </Text>

          <Text style={styles.heroTitle}>
            {getZodiacSymbol(moon.sign)}{' '}
            {t(`western.signs.${moon.sign}`, {
              defaultValue: moon.sign,
            })}
            {' • '}
            {t('lunaAdvanced.common.house', {
              number: result.moonHouse,
              defaultValue: `House ${result.moonHouse}`,
            })}
          </Text>

          <Text style={styles.heroText}>
            {t(
              `lunaAdvanced.transit.houseThemes.house${result.moonHouse}`,
              {
                defaultValue:
                  'Today highlights one part of your chart. Notice the rhythm before forcing action.',
              },
            )}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t('lunaAdvanced.transit.skyNow', {
              defaultValue: 'Sky now',
            })}
          </Text>

          {result.skySummary.map(item => (
            <View
              key={item.point}
              style={styles.skyRow}>
              <View style={styles.symbolBox}>
                <Text style={styles.symbolText}>
                  {getZodiacSymbol(item.sign as never)}
                </Text>
              </View>

              <View style={styles.skyCopy}>
                <Text style={styles.skyTitle}>
                  {t(
                    `lunaAdvanced.points.${item.point}`,
                    {
                      defaultValue:
                        getTransitPointLabel(
                          item.point,
                        ),
                    },
                  )}
                </Text>

                <Text style={styles.skyMeta}>
                  {t(`western.signs.${item.sign}`, {
                    defaultValue: item.sign,
                  })}{' '}
                  {item.degreeText} •{' '}
                  {t('lunaAdvanced.common.house', {
                    number: item.house,
                    defaultValue: `House ${item.house}`,
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t('lunaAdvanced.transit.keyAspects', {
              defaultValue: 'Key transit aspects',
            })}
          </Text>

          {result.keyTransits.length === 0 ? (
            <Text style={styles.emptyText}>
              {t('lunaAdvanced.transit.noAspects', {
                defaultValue:
                  'No exact major aspects today. Keep the day simple and observe subtle shifts.',
              })}
            </Text>
          ) : (
            result.keyTransits.map(aspect => (
              <TransitAspectCard
                key={`${aspect.transitPoint}-${aspect.natalPoint}-${aspect.type}`}
                aspect={aspect}
              />
            ))
          )}
        </View>

        <Text style={styles.notice}>
          {t('lunaAdvanced.common.notice', {
            defaultValue:
              'Astrology content is for reflection and self-awareness only.',
          })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function TransitAspectCard({
  aspect,
}: {
  aspect: TransitAspect;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.aspectCard}>
      <Text style={styles.aspectTitle}>
        {t(`lunaAdvanced.points.${aspect.transitPoint}`, {
          defaultValue:
            getTransitPointLabel(
              aspect.transitPoint,
            ),
        })}{' '}
        {t(`lunaAdvanced.aspectNames.${aspect.type}`, {
          defaultValue: aspect.type,
        })}{' '}
        {t(`lunaAdvanced.points.${aspect.natalPoint}`, {
          defaultValue:
            getTransitPointLabel(
              aspect.natalPoint,
            ),
        })}
      </Text>

      <Text style={styles.aspectMeta}>
        {t(`lunaAdvanced.tones.${aspect.tone}`, {
          defaultValue: aspect.tone,
        })}{' '}
        •{' '}
        {t('lunaAdvanced.common.orb', {
          value: aspect.orb,
          defaultValue: `orb ${aspect.orb}°`,
        })}
      </Text>

      <Text style={styles.aspectText}>
        {t(`lunaAdvanced.transit.toneText.${aspect.tone}`, {
          defaultValue:
            'Notice how this transit touches a natal pattern today.',
        })}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  titleCopy: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },
  profileButton: {
    backgroundColor: COLORS.night,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 10,
  },
  profileText: {
    color: '#F8EBCB',
    fontSize: 11,
    fontWeight: '900',
  },
  heroCard: {
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 16,
  },
  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFF8EA',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  heroText: {
    color: '#DDD4F3',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 12,
  },
  sectionCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },
  sectionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  skyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
  },
  symbolBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
  },
  symbolText: {
    color: COLORS.purple,
    fontSize: 21,
    fontWeight: '900',
  },
  skyCopy: {
    flex: 1,
    marginLeft: 11,
  },
  skyTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  skyMeta: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
    textTransform: 'capitalize',
  },
  aspectCard: {
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 9,
  },
  aspectTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  aspectMeta: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  aspectText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
