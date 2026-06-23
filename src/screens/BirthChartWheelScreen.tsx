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

import BirthChartWheel
  from '../components/BirthChartWheel';

import {
  buildBirthChart,
  CHART_POINT_ORDER,
  getChartPointLabel,
  getZodiacSymbol,
  type BirthChartResult,
} from '../services/astroBirthChart';

import {
  ensureDefaultBirthProfile,
  getActiveBirthProfile,
  type BirthProfile,
} from '../services/birthProfiles';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function BirthChartWheelScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    profile,
    setProfile,
  ] =
    useState<BirthProfile | undefined>();

  const [chart, setChart] =
    useState<BirthChartResult | undefined>();

  const load = useCallback(
    async () => {
      const active =
        (await getActiveBirthProfile()) ??
        (await ensureDefaultBirthProfile());

      setProfile(active);
      setChart(
        buildBirthChart(
          active.input,
        ),
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

  if (
    !profile ||
    !chart
  ) {
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
          {t('lunaAdvanced.wheel.eyebrow', {
            defaultValue: 'Birth Chart',
          })}
        </Text>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>
              {t('lunaAdvanced.wheel.title', {
                defaultValue: 'Chart Wheel',
              })}
            </Text>

            <Text style={styles.subtitle}>
              {profile.name}
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

        <View style={styles.wheelCard}>
          <BirthChartWheel
            chart={chart}
            size={320}
          />
        </View>

        <View style={styles.legendCard}>
          <Text style={styles.sectionTitle}>
            {t('lunaAdvanced.wheel.legend', {
              defaultValue: 'Legend',
            })}
          </Text>

          <View style={styles.legendRow}>
            <View style={styles.supportLine} />
            <Text style={styles.legendText}>
              {t('lunaAdvanced.wheel.supportiveLine', {
                defaultValue: 'Supportive aspects',
              })}
            </Text>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.challengeLine} />
            <Text style={styles.legendText}>
              {t('lunaAdvanced.wheel.challengeLine', {
                defaultValue: 'Challenging aspects',
              })}
            </Text>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.neutralLine} />
            <Text style={styles.legendText}>
              {t('lunaAdvanced.wheel.neutralLine', {
                defaultValue: 'Conjunction / neutral aspects',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t('lunaAdvanced.wheel.planetPositions', {
              defaultValue: 'Planet positions',
            })}
          </Text>

          {CHART_POINT_ORDER.map(pointId => {
            const point =
              chart.points[pointId];

            return (
              <View
                key={pointId}
                style={styles.positionRow}>
                <Text style={styles.positionName}>
                  {t(
                    `lunaAdvanced.points.${pointId}`,
                    {
                      defaultValue:
                        getChartPointLabel(
                          pointId,
                        ),
                    },
                  )}
                </Text>

                <Text style={styles.positionValue}>
                  {getZodiacSymbol(point.sign)}{' '}
                  {t(`western.signs.${point.sign}`, {
                    defaultValue: point.sign,
                  })}{' '}
                  {point.degreeText}
                </Text>
              </View>
            );
          })}
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
  wheelCard: {
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 28,
    paddingVertical: 18,
    marginTop: 16,
  },
  legendCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
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
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  supportLine: {
    width: 34,
    height: 3,
    backgroundColor: '#6EAA84',
    borderRadius: 99,
    marginRight: 10,
  },
  challengeLine: {
    width: 34,
    height: 3,
    backgroundColor: '#BE555F',
    borderRadius: 99,
    marginRight: 10,
  },
  neutralLine: {
    width: 34,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 99,
    marginRight: 10,
  },
  legendText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '800',
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F2EA',
    borderRadius: 14,
    padding: 11,
    marginBottom: 7,
  },
  positionName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },
  positionValue: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
