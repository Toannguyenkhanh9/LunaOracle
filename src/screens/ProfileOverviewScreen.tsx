import React, {
  useCallback,
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
  getProfileOverview,
  type ProfileOverviewData,
} from '../services/profileOverview';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'ProfileOverview'
>;

function twoDigits(
  value: number,
): string {
  return String(value)
    .padStart(2, '0');
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

function ActionCard({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.actionCard,
        pressed &&
          styles.pressed,
      ]}
      onPress={onPress}>
      <Text style={styles.actionIcon}>
        {icon}
      </Text>

      <Text style={styles.actionTitle}>
        {title}
      </Text>

      <Text style={styles.actionArrow}>
        ›
      </Text>
    </Pressable>
  );
}

export default function ProfileOverviewScreen({
  navigation,
  route,
}: Props) {
  const {t} =
    useTranslation();

  const [data, setData] =
    useState<
      ProfileOverviewData | null
    >(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      setData(
        await getProfileOverview(
          route.params.profileId,
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to load profile overview:',
        error,
      );

      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [route.params.profileId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (
    isLoading ||
    !data
  ) {
    return (
      <SafeAreaView
        style={styles.loading}>
        <Text
          style={
            styles.loadingText
          }>
          {isLoading
            ? t(
                'profileOverview.loading',
              )
            : t(
                'profileOverview.notFound',
              )}
        </Text>
      </SafeAreaView>
    );
  }

  const {
    profile,
    stats,
  } = data;

  const birthDate =
    [
      twoDigits(
        profile.birthDate.day,
      ),
      twoDigits(
        profile.birthDate.month,
      ),
      profile.birthDate.year,
    ].join('/');

  const birthTime =
    profile.birthTime.accuracy ===
    'unknown'
      ? t(
          'profileOverview.unknownTime',
        )
      : `${twoDigits(
          profile.birthTime.hour,
        )}:${twoDigits(
          profile.birthTime.minute,
        )}`;

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
            style={({pressed}) => [
              styles.backButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.goBack()
            }>
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.displayName
                .trim()
                .slice(0, 1)
                .toUpperCase()}
            </Text>
          </View>

          <View style={styles.heroTextWrap}>
            <Text style={styles.heroEyebrow}>
              EASTERN DESTINY
            </Text>

            <Text style={styles.heroTitle}>
              {profile.displayName}
            </Text>

            <Text style={styles.heroSubtitle}>
              {t(
                `userProfiles.relationships.${profile.relationship}`,
              )}
              {profile.isFavorite
                ? ' · ★'
                : ''}
            </Text>
          </View>

          <Pressable
            style={({pressed}) => [
              styles.editButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate(
                'UserProfileEditor',
                {
                  profileId:
                    profile.id,
                },
              )
            }>
            <Text
              style={
                styles.editButtonText
              }>
              {t(
                'profileOverview.edit',
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.identityCard}>
          <View style={styles.identityRow}>
            <Text style={styles.identityLabel}>
              {t(
                'profileOverview.birthDate',
              )}
            </Text>

            <Text style={styles.identityValue}>
              {birthDate}
            </Text>
          </View>

          <View style={styles.identityRow}>
            <Text style={styles.identityLabel}>
              {t(
                'profileOverview.birthTime',
              )}
            </Text>

            <Text style={styles.identityValue}>
              {birthTime}
            </Text>
          </View>

          <View style={styles.identityRow}>
            <Text style={styles.identityLabel}>
              {t(
                'profileOverview.location',
              )}
            </Text>

            <Text
              style={styles.identityValue}
              numberOfLines={2}>
              {profile.location.placeName ||
                profile.location.timeZone}
            </Text>
          </View>

          <View style={styles.identityRowLast}>
            <Text style={styles.identityLabel}>
              {t(
                'profileOverview.timeZone',
              )}
            </Text>

            <Text style={styles.identityValue}>
              {profile.location.timeZone}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'profileOverview.snapshotEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'profileOverview.snapshotTitle',
            )}
          </Text>

          <View style={styles.statsGrid}>
            <StatCard
              value={
                stats.timelineEventCount
              }
              label={t(
                'profileOverview.stats.events',
              )}
            />

            <StatCard
              value={
                stats.importantEventCount
              }
              label={t(
                'profileOverview.stats.milestones',
              )}
            />

            <StatCard
              value={
                stats.linkedBookmarkCount
              }
              label={t(
                'profileOverview.stats.bookmarks',
              )}
            />

            <StatCard
              value={
                stats.linkedRecentCount
              }
              label={t(
                'profileOverview.stats.recent',
              )}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'profileOverview.toolsEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'profileOverview.toolsTitle',
            )}
          </Text>

          <View style={styles.actionsGrid}>
            <ActionCard
              icon="☯"
              title={t(
                'astrologyHome.cards.baziTitle',
              )}
              onPress={() =>
                navigation.navigate(
                  'BaziChart',
                  {
                    profileId:
                      profile.id,
                  },
                )
              }
            />

            <ActionCard
              icon="紫"
              title={t(
                'astrologyHome.cards.ziweiTitle',
              )}
              onPress={() =>
                navigation.navigate(
                  'ZiweiChart',
                  {
                    profileId:
                      profile.id,
                  },
                )
              }
            />

            <ActionCard
              icon="✦"
              title={t(
                'astrologyHome.cards.auspiciousTitle',
              )}
              onPress={() =>
                navigation.navigate(
                  'Horoscope',
                  {
                    profileId:
                      profile.id,
                  },
                )
              }
            />

            <ActionCard
              icon="⌁"
              title={t(
                'insightFeatures.timeline.title',
              )}
              onPress={() =>
                navigation.navigate(
                  'LifeTimeline',
                  {
                    profileId:
                      profile.id,
                  },
                )
              }
            />

            <ActionCard
              icon="☀"
              title={t(
                'dailyBrief.title',
              )}
              onPress={() =>
                navigation.navigate(
                  'DailyBrief',
                  {
                    profileId:
                      profile.id,
                  },
                )
              }
            />

            <ActionCard
              icon="◉"
              title={t(
                'insightFeatures.compatibility.title',
              )}
              onPress={() =>
                navigation.navigate(
                  'AdvancedCompatibility',
                  {
                    profileAId:
                      profile.id,
                  },
                )
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'profileOverview.eventsEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'profileOverview.eventsTitle',
            )}
          </Text>

          {data.recentEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {t(
                  'profileOverview.noEvents',
                )}
              </Text>
            </View>
          ) : (
            data.recentEvents.map(
              item => (
                <Pressable
                  key={item.id}
                  style={({pressed}) => [
                    styles.listCard,
                    pressed &&
                      styles.pressed,
                  ]}
                  onPress={() =>
                    navigation.navigate(
                      'LifeTimeline',
                      {
                        profileId:
                          profile.id,
                        year:
                          item.year,
                      },
                    )
                  }>
                  <Text
                    style={
                      styles.listTitle
                    }>
                    {item.title}
                  </Text>

                  <Text
                    style={
                      styles.listMeta
                    }>
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

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'profileOverview.libraryEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'profileOverview.libraryTitle',
            )}
          </Text>

          {data.recentBookmarks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {t(
                  'profileOverview.noBookmarks',
                )}
              </Text>
            </View>
          ) : (
            data.recentBookmarks.map(
              item => (
                <View
                  key={item.id}
                  style={
                    styles.listCard
                  }>
                  <Text
                    style={
                      styles.listTitle
                    }>
                    {item.icon}{' '}
                    {t(
                      item.titleKey,
                    )}
                  </Text>

                  {!!item.note && (
                    <Text
                      style={
                        styles.listDescription
                      }
                      numberOfLines={3}>
                      {item.note}
                    </Text>
                  )}
                </View>
              ),
            )
          )}

          <Pressable
            style={({pressed}) => [
              styles.libraryButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate(
                'BookmarksNotes',
              )
            }>
            <Text
              style={
                styles.libraryButtonText
              }>
              {t(
                'profileOverview.openLibrary',
              )}
            </Text>
          </Pressable>
        </View>

        {!!profile.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>
              {t(
                'profileOverview.profileNotesEyebrow',
              )}
            </Text>

            <Text style={styles.sectionTitle}>
              {t(
                'profileOverview.profileNotesTitle',
              )}
            </Text>

            <View style={styles.notesCard}>
              <Text style={styles.notesText}>
                {profile.notes}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {t(
              'profileOverview.noticeTitle',
            )}
          </Text>

          <Text style={styles.noticeText}>
            {t(
              'profileOverview.notice',
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

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.cream,
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 12,
  },

  backText: {
    color: '#FFF3D3',
    fontSize: 28,
  },

  avatar: {
    width: 49,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.16)',
    borderWidth: 1,
    borderColor:
      'rgba(215,175,94,0.45)',
    borderRadius: 16,
    marginLeft: 10,
  },

  avatarText: {
    color: '#F1D38D',
    fontSize: 20,
    fontWeight: '900',
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
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },

  heroSubtitle: {
    color: '#C8CFD9',
    fontSize: 9.5,
    marginTop: 4,
  },

  editButton: {
    backgroundColor:
      COLORS.gold,
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  editButtonText: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: '900',
  },

  identityCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
  },

  identityRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor:
      COLORS.border,
  },

  identityRowLast: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },

  identityLabel: {
    width: '40%',
    color: COLORS.muted,
    fontSize: 9.5,
    fontWeight: '800',
  },

  identityValue: {
    flex: 1,
    color: COLORS.text,
    fontSize: 10.5,
    fontWeight: '900',
    textAlign: 'right',
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 22,
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

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    marginTop: 12,
  },

  statCard: {
    width: '48.5%',
    minHeight: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    marginBottom: 10,
  },

  statValue: {
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: '900',
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    marginTop: 12,
  },

  actionCard: {
    width: '48.5%',
    minHeight: 67,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  actionIcon: {
    color: '#9B7335',
    fontSize: 19,
    fontWeight: '900',
  },

  actionTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 9,
  },

  actionArrow: {
    color: '#A5998A',
    fontSize: 20,
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginTop: 11,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
  },

  listCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    padding: 13,
    marginTop: 10,
  },

  listTitle: {
    color: COLORS.text,
    fontSize: 11.5,
    fontWeight: '900',
  },

  listMeta: {
    color: COLORS.muted,
    fontSize: 8.5,
    marginTop: 5,
  },

  listDescription: {
    color: '#5F615F',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 7,
  },

  libraryButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAE3D8',
    borderRadius: 13,
    marginTop: 10,
  },

  libraryButtonText: {
    color: '#72562C',
    fontSize: 9.5,
    fontWeight: '900',
  },

  notesCard: {
    backgroundColor: '#EEF1F5',
    borderRadius: 16,
    padding: 14,
    marginTop: 11,
  },

  notesText: {
    color: '#5A6470',
    fontSize: 10,
    lineHeight: 17,
  },

  noticeCard: {
    backgroundColor: '#E8EDF3',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 20,
  },

  noticeTitle: {
    color: COLORS.navy,
    fontSize: 10.5,
    fontWeight: '900',
  },

  noticeText: {
    color: '#5F6875',
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
