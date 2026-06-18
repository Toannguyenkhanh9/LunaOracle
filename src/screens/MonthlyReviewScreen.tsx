import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
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
  buildMonthlyReview,
  type MonthlyReview,
} from '../services/monthlyReview';

import {
  getUserProfiles,
  type UserProfile,
} from '../services/userProfiles';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'MonthlyReview'
>;

function shiftMonth(
  year: number,
  month: number,
  delta: number,
): {
  year: number;
  month: number;
} {
  const date =
    new Date(
      year,
      month - 1 + delta,
      1,
      12,
      0,
      0,
      0,
    );

  return {
    year:
      date.getFullYear(),
    month:
      date.getMonth() + 1,
  };
}

function monthLabel(
  year: number,
  month: number,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        month: 'long',
        year: 'numeric',
      },
    ).format(
      new Date(
        year,
        month - 1,
        1,
      ),
    );
  } catch {
    return `${month}/${year}`;
  }
}

function StatCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

export default function MonthlyReviewScreen({
  navigation,
  route,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const now = new Date();

  const [year, setYear] =
    useState(
      route.params?.year ??
      now.getFullYear(),
    );

  const [month, setMonth] =
    useState(
      route.params?.month ??
      now.getMonth() + 1,
    );

  const [profiles, setProfiles] =
    useState<UserProfile[]>([]);

  const [
    selectedProfileId,
    setSelectedProfileId,
  ] =
    useState<string | undefined>(
      route.params?.profileId,
    );

  const [review, setReview] =
    useState<MonthlyReview | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      const items =
        await getUserProfiles();

      setProfiles(items);

      setReview(
        await buildMonthlyReview({
          year,
          month,
          profileId:
            selectedProfileId,
        }),
      );
    } catch (error) {
      console.warn(
        'Unable to load monthly review:',
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    month,
    selectedProfileId,
    year,
  ]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const categoryEntries =
    useMemo(
      () =>
        review
          ? Object.entries(
              review.categoryCounts,
            )
              .filter(
                (
                  entry,
                ) =>
                  Number(
                    entry[1],
                  ) > 0,
              )
              .sort(
                (
                  first,
                  second,
                ) =>
                  Number(
                    second[1],
                  ) -
                  Number(
                    first[1],
                  ),
              )
          : [],
      [review],
    );

  const changeMonth = (
    delta: number,
  ) => {
    const next =
      shiftMonth(
        year,
        month,
        delta,
      );

    setYear(next.year);
    setMonth(next.month);
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
          <Pressable
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }>
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.heroTextWrap}>
            <Text style={styles.heroEyebrow}>
              EASTERN DESTINY
            </Text>

            <Text style={styles.heroTitle}>
              {t(
                'monthlyReview.title',
              )}
            </Text>

            <Text style={styles.heroSubtitle}>
              {t(
                'monthlyReview.subtitle',
              )}
            </Text>
          </View>

          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>
              ◫
            </Text>
          </View>
        </View>

        <View style={styles.monthSelector}>
          <Pressable
            style={styles.monthButton}
            onPress={() =>
              changeMonth(-1)
            }>
            <Text style={styles.monthButtonText}>
              ‹
            </Text>
          </Pressable>

          <Text style={styles.monthTitle}>
            {monthLabel(
              year,
              month,
              language,
            )}
          </Text>

          <Pressable
            style={styles.monthButton}
            onPress={() =>
              changeMonth(1)
            }>
            <Text style={styles.monthButtonText}>
              ›
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'monthlyReview.profileEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'monthlyReview.profileTitle',
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
            <Pressable
              style={[
                styles.profileChip,
                !selectedProfileId &&
                  styles.profileChipActive,
              ]}
              onPress={() =>
                setSelectedProfileId(
                  undefined,
                )
              }>
              <Text
                style={[
                  styles.profileChipText,
                  !selectedProfileId &&
                    styles.profileChipTextActive,
                ]}>
                {t(
                  'monthlyReview.allActivity',
                )}
              </Text>
            </Pressable>

            {profiles.map(
              profile => (
                <Pressable
                  key={profile.id}
                  style={[
                    styles.profileChip,
                    selectedProfileId ===
                      profile.id &&
                      styles.profileChipActive,
                  ]}
                  onPress={() =>
                    setSelectedProfileId(
                      profile.id,
                    )
                  }>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.profileChipText,
                      selectedProfileId ===
                        profile.id &&
                        styles.profileChipTextActive,
                    ]}>
                    {
                      profile.displayName
                    }
                  </Text>
                </Pressable>
              ),
            )}
          </ScrollView>
        </View>

        {isLoading || !review ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>
              {t(
                'monthlyReview.loading',
              )}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>
                {t(
                  'monthlyReview.snapshotEyebrow',
                )}
              </Text>

              <Text style={styles.sectionTitle}>
                {t(
                  'monthlyReview.snapshotTitle',
                )}
              </Text>

              <View style={styles.statsGrid}>
                <StatCard
                  value={
                    review.viewedCount
                  }
                  label={t(
                    'monthlyReview.stats.views',
                  )}
                />

                <StatCard
                  value={
                    review.bookmarkCount
                  }
                  label={t(
                    'monthlyReview.stats.bookmarks',
                  )}
                />

                <StatCard
                  value={
                    review.noteCount
                  }
                  label={t(
                    'monthlyReview.stats.notes',
                  )}
                />

                <StatCard
                  value={
                    review.timelineEventCount
                  }
                  label={t(
                    'monthlyReview.stats.events',
                  )}
                />

                <StatCard
                  value={
                    review.importantEventCount
                  }
                  label={t(
                    'monthlyReview.stats.milestones',
                  )}
                />

                <StatCard
                  value={
                    review.activeDayCount
                  }
                  label={t(
                    'monthlyReview.stats.activeDays',
                  )}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>
                {t(
                  'monthlyReview.highlightsEyebrow',
                )}
              </Text>

              <Text style={styles.sectionTitle}>
                {t(
                  'monthlyReview.highlightsTitle',
                )}
              </Text>

              <View style={styles.highlightsCard}>
                {review.highlightCodes.map(
                  code => (
                    <Text
                      key={code}
                      style={styles.highlightItem}>
                      ✦{' '}
                      {t(
                        `monthlyReview.highlights.${code}`,
                      )}
                    </Text>
                  ),
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>
                {t(
                  'monthlyReview.eventMixEyebrow',
                )}
              </Text>

              <Text style={styles.sectionTitle}>
                {t(
                  'monthlyReview.eventMixTitle',
                )}
              </Text>

              <View style={styles.eventMixCard}>
                <View style={styles.toneRow}>
                  <View style={styles.toneItem}>
                    <Text style={styles.toneValue}>
                      {
                        review.toneCounts
                          .positive
                      }
                    </Text>

                    <Text style={styles.toneLabel}>
                      {t(
                        'timelineEvents.tones.positive',
                      )}
                    </Text>
                  </View>

                  <View style={styles.toneItem}>
                    <Text style={styles.toneValue}>
                      {
                        review.toneCounts
                          .neutral
                      }
                    </Text>

                    <Text style={styles.toneLabel}>
                      {t(
                        'timelineEvents.tones.neutral',
                      )}
                    </Text>
                  </View>

                  <View style={styles.toneItem}>
                    <Text style={styles.toneValue}>
                      {
                        review.toneCounts
                          .challenging
                      }
                    </Text>

                    <Text style={styles.toneLabel}>
                      {t(
                        'timelineEvents.tones.challenging',
                      )}
                    </Text>
                  </View>
                </View>

                {categoryEntries.length ===
                0 ? (
                  <Text style={styles.emptyText}>
                    {t(
                      'monthlyReview.noEvents',
                    )}
                  </Text>
                ) : (
                  categoryEntries.map(
                    ([
                      category,
                      count,
                    ]) => (
                      <View
                        key={category}
                        style={styles.categoryRow}>
                        <Text
                          style={styles.categoryLabel}>
                          {t(
                            `timelineEvents.categories.${category}`,
                          )}
                        </Text>

                        <Text
                          style={styles.categoryValue}>
                          {count}
                        </Text>
                      </View>
                    ),
                  )
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>
                {t(
                  'monthlyReview.toolsEyebrow',
                )}
              </Text>

              <Text style={styles.sectionTitle}>
                {t(
                  'monthlyReview.toolsTitle',
                )}
              </Text>

              <View style={styles.toolsCard}>
                {review.topTools.length ===
                0 ? (
                  <Text style={styles.emptyText}>
                    {t(
                      'monthlyReview.noTools',
                    )}
                  </Text>
                ) : (
                  review.topTools.map(
                    item => (
                      <View
                        key={item.titleKey}
                        style={styles.toolRow}>
                        <Text
                          style={styles.toolLabel}>
                          {t(
                            item.titleKey,
                          )}
                        </Text>

                        <Text
                          style={styles.toolValue}>
                          ×{item.count}
                        </Text>
                      </View>
                    ),
                  )
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionEyebrow}>
                {t(
                  'monthlyReview.eventsEyebrow',
                )}
              </Text>

              <Text style={styles.sectionTitle}>
                {t(
                  'monthlyReview.eventsTitle',
                )}
              </Text>

              {review.recentEvents.length ===
              0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>
                    {t(
                      'monthlyReview.noEvents',
                    )}
                  </Text>
                </View>
              ) : (
                review.recentEvents.map(
                  item => (
                    <Pressable
                      key={item.id}
                      style={styles.eventCard}
                      onPress={() =>
                        navigation.navigate(
                          'LifeTimeline',
                          {
                            profileId:
                              item.profileId,
                            year:
                              item.year,
                          },
                        )
                      }>
                      <Text style={styles.eventTitle}>
                        {item.title}
                      </Text>

                      <Text style={styles.eventMeta}>
                        {item.date} ·{' '}
                        {t(
                          `timelineEvents.categories.${item.category}`,
                        )}
                      </Text>
                    </Pressable>
                  ),
                )
              )}
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  if (selectedProfileId) {
                    navigation.navigate(
                      'LifeTimeline',
                      {
                        profileId:
                          selectedProfileId,
                      },
                    );
                    return;
                  }

                  navigation.navigate(
                    'LifeTimeline',
                  );
                }}>
                <Text style={styles.primaryButtonText}>
                  {t(
                    'monthlyReview.openTimeline',
                  )}
                </Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={() =>
                  navigation.navigate(
                    'SmartNotifications',
                  )
                }>
                <Text style={styles.secondaryButtonText}>
                  {t(
                    'monthlyReview.notifications',
                  )}
                </Text>
              </Pressable>
            </View>
          </>
        )}

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {t(
              'monthlyReview.noticeTitle',
            )}
          </Text>

          <Text style={styles.noticeText}>
            {t(
              'monthlyReview.notice',
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
    padding: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 13,
  },

  backText: {
    color: '#FFF3D3',
    fontSize: 29,
  },

  heroTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  heroEyebrow: {
    color: '#D5B672',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#FFF7E5',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 3,
  },

  heroSubtitle: {
    color: '#C8CFD9',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },

  heroIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.14)',
    borderRadius: 14,
  },

  heroIconText: {
    color: '#F0D18B',
    fontSize: 22,
  },

  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 7,
  },

  monthButton: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE7DC',
    borderRadius: 11,
  },

  monthButtonText: {
    color: COLORS.navy,
    fontSize: 23,
    fontWeight: '900',
  },

  monthTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 21,
  },

  sectionEyebrow: {
    color: '#9B783B',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  profileRow: {
    paddingTop: 10,
    paddingRight: 12,
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

  profileChipActive: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  profileChipText: {
    color: COLORS.text,
    fontSize: 9.5,
    fontWeight: '800',
  },

  profileChipTextActive: {
    color: '#FFF1D0',
  },

  loadingCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderRadius: 17,
    padding: 24,
    margin: 16,
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 10,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    marginTop: 12,
  },

  statCard: {
    width: '31.8%',
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 15,
    marginBottom: 8,
  },

  statValue: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '900',
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 8.2,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },

  highlightsCard: {
    backgroundColor: '#E8EDF3',
    borderRadius: 17,
    padding: 14,
    marginTop: 11,
  },

  highlightItem: {
    color: '#556171',
    fontSize: 10,
    lineHeight: 17,
    marginBottom: 5,
  },

  eventMixCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    padding: 14,
    marginTop: 11,
  },

  toneRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 12,
  },

  toneItem: {
    width: '31.5%',
    alignItems: 'center',
    backgroundColor: '#F1EBE2',
    borderRadius: 13,
    padding: 10,
  },

  toneValue: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '900',
  },

  toneLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
    marginTop: 4,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      COLORS.border,
  },

  categoryLabel: {
    color: COLORS.text,
    fontSize: 9.5,
    fontWeight: '800',
  },

  categoryValue: {
    color: '#8F6B34',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 'auto',
  },

  toolsCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    paddingHorizontal: 14,
    marginTop: 11,
  },

  toolRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor:
      COLORS.border,
  },

  toolLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 9.5,
    fontWeight: '800',
  },

  toolValue: {
    color: '#8F6B34',
    fontSize: 9.5,
    fontWeight: '900',
  },

  emptyCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    padding: 17,
    marginTop: 11,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 9.5,
    lineHeight: 15,
    textAlign: 'center',
  },

  eventCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    padding: 13,
    marginTop: 10,
  },

  eventTitle: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
  },

  eventMeta: {
    color: COLORS.muted,
    fontSize: 8.5,
    marginTop: 5,
  },

  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 18,
  },

  primaryButton: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.gold,
    borderRadius: 14,
    marginRight: 6,
  },

  primaryButtonText: {
    color: COLORS.navy,
    fontSize: 9.5,
    fontWeight: '900',
  },

  secondaryButton: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 14,
    marginLeft: 6,
  },

  secondaryButtonText: {
    color: COLORS.navy,
    fontSize: 9.5,
    fontWeight: '900',
  },

  noticeCard: {
    backgroundColor: '#F6EAE6',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
  },

  noticeTitle: {
    color: '#7F4E47',
    fontSize: 10.5,
    fontWeight: '900',
  },

  noticeText: {
    color: '#765D59',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },
});
