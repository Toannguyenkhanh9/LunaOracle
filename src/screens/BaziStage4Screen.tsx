import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  CompatibilityPurpose,
  DateSelectionActivity,
  DetailedCompatibilityResult,
  RecommendedDate,
  TransitTimeline,
} from '../astrology/bazi';

import {
  getSavedBaziCharts,
  type SavedBaziRecord,
} from '../services/baziHistory';

import {
  calculateBaziCompatibility,
  calculateBaziRecommendedDates,
  calculateBaziTimeline,
} from '../services/baziStage4';

import {
  formatStage4Pillar,
} from '../services/baziStage4Localization';

type Stage4Tab =
  | 'timeline'
  | 'compatibility'
  | 'dates';

const TIMELINE_YEAR_OPTIONS = [
  5,
  10,
  20,
] as const;

const DATE_MONTH_OPTIONS = [
  3,
  6,
  12,
] as const;

const PURPOSE_OPTIONS: CompatibilityPurpose[] = [
  'general',
  'love',
  'business',
];

const ACTIVITY_OPTIONS: Array<{
  id: DateSelectionActivity;
  icon: string;
}> = [
  {
    id: 'wedding',
    icon: '💍',
  },
  {
    id: 'construction',
    icon: '🏠',
  },
  {
    id: 'opening',
    icon: '🎊',
  },
  {
    id: 'moving',
    icon: '📦',
  },
  {
    id: 'travel',
    icon: '🧳',
  },
  {
    id: 'signing',
    icon: '✍️',
  },
];

function toIsoDate(
  date: Date,
): string {
  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      '0',
    ),
    String(
      date.getDate(),
    ).padStart(
      2,
      '0',
    ),
  ].join('-');
}

function addMonths(
  date: Date,
  months: number,
): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth() + months,
    date.getDate(),
  );
}

