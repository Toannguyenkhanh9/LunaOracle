import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  getUserProfiles,
  type UserProfile,
} from '../services/userProfiles';

import {
  buildLifeTimeline,
  type TimelineYearInsight,
} from '../services/lifeTimeline';

import {
  saveBookmark,
} from '../services/bookmarksNotes';

import ExpertModeBar
  from '../components/ExpertModeBar';

import ExpertDetailsCard
  from '../components/ExpertDetailsCard';

import {
  useExpertMode,
} from '../services/expertMode';

import {
  buildTimelineEventCounts,
  deleteTimelineEvent,
  getTimelineEventsByProfile,
  type TimelineEvent,
} from '../services/timelineEvents';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'LifeTimeline'
>;

const STEM_KEYS = [
  'jia',
  'yi',
  'bing',
  'ding',
  'wu',
  'ji',
  'geng',
  'xin',
  'ren',
  'gui',
] as const;

const BRANCH_KEYS = [
  'rat',
  'ox',
  'tiger',
  'rabbit',
  'dragon',
  'snake',
  'horse',
  'goat',
  'monkey',
  'rooster',
  'dog',
  'pig',
] as const;

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.scoreRow}>
      <View style={styles.scoreLabelRow}>
        <Text style={styles.scoreLabel}>
          {label}
        </Text>

        <Text style={styles.scoreValue}>
          {value}
        </Text>
      </View>

      <View style={styles.scoreTrack}>
        <View
          style={[
            styles.scoreFill,
            {
              width: `${value}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

function ProfileChip({
  profile,
  selected,
  onPress,
}: {
  profile: UserProfile;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.profileChip,
        selected &&
          styles.profileChipSelected,
        pressed &&
          styles.pressed,
      ]}
      onPress={onPress}>
      <Text
        numberOfLines={1}
        style={[
          styles.profileChipText,
          selected &&
            styles.profileChipTextSelected,
        ]}>
        {profile.displayName}
      </Text>
    </Pressable>
  );
}

function formatTimelineEventDate(
  item: TimelineEvent,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    ).format(
      new Date(
        item.year,
        item.month - 1,
        item.day,
        12,
        0,
        0,
        0,
      ),
    );
  } catch {
    return `${item.day}/${item.month}/${item.year}`;
  }
}

function TimelineEventCard({
  item,
  language,
  t,
  onEdit,
  onDelete,
}: {
  item: TimelineEvent;
  language: string;
  t: (
    key: string,
    options?: Record<
      string,
      unknown
    >,
  ) => unknown;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View
      style={[
        styles.eventCard,
        item.tone ===
          'positive' &&
          styles.eventCardPositive,
        item.tone ===
          'challenging' &&
          styles.eventCardChallenging,
      ]}>
      <View
        style={
          styles.eventCardHeader
        }>
        <View
          style={[
            styles.eventToneDot,
            item.tone ===
              'positive' &&
              styles.eventToneDotPositive,
            item.tone ===
              'challenging' &&
              styles.eventToneDotChallenging,
          ]}
        />

        <View
          style={
            styles.eventCardTextWrap
          }>
          <Text
            style={
              styles.eventCardTitle
            }>
            {item.title}
          </Text>

          <Text
            style={
              styles.eventCardMeta
            }>
            {formatTimelineEventDate(
              item,
              language,
            )}{' '}
            ·{' '}
            {String(
              t(
                `timelineEvents.categories.${item.category}`,
              ),
            )}
          </Text>
        </View>

        <View
          style={
            styles.eventImportance
          }>
          <Text
            style={
              styles.eventImportanceText
            }>
            {'★'.repeat(
              item.importance,
            )}
          </Text>
        </View>
      </View>

      {!!item.description && (
        <Text
          style={
            styles.eventDescription
          }>
          {item.description}
        </Text>
      )}

      {item.tags.length > 0 && (
        <View
          style={
            styles.eventTags
          }>
          {item.tags.map(
            tag => (
              <Text
                key={tag}
                style={
                  styles.eventTag
                }>
                #{tag}
              </Text>
            ),
          )}
        </View>
      )}

      <View
        style={
          styles.eventActions
        }>
        <Pressable
          style={
            styles.eventEditButton
          }
          onPress={onEdit}>
          <Text
            style={
              styles.eventEditText
            }>
            {String(
              t(
                'timelineEvents.edit',
              ),
            )}
          </Text>
        </Pressable>

        <Pressable
          style={
            styles.eventDeleteButton
          }
          onPress={onDelete}>
          <Text
            style={
              styles.eventDeleteText
            }>
            {String(
              t(
                'timelineEvents.delete',
              ),
            )}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function LifeTimelineScreen({
  navigation,
  route,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const {
    isExpert,
    preferences,
  } =
    useExpertMode();

  const currentYear =
    new Date().getFullYear();

  const [profiles, setProfiles] =
    useState<UserProfile[]>([]);

  const [events, setEvents] =
    useState<TimelineEvent[]>([]);

  const [
    isLoadingEvents,
    setIsLoadingEvents,
  ] = useState(false);

  const [
    selectedProfileId,
    setSelectedProfileId,
  ] = useState<string | null>(
    route.params?.profileId ??
      null,
  );

  const [selectedYear, setSelectedYear] =
    useState(
      route.params?.year ??
        currentYear,
    );

  const [rangeYears, setRangeYears] =
    useState<10 | 20>(10);

  const load = useCallback(async () => {
    try {
      const items =
        await getUserProfiles();

      setProfiles(items);

      setSelectedProfileId(
        current => {
          if (
            current &&
            items.some(
              item =>
                item.id === current,
            )
          ) {
            return current;
          }

          const favorite =
            items.find(
              item =>
                item.isFavorite,
            );

          return (
            favorite?.id ??
            items[0]?.id ??
            null
          );
        },
      );
    } catch (error) {
      console.warn(
        'Unable to load profiles for timeline:',
        error,
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const loadEvents =
    useCallback(async () => {
      if (!selectedProfileId) {
        setEvents([]);
        return;
      }

      setIsLoadingEvents(
        true,
      );

      try {
        setEvents(
          await getTimelineEventsByProfile(
            selectedProfileId,
          ),
        );
      } catch (error) {
        console.warn(
          'Unable to load timeline events:',
          error,
        );
      } finally {
        setIsLoadingEvents(
          false,
        );
      }
    }, [selectedProfileId]);

  useFocusEffect(
    useCallback(() => {
      void loadEvents();
    }, [loadEvents]),
  );

  const selectedProfile =
    useMemo(
      () =>
        profiles.find(
          item =>
            item.id ===
            selectedProfileId,
        ) ?? null,
      [
        profiles,
        selectedProfileId,
      ],
    );

  const timeline =
    useMemo(() => {
      if (!selectedProfile) {
        return [];
      }

      const yearsBefore =
        rangeYears === 10
          ? 2
          : 5;

      const startYear =
        currentYear -
        yearsBefore;

      const endYear =
        startYear +
        rangeYears -
        1;

      return buildLifeTimeline(
        selectedProfile,
        startYear,
        endYear,
      );
    }, [
      selectedProfile,
      currentYear,
      rangeYears,
    ]);

  const selectedInsight =
    useMemo(
      () =>
        timeline.find(
          item =>
            item.year ===
            selectedYear,
        ) ??
        timeline.find(
          item =>
            item.year ===
            currentYear,
        ) ??
        timeline[0] ??
        null,
      [
        timeline,
        selectedYear,
        currentYear,
      ],
    );

  const eventCounts =
    useMemo(
      () =>
        buildTimelineEventCounts(
          events,
        ),
      [events],
    );

  const selectedYearEvents =
    useMemo(
      () =>
        events.filter(
          item =>
            item.year ===
            (
              selectedInsight?.year ??
              selectedYear
            ),
        ),
      [
        events,
        selectedInsight?.year,
        selectedYear,
      ],
    );

  const openEventEditor = (
    eventId?: string,
  ) => {
    if (
      !selectedProfile ||
      !selectedInsight
    ) {
      return;
    }

    navigation.navigate(
      'TimelineEventEditor',
      {
        profileId:
          selectedProfile.id,
        year:
          selectedInsight.year,
        eventId,
      },
    );
  };

  const confirmDeleteEvent = (
    item: TimelineEvent,
  ) => {
    Alert.alert(
      t(
        'timelineEvents.deleteTitle',
      ),
      t(
        'timelineEvents.deleteMessage',
        {
          title:
            item.title,
        },
      ),
      [
        {
          text: t(
            'timelineEvents.cancel',
          ),
          style: 'cancel',
        },
        {
          text: t(
            'timelineEvents.delete',
          ),
          style: 'destructive',
          onPress: async () => {
            try {
              const remaining =
                await deleteTimelineEvent(
                  item.id,
                );

              setEvents(
                remaining.filter(
                  event =>
                    event.profileId ===
                    selectedProfileId,
                ),
              );
            } catch (error) {
              console.warn(
                'Unable to delete timeline event:',
                error,
              );
            }
          },
        },
      ],
    );
  };

  const saveCurrent = async () => {
    if (
      !selectedProfile ||
      !selectedInsight
    ) {
      return;
    }

    try {
      await saveBookmark({
        route: 'LifeTimeline',
        params: {
          profileId:
            selectedProfile.id,
          year:
            selectedInsight.year,
        },
        titleKey:
          'insightFeatures.timeline.title',
        icon: '⌁',
        profileName:
          selectedProfile.displayName,
      });

      Alert.alert(
        t(
          'insightFeatures.timeline.savedTitle',
        ),
        t(
          'insightFeatures.timeline.savedMessage',
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to bookmark timeline:',
        error,
      );
    }
  };

  const yearLabel = (
    insight: TimelineYearInsight,
  ): string => {
    const stem =
      t(
        `insightFeatures.timeline.stems.${STEM_KEYS[insight.stemIndex]}`,
      );

    const branch =
      t(
        `insightFeatures.timeline.branches.${BRANCH_KEYS[insight.branchIndex]}`,
      );

    return `${stem} ${branch}`;
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.navy
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.hero}>
          <View>
            <Text style={styles.heroEyebrow}>
              EASTERN DESTINY
            </Text>

            <Text style={styles.heroTitle}>
              {t(
                'insightFeatures.timeline.title',
              )}
            </Text>

            <Text
              style={
                styles.heroSubtitle
              }>
              {t(
                'insightFeatures.timeline.subtitle',
              )}
            </Text>
          </View>

          <Text style={styles.heroIcon}>
            ⌁
          </Text>
        </View>

        <ExpertModeBar
          onOpenSettings={() =>
            navigation.navigate(
              'ExpertMode',
            )
          }
        />

        {profiles.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ◎
            </Text>

            <Text style={styles.emptyTitle}>
              {t(
                'insightFeatures.timeline.noProfileTitle',
              )}
            </Text>

            <Text style={styles.emptyText}>
              {t(
                'insightFeatures.timeline.noProfileMessage',
              )}
            </Text>

            <Pressable
              style={
                styles.createProfileButton
              }
              onPress={() =>
                navigation.navigate(
                  'UserProfileEditor',
                )
              }>
              <Text
                style={
                  styles.createProfileButtonText
                }>
                {t(
                  'insightFeatures.timeline.createProfile',
                )}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text
                style={
                  styles.sectionTitle
                }>
                {t(
                  'insightFeatures.timeline.chooseProfile',
                )}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.profileRow
                }>
                {profiles.map(
                  profile => (
                    <ProfileChip
                      key={
                        profile.id
                      }
                      profile={
                        profile
                      }
                      selected={
                        profile.id ===
                        selectedProfileId
                      }
                      onPress={() => {
                        setSelectedProfileId(
                          profile.id,
                        );

                        setSelectedYear(
                          currentYear,
                        );
                      }}
                    />
                  ),
                )}
              </ScrollView>

              <View
                style={
                  styles.rangeRow
                }>
                <Text
                  style={
                    styles.rangeLabel
                  }>
                  {t(
                    'insightFeatures.timeline.range',
                  )}
                </Text>

                <View
                  style={
                    styles.rangeButtons
                  }>
                  {(
                    [
                      10,
                      20,
                    ] as const
                  ).map(value => (
                    <Pressable
                      key={value}
                      style={[
                        styles.rangeButton,
                        rangeYears ===
                          value &&
                          styles.rangeButtonActive,
                      ]}
                      onPress={() => {
                        setRangeYears(
                          value,
                        );

                        setSelectedYear(
                          currentYear,
                        );
                      }}>
                      <Text
                        style={[
                          styles.rangeButtonText,
                          rangeYears ===
                            value &&
                            styles.rangeButtonTextActive,
                        ]}>
                        {t(
                          'insightFeatures.timeline.years',
                          {
                            count:
                              value,
                          },
                        )}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={
                  styles.sectionEyebrow
                }>
                {t(
                  'insightFeatures.timeline.visualEyebrow',
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }>
                {t(
                  'insightFeatures.timeline.visualTitle',
                )}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.timelineRow
                }>
                {timeline.map(
                  item => {
                    const active =
                      item.year ===
                      selectedInsight?.year;

                    const isCurrent =
                      item.year ===
                      currentYear;

                    return (
                      <Pressable
                        key={item.year}
                        style={[
                          styles.yearNode,
                          active &&
                            styles.yearNodeActive,
                        ]}
                        onPress={() =>
                          setSelectedYear(
                            item.year,
                          )
                        }>
                        <View
                          style={[
                            styles.yearDot,
                            active &&
                              styles.yearDotActive,
                            isCurrent &&
                              styles.yearDotCurrent,
                          ]}
                        />

                        <Text
                          style={[
                            styles.yearValue,
                            active &&
                              styles.yearValueActive,
                          ]}>
                          {item.year}
                        </Text>

                        <Text
                          style={[
                            styles.yearScore,
                            active &&
                              styles.yearScoreActive,
                          ]}>
                          {
                            item.overallScore
                          }
                        </Text>

                        {!!eventCounts[
                          item.year
                        ] && (
                          <View
                            style={[
                              styles.eventCountBadge,
                              active &&
                                styles.eventCountBadgeActive,
                            ]}>
                            <Text
                              style={[
                                styles.eventCountText,
                                active &&
                                  styles.eventCountTextActive,
                              ]}>
                              {
                                eventCounts[
                                  item.year
                                ]
                              }
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  },
                )}
              </ScrollView>
            </View>

            {selectedInsight &&
              selectedProfile && (
                <>
                  <View
                    style={
                      styles.detailCard
                    }>
                    <View
                      style={
                        styles.detailHeader
                      }>
                      <View>
                        <Text
                          style={
                            styles.detailYear
                          }>
                          {
                            selectedInsight.year
                          }
                        </Text>

                        <Text
                          style={
                            styles.detailCanChi
                          }>
                          {yearLabel(
                            selectedInsight,
                          )}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.overallScore
                        }>
                        <Text
                          style={
                            styles.overallScoreValue
                          }>
                          {
                            selectedInsight.overallScore
                          }
                        </Text>

                        <Text
                          style={
                            styles.overallScoreLabel
                          }>
                          {t(
                            'insightFeatures.timeline.overall',
                          )}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={
                        styles.detailMetaRow
                      }>
                      <Text
                        style={
                          styles.detailMeta
                        }>
                        {t(
                          'insightFeatures.timeline.age',
                          {
                            count:
                              selectedInsight.age,
                          },
                        )}
                      </Text>

                      <Text
                        style={
                          styles.detailMeta
                        }>
                        {t(
                          `insightFeatures.timeline.elements.${selectedInsight.element}`,
                        )}
                      </Text>

                      <Text
                        style={
                          styles.detailMeta
                        }>
                        {t(
                          `insightFeatures.timeline.relations.${selectedInsight.relation}`,
                        )}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.scoreSection
                      }>
                      <ScoreBar
                        label={t(
                          'insightFeatures.timeline.domains.career',
                        )}
                        value={
                          selectedInsight.careerScore
                        }
                      />

                      <ScoreBar
                        label={t(
                          'insightFeatures.timeline.domains.wealth',
                        )}
                        value={
                          selectedInsight.wealthScore
                        }
                      />

                      <ScoreBar
                        label={t(
                          'insightFeatures.timeline.domains.relationship',
                        )}
                        value={
                          selectedInsight.relationshipScore
                        }
                      />

                      <ScoreBar
                        label={t(
                          'insightFeatures.timeline.domains.wellbeing',
                        )}
                        value={
                          selectedInsight.wellbeingScore
                        }
                      />
                    </View>
                  </View>

                  {isExpert &&
                    preferences.showCalculationDetails && (
                      <ExpertDetailsCard
                        eyebrow={t(
                          'expertMode.details.eyebrow',
                        )}
                        title={t(
                          'expertMode.details.timelineTitle',
                        )}
                        showRawCodes={
                          preferences.showRawCodes
                        }
                        rows={[
                          {
                            label: t(
                              'expertMode.details.fields.modelVersion',
                            ),
                            value:
                              'life-timeline-v1',
                            code:
                              'life-timeline-v1',
                          },
                          {
                            label: t(
                              'expertMode.details.fields.yearStemIndex',
                            ),
                            value:
                              String(
                                selectedInsight.stemIndex,
                              ),
                            code:
                              'stemIndex',
                          },
                          {
                            label: t(
                              'expertMode.details.fields.yearBranchIndex',
                            ),
                            value:
                              String(
                                selectedInsight.branchIndex,
                              ),
                            code:
                              'branchIndex',
                          },
                          {
                            label: t(
                              'expertMode.details.fields.relationCode',
                            ),
                            value:
                              t(
                                `insightFeatures.timeline.relations.${selectedInsight.relation}`,
                              ),
                            code:
                              selectedInsight.relation,
                          },
                          {
                            label: t(
                              'expertMode.details.fields.timelineTone',
                            ),
                            value:
                              selectedInsight.tone,
                            code:
                              'tone',
                          },
                          {
                            label: t(
                              'expertMode.details.fields.calculationMethod',
                            ),
                            value:
                              'branch + element + stable profile variation',
                            code:
                              'timeline-v1-formula',
                          },
                        ]}
                        notes={[
                          t(
                            'expertMode.details.notes.timeline',
                          ),
                        ]}
                      />
                    )}

                  <View
                    style={
                      styles.insightGrid
                    }>
                    <View
                      style={
                        styles.insightCard
                      }>
                      <Text
                        style={
                          styles.insightTitle
                        }>
                        {t(
                          'insightFeatures.timeline.strengths',
                        )}
                      </Text>

                      {selectedInsight.strengthCodes.map(
                        code => (
                          <Text
                            key={code}
                            style={
                              styles.insightItem
                            }>
                            ✓{' '}
                            {t(
                              `insightFeatures.timeline.strengthCodes.${code}`,
                            )}
                          </Text>
                        ),
                      )}
                    </View>

                    <View
                      style={[
                        styles.insightCard,
                        styles.insightCardCaution,
                      ]}>
                      <Text
                        style={
                          styles.insightTitle
                        }>
                        {t(
                          'insightFeatures.timeline.cautions',
                        )}
                      </Text>

                      {selectedInsight.cautionCodes.map(
                        code => (
                          <Text
                            key={code}
                            style={
                              styles.insightItem
                            }>
                            !{' '}
                            {t(
                              `insightFeatures.timeline.cautionCodes.${code}`,
                            )}
                          </Text>
                        ),
                      )}
                    </View>
                  </View>

                  <View
                    style={
                      styles.eventsSection
                    }>
                    <View
                      style={
                        styles.eventsHeader
                      }>
                      <View
                        style={
                          styles.eventsHeaderText
                        }>
                        <Text
                          style={
                            styles.eventsEyebrow
                          }>
                          {t(
                            'timelineEvents.sectionEyebrow',
                          )}
                        </Text>

                        <Text
                          style={
                            styles.eventsTitle
                          }>
                          {t(
                            'timelineEvents.sectionTitle',
                            {
                              year:
                                selectedInsight.year,
                            },
                          )}
                        </Text>

                        <Text
                          style={
                            styles.eventsSubtitle
                          }>
                          {t(
                            'timelineEvents.sectionSubtitle',
                          )}
                        </Text>
                      </View>

                      <Pressable
                        style={({pressed}) => [
                          styles.addEventButton,
                          pressed &&
                            styles.pressed,
                        ]}
                        onPress={() =>
                          openEventEditor()
                        }>
                        <Text
                          style={
                            styles.addEventButtonText
                          }>
                          ＋{' '}
                          {t(
                            'timelineEvents.add',
                          )}
                        </Text>
                      </Pressable>
                    </View>

                    {isLoadingEvents ? (
                      <View
                        style={
                          styles.eventsEmpty
                        }>
                        <Text
                          style={
                            styles.eventsEmptyText
                          }>
                          {t(
                            'timelineEvents.loading',
                          )}
                        </Text>
                      </View>
                    ) : selectedYearEvents.length ===
                      0 ? (
                      <View
                        style={
                          styles.eventsEmpty
                        }>
                        <Text
                          style={
                            styles.eventsEmptyIcon
                          }>
                          ✦
                        </Text>

                        <Text
                          style={
                            styles.eventsEmptyTitle
                          }>
                          {t(
                            'timelineEvents.emptyTitle',
                          )}
                        </Text>

                        <Text
                          style={
                            styles.eventsEmptyText
                          }>
                          {t(
                            'timelineEvents.emptyMessage',
                          )}
                        </Text>
                      </View>
                    ) : (
                      selectedYearEvents.map(
                        item => (
                          <TimelineEventCard
                            key={
                              item.id
                            }
                            item={
                              item
                            }
                            language={
                              language
                            }
                            t={t}
                            onEdit={() =>
                              openEventEditor(
                                item.id,
                              )
                            }
                            onDelete={() =>
                              confirmDeleteEvent(
                                item,
                              )
                            }
                          />
                        ),
                      )
                    )}
                  </View>

                  <Pressable
                    style={
                      styles.explainButton
                    }
                    onPress={() =>
                      navigation.navigate(
                        'ExplainableResult',
                        {
                          kind:
                            'timeline',
                          profileId:
                            selectedProfile.id,
                          year:
                            selectedInsight.year,
                        },
                      )
                    }>
                    <Text
                      style={
                        styles.explainButtonText
                      }>
                      ?{' '}
                      {t(
                        'explainable.whyThisResult',
                      )}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={
                      styles.bookmarkButton
                    }
                    onPress={
                      saveCurrent
                    }>
                    <Text
                      style={
                        styles.bookmarkButtonText
                      }>
                      ☆{' '}
                      {t(
                        'insightFeatures.timeline.bookmark',
                      )}
                    </Text>
                  </Pressable>
                </>
              )}
          </>
        )}

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {t(
              'insightFeatures.timeline.modelTitle',
            )}
          </Text>

          <Text style={styles.noticeText}>
            {t(
              'insightFeatures.timeline.modelNotice',
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  navy: '#17243A',
  gold: '#D7AF5E',
  cream: '#F7F2E8',
  surface: '#FFFDF8',
  text: '#282D36',
  muted: '#6C726F',
  border: '#E2D7C5',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  content: {
    paddingBottom: 145,
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.navy,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
  },

  heroEyebrow: {
    color: '#D5B672',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#FFF7E5',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  heroSubtitle: {
    maxWidth: 300,
    color: '#C8CFD9',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  heroIcon: {
    color: '#E4C77F',
    fontSize: 44,
    marginLeft: 'auto',
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 22,
  },

  sectionEyebrow: {
    color: '#9B783B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  profileRow: {
    paddingTop: 11,
    paddingRight: 10,
  },

  profileChip: {
    minWidth: 108,
    maxWidth: 170,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },

  profileChipSelected: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  profileChipText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
  },

  profileChipTextSelected: {
    color: '#FFF1D0',
  },

  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },

  rangeLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
  },

  rangeButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },

  rangeButton: {
    backgroundColor: '#EEE6DA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginLeft: 6,
  },

  rangeButtonActive: {
    backgroundColor:
      COLORS.gold,
  },

  rangeButtonText: {
    color: '#6E665C',
    fontSize: 9,
    fontWeight: '800',
  },

  rangeButtonTextActive: {
    color: COLORS.navy,
  },

  timelineRow: {
    paddingTop: 14,
    paddingRight: 14,
  },

  yearNode: {
    width: 68,
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    paddingVertical: 11,
    marginRight: 8,
  },

  yearNodeActive: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  yearDot: {
    width: 9,
    height: 9,
    backgroundColor: '#B9AD9C',
    borderRadius: 5,
  },

  yearDotActive: {
    backgroundColor:
      COLORS.gold,
  },

  yearDotCurrent: {
    borderWidth: 2,
    borderColor: '#D9A840',
  },

  yearValue: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 7,
  },

  yearValueActive: {
    color: '#FFF3D3',
  },

  yearScore: {
    color: '#9B7844',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
  },

  yearScoreActive: {
    color: '#E4C77E',
  },

  detailCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 21,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 18,
  },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailYear: {
    color: COLORS.text,
    fontSize: 29,
    fontWeight: '900',
  },

  detailCanChi: {
    color: '#8E6930',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },

  overallScore: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.navy,
    borderWidth: 3,
    borderColor:
      COLORS.gold,
    borderRadius: 34,
    marginLeft: 'auto',
  },

  overallScoreValue: {
    color: '#FFF2D2',
    fontSize: 21,
    fontWeight: '900',
  },

  overallScoreLabel: {
    color: '#DCC78F',
    fontSize: 7.5,
    fontWeight: '800',
    marginTop: 1,
  },

  detailMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },

  detailMeta: {
    color: '#6C6257',
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: '#EEE7DB',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },

  scoreSection: {
    marginTop: 9,
  },

  scoreRow: {
    marginTop: 11,
  },

  scoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scoreLabel: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
  },

  scoreValue: {
    color: '#8D6A35',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 'auto',
  },

  scoreTrack: {
    height: 8,
    backgroundColor: '#E7E0D5',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },

  scoreFill: {
    height: '100%',
    backgroundColor:
      COLORS.gold,
  },

  insightGrid: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    paddingHorizontal: 16,
    marginTop: 11,
  },

  insightCard: {
    width: '48.5%',
    backgroundColor: '#EDF4E7',
    borderRadius: 16,
    padding: 13,
  },

  insightCardCaution: {
    backgroundColor: '#F8EBE7',
  },

  insightTitle: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 7,
  },

  insightItem: {
    color: '#5E5A54',
    fontSize: 9.5,
    lineHeight: 15,
    marginBottom: 5,
  },

  eventCountBadge: {
    minWidth: 22,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5DAC7',
    borderRadius: 9,
    paddingHorizontal: 5,
    marginTop: 7,
  },

  eventCountBadgeActive: {
    backgroundColor:
      'rgba(215,175,94,0.22)',
  },

  eventCountText: {
    color: '#76592E',
    fontSize: 8,
    fontWeight: '900',
  },

  eventCountTextActive: {
    color: '#F0D18B',
  },

  eventsSection: {
    paddingHorizontal: 16,
    marginTop: 18,
  },

  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  eventsHeaderText: {
    flex: 1,
    marginRight: 10,
  },

  eventsEyebrow: {
    color: '#9B783B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  eventsTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  eventsSubtitle: {
    color: COLORS.muted,
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  addEventButton: {
    backgroundColor:
      COLORS.gold,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  addEventButtonText: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: '900',
  },

  eventsEmpty: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    padding: 18,
    marginTop: 11,
  },

  eventsEmptyIcon: {
    color: '#B28C49',
    fontSize: 26,
  },

  eventsEmptyTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 6,
  },

  eventsEmptyText: {
    color: COLORS.muted,
    fontSize: 9.5,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 5,
  },

  eventCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: '#AFA69B',
    borderRadius: 17,
    padding: 13,
    marginTop: 10,
  },

  eventCardPositive: {
    borderLeftColor: '#6F8D61',
    backgroundColor: '#FBFDF9',
  },

  eventCardChallenging: {
    borderLeftColor: '#B06A5D',
    backgroundColor: '#FFF9F7',
  },

  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  eventToneDot: {
    width: 11,
    height: 11,
    backgroundColor: '#AFA69B',
    borderRadius: 6,
  },

  eventToneDotPositive: {
    backgroundColor: '#6F8D61',
  },

  eventToneDotChallenging: {
    backgroundColor: '#B06A5D',
  },

  eventCardTextWrap: {
    flex: 1,
    marginLeft: 9,
  },

  eventCardTitle: {
    color: COLORS.text,
    fontSize: 12.5,
    fontWeight: '900',
  },

  eventCardMeta: {
    color: COLORS.muted,
    fontSize: 8.5,
    marginTop: 3,
  },

  eventImportance: {
    marginLeft: 8,
  },

  eventImportanceText: {
    color: '#B18843',
    fontSize: 9,
    fontWeight: '900',
  },

  eventDescription: {
    color: '#5F615F',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 10,
  },

  eventTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },

  eventTag: {
    color: '#6E5A39',
    fontSize: 8.5,
    fontWeight: '800',
    backgroundColor: '#EFE7DA',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },

  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 9,
  },

  eventEditButton: {
    backgroundColor: '#E8EDF3',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  eventEditText: {
    color: COLORS.navy,
    fontSize: 8.5,
    fontWeight: '900',
  },

  eventDeleteButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginLeft: 6,
  },

  eventDeleteText: {
    color: '#A65F55',
    fontSize: 8.5,
    fontWeight: '900',
  },

  explainButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 47,
    backgroundColor: '#E8EDF3',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },

  explainButtonText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '900',
  },

  bookmarkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 47,
    backgroundColor: '#EEE4D3',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },

  bookmarkButtonText: {
    color: '#76582B',
    fontSize: 10,
    fontWeight: '900',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    padding: 28,
    margin: 16,
  },

  emptyIcon: {
    color: '#B28C49',
    fontSize: 36,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },

  createProfileButton: {
    backgroundColor:
      COLORS.gold,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 13,
  },

  createProfileButtonText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '900',
  },

  noticeCard: {
    backgroundColor: '#EAE5DC',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
  },

  noticeTitle: {
    color: '#5D574F',
    fontSize: 11,
    fontWeight: '900',
  },

  noticeText: {
    color: '#746E66',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
