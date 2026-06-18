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
  buildDailyBrief,
  getDailyBriefProfileId,
  setDailyBriefProfileId,
} from '../services/dailyBrief';

import {
  getUserProfiles,
  type UserProfile,
} from '../services/userProfiles';

import {
  refreshHomeWidget,
} from '../services/homeWidget';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'DailyBrief'
>;

function formatDate(
  value: Date,
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
    ).format(value);
  } catch {
    return value.toLocaleDateString();
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
  return (
    <Pressable
      style={[
        styles.profileChip,
        selected &&
          styles.profileChipActive,
      ]}
      onPress={onPress}>
      <Text
        numberOfLines={1}
        style={[
          styles.profileChipText,
          selected &&
            styles.profileChipTextActive,
        ]}>
        {profile.displayName}
      </Text>
    </Pressable>
  );
}

export default function DailyBriefScreen({
  navigation,
  route,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const [profiles, setProfiles] =
    useState<UserProfile[]>([]);

  const [
    selectedProfileId,
    setSelectedProfileId,
  ] =
    useState<string | null>(
      route.params?.profileId ??
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const load = useCallback(async () => {
    try {
      const [
        items,
        storedProfileId,
      ] = await Promise.all([
        getUserProfiles(),
        getDailyBriefProfileId(),
      ]);

      setProfiles(items);

      setSelectedProfileId(
        current => {
          const candidate =
            current ??
            route.params?.profileId ??
            storedProfileId;

          if (
            candidate &&
            items.some(
              item =>
                item.id ===
                candidate,
            )
          ) {
            return candidate;
          }

          return (
            items.find(
              item =>
                item.isFavorite,
            )?.id ??
            items[0]?.id ??
            null
          );
        },
      );
    } catch (error) {
      console.warn(
        'Unable to load daily brief:',
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [route.params?.profileId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
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

  const brief =
    useMemo(
      () =>
        buildDailyBrief(
          selectedProfile,
          new Date(),
        ),
      [selectedProfile],
    );

  const chooseProfile = async (
    profileId: string,
  ) => {
    setSelectedProfileId(
      profileId,
    );

    await setDailyBriefProfileId(
      profileId,
    );
  };

  const updateWidget = async () => {
    try {
      const updated =
        await refreshHomeWidget(
          language,
          selectedProfileId ??
          undefined,
        );

      Alert.alert(
        t(
          updated
            ? 'dailyBrief.widgetUpdatedTitle'
            : 'dailyBrief.widgetUnavailableTitle',
        ),
        t(
          updated
            ? 'dailyBrief.widgetUpdatedMessage'
            : 'dailyBrief.widgetUnavailableMessage',
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to update home widget:',
        error,
      );

      Alert.alert(
        t(
          'dailyBrief.widgetUnavailableTitle',
        ),
        t(
          'dailyBrief.widgetUnavailableMessage',
        ),
      );
    }
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
              EASTERN DESTINY DAILY
            </Text>

            <Text style={styles.heroTitle}>
              {t(
                'dailyBrief.title',
              )}
            </Text>

            <Text style={styles.heroSubtitle}>
              {formatDate(
                brief.date,
                language,
              )}
            </Text>
          </View>

          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>
              ☀
            </Text>
          </View>
        </View>

        {profiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>
              {t(
                'dailyBrief.profileEyebrow',
              )}
            </Text>

            <Text style={styles.sectionTitle}>
              {t(
                'dailyBrief.profileTitle',
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
                    key={profile.id}
                    profile={profile}
                    selected={
                      profile.id ===
                      selectedProfileId
                    }
                    onPress={() =>
                      void chooseProfile(
                        profile.id,
                      )
                    }
                  />
                ),
              )}
            </ScrollView>
          </View>
        )}

        <View style={styles.briefCard}>
          <Text style={styles.briefLabel}>
            {t(
              'dailyBrief.headlineLabel',
            )}
          </Text>

          <Text style={styles.briefHeadline}>
            {t(
              `dailyBrief.headlines.${brief.headlineCode}`,
            )}
          </Text>

          <View style={styles.briefMetaRow}>
            <Text style={styles.briefMeta}>
              {t(
                'dailyBrief.lunarLine',
                {
                  day:
                    brief.lunarDay,
                  month:
                    brief.lunarMonth,
                  year:
                    brief.lunarYear,
                },
              )}
            </Text>

            <Text style={styles.briefMeta}>
              {brief.dayCanChiRaw}
            </Text>
          </View>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.focusCard}>
            <Text style={styles.cardEyebrow}>
              {t(
                'dailyBrief.focusEyebrow',
              )}
            </Text>

            <Text style={styles.cardTitle}>
              {t(
                `dailyBrief.focus.${brief.focusCode}`,
              )}
            </Text>
          </View>

          <View style={styles.cautionCard}>
            <Text style={styles.cardEyebrow}>
              {t(
                'dailyBrief.cautionEyebrow',
              )}
            </Text>

            <Text style={styles.cardTitle}>
              {t(
                `dailyBrief.cautions.${brief.cautionCode}`,
              )}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'dailyBrief.suitableEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'dailyBrief.suitableTitle',
            )}
          </Text>

          <View style={styles.listCard}>
            {brief.suitable.map(
              item => (
                <Text
                  key={item}
                  style={styles.listItem}>
                  ✓{' '}
                  {t(
                    `today.activities.${item}`,
                  )}
                </Text>
              ),
            )}

            {brief.suitable.length ===
              0 && (
              <Text style={styles.listItem}>
                {t(
                  'dailyBrief.noSuitable',
                )}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'dailyBrief.hoursEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'dailyBrief.hoursTitle',
            )}
          </Text>

          <View style={styles.hoursRow}>
            {brief.topHours.map(
              item => (
                <View
                  key={`${item.branchIndex}-${item.start}`}
                  style={styles.hourChip}>
                  <Text style={styles.hourTime}>
                    {item.start}
                  </Text>

                  <Text style={styles.hourEnd}>
                    {item.end}
                  </Text>
                </View>
              ),
            )}
          </View>
        </View>

        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionEyebrow}>
            {t(
              'dailyBrief.reflectionEyebrow',
            )}
          </Text>

          <Text style={styles.reflectionText}>
            {t(
              `today.reflections.${brief.reflectionIndex}`,
            )}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate(
                'ExplainableResult',
                {
                  kind: 'today',
                  profileId:
                    selectedProfileId ??
                    undefined,
                  date:
                    brief.date.toISOString(),
                },
              )
            }>
            <Text style={styles.primaryButtonText}>
              {t(
                'dailyBrief.explain',
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
                'dailyBrief.notifications',
              )}
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.widgetButton}
          onPress={() =>
            void updateWidget()
          }>
          <Text style={styles.widgetButtonText}>
            {t(
              'dailyBrief.updateWidget',
            )}
          </Text>
        </Pressable>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {t(
              'dailyBrief.noticeTitle',
            )}
          </Text>

          <Text style={styles.noticeText}>
            {t(
              'dailyBrief.notice',
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

  briefCard: {
    backgroundColor:
      COLORS.navy,
    borderRadius: 20,
    padding: 17,
    marginHorizontal: 16,
    marginTop: 18,
  },

  briefLabel: {
    color: '#D5B672',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  briefHeadline: {
    color: '#FFF2D4',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '900',
    marginTop: 8,
  },

  briefMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },

  briefMeta: {
    color: '#C8CFD9',
    fontSize: 8.5,
    fontWeight: '800',
    backgroundColor:
      'rgba(255,255,255,0.07)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 5,
  },

  twoColumn: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
  },

  focusCard: {
    width: '48.5%',
    backgroundColor: '#EDF4E7',
    borderRadius: 16,
    padding: 13,
  },

  cautionCard: {
    width: '48.5%',
    backgroundColor: '#F8EBE7',
    borderRadius: 16,
    padding: 13,
  },

  cardEyebrow: {
    color: '#817362',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '900',
    marginTop: 5,
  },

  listCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    padding: 14,
    marginTop: 11,
  },

  listItem: {
    color: '#555B63',
    fontSize: 10,
    lineHeight: 17,
    marginBottom: 5,
  },

  hoursRow: {
    flexDirection: 'row',
    marginTop: 11,
  },

  hourChip: {
    minWidth: 78,
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 14,
    padding: 10,
    marginRight: 8,
  },

  hourTime: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '900',
  },

  hourEnd: {
    color: COLORS.muted,
    fontSize: 8.5,
    marginTop: 3,
  },

  reflectionCard: {
    backgroundColor: '#E8EDF3',
    borderRadius: 17,
    padding: 15,
    marginHorizontal: 16,
    marginTop: 20,
  },

  reflectionEyebrow: {
    color: '#7A6747',
    fontSize: 8.5,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  reflectionText: {
    color: '#4F5B6B',
    fontSize: 11,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 7,
  },

  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 14,
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

  widgetButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE5D7',
    borderRadius: 13,
    marginHorizontal: 16,
    marginTop: 10,
  },

  widgetButtonText: {
    color: '#75582E',
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
