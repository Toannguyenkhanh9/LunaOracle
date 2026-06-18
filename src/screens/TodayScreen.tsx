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
  TFunction,
} from 'i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  getUserProfiles,
  type UserProfile,
} from '../services/userProfiles';

import {
  getTodayInsight,
  localizeCanChiForToday,
  type TodayActivityCode,
  type TodayHourPeriod,
  type TodayInsight,
  type TodayProfileRelation,
} from '../services/todayInsight';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'Today'
>;

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

function formatSolarDate(
  date: Date,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

function formatShortDate(
  date: Date,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        day: '2-digit',
        month: 'short',
      },
    ).format(date);
  } catch {
    return date.toLocaleDateString();
  }
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
  const initials =
    profile.displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || 'P';

  return (
    <Pressable
      accessibilityRole="button"
      style={({pressed}) => [
        styles.profileChip,
        selected &&
          styles.profileChipSelected,
        pressed &&
          styles.pressed,
      ]}
      onPress={onPress}>
      <View
        style={[
          styles.profileAvatar,
          selected &&
            styles.profileAvatarSelected,
        ]}>
        <Text
          style={[
            styles.profileAvatarText,
            selected &&
              styles.profileAvatarTextSelected,
          ]}>
          {initials}
        </Text>
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.profileChipText,
          selected &&
            styles.profileChipTextSelected,
        ]}>
        {profile.displayName}
      </Text>

      {profile.isFavorite && (
        <Text
          style={
            styles.profileFavorite
          }>
          ★
        </Text>
      )}
    </Pressable>
  );
}

function InfoPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoPill}>
      <Text style={styles.infoPillLabel}>
        {label}
      </Text>

      <Text style={styles.infoPillValue}>
        {value}
      </Text>
    </View>
  );
}

function ActivityItem({
  code,
  positive,
  t,
}: {
  code: TodayActivityCode;
  positive: boolean;
  t: TFunction;
}) {
  return (
    <View
      style={[
        styles.activityItem,
        positive
          ? styles.activityItemPositive
          : styles.activityItemCaution,
      ]}>
      <View
        style={[
          styles.activityBullet,
          positive
            ? styles.activityBulletPositive
            : styles.activityBulletCaution,
        ]}>
        <Text
          style={
            styles.activityBulletText
          }>
          {positive ? '✓' : '!'}
        </Text>
      </View>

      <Text style={styles.activityText}>
        {String(
          t(
            `today.activities.${code}`,
          ),
        )}
      </Text>
    </View>
  );
}

function HourChip({
  item,
  t,
}: {
  item: TodayHourPeriod;
  t: TFunction;
}) {
  const branchKey =
    BRANCH_KEYS[
      item.branchIndex
    ] ?? 'rat';

  return (
    <View style={styles.hourChip}>
      <Text style={styles.hourName}>
        {String(
          t(
            `today.branches.${branchKey}`,
          ),
        )}
      </Text>

      <Text style={styles.hourTime}>
        {item.start}–{item.end}
      </Text>
    </View>
  );
}

function relationTone(
  relation: TodayProfileRelation,
): 'positive' | 'neutral' | 'caution' {
  if (
    relation === 'sixHarmony' ||
    relation === 'threeHarmony' ||
    relation === 'supportive'
  ) {
    return 'positive';
  }

  if (
    relation === 'clash'
  ) {
    return 'caution';
  }

  return 'neutral';
}

