import React, {
  useCallback,
  useMemo,
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
  buildActiveYearForecast,
  type ForecastDomain,
  type ForecastMonth,
  type ForecastYearResult,
} from '../services/lunaForecast';

import {
  getChartPointLabel,
} from '../services/astroBirthChart';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

const DOMAIN_ORDER:
  ForecastDomain[] = [
    'love',
    'career',
    'money',
    'wellness',
    'spirit',
  ];

export default function YearMonthlyForecastScreen() {
  const {t, i18n} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    year,
    setYear,
  ] =
    useState(
      new Date().getFullYear(),
    );

  const [
    selectedMonth,
    setSelectedMonth,
  ] =
    useState(
      new Date().getMonth() + 1,
    );

  const [
    selectedDomain,
    setSelectedDomain,
  ] =
    useState<ForecastDomain>('love');

  const [
    forecast,
    setForecast,
  ] =
    useState<ForecastYearResult | undefined>();

  const load = useCallback(
    async () => {
      setForecast(
        await buildActiveYearForecast(
          year,
        ),
      );
    },
    [year],
  );

  useFocusEffect(
    useCallback(
      () => {
        void load();
      },
      [load],
    ),
  );

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const monthFormatter =
    useMemo(
      () =>
        new Intl.DateTimeFormat(
          language,
          {
            month: 'short',
          },
        ),
      [language],
    );

  const selected =
    forecast?.months.find(
      item =>
        item.month ===
        selectedMonth,
    );

  if (!forecast || !selected) {
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

  const sortedByDomain =
    [...forecast.months].sort(
      (a, b) =>
        b.scores[
          selectedDomain
        ] -
        a.scores[
          selectedDomain
        ],
    );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.eyebrow}>
              {t(
                'lunaForecast.eyebrow',
                {
                  defaultValue:
                    'Forecast',
                },
              )}
            </Text>

            <Text style={styles.title}>
              {t(
                'lunaForecast.title',
                {
                  defaultValue:
                    'Year / Monthly Forecast',
                },
              )}
            </Text>

            <Text style={styles.subtitle}>
              {t(
                'lunaForecast.subtitleFor',
                {
                  name:
                    forecast.profile.name,
                  defaultValue:
                    `For ${forecast.profile.name}`,
                },
              )}
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() =>
              navigation.navigate(
                'BirthProfiles',
              )
            }>
            <Text style={styles.profileButtonText}>
              {t(
                'lunaForecast.profile',
                {
                  defaultValue:
                    'Profile',
                },
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.yearSwitcher}>
          <Pressable
            style={styles.yearButton}
            onPress={() =>
              setYear(value => value - 1)
            }>
            <Text style={styles.yearButtonText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.yearCenter}>
            <Text style={styles.yearLabel}>
              {year}
            </Text>

            <Text style={styles.yearSub}>
              {t(
                `lunaForecast.yearThemes.${forecast.yearThemeId}`,
                {
                  defaultValue:
                    'A year of alignment and steady growth.',
                },
              )}
            </Text>
          </View>

          <Pressable
            style={styles.yearButton}
            onPress={() =>
              setYear(value => value + 1)
            }>
            <Text style={styles.yearButtonText}>
              ›
            </Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>
                {t(
                  'lunaForecast.overall',
                  {
                    defaultValue:
                      'Overall',
                  },
                )}
              </Text>

              <Text style={styles.heroScore}>
                {
                  selected.overallScore
                }
              </Text>
            </View>

            <View style={styles.heroMonth}>
              <Text style={styles.heroMonthText}>
                {monthFormatter.format(
                  new Date(
                    year,
                    selected.month - 1,
                    1,
                  ),
                )}
              </Text>

              <Text style={styles.heroMonthSub}>
                {t(
                  `lunaForecast.months.${selected.monthKey}`,
                  {
                    defaultValue:
                      selected.monthKey,
                  },
                )}
              </Text>
            </View>
          </View>

          <Text style={styles.heroTheme}>
            {t(
              `lunaForecast.monthThemes.${selected.themeId}`,
              {
                defaultValue:
                  'A month for calm decisions and honest alignment.',
              },
            )}
          </Text>

          <TransitLine
            month={selected}
          />
        </View>

        <View style={styles.domainRow}>
          {DOMAIN_ORDER.map(domain => (
            <Pressable
              key={domain}
              style={[
                styles.domainChip,
                selectedDomain === domain &&
                  styles.domainChipActive,
              ]}
              onPress={() =>
                setSelectedDomain(
                  domain,
                )
              }>
              <Text
                style={[
                  styles.domainText,
                  selectedDomain === domain &&
                    styles.domainTextActive,
                ]}>
                {t(
                  `lunaForecast.domains.${domain}`,
                  {
                    defaultValue:
                      domain,
                  },
                )}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaForecast.monthScoreTitle',
              {
                defaultValue:
                  'Monthly scores',
              },
            )}
          </Text>

          {DOMAIN_ORDER.map(domain => (
            <ScoreRow
              key={domain}
              label={t(
                `lunaForecast.domains.${domain}`,
                {
                  defaultValue:
                    domain,
                },
              )}
              score={
                selected.scores[domain]
              }
            />
          ))}
        </View>

        <View style={styles.promptGrid}>
          <PromptCard
            label={t(
              'lunaForecast.opportunity',
              {
                defaultValue:
                  'Opportunity',
              },
            )}
            text={t(
              `lunaForecast.opportunities.${selected.opportunityId}`,
              {
                defaultValue:
                  'Say yes to one opening that feels sincere.',
              },
            )}
          />

          <PromptCard
            label={t(
              'lunaForecast.challenge',
              {
                defaultValue:
                  'Challenge',
              },
            )}
            text={t(
              `lunaForecast.challenges.${selected.challengeId}`,
              {
                defaultValue:
                  'Avoid letting old patterns choose for you.',
              },
            )}
          />

          <PromptCard
            label={t(
              'lunaForecast.action',
              {
                defaultValue:
                  'Action',
              },
            )}
            text={t(
              `lunaForecast.actions.${selected.actionId}`,
              {
                defaultValue:
                  'Finish one clear thing before adding more.',
              },
            )}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaForecast.yearOverview',
              {
                defaultValue:
                  'Year overview',
              },
            )}
          </Text>

          <View style={styles.overviewRow}>
            <OverviewBox
              label={t(
                'lunaForecast.bestMonth',
                {
                  defaultValue:
                    'Best month',
                },
              )}
              value={monthFormatter.format(
                new Date(
                  year,
                  forecast.bestMonth.month - 1,
                  1,
                ),
              )}
              score={
                forecast.bestMonth.overallScore
              }
            />

            <OverviewBox
              label={t(
                'lunaForecast.growthMonth',
                {
                  defaultValue:
                    'Growth month',
                },
              )}
              value={monthFormatter.format(
                new Date(
                  year,
                  forecast.growthMonth.month - 1,
                  1,
                ),
              )}
              score={
                forecast.growthMonth.overallScore
              }
            />

            <OverviewBox
              label={t(
                'lunaForecast.focusDomain',
                {
                  defaultValue:
                    'Focus',
                },
              )}
              value={t(
                `lunaForecast.domains.${forecast.dominantDomain}`,
                {
                  defaultValue:
                    forecast.dominantDomain,
                },
              )}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaForecast.monthTimeline',
              {
                defaultValue:
                  'Monthly timeline',
              },
            )}
          </Text>

          <View style={styles.monthGrid}>
            {forecast.months.map(month => {
              const active =
                month.month ===
                selectedMonth;

              return (
                <Pressable
                  key={month.month}
                  style={[
                    styles.monthCell,
                    active &&
                      styles.monthCellActive,
                  ]}
                  onPress={() =>
                    setSelectedMonth(
                      month.month,
                    )
                  }>
                  <Text
                    style={[
                      styles.monthCellLabel,
                      active &&
                        styles.monthCellTextActive,
                    ]}>
                    {monthFormatter.format(
                      new Date(
                        year,
                        month.month - 1,
                        1,
                      ),
                    )}
                  </Text>

                  <Text
                    style={[
                      styles.monthCellScore,
                      active &&
                        styles.monthCellTextActive,
                    ]}>
                    {month.scores[
                      selectedDomain
                    ]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaForecast.bestByDomain',
              {
                defaultValue:
                  'Best months for selected area',
              },
            )}
          </Text>

          {sortedByDomain
            .slice(0, 3)
            .map(month => (
              <View
                key={month.month}
                style={styles.rankRow}>
                <Text style={styles.rankMonth}>
                  {monthFormatter.format(
                    new Date(
                      year,
                      month.month - 1,
                      1,
                    ),
                  )}
                </Text>

                <Text style={styles.rankTheme}>
                  {t(
                    `lunaForecast.monthThemes.${month.themeId}`,
                    {
                      defaultValue:
                        'Aligned momentum',
                    },
                  )}
                </Text>

                <Text style={styles.rankScore}>
                  {month.scores[
                    selectedDomain
                  ]}
                </Text>
              </View>
            ))}
        </View>

        <Text style={styles.notice}>
          {t(
            'lunaForecast.notice',
            {
              defaultValue:
                'Forecasts are reflective astrology references and should not replace professional advice or real-world planning.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function TransitLine({
  month,
}: {
  month: ForecastMonth;
}) {
  const {t} =
    useTranslation();

  const transit =
    month.keyTransit;

  return (
    <Text style={styles.transitText}>
      {t(
        'lunaForecast.keyTransit',
        {
          planet:
            getChartPointLabel(
              transit.planet,
            ),
          natal:
            getChartPointLabel(
              transit.natalPoint,
            ),
          aspect:
            t(
              `lunaForecast.aspects.${transit.aspect}`,
              {
                defaultValue:
                  transit.aspect,
              },
            ),
          orb:
            transit.orb,
          defaultValue:
            `${getChartPointLabel(transit.planet)} ${transit.aspect} natal ${getChartPointLabel(transit.natalPoint)}`,
        },
      )}
    </Text>
  );
}

function ScoreRow({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreLabel}>
        {label}
      </Text>

      <View style={styles.scoreTrack}>
        <View
          style={[
            styles.scoreFill,
            {
              width:
                `${score}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.scoreValue}>
        {score}
      </Text>
    </View>
  );
}

function PromptCard({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <View style={styles.promptCard}>
      <Text style={styles.promptLabel}>
        {label}
      </Text>

      <Text style={styles.promptText}>
        {text}
      </Text>
    </View>
  );
}

function OverviewBox({
  label,
  value,
  score,
}: {
  label: string;
  value: string;
  score?: number;
}) {
  return (
    <View style={styles.overviewBox}>
      <Text style={styles.overviewLabel}>
        {label}
      </Text>

      <Text style={styles.overviewValue}>
        {value}
      </Text>

      {typeof score === 'number' ? (
        <Text style={styles.overviewScore}>
          {score}
        </Text>
      ) : null}
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

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  titleWrap: {
    flex: 1,
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
    marginTop: 5,
  },

  profileButton: {
    backgroundColor: COLORS.night,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 10,
  },

  profileButtonText: {
    color: '#F8EBCB',
    fontSize: 11,
    fontWeight: '900',
  },

  yearSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 12,
    marginTop: 16,
  },

  yearButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 15,
  },

  yearButtonText: {
    color: COLORS.purple,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 28,
  },

  yearCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  yearLabel: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
  },

  yearSub: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 3,
  },

  heroCard: {
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 14,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  heroScore: {
    color: '#FFF8EA',
    fontSize: 62,
    fontWeight: '900',
    marginTop: 2,
  },

  heroMonth: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 88,
    height: 88,
    backgroundColor: 'rgba(217,183,110,0.14)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 44,
  },

  heroMonthText: {
    color: '#F8EBCB',
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  heroMonthSub: {
    color: '#BEB3DD',
    fontSize: 8.5,
    fontWeight: '900',
    marginTop: 2,
  },

  heroTheme: {
    color: '#F8EBCB',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '800',
    marginTop: 12,
  },

  transitText: {
    color: '#DCD2F3',
    fontSize: 11,
    lineHeight: 17,
    fontWeight: '800',
    marginTop: 10,
  },

  domainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 14,
  },

  domainChip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  domainChipActive: {
    backgroundColor: COLORS.night,
  },

  domainText: {
    color: '#4D405E',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  domainTextActive: {
    color: '#F8EBCB',
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

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  scoreLabel: {
    width: 76,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  scoreTrack: {
    flex: 1,
    height: 8,
    overflow: 'hidden',
    backgroundColor: '#EEE6F4',
    borderRadius: 99,
  },

  scoreFill: {
    height: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 99,
  },

  scoreValue: {
    width: 38,
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'right',
  },

  promptGrid: {
    marginTop: 14,
  },

  promptCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },

  promptLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  promptText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 6,
  },

  overviewRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },

  overviewBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F7F2EA',
    borderRadius: 18,
    padding: 10,
    marginHorizontal: 4,
  },

  overviewLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  overviewValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 5,
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  overviewScore: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  monthCell: {
    width: '25%',
    padding: 4,
  },

  monthCellActive: {},

  monthCellLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#EEE6F4',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 10,
    textTransform: 'uppercase',
  },

  monthCellScore: {
    color: COLORS.purple,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#EEE6F4',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingBottom: 10,
    paddingTop: 2,
  },

  monthCellTextActive: {
    color: COLORS.gold,
    backgroundColor: COLORS.night,
  },

  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },

  rankMonth: {
    width: 48,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  rankTheme: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginHorizontal: 10,
  },

  rankScore: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: '900',
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 15,
  },
});