function formatDate(
  value: string,
  language: string,
): string {
  const date = new Date(
    `${value}T12:00:00`,
  );

  try {
    return new Intl.DateTimeFormat(
      language,
      {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    ).format(date);
  } catch {
    return value;
  }
}

function scoreTone(
  score: number,
): {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
} {
  if (score >= 78) {
    return {
      backgroundColor:
        '#5B3A1F',
      borderColor:
        '#D4A24C',
      textColor:
        '#FFE7AA',
    };
  }

  if (score >= 64) {
    return {
      backgroundColor:
        '#6F5D2C',
      borderColor:
        '#C8B15C',
      textColor:
        '#FFF3C5',
    };
  }

  if (score >= 48) {
    return {
      backgroundColor:
        '#6C665E',
      borderColor:
        '#B0A79D',
      textColor:
        '#FFF8EF',
    };
  }

  return {
    backgroundColor:
      '#784235',
    borderColor:
      '#C47B67',
    textColor:
      '#FFE6DD',
  };
}

export default function BaziStage4Screen() {
  const {
    t,
    i18n,
  } = useTranslation();

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const [tab, setTab] =
    useState<Stage4Tab>(
      'timeline',
    );

  const [records, setRecords] =
    useState<SavedBaziRecord[]>(
      [],
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [primaryId, setPrimaryId] =
    useState<string | null>(
      null,
    );

  const [secondaryId, setSecondaryId] =
    useState<string | null>(
      null,
    );

  const [timelineYears, setTimelineYears] =
    useState<number>(
      10,
    );

  const [selectedTimelineYear, setSelectedTimelineYear] =
    useState<number>(
      new Date().getFullYear(),
    );

  const [timeline, setTimeline] =
    useState<TransitTimeline | null>(
      null,
    );

  const [purpose, setPurpose] =
    useState<CompatibilityPurpose>(
      'general',
    );

  const [compatibility, setCompatibility] =
    useState<DetailedCompatibilityResult | null>(
      null,
    );

  const [activity, setActivity] =
    useState<DateSelectionActivity>(
      'wedding',
    );

  const [dateMonths, setDateMonths] =
    useState<number>(
      6,
    );

  const [recommendedDates, setRecommendedDates] =
    useState<RecommendedDate[]>(
      [],
    );

  const [isCalculating, setIsCalculating] =
    useState(false);

  const loadRecords =
    useCallback(
      async () => {
        try {
          const saved =
            await getSavedBaziCharts();

          setRecords(saved);

          if (
            saved.length > 0
          ) {
            setPrimaryId(
              current =>
                current &&
                saved.some(
                  item =>
                    item.id ===
                    current,
                )
                  ? current
                  : saved[0].id,
            );

            setSecondaryId(
              current =>
                current &&
                saved.some(
                  item =>
                    item.id ===
                    current,
                )
                  ? current
                  : saved[1]?.id ??
                    null,
            );
          }
        } finally {
          setIsLoading(false);
        }
      },
      [],
    );

  useFocusEffect(
    useCallback(
      () => {
        loadRecords();
      },
      [loadRecords],
    ),
  );

  const primary =
    useMemo(
      () =>
        records.find(
          item =>
            item.id === primaryId,
        ) ?? null,
      [
        primaryId,
        records,
      ],
    );

  const secondary =
    useMemo(
      () =>
        records.find(
          item =>
            item.id === secondaryId,
        ) ?? null,
      [
        secondaryId,
        records,
      ],
    );

  const calculateTimeline =
    () => {
      if (!primary) {
        Alert.alert(
          t(
            'bazi.stage4.errors.noPrimaryTitle',
          ),
          t(
            'bazi.stage4.errors.noPrimaryMessage',
          ),
        );
        return;
      }

      setIsCalculating(true);

      try {
        const currentYear =
          new Date().getFullYear();

        const result =
          calculateBaziTimeline(
            primary.chart,
            {
              startYear:
                currentYear,
              years:
                timelineYears,
              includeMonthly:
                true,
              monthlyYears:
                Array.from(
                  {
                    length:
                      timelineYears,
                  },
                  (
                    _,
                    index,
                  ) =>
                    currentYear +
                    index,
                ),
            },
          );

        setTimeline(
          result,
        );
      } catch (error) {
        console.warn(
          'Cannot build BaZi timeline:',
          error,
        );

        Alert.alert(
          t(
            'bazi.stage4.errors.calculateTitle',
          ),
          t(
            'bazi.stage4.errors.calculateMessage',
          ),
        );
      } finally {
        setIsCalculating(false);
      }
    };

  const calculateCompatibility =
    () => {
      if (
        !primary ||
        !secondary
      ) {
        Alert.alert(
          t(
            'bazi.stage4.errors.needTwoChartsTitle',
          ),
          t(
            'bazi.stage4.errors.needTwoChartsMessage',
          ),
        );
        return;
      }

      if (
        primary.id ===
        secondary.id
      ) {
        Alert.alert(
          t(
            'bazi.stage4.errors.sameChartTitle',
          ),
          t(
            'bazi.stage4.errors.sameChartMessage',
          ),
        );
        return;
      }

      setIsCalculating(true);

      try {
        setCompatibility(
          calculateBaziCompatibility(
            primary.chart,
            secondary.chart,
            purpose,
          ),
        );
      } finally {
        setIsCalculating(false);
      }
    };

  const calculateDates =
    () => {
      if (!primary) {
        Alert.alert(
          t(
            'bazi.stage4.errors.noPrimaryTitle',
          ),
          t(
            'bazi.stage4.errors.noPrimaryMessage',
          ),
        );
        return;
      }

      setIsCalculating(true);

      try {
        const start =
          new Date();

        start.setHours(
          12,
          0,
          0,
          0,
        );

        start.setDate(
          start.getDate() + 1,
        );

        const end =
          addMonths(
            start,
            dateMonths,
          );

        setRecommendedDates(
          calculateBaziRecommendedDates(
            primary.chart,
            activity,
            toIsoDate(start),
            toIsoDate(end),
            secondary &&
              secondary.id !==
                primary.id
              ? secondary.chart
              : undefined,
            12,
          ),
        );
      } catch (error) {
        console.warn(
          'Cannot select BaZi dates:',
          error,
        );

        Alert.alert(
          t(
            'bazi.stage4.errors.calculateTitle',
          ),
          t(
            'bazi.stage4.errors.calculateMessage',
          ),
        );
      } finally {
        setIsCalculating(false);
      }
    };

  return (
    <SafeAreaView
      style={
        styles.screen
      }>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          BACKGROUND
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View
          style={
            styles.headerCard
          }>
          <Text
            style={
              styles.headerIcon
            }>
            ✦
          </Text>

          <Text
            style={
              styles.title
            }>
            {t(
              'bazi.stage4.title',
            )}
          </Text>

          <Text
            style={
              styles.subtitle
            }>
            {t(
              'bazi.stage4.subtitle',
            )}
          </Text>
        </View>

        <View
          style={
            styles.tabRow
          }>
          <Stage4TabButton
            active={
              tab ===
              'timeline'
            }
            label={t(
              'bazi.stage4.tabs.timeline',
            )}
            onPress={() =>
              setTab(
                'timeline',
              )
            }
          />

          <Stage4TabButton
            active={
              tab ===
              'compatibility'
            }
            label={t(
              'bazi.stage4.tabs.compatibility',
            )}
            onPress={() =>
              setTab(
                'compatibility',
              )
            }
          />

          <Stage4TabButton
            active={
              tab ===
              'dates'
            }
            label={t(
              'bazi.stage4.tabs.dates',
            )}
            onPress={() =>
              setTab(
                'dates',
              )
            }
          />
        </View>

        {isLoading ? (
          <Text
            style={
              styles.emptyText
            }>
            {t(
              'common.loading',
            )}
          </Text>
        ) : records.length ===
          0 ? (
          <View
            style={
              styles.emptyCard
            }>
            <Text
              style={
                styles.emptyIcon
              }>
              📚
            </Text>

            <Text
              style={
                styles.emptyTitle
              }>
              {t(
                'bazi.stage4.emptyTitle',
              )}
            </Text>

            <Text
              style={
                styles.emptyText
              }>
              {t(
                'bazi.stage4.emptyMessage',
              )}
            </Text>
          </View>
        ) : (
          <>
            <RecordSelector
              label={t(
                'bazi.stage4.primaryChart',
              )}
              records={
                records
              }
              selectedId={
                primaryId
              }
              onSelect={
                setPrimaryId
              }
              language={
                language
              }
            />

            {(tab ===
              'compatibility' ||
              tab ===
                'dates') && (
              <RecordSelector
                label={
                  tab ===
                  'compatibility'
                    ? t(
                        'bazi.stage4.secondaryChart',
                      )
                    : t(
                        'bazi.stage4.optionalPartnerChart',
                      )
                }
                records={
                  records
                }
                selectedId={
                  secondaryId
                }
                onSelect={
                  setSecondaryId
                }
                allowNone={
                  tab ===
                  'dates'
                }
                noneLabel={t(
                  'bazi.stage4.noPartner',
                )}
                language={
                  language
                }
              />
            )}

            {tab ===
              'timeline' && (
              <TimelinePanel
                t={t}
                language={
                  language
                }
                years={
                  timelineYears
                }
                setYears={
                  setTimelineYears
                }
                selectedYear={
                  selectedTimelineYear
                }
                setSelectedYear={
                  setSelectedTimelineYear
                }
                timeline={
                  timeline
                }
                calculate={
                  calculateTimeline
                }
                isCalculating={
                  isCalculating
                }
              />
            )}

            {tab ===
              'compatibility' && (
              <CompatibilityPanel
                t={t}
                language={
                  language
                }
                purpose={
                  purpose
                }
                setPurpose={
                  setPurpose
                }
                result={
                  compatibility
                }
                calculate={
                  calculateCompatibility
                }
                isCalculating={
                  isCalculating
                }
              />
            )}

            {tab ===
              'dates' && (
              <DateSelectionPanel
                t={t}
                language={
                  language
                }
                activity={
                  activity
                }
                setActivity={
                  setActivity
                }
                months={
                  dateMonths
                }
                setMonths={
                  setDateMonths
                }
                dates={
                  recommendedDates
                }
                calculate={
                  calculateDates
                }
                isCalculating={
                  isCalculating
                }
              />
            )}
          </>
        )}

        {/* <View
          style={
            styles.noticeCard
          }>
          <Text
            style={
              styles.noticeTitle
            }>
            {t(
              'bazi.noticeTitle',
            )}
          </Text>

          <Text
            style={
              styles.noticeText
            }>
            {t(
              'bazi.stage4.notice',
            )}
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

type TFunctionLike = (
  key: string,
  options?: Record<
    string,
    unknown
  >,
) => string;

function Stage4TabButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({pressed}: {pressed: boolean}) => [
        styles.tabButton,
        active &&
          styles.tabButtonActive,
        pressed &&
          styles.pressed,
      ]}
      onPress={
        onPress
      }>
      <Text
        style={[
          styles.tabButtonText,
          active &&
            styles.tabButtonTextActive,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

function RecordSelector({
  label,
  records,
  selectedId,
  onSelect,
  allowNone = false,
  noneLabel = '',
  language,
}: {
  label: string;
  records: SavedBaziRecord[];
  selectedId: string | null;
  onSelect: (
    value: string | null,
  ) => void;
  allowNone?: boolean;
  noneLabel?: string;
  language: string;
}) {
  return (
    <View
      style={
        styles.selectorCard
      }>
      <Text
        style={
          styles.sectionTitle
        }>
        {label}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.selectorRow
        }>
        {allowNone && (
          <Pressable
            style={({pressed}: {pressed: boolean}) => [
              styles.recordChip,
              selectedId ===
                null &&
                styles.recordChipActive,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              onSelect(
                null,
              )
            }>
            <Text
              style={[
                styles.recordChipTitle,
                selectedId ===
                  null &&
                  styles.recordChipTitleActive,
              ]}>
              {noneLabel}
            </Text>
          </Pressable>
        )}

        {records.map(
          item => {
            const selected =
              item.id ===
              selectedId;

            return (
              <Pressable
                key={
                  item.id
                }
                style={({pressed}: {pressed: boolean}) => [
                  styles.recordChip,
                  selected &&
                    styles.recordChipActive,
                  pressed &&
                    styles.pressed,
                ]}
                onPress={() =>
                  onSelect(
                    item.id,
                  )
                }>
                <Text
                  style={[
                    styles.recordChipTitle,
                    selected &&
                      styles.recordChipTitleActive,
                  ]}
                  numberOfLines={
                    1
                  }>
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.recordChipMeta,
                    selected &&
                      styles.recordChipMetaActive,
                  ]}>
                  {formatStage4Pillar(
                    item.chart
                      .pillars
                      .day,
                    language,
                  )}
                </Text>
              </Pressable>
            );
          },
        )}
      </ScrollView>
    </View>
  );
}

function TimelinePanel({
  t,
  language,
  years,
  setYears,
  selectedYear,
  setSelectedYear,
  timeline,
  calculate,
  isCalculating,
}: {
  t: TFunctionLike;
  language: string;
  years: number;
  setYears: (
    value: number,
  ) => void;
  selectedYear: number;
  setSelectedYear: (
    value: number,
  ) => void;
  timeline: TransitTimeline | null;
  calculate: () => void;
  isCalculating: boolean;
}) {
  return (
    <View
      style={
        styles.panelCard
      }>
      <Text
        style={
          styles.sectionTitle
        }>
        {t(
          'bazi.stage4.timeline.title',
        )}
      </Text>

      <Text
        style={
          styles.sectionSubtitle
        }>
        {t(
          'bazi.stage4.timeline.subtitle',
        )}
      </Text>

      <OptionRow
        values={
          TIMELINE_YEAR_OPTIONS
        }
        selected={
          years
        }
        onSelect={
          setYears
        }
        label={value =>
          t(
            'bazi.stage4.timeline.yearCount',
            {
              count:
                value,
            },
          )
        }
      />

      <PrimaryActionButton
        label={
          isCalculating
            ? t(
                'bazi.stage4.calculating',
              )
            : t(
                'bazi.stage4.timeline.calculate',
              )
        }
        disabled={
          isCalculating
        }
        onPress={
          calculate
        }
      />

      {timeline && (
        <>
          <View
            style={
              styles.summaryStrip
            }>
            <SummaryBlock
              label={t(
                'bazi.stage4.timeline.peakYears',
              )}
              value={
                timeline.peakYears.join(
                  ', ',
                )
              }
            />

            <SummaryBlock
              label={t(
                'bazi.stage4.timeline.cautionYears',
              )}
              value={
                timeline.cautionYears.join(
                  ', ',
                )
              }
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.yearCardsRow
            }>
            {timeline.annual.map(
              item => {
                const tone =
                  scoreTone(
                    item
                      .domainScores
                      .overall
                      .score,
                  );

                const active =
                  selectedYear ===
                  item.year;

                return (
                  <Pressable
                    key={
                      item.year
                    }
                    style={({pressed}: {pressed: boolean}) => [
                      styles.yearCard,
                      {
                        backgroundColor:
                          tone.backgroundColor,
                        borderColor:
                          active
                            ? '#F7CE76'
                            : tone.borderColor,
                      },
                      pressed &&
                        styles.pressed,
                    ]}
                    onPress={() =>
                      setSelectedYear(
                        item.year,
                      )
                    }>
                    <Text
                      style={[
                        styles.yearCardYear,
                        {
                          color:
                            tone.textColor,
                        },
                      ]}>
                      {item.year}
                    </Text>

                    <Text
                      style={[
                        styles.yearCardPillar,
                        {
                          color:
                            tone.textColor,
                        },
                      ]}>
                      {formatStage4Pillar(
                        item.pillar,
                        language,
                      )}
                    </Text>

                    <Text
                      style={[
                        styles.yearCardScore,
                        {
                          color:
                            tone.textColor,
                        },
                      ]}>
                      {
                        item
                          .domainScores
                          .overall
                          .score
                      }
                    </Text>
                  </Pressable>
                );
              },
            )}
          </ScrollView>

          {timeline.annual
            .filter(
              item =>
                item.year ===
                selectedYear,
            )
            .map(
              item => (
                <View
                  key={
                    item.year
                  }
                  style={
                    styles.detailCard
                  }>
                  <Text
                    style={
                      styles.detailTitle
                    }>
                    {
                      item.year
                    }{' '}
                    •{' '}
                    {formatStage4Pillar(
                      item.pillar,
                      language,
                    )}
                  </Text>

                  <DomainScores
                    t={t}
                    scores={
                      item.domainScores
                    }
                  />

                  {item.activeLuckPillar && (
                    <Text
                      style={
                        styles.detailNote
                      }>
                      {t(
                        'bazi.stage4.timeline.activeLuck',
                      )}
                      {': '}
                      {formatStage4Pillar(
                        item.activeLuckPillar,
                        language,
                      )}
                    </Text>
                  )}
                </View>
              ),
            )}

          {timeline.monthlyByYear[
            String(
              selectedYear,
            )
          ] && (
            <View
              style={
                styles.monthGrid
              }>
              {timeline.monthlyByYear[
                String(
                  selectedYear,
                )
              ].map(
                month => {
                  const tone =
                    scoreTone(
                      month
                        .domainScores
                        .overall
                        .score,
                    );

                  return (
                    <View
                      key={
                        month.month
                      }
                      style={[
                        styles.monthCard,
                        {
                          borderColor:
                            tone.borderColor,
                        },
                      ]}>
                      <Text
                        style={
                          styles.monthLabel
                        }>
                        {t(
                          'bazi.stage4.timeline.monthLabel',
                          {
                            count:
                              month.month,
                          },
                        )}
                      </Text>

                      <Text
                        style={
                          styles.monthPillar
                        }>
                        {formatStage4Pillar(
                          month.pillar,
                          language,
                        )}
                      </Text>

                      <Text
                        style={
                          styles.monthScore
                        }>
                        {
                          month
                            .domainScores
                            .overall
                            .score
                        }
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

function CompatibilityPanel({
  t,
  language,
  purpose,
  setPurpose,
  result,
  calculate,
  isCalculating,
}: {
  t: TFunctionLike;
  language: string;
  purpose: CompatibilityPurpose;
  setPurpose: (
    value: CompatibilityPurpose,
  ) => void;
  result: DetailedCompatibilityResult | null;
  calculate: () => void;
  isCalculating: boolean;
}) {
  return (
    <View
      style={
        styles.panelCard
      }>
      <Text
        style={
          styles.sectionTitle
        }>
        {t(
          'bazi.stage4.compatibility.title',
        )}
      </Text>

      <Text
        style={
          styles.sectionSubtitle
        }>
        {t(
          'bazi.stage4.compatibility.subtitle',
        )}
      </Text>

      <View
        style={
          styles.threeOptionRow
        }>
        {PURPOSE_OPTIONS.map(
          item => {
            const selected =
              item ===
              purpose;

            return (
              <Pressable
                key={
                  item
                }
                style={({pressed}: {pressed: boolean}) => [
                  styles.smallOption,
                  selected &&
                    styles.smallOptionActive,
                  pressed &&
                    styles.pressed,
                ]}
                onPress={() =>
                  setPurpose(
                    item,
                  )
                }>
                <Text
                  style={[
                    styles.smallOptionText,
                    selected &&
                      styles.smallOptionTextActive,
                  ]}>
                  {t(
                    `bazi.stage4.compatibility.purposes.${item}`,
                  )}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>

      <PrimaryActionButton
        label={
          isCalculating
            ? t(
                'bazi.stage4.calculating',
              )
            : t(
                'bazi.stage4.compatibility.calculate',
              )
        }
        disabled={
          isCalculating
        }
        onPress={
          calculate
        }
      />

      {result && (
        <View
          style={
            styles.detailCard
          }>
          <View
            style={
              styles.compatibilityHeader
            }>
            <View>
              <Text
                style={
                  styles.detailTitle
                }>
                {t(
                  'bazi.stage4.compatibility.overall',
                )}
              </Text>

              <Text
                style={
                  styles.detailNote
                }>
                {t(
                  `bazi.stage4.levels.${result.level}`,
                )}
              </Text>
            </View>

            <View
              style={
                styles.largeScoreBadge
              }>
              <Text
                style={
                  styles.largeScore
                }>
                {result.score}
              </Text>
            </View>
          </View>

          {Object.entries(
            result.domains,
          ).map(
            ([
              key,
              value,
            ]) => (
              <ScoreProgress
                key={
                  key
                }
                label={t(
                  `bazi.stage4.compatibility.domains.${key}`,
                )}
                score={
                  value.score
                }
              />
            ),
          )}

          {result
            .complementingElements
            .length > 0 && (
            <Text
              style={
                styles.detailNote
              }>
              {t(
                'bazi.stage4.compatibility.complementingElements',
              )}
              {': '}
              {result.complementingElements
                .map(
                  element =>
                    t(
                      `bazi.elements.${element}`,
                    ),
                )
                .join(
                  ', ',
                )}
            </Text>
          )}

          {result
            .conflictingElements
            .length > 0 && (
            <Text
              style={
                styles.warningText
              }>
              {t(
                'bazi.stage4.compatibility.conflictingElements',
              )}
              {': '}
              {result.conflictingElements
                .map(
                  element =>
                    t(
                      `bazi.elements.${element}`,
                    ),
                )
                .join(
                  ', ',
                )}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

function DateSelectionPanel({
  t,
  language,
  activity,
  setActivity,
  months,
  setMonths,
  dates,
  calculate,
  isCalculating,
}: {
  t: TFunctionLike;
  language: string;
  activity: DateSelectionActivity;
  setActivity: (
    value: DateSelectionActivity,
  ) => void;
  months: number;
  setMonths: (
    value: number,
  ) => void;
  dates: RecommendedDate[];
  calculate: () => void;
  isCalculating: boolean;
}) {
  return (
    <View
      style={
        styles.panelCard
      }>
      <Text
        style={
          styles.sectionTitle
        }>
        {t(
          'bazi.stage4.dates.title',
        )}
      </Text>

      <Text
        style={
          styles.sectionSubtitle
        }>
        {t(
          'bazi.stage4.dates.subtitle',
        )}
      </Text>

      <View
        style={
          styles.activityGrid
        }>
        {ACTIVITY_OPTIONS.map(
          item => {
            const selected =
              item.id ===
              activity;

            return (
              <Pressable
                key={
                  item.id
                }
                style={({pressed}: {pressed: boolean}) => [
                  styles.activityButton,
                  selected &&
                    styles.activityButtonActive,
                  pressed &&
                    styles.pressed,
                ]}
                onPress={() =>
                  setActivity(
                    item.id,
                  )
                }>
                <Text
                  style={
                    styles.activityIcon
                  }>
                  {item.icon}
                </Text>

                <Text
                  style={[
                    styles.activityText,
                    selected &&
                      styles.activityTextActive,
                  ]}>
                  {t(
                    `bazi.stage4.dates.activities.${item.id}`,
                  )}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>

      <OptionRow
        values={
          DATE_MONTH_OPTIONS
        }
        selected={
          months
        }
        onSelect={
          setMonths
        }
        label={value =>
          t(
            'bazi.stage4.dates.monthCount',
            {
              count:
                value,
            },
          )
        }
      />

      <PrimaryActionButton
        label={
          isCalculating
            ? t(
                'bazi.stage4.calculating',
              )
            : t(
                'bazi.stage4.dates.calculate',
              )
        }
        disabled={
          isCalculating
        }
        onPress={
          calculate
        }
      />

      {dates.map(
        (
          item,
          index,
        ) => {
          const tone =
            scoreTone(
              item.score,
            );

          return (
            <View
              key={
                item.date
              }
              style={
                styles.dateCard
              }>
              <View
                style={
                  styles.dateRank
                }>
                <Text
                  style={
                    styles.dateRankText
                  }>
                  {index + 1}
                </Text>
              </View>

              <View
                style={
                  styles.dateInfo
                }>
                <Text
                  style={
                    styles.dateTitle
                  }>
                  {formatDate(
                    item.date,
                    language,
                  )}
                </Text>

                <Text
                  style={
                    styles.datePillar
                  }>
                  {formatStage4Pillar(
                    item.pillar,
                    language,
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.dateScoreBadge,
                  {
                    backgroundColor:
                      tone.backgroundColor,
                    borderColor:
                      tone.borderColor,
                  },
                ]}>
                <Text
                  style={[
                    styles.dateScore,
                    {
                      color:
                        tone.textColor,
                    },
                  ]}>
                  {item.score}
                </Text>
              </View>
            </View>
          );
        },
      )}
    </View>
  );
}

function OptionRow({
  values,
  selected,
  onSelect,
  label,
}: {
  values: readonly number[];
  selected: number;
  onSelect: (
    value: number,
  ) => void;
  label: (
    value: number,
  ) => string;
}) {
  return (
    <View
      style={
        styles.optionRow
      }>
      {values.map(
        value => {
          const active =
            selected ===
            value;

          return (
            <Pressable
              key={
                value
              }
              style={({pressed}: {pressed: boolean}) => [
                styles.optionButton,
                active &&
                  styles.optionButtonActive,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                onSelect(
                  value,
                )
              }>
              <Text
                style={[
                  styles.optionButtonText,
                  active &&
                    styles.optionButtonTextActive,
                ]}>
                {label(
                  value,
                )}
              </Text>
            </Pressable>
          );
        },
      )}
    </View>
  );
}

function PrimaryActionButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={
        disabled
      }
      style={({pressed}: {pressed: boolean}) => [
        styles.primaryButton,
        disabled &&
          styles.disabled,
        pressed &&
          styles.pressed,
      ]}
      onPress={
        onPress
      }>
      <Text
        style={
          styles.primaryButtonText
        }>
        {label}
      </Text>
    </Pressable>
  );
}

function SummaryBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={
        styles.summaryBlock
      }>
      <Text
        style={
          styles.summaryLabel
        }>
        {label}
      </Text>

      <Text
        style={
          styles.summaryValue
        }>
        {value ||
          '—'}
      </Text>
    </View>
  );
}

function DomainScores({
  t,
  scores,
}: {
  t: TFunctionLike;
  scores: TransitTimeline['annual'][number]['domainScores'];
}) {
  return (
    <View
      style={
        styles.domainGrid
      }>
      {(
        [
          'love',
          'career',
          'wealth',
          'wellbeing',
        ] as const
      ).map(
        key => (
          <View
            key={
              key
            }
            style={
              styles.domainItem
            }>
            <Text
              style={
                styles.domainLabel
              }>
              {t(
                `bazi.stage4.domains.${key}`,
              )}
            </Text>

            <Text
              style={
                styles.domainScore
              }>
              {
                scores[
                  key
                ].score
              }
            </Text>
          </View>
        ),
      )}
    </View>
  );
}

function ScoreProgress({
  label,
  score,
}: {
  key?: string;
  label: string;
  score: number;
}) {
  return (
    <View
      style={
        styles.progressRow
      }>
      <View
        style={
          styles.progressHeader
        }>
        <Text
          style={
            styles.progressLabel
          }>
          {label}
        </Text>

        <Text
          style={
            styles.progressValue
          }>
          {score}
        </Text>
      </View>

      <View
        style={
          styles.progressTrack
        }>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.max(
                0,
                Math.min(
                  100,
                  score,
                ),
              )}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const BACKGROUND =
  '#FFF8EF';

const SURFACE =
  '#FFFDF8';

const BROWN =
  '#4E2C1C';

const GOLD =
  '#D0A04C';

const BORDER =
  '#E4CBA7';

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        BACKGROUND,
    },

    content: {
      padding: 16,
      paddingBottom: 120,
    },

    headerCard: {
      alignItems:
        'center',
      backgroundColor:
        BROWN,
      borderWidth: 1,
      borderColor:
        GOLD,
      borderRadius: 24,
      padding: 20,
    },

    headerIcon: {
      color:
        '#FFE3A3',
      fontSize: 42,
    },

    title: {
      color:
        '#FFE3A3',
      fontSize: 27,
      fontWeight:
        '900',
      textAlign:
        'center',
      marginTop: 6,
    },

    subtitle: {
      color:
        '#ECD7B8',
      fontSize: 14,
      lineHeight: 21,
      textAlign:
        'center',
      marginTop: 8,
    },

    tabRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      backgroundColor:
        '#F4E7D5',
      borderRadius: 16,
      padding: 5,
      marginTop: 14,
    },

    tabButton: {
      width: '32%',
      minHeight: 44,
      alignItems:
        'center',
      justifyContent:
        'center',
      borderRadius: 12,
      paddingHorizontal: 5,
    },

    tabButtonActive: {
      backgroundColor:
        BROWN,
    },

    tabButtonText: {
      color:
        '#775F4B',
      fontSize: 11,
      fontWeight:
        '800',
      textAlign:
        'center',
    },

    tabButtonTextActive: {
      color:
        '#FFE5AA',
    },

    selectorCard: {
      backgroundColor:
        SURFACE,
      borderWidth: 1,
      borderColor:
        BORDER,
      borderRadius: 18,
      padding: 14,
      marginTop: 14,
    },

    sectionTitle: {
      color:
        BROWN,
      fontSize: 18,
      fontWeight:
        '900',
    },

    sectionSubtitle: {
      color:
        '#826B58',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 5,
      marginBottom: 12,
    },

    selectorRow: {
      paddingTop: 10,
      paddingRight: 4,
    },

    recordChip: {
      width: 150,
      minHeight: 64,
      backgroundColor:
        '#F4E8D8',
      borderWidth: 1,
      borderColor:
        '#E0C8A6',
      borderRadius: 14,
      padding: 11,
      marginRight: 8,
    },

    recordChipActive: {
      backgroundColor:
        BROWN,
      borderColor:
        GOLD,
    },

    recordChipTitle: {
      color:
        BROWN,
      fontSize: 13,
      fontWeight:
        '900',
    },

    recordChipTitleActive: {
      color:
        '#FFE5AA',
    },

    recordChipMeta: {
      color:
        '#8D735D',
      fontSize: 10,
      marginTop: 5,
    },

    recordChipMetaActive: {
      color:
        '#DCC6A1',
    },

    panelCard: {
      backgroundColor:
        SURFACE,
      borderWidth: 1,
      borderColor:
        BORDER,
      borderRadius: 22,
      padding: 16,
      marginTop: 14,
    },

    optionRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      marginTop: 10,
    },

    optionButton: {
      width: '31.5%',
      minHeight: 42,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F3E7D7',
      borderRadius: 13,
    },

    optionButtonActive: {
      backgroundColor:
        BROWN,
    },

    optionButtonText: {
      color:
        '#705846',
      fontSize: 12,
      fontWeight:
        '800',
    },

    optionButtonTextActive: {
      color:
        '#FFE5AA',
    },

    primaryButton: {
      minHeight: 50,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        GOLD,
      borderRadius: 15,
      marginTop: 16,
    },

    primaryButtonText: {
      color:
        '#3C2417',
      fontSize: 14,
      fontWeight:
        '900',
    },

    summaryStrip: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      marginTop: 14,
    },

    summaryBlock: {
      width: '48.5%',
      backgroundColor:
        '#F6E9D7',
      borderRadius: 14,
      padding: 12,
    },

    summaryLabel: {
      color:
        '#866B54',
      fontSize: 10,
      fontWeight:
        '700',
    },

    summaryValue: {
      color:
        BROWN,
      fontSize: 15,
      fontWeight:
        '900',
      marginTop: 5,
    },

    yearCardsRow: {
      paddingTop: 14,
      paddingRight: 5,
    },

    yearCard: {
      width: 112,
      minHeight: 132,
      alignItems:
        'center',
      justifyContent:
        'center',
      borderWidth: 2,
      borderRadius: 17,
      padding: 10,
      marginRight: 9,
    },

    yearCardYear: {
      fontSize: 13,
      fontWeight:
        '700',
    },

    yearCardPillar: {
      fontSize: 18,
      fontWeight:
        '900',
      textAlign:
        'center',
      marginTop: 7,
    },

    yearCardScore: {
      fontSize: 24,
      fontWeight:
        '900',
      marginTop: 8,
    },

    detailCard: {
      backgroundColor:
        '#FFF4DF',
      borderWidth: 1,
      borderColor:
        '#DFC18C',
      borderRadius: 17,
      padding: 14,
      marginTop: 14,
    },

    detailTitle: {
      color:
        BROWN,
      fontSize: 16,
      fontWeight:
        '900',
    },

    detailNote: {
      color:
        '#765F4C',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 10,
    },

    domainGrid: {
      flexDirection:
        'row',
      flexWrap:
        'wrap',
      justifyContent:
        'space-between',
      marginTop: 10,
    },

    domainItem: {
      width: '48.5%',
      backgroundColor:
        '#F6E8D4',
      borderRadius: 13,
      padding: 10,
      marginBottom: 8,
    },

    domainLabel: {
      color:
        '#826A56',
      fontSize: 10,
    },

    domainScore: {
      color:
        BROWN,
      fontSize: 20,
      fontWeight:
        '900',
      marginTop: 3,
    },

    monthGrid: {
      flexDirection:
        'row',
      flexWrap:
        'wrap',
      justifyContent:
        'space-between',
      marginTop: 13,
    },

    monthCard: {
      width: '31.5%',
      minHeight: 94,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#FFFDF8',
      borderWidth: 1,
      borderRadius: 14,
      padding: 8,
      marginBottom: 8,
    },

    monthLabel: {
      color:
        '#8A715C',
      fontSize: 10,
    },

    monthPillar: {
      color:
        BROWN,
      fontSize: 13,
      fontWeight:
        '900',
      textAlign:
        'center',
      marginTop: 5,
    },

    monthScore: {
      color:
        '#8A6335',
      fontSize: 17,
      fontWeight:
        '900',
      marginTop: 5,
    },

    threeOptionRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
    },

    smallOption: {
      width: '31.5%',
      minHeight: 44,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F3E7D7',
      borderRadius: 13,
      paddingHorizontal: 4,
    },

    smallOptionActive: {
      backgroundColor:
        BROWN,
    },

    smallOptionText: {
      color:
        '#6F5745',
      fontSize: 11,
      fontWeight:
        '800',
      textAlign:
        'center',
    },

    smallOptionTextActive: {
      color:
        '#FFE5AA',
    },

    compatibilityHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
    },

    largeScoreBadge: {
      width: 68,
      height: 68,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        BROWN,
      borderRadius: 20,
    },

    largeScore: {
      color:
        '#FFE5AA',
      fontSize: 24,
      fontWeight:
        '900',
    },

    progressRow: {
      marginTop: 13,
    },

    progressHeader: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
    },

    progressLabel: {
      color:
        '#755D4B',
      fontSize: 12,
      fontWeight:
        '700',
    },

    progressValue: {
      color:
        BROWN,
      fontSize: 12,
      fontWeight:
        '900',
    },

    progressTrack: {
      height: 9,
      backgroundColor:
        '#E9DCCE',
      borderRadius: 5,
      overflow:
        'hidden',
      marginTop: 6,
    },

    progressFill: {
      height: '100%',
      backgroundColor:
        GOLD,
      borderRadius: 5,
    },

    warningText: {
      color:
        '#9C4F3D',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 10,
    },

    activityGrid: {
      flexDirection:
        'row',
      flexWrap:
        'wrap',
      justifyContent:
        'space-between',
    },

    activityButton: {
      width: '48.5%',
      minHeight: 62,
      flexDirection:
        'row',
      alignItems:
        'center',
      backgroundColor:
        '#F3E7D7',
      borderRadius: 14,
      paddingHorizontal: 10,
      marginBottom: 8,
    },

    activityButtonActive: {
      backgroundColor:
        BROWN,
    },

    activityIcon: {
      fontSize: 21,
      marginRight: 8,
    },

    activityText: {
      flex: 1,
      color:
        '#6F5745',
      fontSize: 11,
      fontWeight:
        '800',
    },

    activityTextActive: {
      color:
        '#FFE5AA',
    },

    dateCard: {
      flexDirection:
        'row',
      alignItems:
        'center',
      backgroundColor:
        '#FFF9EE',
      borderWidth: 1,
      borderColor:
        '#E4CCAA',
      borderRadius: 16,
      padding: 12,
      marginTop: 10,
    },

    dateRank: {
      width: 34,
      height: 34,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F1DFC0',
      borderRadius: 11,
      marginRight: 10,
    },

    dateRankText: {
      color:
        BROWN,
      fontSize: 13,
      fontWeight:
        '900',
    },

    dateInfo: {
      flex: 1,
    },

    dateTitle: {
      color:
        BROWN,
      fontSize: 13,
      fontWeight:
        '900',
    },

    datePillar: {
      color:
        '#8B705A',
      fontSize: 11,
      marginTop: 4,
    },

    dateScoreBadge: {
      minWidth: 58,
      alignItems:
        'center',
      borderWidth: 1,
      borderRadius: 13,
      paddingHorizontal: 8,
      paddingVertical: 8,
    },

    dateScore: {
      fontSize: 17,
      fontWeight:
        '900',
    },

    noticeCard: {
      backgroundColor:
        '#F7EAD6',
      borderWidth: 1,
      borderColor:
        '#DFC59C',
      borderRadius: 16,
      padding: 14,
      marginTop: 14,
    },

    noticeTitle: {
      color:
        BROWN,
      fontSize: 14,
      fontWeight:
        '900',
    },

    noticeText: {
      color:
        '#745C48',
      fontSize: 11,
      lineHeight: 17,
      marginTop: 5,
    },

    emptyCard: {
      alignItems:
        'center',
      backgroundColor:
        SURFACE,
      borderWidth: 1,
      borderColor:
        BORDER,
      borderRadius: 20,
      padding: 24,
      marginTop: 14,
    },

    emptyIcon: {
      fontSize: 36,
    },

    emptyTitle: {
      color:
        BROWN,
      fontSize: 17,
      fontWeight:
        '900',
      marginTop: 8,
    },

    emptyText: {
      color:
        '#806A57',
      fontSize: 13,
      lineHeight: 19,
      textAlign:
        'center',
      marginTop: 6,
    },

    disabled: {
      opacity: 0.5,
    },

    pressed: {
      opacity: 0.68,
      transform: [
        {
          scale: 0.985,
        },
      ],
    },
  });
