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
  buildDailyPersonalizedInsight,
  getDailyTransitPointLabel,
  type DailyPersonalizedInsight,
  type DailyTransitAspect,
} from '../services/dailyPersonalizedInsight';

import {
  ensureDefaultBirthProfile,
  getActiveBirthProfile,
} from '../services/birthProfiles';

import {
  getZodiacSymbol,
  type ChartPointId,
} from '../services/astroBirthChart';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function DailyInsightScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    insight,
    setInsight,
  ] =
    useState<DailyPersonalizedInsight | undefined>();

  const load = useCallback(
    async () => {
      const profile =
        (await getActiveBirthProfile()) ??
        (await ensureDefaultBirthProfile());

      setInsight(
        buildDailyPersonalizedInsight(
          profile,
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

  if (!insight) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            {t(
              'common.loading',
              {
                defaultValue:
                  'Loading...',
              },
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const moon =
    insight.transitChart.points.moon;

  const sun =
    insight.transitChart.points.sun;

  const venus =
    insight.transitChart.points.venus;

  const mars =
    insight.transitChart.points.mars;

  const dominantElement =
    t(
      `western.elements.${insight.dominantTransitElement}`,
      {
        defaultValue:
          insight.dominantTransitElement,
      },
    );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaDailyInsight.eyebrow',
            {
              defaultValue:
                'Today',
            },
          )}
        </Text>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>
              {t(
                'lunaDailyInsight.title',
                {
                  defaultValue:
                    'Daily Personalized Insight',
                },
              )}
            </Text>

            <Text style={styles.subtitle}>
              {t(
                'lunaDailyInsight.todayFor',
                {
                  name:
                    insight.profileName,
                  date:
                    insight.displayDate,
                  defaultValue:
                    `For ${insight.profileName} • ${insight.displayDate}`,
                },
              )}
            </Text>
          </View>

          <Pressable
            style={styles.manageButton}
            onPress={() =>
              navigation.navigate(
                'BirthProfiles',
              )
            }>
            <Text style={styles.manageText}>
              {t(
                'lunaDailyInsight.manageProfile',
                {
                  defaultValue:
                    'Profile',
                },
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>
                {t(
                  'lunaDailyInsight.moonFocus',
                  {
                    defaultValue:
                      'Moon focus',
                  },
                )}
              </Text>

              <Text style={styles.heroTitle}>
                {getZodiacSymbol(
                  moon.sign,
                )}{' '}
                {t(
                  `western.signs.${moon.sign}`,
                  {
                    defaultValue:
                      moon.sign,
                  },
                )}
                {' • '}
                {t(
                  'lunaDailyInsight.houseLabel',
                  {
                    number:
                      insight.moonHouse,
                    defaultValue:
                      `House ${insight.moonHouse}`,
                  },
                )}
              </Text>
            </View>

            <View style={styles.energyCircle}>
              <Text style={styles.energyNumber}>
                {insight.energyScore}
              </Text>

              <Text style={styles.energyLabel}>
                {t(
                  'lunaDailyInsight.energyScore',
                  {
                    defaultValue:
                      'Energy',
                  },
                )}
              </Text>
            </View>
          </View>

          <Text style={styles.heroText}>
            {t(
              `lunaDailyInsight.themes.house${insight.moonHouse}.text`,
              {
                defaultValue:
                  'Today is best used with calm attention and one practical step.',
              },
            )}
          </Text>

          <View style={styles.phaseBox}>
            <Text style={styles.phaseTitle}>
              {t(
                `lunaDailyInsight.moonPhases.${insight.moonPhase}.title`,
                {
                  defaultValue:
                    insight.moonPhase,
                },
              )}
            </Text>

            <Text style={styles.phaseText}>
              {t(
                `lunaDailyInsight.moonPhases.${insight.moonPhase}.text`,
                {
                  defaultValue:
                    'Let the current moon rhythm guide your pace today.',
                },
              )}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaDailyInsight.focusScores',
              {
                defaultValue:
                  'Focus scores',
              },
            )}
          </Text>

          {insight.focusScores.map(item => (
            <MeterRow
              key={item.id}
              label={t(
                `lunaDailyInsight.focus.${item.id}`,
                {
                  defaultValue:
                    item.id,
                },
              )}
              value={item.score}
            />
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaDailyInsight.skyToday',
              {
                defaultValue:
                  'Sky today',
              },
            )}
          </Text>

          <SkyPoint
            point="sun"
            sign={sun.sign}
            degree={sun.degreeText}
          />

          <SkyPoint
            point="moon"
            sign={moon.sign}
            degree={moon.degreeText}
          />

          <SkyPoint
            point="venus"
            sign={venus.sign}
            degree={venus.degreeText}
          />

          <SkyPoint
            point="mars"
            sign={mars.sign}
            degree={mars.degreeText}
          />

          <Text style={styles.skyNote}>
            {t(
              'lunaDailyInsight.dominantTransitElement',
              {
                element:
                  dominantElement,
                defaultValue:
                  `Dominant transit element: ${dominantElement}`,
              },
            )}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaDailyInsight.natalTouchpoints',
              {
                defaultValue:
                  'Natal touchpoints',
              },
            )}
          </Text>

          {insight.aspects.length === 0 ? (
            <Text style={styles.emptyText}>
              {t(
                'lunaDailyInsight.noTouchpoints',
                {
                  defaultValue:
                    'No exact major transit touches today. Keep the day simple and observe subtle patterns.',
                },
              )}
            </Text>
          ) : (
            insight.aspects.map(aspect => (
              <AspectCard
                key={`${aspect.transitPoint}-${aspect.natalPoint}-${aspect.type}`}
                aspect={aspect}
              />
            ))
          )}
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>
            {t(
              'lunaDailyInsight.suggestedAction',
              {
                defaultValue:
                  'Suggested action',
              },
            )}
          </Text>

          <Text style={styles.promptText}>
            {t(
              `lunaDailyInsight.actions.${insight.actionId}`,
              {
                defaultValue:
                  'Take one small aligned action before the day gets busy.',
              },
            )}
          </Text>

          <View style={styles.promptDivider} />

          <Text style={styles.promptLabel}>
            {t(
              'lunaDailyInsight.journalPrompt',
              {
                defaultValue:
                  'Journal prompt',
              },
            )}
          </Text>

          <Text style={styles.promptText}>
            {t(
              `lunaDailyInsight.prompts.${insight.journalPromptId}`,
              {
                defaultValue:
                  'What pattern am I ready to notice today?',
              },
            )}
          </Text>
        </View>

        <Text style={styles.notice}>
          {t(
            'lunaDailyInsight.notice',
            {
              defaultValue:
                'Daily insight is for reflection and self-awareness. It should not replace professional advice.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MeterRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.meterRow}>
      <Text style={styles.meterLabel}>
        {label}
      </Text>

      <View style={styles.meterTrack}>
        <View
          style={[
            styles.meterFill,
            {
              width: `${Math.max(
                0,
                Math.min(100, value),
              )}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.meterValue}>
        {value}
      </Text>
    </View>
  );
}

function SkyPoint({
  point,
  sign,
  degree,
}: {
  point: ChartPointId;
  sign: string;
  degree: string;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.skyRow}>
      <View style={styles.skySymbolBox}>
        <Text style={styles.skySymbol}>
          {getZodiacSymbol(
            sign as never,
          )}
        </Text>
      </View>

      <View style={styles.skyCopy}>
        <Text style={styles.skyTitle}>
          {t(
            `lunaDailyInsight.points.${point}`,
            {
              defaultValue:
                getDailyTransitPointLabel(point),
            },
          )}
        </Text>

        <Text style={styles.skyMeta}>
          {t(
            `western.signs.${sign}`,
            {
              defaultValue:
                sign,
            },
          )}{' '}
          {degree}
        </Text>
      </View>
    </View>
  );
}

function AspectCard({
  aspect,
}: {
  aspect: DailyTransitAspect;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.aspectCard}>
      <Text style={styles.aspectTitle}>
        {t(
          `lunaDailyInsight.points.${aspect.transitPoint}`,
          {
            defaultValue:
              getDailyTransitPointLabel(
                aspect.transitPoint,
              ),
          },
        )}{' '}
        {t(
          `lunaDailyInsight.aspectNames.${aspect.type}`,
          {
            defaultValue:
              aspect.type,
          },
        )}{' '}
        {t(
          `lunaDailyInsight.points.${aspect.natalPoint}`,
          {
            defaultValue:
              getDailyTransitPointLabel(
                aspect.natalPoint,
              ),
          },
        )}
      </Text>

      <Text style={styles.aspectMeta}>
        {t(
          `lunaDailyInsight.tones.${aspect.tone}`,
          {
            defaultValue:
              aspect.tone,
          },
        )}{' '}
        •{' '}
        {t(
          'lunaDailyInsight.orb',
          {
            value:
              aspect.orb,
            defaultValue:
              `orb ${aspect.orb}°`,
          },
        )}
      </Text>

      <Text style={styles.aspectText}>
        {t(
          `lunaDailyInsight.aspectTexts.${aspect.tone}`,
          {
            defaultValue:
              'Notice how this transit is touching a natal pattern today.',
          },
        )}
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
    fontSize: 14,
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
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  manageButton: {
    backgroundColor: COLORS.night,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 10,
  },

  manageText: {
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

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  heroTitle: {
    color: '#FFF8EA',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    marginTop: 6,
    textTransform: 'capitalize',
  },

  energyCircle: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217,183,110,0.14)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 39,
    marginLeft: 12,
  },

  energyNumber: {
    color: '#F8EBCB',
    fontSize: 25,
    fontWeight: '900',
  },

  energyLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  heroText: {
    color: '#E9E4F5',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 14,
  },

  phaseBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 13,
    marginTop: 14,
  },

  phaseTitle: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '900',
  },

  phaseText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
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

  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  meterLabel: {
    width: 82,
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  meterTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEE6F4',
    borderRadius: 99,
    overflow: 'hidden',
  },

  meterFill: {
    height: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 99,
  },

  meterValue: {
    width: 32,
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
  },

  skyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
  },

  skySymbolBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
  },

  skySymbol: {
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
    lineHeight: 16,
    marginTop: 3,
    textTransform: 'capitalize',
  },

  skyNote: {
    color: '#9A7939',
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '800',
    marginTop: 5,
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

  promptCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 16,
    marginTop: 14,
  },

  promptLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  promptText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '800',
    marginTop: 6,
  },

  promptDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 13,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