export default function TodayScreen({
  navigation,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const [profiles, setProfiles] =
    useState<UserProfile[]>([]);

  const [
    selectedProfileId,
    setSelectedProfileId,
  ] = useState<string | null>(
    null,
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [currentDate, setCurrentDate] =
    useState(() => new Date());

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const loadProfiles =
    useCallback(async () => {
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
          'Unable to load Today profiles:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      setCurrentDate(new Date());
      void loadProfiles();
    }, [loadProfiles]),
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

  const insight: TodayInsight =
    useMemo(
      () =>
        getTodayInsight(
          currentDate,
          selectedProfile,
        ),
      [
        currentDate,
        selectedProfile,
      ],
    );

  const localizedDayCanChi =
    localizeCanChiForToday(
      insight.dayCanChiRaw,
      language,
    );

  const localizedMonthCanChi =
    localizeCanChiForToday(
      insight.monthCanChiRaw,
      language,
    );

  const localizedYearCanChi =
    localizeCanChiForToday(
      insight.yearCanChiRaw,
      language,
    );

  const ratingKey =
    `today.ratings.${insight.rating}`;

  const reflectionKey =
    `today.reflections.${insight.reflectionIndex}`;

  const relation =
    insight.profileInsight?.relation;

  const relationStyle =
    relation
      ? relationTone(
          relation,
        )
      : 'neutral';

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.deepBrown
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
          <View
            pointerEvents="none"
            style={
              styles.heroGlow
            }
          />

          <View
            style={
              styles.heroTopRow
            }>
            <View>
              <Text
                style={
                  styles.heroEyebrow
                }>
                {t(
                  'today.eyebrow',
                )}
              </Text>

              <Text
                style={
                  styles.heroTitle
                }>
                {t(
                  'today.title',
                )}
              </Text>
            </View>

            <View
              style={
                styles.heroSymbol
              }>
              <Text
                style={
                  styles.heroSymbolText
                }>
                ☀
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.solarDate
            }>
            {formatSolarDate(
              insight.solarDate,
              language,
            )}
          </Text>

          <View style={styles.lunarCard}>
            <View
              style={
                styles.lunarBadge
              }>
              <Text
                style={
                  styles.lunarBadgeText
                }>
                ☾
              </Text>
            </View>

            <View
              style={
                styles.lunarTextWrap
              }>
              <Text
                style={
                  styles.lunarLabel
                }>
                {t(
                  'today.lunarDate',
                )}
              </Text>

              <Text
                style={
                  styles.lunarValue
                }>
                {t(
                  'today.lunarDateValue',
                  {
                    day:
                      insight.lunarDay,
                    month:
                      insight.lunarMonth,
                    year:
                      insight.lunarYear,
                    leap:
                      insight.isLeapMonth
                        ? t(
                            'today.leapShort',
                          )
                        : '',
                  },
                )}
              </Text>
            </View>

            <View
              style={[
                styles.ratingBadge,
                insight.rating ===
                  'auspicious' &&
                  styles.ratingBadgeGood,
                insight.rating ===
                  'caution' &&
                  styles.ratingBadgeCaution,
              ]}>
              <Text
                style={[
                  styles.ratingText,
                  insight.rating ===
                    'auspicious' &&
                    styles.ratingTextGood,
                  insight.rating ===
                    'caution' &&
                    styles.ratingTextCaution,
                ]}>
                {t(ratingKey)}
              </Text>
            </View>
          </View>

          {(insight.isNewMoon ||
            insight.isFullMoon) && (
            <View
              style={
                styles.specialDayBanner
              }>
              <Text
                style={
                  styles.specialDayIcon
                }>
                {insight.isNewMoon
                  ? '🌑'
                  : '🌕'}
              </Text>

              <Text
                style={
                  styles.specialDayText
                }>
                {insight.isNewMoon
                  ? t(
                      'today.specialDays.newMoonToday',
                    )
                  : t(
                      'today.specialDays.fullMoonToday',
                    )}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionEyebrow
            }>
            {t(
              'today.dayEnergyEyebrow',
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }>
            {t(
              'today.dayEnergyTitle',
            )}
          </Text>

          <View style={styles.infoGrid}>
            <InfoPill
              label={String(
                t(
                  'today.dayCanChi',
                ),
              )}
              value={
                localizedDayCanChi ||
                '—'
              }
            />

            <InfoPill
              label={String(
                t(
                  'today.dayElement',
                ),
              )}
              value={String(
                t(
                  `today.elements.${insight.element}`,
                ),
              )}
            />

            <InfoPill
              label={String(
                t(
                  'today.monthCanChi',
                ),
              )}
              value={
                localizedMonthCanChi ||
                '—'
              }
            />

            <InfoPill
              label={String(
                t(
                  'today.yearCanChi',
                ),
              )}
              value={
                localizedYearCanChi ||
                '—'
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionEyebrow
            }>
            {t(
              'today.dailyGuidanceEyebrow',
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }>
            {t(
              'today.dailyGuidanceTitle',
            )}
          </Text>

          <View style={styles.guidanceGrid}>
            <View
              style={[
                styles.guidanceCard,
                styles.guidanceCardPositive,
              ]}>
              <View
                style={
                  styles.guidanceHeader
                }>
                <Text
                  style={
                    styles.guidanceIcon
                  }>
                  ✓
                </Text>

                <Text
                  style={
                    styles.guidanceTitle
                  }>
                  {t(
                    'today.suitableTitle',
                  )}
                </Text>
              </View>

              {insight.suitable.map(
                code => (
                  <ActivityItem
                    key={`yes-${code}`}
                    code={code}
                    positive
                    t={t}
                  />
                ),
              )}
            </View>

            <View
              style={[
                styles.guidanceCard,
                styles.guidanceCardCaution,
              ]}>
              <View
                style={
                  styles.guidanceHeader
                }>
                <Text
                  style={
                    styles.guidanceIconCaution
                  }>
                  !
                </Text>

                <Text
                  style={
                    styles.guidanceTitle
                  }>
                  {t(
                    'today.cautionTitle',
                  )}
                </Text>
              </View>

              {insight.cautions.length >
              0 ? (
                insight.cautions.map(
                  code => (
                    <ActivityItem
                      key={`no-${code}`}
                      code={code}
                      positive={
                        false
                      }
                      t={t}
                    />
                  ),
                )
              ) : (
                <Text
                  style={
                    styles.noCautionText
                  }>
                  {t(
                    'today.noStrongCaution',
                  )}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionEyebrow
            }>
            {t(
              'today.hoursEyebrow',
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }>
            {t(
              'today.hoursTitle',
            )}
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }>
            {t(
              'today.hoursSubtitle',
            )}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.hoursRow
            }>
            {insight.auspiciousHours.map(
              item => (
                <HourChip
                  key={`${item.branchIndex}-${item.start}`}
                  item={item}
                  t={t}
                />
              ),
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View
            style={
              styles.profileSectionHeader
            }>
            <View style={styles.flex}>
              <Text
                style={
                  styles.sectionEyebrow
                }>
                {t(
                  'today.profileEyebrow',
                )}
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }>
                {t(
                  'today.profileTitle',
                )}
              </Text>
            </View>

            <Pressable
              style={({pressed}) => [
                styles.manageProfilesButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigation.navigate(
                  'UserProfiles',
                )
              }>
              <Text
                style={
                  styles.manageProfilesText
                }>
                {t(
                  'today.manageProfiles',
                )}
              </Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View
              style={
                styles.profileEmptyCard
              }>
              <Text
                style={
                  styles.profileEmptyText
                }>
                {t(
                  'today.loadingProfiles',
                )}
              </Text>
            </View>
          ) : profiles.length === 0 ? (
            <View
              style={
                styles.profileEmptyCard
              }>
              <Text
                style={
                  styles.profileEmptyIcon
                }>
                ◎
              </Text>

              <Text
                style={
                  styles.profileEmptyTitle
                }>
                {t(
                  'today.noProfileTitle',
                )}
              </Text>

              <Text
                style={
                  styles.profileEmptyText
                }>
                {t(
                  'today.noProfileMessage',
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
                    'today.createProfile',
                  )}
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.profileChipsRow
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
                      onPress={() =>
                        setSelectedProfileId(
                          profile.id,
                        )
                      }
                    />
                  ),
                )}
              </ScrollView>

              {selectedProfile &&
                relation && (
                <View
                  style={[
                    styles.profileInsightCard,
                    relationStyle ===
                      'positive' &&
                      styles.profileInsightPositive,
                    relationStyle ===
                      'caution' &&
                      styles.profileInsightCaution,
                  ]}>
                  <View
                    style={
                      styles.profileInsightIconWrap
                    }>
                    <Text
                      style={
                        styles.profileInsightIcon
                      }>
                      ✧
                    </Text>
                  </View>

                  <View
                    style={
                      styles.profileInsightTextWrap
                    }>
                    <Text
                      style={
                        styles.profileInsightName
                      }>
                      {
                        selectedProfile.displayName
                      }
                    </Text>

                    <Text
                      style={
                        styles.profileInsightTitle
                      }>
                      {t(
                        `today.profileRelations.${relation}.title`,
                      )}
                    </Text>

                    <Text
                      style={
                        styles.profileInsightText
                      }>
                      {t(
                        `today.profileRelations.${relation}.message`,
                      )}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionEyebrow
            }>
            {t(
              'today.reflectionEyebrow',
            )}
          </Text>

          <Text
            style={
              styles.sectionTitle
            }>
            {t(
              'today.reflectionTitle',
            )}
          </Text>

          <View
            style={
              styles.reflectionCard
            }>
            <Text
              style={
                styles.reflectionQuote
              }>
              “
            </Text>

            <Text
              style={
                styles.reflectionText
              }>
              {t(
                reflectionKey,
              )}
            </Text>
          </View>
        </View>

        {insight.nextObservance && (
          <View style={styles.section}>
            <Text
              style={
                styles.sectionEyebrow
              }>
              {t(
                'today.upcomingEyebrow',
              )}
            </Text>

            <Text
              style={
                styles.sectionTitle
              }>
              {t(
                'today.upcomingTitle',
              )}
            </Text>

            <View
              style={
                styles.upcomingCard
              }>
              <View
                style={
                  styles.upcomingIconWrap
                }>
                <Text
                  style={
                    styles.upcomingIcon
                  }>
                  {insight.nextObservance
                    .type ===
                  'newMoon'
                    ? '🌑'
                    : '🌕'}
                </Text>
              </View>

              <View
                style={
                  styles.upcomingTextWrap
                }>
                <Text
                  style={
                    styles.upcomingName
                  }>
                  {t(
                    `today.specialDays.${insight.nextObservance.type}`,
                  )}
                </Text>

                <Text
                  style={
                    styles.upcomingDate
                  }>
                  {formatShortDate(
                    insight
                      .nextObservance
                      .solarDate,
                    language,
                  )}{' '}
                  ·{' '}
                  {t(
                    'today.inDays',
                    {
                      count:
                        insight
                          .nextObservance
                          .daysAway,
                    },
                  )}
                </Text>
              </View>

              <Pressable
                style={({pressed}) => [
                  styles.calendarButton,
                  pressed &&
                    styles.pressed,
                ]}
                onPress={() =>
                  navigation.navigate(
                    'BuddhistCalendar',
                  )
                }>
                <Text
                  style={
                    styles.calendarButtonText
                  }>
                  {t(
                    'today.openCalendar',
                  )}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <Pressable
            style={({pressed}) => [
              styles.quickAction,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate(
                'LunarCalendar',
              )
            }>
            <Text
              style={
                styles.quickActionIcon
              }>
              📅
            </Text>

            <Text
              style={
                styles.quickActionText
              }>
              {t(
                'today.viewFullCalendar',
              )}
            </Text>
          </Pressable>

          <Pressable
            style={({pressed}) => [
              styles.quickAction,
              pressed &&
                styles.pressed,
            ]}
            onPress={() => {
              if (selectedProfileId) {
                navigation.navigate(
                  'Horoscope',
                  {
                    profileId:
                      selectedProfileId,
                  },
                );
                return;
              }

              navigation.navigate(
                'Horoscope',
              );
            }}>
            <Text
              style={
                styles.quickActionIcon
              }>
              ✦
            </Text>

            <Text
              style={
                styles.quickActionText
              }>
              {t(
                'today.findAuspiciousDates',
              )}
            </Text>
          </Pressable>

          <Pressable
            style={({pressed}) => [
              styles.quickAction,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate(
                'ExplainableResult',
                {
                  kind: 'today',
                  profileId:
                    selectedProfileId ??
                    undefined,
                  date:
                    insight.solarDate.toISOString(),
                },
              )
            }>
            <Text
              style={
                styles.quickActionIcon
              }>
              ?
            </Text>

            <Text
              style={
                styles.quickActionText
              }>
              {t(
                'explainable.whyThisResult',
              )}
            </Text>
          </Pressable>

          <Pressable
            style={({pressed}) => [
              styles.quickAction,
              pressed &&
                styles.pressed,
            ]}
            onPress={() => {
              if (selectedProfileId) {
                navigation.navigate(
                  'DailyBrief',
                  {
                    profileId:
                      selectedProfileId,
                  },
                );
                return;
              }

              navigation.navigate(
                'DailyBrief',
              );
            }}>
            <Text
              style={
                styles.quickActionIcon
              }>
              ☀
            </Text>

            <Text
              style={
                styles.quickActionText
              }>
              {t(
                'dailyBrief.title',
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.disclaimerCard}>
          <Text
            style={
              styles.disclaimerTitle
            }>
            {t(
              'today.disclaimerTitle',
            )}
          </Text>

          <Text
            style={
              styles.disclaimerText
            }>
            {t(
              'today.disclaimer',
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  deepBrown: '#17243A',
  brown: '#243550',
  gold: '#D7AF5E',
  cream: '#F7F2E8',
  surface: '#FFFDF8',
  text: '#282D36',
  muted: '#6C726F',
  border: '#E2D7C5',
  green: '#5F7D51',
  greenSoft: '#EDF4E7',
  red: '#A75B4C',
  redSoft: '#FAECE8',
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  content: {
    paddingBottom: 145,
  },

  hero: {
    overflow: 'hidden',
    backgroundColor:
      COLORS.deepBrown,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 19,
    paddingTop: 18,
    paddingBottom: 23,
  },

  heroGlow: {
    position: 'absolute',
    top: -90,
    right: -65,
    width: 220,
    height: 220,
    backgroundColor:
      'rgba(213,169,91,0.13)',
    borderRadius: 110,
  },

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroEyebrow: {
    color: '#E0BF82',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  heroTitle: {
    color: '#FFF5DF',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 3,
  },

  heroSymbol: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(213,169,91,0.45)',
    borderRadius: 16,
    marginLeft: 'auto',
  },

  heroSymbolText: {
    color: '#F2CF87',
    fontSize: 24,
  },

  solarDate: {
    color: '#D9C7B7',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginTop: 14,
  },

  lunarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.12)',
    borderRadius: 18,
    padding: 12,
    marginTop: 14,
  },

  lunarBadge: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(213,169,91,0.16)',
    borderRadius: 13,
  },

  lunarBadgeText: {
    color: '#F1D393',
    fontSize: 22,
  },

  lunarTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  lunarLabel: {
    color: '#BFB2A8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  lunarValue: {
    color: '#FFF4DE',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },

  ratingBadge: {
    backgroundColor:
      'rgba(255,255,255,0.10)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  ratingBadgeGood: {
    backgroundColor:
      'rgba(153,194,126,0.17)',
  },

  ratingBadgeCaution: {
    backgroundColor:
      'rgba(222,132,106,0.17)',
  },

  ratingText: {
    color: '#E9DED2',
    fontSize: 9,
    fontWeight: '900',
  },

  ratingTextGood: {
    color: '#DDF0CC',
  },

  ratingTextCaution: {
    color: '#F1C5B8',
  },

  specialDayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(213,169,91,0.15)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 11,
  },

  specialDayIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  specialDayText: {
    flex: 1,
    color: '#F3DFC0',
    fontSize: 11,
    fontWeight: '800',
  },

  section: {
    paddingHorizontal: 17,
    marginTop: 24,
  },

  sectionEyebrow: {
    color: '#A47A3E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 3,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    marginTop: 12,
  },

  infoPill: {
    width: '48.5%',
    minHeight: 76,
    justifyContent: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 10,
  },

  infoPillLabel: {
    color: '#96887B',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  infoPillValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 5,
  },

  guidanceGrid: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginTop: 12,
  },

  guidanceCard: {
    width: '48.5%',
    minHeight: 190,
    borderWidth: 1,
    borderRadius: 19,
    padding: 13,
  },

  guidanceCardPositive: {
    backgroundColor:
      COLORS.greenSoft,
    borderColor: '#CDDDC2',
  },

  guidanceCardCaution: {
    backgroundColor:
      COLORS.redSoft,
    borderColor: '#E9CFC8',
  },

  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  guidanceIcon: {
    color: COLORS.green,
    fontSize: 16,
    fontWeight: '900',
    marginRight: 6,
  },

  guidanceIconCaution: {
    color: COLORS.red,
    fontSize: 16,
    fontWeight: '900',
    marginRight: 6,
  },

  guidanceTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },

  activityItem: {
    minHeight: 35,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
  },

  activityItemPositive: {
    backgroundColor:
      'rgba(95,125,81,0.08)',
  },

  activityItemCaution: {
    backgroundColor:
      'rgba(167,91,76,0.08)',
  },

  activityBullet: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 7,
  },

  activityBulletPositive: {
    backgroundColor:
      COLORS.green,
  },

  activityBulletCaution: {
    backgroundColor:
      COLORS.red,
  },

  activityBulletText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  activityText: {
    flex: 1,
    color: '#4F4A45',
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '700',
  },

  noCautionText: {
    color: '#765F58',
    fontSize: 10,
    lineHeight: 16,
  },

  hoursRow: {
    paddingTop: 12,
    paddingRight: 10,
  },

  hourChip: {
    minWidth: 104,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginRight: 9,
  },

  hourName: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '900',
  },

  hourTime: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },

  profileSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  manageProfilesButton: {
    backgroundColor: '#EFE3D1',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  manageProfilesText: {
    color: '#765124',
    fontSize: 9,
    fontWeight: '900',
  },

  profileEmptyCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 19,
    padding: 22,
    marginTop: 12,
  },

  profileEmptyIcon: {
    color: '#B18A4C',
    fontSize: 34,
  },

  profileEmptyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 7,
  },

  profileEmptyText: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 5,
  },

  createProfileButton: {
    backgroundColor:
      COLORS.deepBrown,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 13,
  },

  createProfileButtonText: {
    color: '#FFF1D1',
    fontSize: 10,
    fontWeight: '900',
  },

  profileChipsRow: {
    paddingTop: 12,
    paddingRight: 10,
  },

  profileChip: {
    minWidth: 112,
    maxWidth: 168,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 8,
    marginRight: 8,
  },

  profileChipSelected: {
    backgroundColor:
      COLORS.deepBrown,
    borderColor:
      COLORS.deepBrown,
  },

  profileAvatar: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9DDCB',
    borderRadius: 10,
  },

  profileAvatarSelected: {
    backgroundColor:
      'rgba(213,169,91,0.17)',
  },

  profileAvatarText: {
    color: '#785A2D',
    fontSize: 9,
    fontWeight: '900',
  },

  profileAvatarTextSelected: {
    color: '#F2D18E',
  },

  profileChipText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 7,
  },

  profileChipTextSelected: {
    color: '#FFF2D6',
  },

  profileFavorite: {
    color: '#D1A44C',
    fontSize: 10,
    marginLeft: 4,
  },

  profileInsightCard: {
    flexDirection: 'row',
    backgroundColor: '#F2ECE3',
    borderWidth: 1,
    borderColor: '#DDD0BE',
    borderRadius: 18,
    padding: 14,
    marginTop: 11,
  },

  profileInsightPositive: {
    backgroundColor:
      COLORS.greenSoft,
    borderColor: '#CEDFC4',
  },

  profileInsightCaution: {
    backgroundColor:
      COLORS.redSoft,
    borderColor: '#E8CEC6',
  },

  profileInsightIconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(213,169,91,0.14)',
    borderRadius: 13,
  },

  profileInsightIcon: {
    color: '#A6752B',
    fontSize: 21,
  },

  profileInsightTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  profileInsightName: {
    color: '#8B735C',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  profileInsightTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 3,
  },

  profileInsightText: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  reflectionCard: {
    backgroundColor:
      COLORS.deepBrown,
    borderRadius: 20,
    padding: 18,
    marginTop: 12,
  },

  reflectionQuote: {
    color: '#D9B66E',
    fontSize: 40,
    lineHeight: 35,
  },

  reflectionText: {
    color: '#F5E4C6',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '700',
    marginTop: 2,
  },

  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    padding: 13,
    marginTop: 12,
  },

  upcomingIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE5D9',
    borderRadius: 14,
  },

  upcomingIcon: {
    fontSize: 21,
  },

  upcomingTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  upcomingName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  upcomingDate: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },

  calendarButton: {
    backgroundColor:
      COLORS.deepBrown,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  calendarButtonText: {
    color: '#FFF1D1',
    fontSize: 9,
    fontWeight: '900',
  },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 13,
    marginTop: 22,
  },

  quickAction: {
    width: '47.7%',
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    marginHorizontal: 4,
    paddingHorizontal: 8,
  },

  quickActionIcon: {
    fontSize: 18,
    marginRight: 7,
  },

  quickActionText: {
    flexShrink: 1,
    color: COLORS.text,
    fontSize: 9.5,
    fontWeight: '900',
    textAlign: 'center',
  },

  disclaimerCard: {
    backgroundColor: '#ECE5DB',
    borderRadius: 17,
    padding: 15,
    marginHorizontal: 17,
    marginTop: 16,
  },

  disclaimerTitle: {
    color: '#5C554D',
    fontSize: 11,
    fontWeight: '900',
  },

  disclaimerText: {
    color: '#756E66',
    fontSize: 9.5,
    lineHeight: 16,
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
