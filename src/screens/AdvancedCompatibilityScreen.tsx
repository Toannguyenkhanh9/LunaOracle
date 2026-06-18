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
  calculateAdvancedCompatibility,
  type CompatibilityMode,
} from '../services/advancedCompatibility';

import {
  saveBookmark,
} from '../services/bookmarksNotes';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'AdvancedCompatibility'
>;

const MODES: CompatibilityMode[] = [
  'love',
  'marriage',
  'friendship',
  'business',
  'parentChild',
];

function ProfileSelector({
  label,
  profiles,
  selectedId,
  excludedId,
  onSelect,
}: {
  label: string;
  profiles: UserProfile[];
  selectedId: string | null;
  excludedId?: string | null;
  onSelect: (
    id: string,
  ) => void;
}) {
  return (
    <View style={styles.selectorBlock}>
      <Text style={styles.selectorLabel}>
        {label}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.profileRow
        }>
        {profiles
          .filter(
            item =>
              item.id !==
              excludedId,
          )
          .map(profile => {
            const selected =
              profile.id ===
              selectedId;

            return (
              <Pressable
                key={profile.id}
                style={({pressed}) => [
                  styles.profileChip,
                  selected &&
                    styles.profileChipSelected,
                  pressed &&
                    styles.pressed,
                ]}
                onPress={() =>
                  onSelect(
                    profile.id,
                  )
                }>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.profileChipText,
                    selected &&
                      styles.profileChipTextSelected,
                  ]}>
                  {
                    profile.displayName
                  }
                </Text>
              </Pressable>
            );
          })}
      </ScrollView>
    </View>
  );
}

function DimensionBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.dimensionRow}>
      <View style={styles.dimensionLabelRow}>
        <Text
          style={
            styles.dimensionLabel
          }>
          {label}
        </Text>

        <Text
          style={
            styles.dimensionValue
          }>
          {value}
        </Text>
      </View>

      <View style={styles.dimensionTrack}>
        <View
          style={[
            styles.dimensionFill,
            {
              width: `${value}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function AdvancedCompatibilityScreen({
  navigation,
  route,
}: Props) {
  const {t} =
    useTranslation();

  const [profiles, setProfiles] =
    useState<UserProfile[]>([]);

  const [profileAId, setProfileAId] =
    useState<string | null>(
      route.params?.profileAId ??
        null,
    );

  const [profileBId, setProfileBId] =
    useState<string | null>(
      route.params?.profileBId ??
        null,
    );

  const [mode, setMode] =
    useState<CompatibilityMode>(
      route.params?.mode ??
        'love',
    );

  const load = useCallback(async () => {
    try {
      const items =
        await getUserProfiles();

      setProfiles(items);

      setProfileAId(
        current =>
          current &&
          items.some(
            item =>
              item.id === current,
          )
            ? current
            : items[0]?.id ??
              null,
      );

      setProfileBId(
        current => {
          if (
            current &&
            items.some(
              item =>
                item.id === current,
            ) &&
            current !==
              profileAId
          ) {
            return current;
          }

          return (
            items.find(
              item =>
                item.id !==
                (
                  profileAId ??
                  items[0]?.id
                ),
            )?.id ?? null
          );
        },
      );
    } catch (error) {
      console.warn(
        'Unable to load compatibility profiles:',
        error,
      );
    }
  }, [profileAId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const first =
    useMemo(
      () =>
        profiles.find(
          item =>
            item.id ===
            profileAId,
        ) ?? null,
      [
        profiles,
        profileAId,
      ],
    );

  const second =
    useMemo(
      () =>
        profiles.find(
          item =>
            item.id ===
            profileBId,
        ) ?? null,
      [
        profiles,
        profileBId,
      ],
    );

  const result =
    useMemo(() => {
      if (
        !first ||
        !second ||
        first.id === second.id
      ) {
        return null;
      }

      return calculateAdvancedCompatibility(
        first,
        second,
        mode,
      );
    }, [
      first,
      second,
      mode,
    ]);

  const saveCurrent = async () => {
    if (
      !first ||
      !second ||
      !result
    ) {
      return;
    }

    try {
      await saveBookmark({
        route:
          'AdvancedCompatibility',
        params: {
          profileAId:
            first.id,
          profileBId:
            second.id,
          mode,
        },
        titleKey:
          'insightFeatures.compatibility.title',
        icon: '◉',
        profileName:
          `${first.displayName} × ${second.displayName}`,
      });

      Alert.alert(
        t(
          'insightFeatures.compatibility.savedTitle',
        ),
        t(
          'insightFeatures.compatibility.savedMessage',
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to bookmark compatibility:',
        error,
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
          <View>
            <Text style={styles.heroEyebrow}>
              EASTERN DESTINY
            </Text>

            <Text style={styles.heroTitle}>
              {t(
                'insightFeatures.compatibility.title',
              )}
            </Text>

            <Text
              style={
                styles.heroSubtitle
              }>
              {t(
                'insightFeatures.compatibility.subtitle',
              )}
            </Text>
          </View>

          <Text style={styles.heroIcon}>
            ◉
          </Text>
        </View>

        {profiles.length < 2 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ◎
            </Text>

            <Text style={styles.emptyTitle}>
              {t(
                'insightFeatures.compatibility.needProfilesTitle',
              )}
            </Text>

            <Text style={styles.emptyText}>
              {t(
                'insightFeatures.compatibility.needProfilesMessage',
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
                  'insightFeatures.compatibility.createProfile',
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
                  'insightFeatures.compatibility.chooseProfiles',
                )}
              </Text>

              <ProfileSelector
                label={t(
                  'insightFeatures.compatibility.profileA',
                )}
                profiles={profiles}
                selectedId={
                  profileAId
                }
                excludedId={
                  profileBId
                }
                onSelect={id => {
                  setProfileAId(
                    id,
                  );

                  if (
                    id === profileBId
                  ) {
                    setProfileBId(
                      profiles.find(
                        item =>
                          item.id !== id,
                      )?.id ??
                        null,
                    );
                  }
                }}
              />

              <ProfileSelector
                label={t(
                  'insightFeatures.compatibility.profileB',
                )}
                profiles={profiles}
                selectedId={
                  profileBId
                }
                excludedId={
                  profileAId
                }
                onSelect={
                  setProfileBId
                }
              />

              <Text
                style={
                  styles.modeLabel
                }>
                {t(
                  'insightFeatures.compatibility.mode',
                )}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.modeRow
                }>
                {MODES.map(
                  item => (
                    <Pressable
                      key={item}
                      style={[
                        styles.modeChip,
                        item === mode &&
                          styles.modeChipActive,
                      ]}
                      onPress={() =>
                        setMode(item)
                      }>
                      <Text
                        style={[
                          styles.modeChipText,
                          item === mode &&
                            styles.modeChipTextActive,
                        ]}>
                        {t(
                          `insightFeatures.compatibility.modes.${item}`,
                        )}
                      </Text>
                    </Pressable>
                  ),
                )}
              </ScrollView>
            </View>

            {result &&
              first &&
              second && (
                <>
                  <View
                    style={
                      styles.resultCard
                    }>
                    <View
                      style={
                        styles.pairRow
                      }>
                      <View
                        style={
                          styles.personBadge
                        }>
                        <Text
                          style={
                            styles.personBadgeText
                          }>
                          {first.displayName
                            .slice(
                              0,
                              1,
                            )
                            .toUpperCase()}
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.pairSymbol
                        }>
                        ×
                      </Text>

                      <View
                        style={
                          styles.personBadge
                        }>
                        <Text
                          style={
                            styles.personBadgeText
                          }>
                          {second.displayName
                            .slice(
                              0,
                              1,
                            )
                            .toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={
                        styles.pairNames
                      }>
                      {
                        first.displayName
                      }{' '}
                      ·{' '}
                      {
                        second.displayName
                      }
                    </Text>

                    <View
                      style={
                        styles.scoreCircle
                      }>
                      <Text
                        style={
                          styles.scoreCircleValue
                        }>
                        {
                          result.overallScore
                        }
                      </Text>

                      <Text
                        style={
                          styles.scoreCircleLabel
                        }>
                        {t(
                          'insightFeatures.compatibility.overall',
                        )}
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.toneTitle
                      }>
                      {t(
                        `insightFeatures.compatibility.tones.${result.tone}.title`,
                      )}
                    </Text>

                    <Text
                      style={
                        styles.toneMessage
                      }>
                      {t(
                        `insightFeatures.compatibility.tones.${result.tone}.message`,
                      )}
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text
                      style={
                        styles.sectionEyebrow
                      }>
                      {t(
                        'insightFeatures.compatibility.dimensionsEyebrow',
                      )}
                    </Text>

                    <Text
                      style={
                        styles.sectionTitle
                      }>
                      {t(
                        'insightFeatures.compatibility.dimensionsTitle',
                      )}
                    </Text>

                    <View
                      style={
                        styles.dimensionsCard
                      }>
                      {result.dimensions.map(
                        item => (
                          <DimensionBar
                            key={
                              item.code
                            }
                            label={t(
                              `insightFeatures.compatibility.dimensions.${item.code}`,
                            )}
                            value={
                              item.score
                            }
                          />
                        ),
                      )}
                    </View>
                  </View>

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
                          'insightFeatures.compatibility.strengths',
                        )}
                      </Text>

                      {result.strengthCodes.map(
                        code => (
                          <Text
                            key={code}
                            style={
                              styles.insightItem
                            }>
                            ✓{' '}
                            {t(
                              `insightFeatures.compatibility.codeText.${code}`,
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
                          'insightFeatures.compatibility.cautions',
                        )}
                      </Text>

                      {result.cautionCodes.map(
                        code => (
                          <Text
                            key={code}
                            style={
                              styles.insightItem
                            }>
                            !{' '}
                            {t(
                              `insightFeatures.compatibility.codeText.${code}`,
                            )}
                          </Text>
                        ),
                      )}
                    </View>
                  </View>

                  <View
                    style={
                      styles.suggestionsCard
                    }>
                    <Text
                      style={
                        styles.suggestionsTitle
                      }>
                      {t(
                        'insightFeatures.compatibility.suggestions',
                      )}
                    </Text>

                    {result.suggestionCodes.map(
                      code => (
                        <Text
                          key={code}
                          style={
                            styles.suggestionItem
                          }>
                          •{' '}
                          {t(
                            `insightFeatures.compatibility.codeText.${code}`,
                          )}
                        </Text>
                      ),
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
                            'compatibility',
                          profileAId:
                            first.id,
                          profileBId:
                            second.id,
                          mode,
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
                        'insightFeatures.compatibility.bookmark',
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
              'insightFeatures.compatibility.modelTitle',
            )}
          </Text>

          <Text style={styles.noticeText}>
            {t(
              'insightFeatures.compatibility.modelNotice',
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
    fontSize: 42,
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

  selectorBlock: {
    marginTop: 13,
  },

  selectorLabel: {
    color: '#5E6570',
    fontSize: 10,
    fontWeight: '900',
  },

  profileRow: {
    paddingTop: 8,
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

  modeLabel: {
    color: '#5E6570',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 15,
  },

  modeRow: {
    paddingTop: 8,
    paddingRight: 10,
  },

  modeChip: {
    backgroundColor: '#ECE5DA',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginRight: 7,
  },

  modeChipActive: {
    backgroundColor:
      COLORS.gold,
  },

  modeChipText: {
    color: '#6F675E',
    fontSize: 9,
    fontWeight: '800',
  },

  modeChipTextActive: {
    color: COLORS.navy,
  },

  resultCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 22,
    padding: 19,
    marginHorizontal: 16,
    marginTop: 19,
  },

  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  personBadge: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.navy,
    borderRadius: 15,
  },

  personBadgeText: {
    color: '#F1D38D',
    fontSize: 18,
    fontWeight: '900',
  },

  pairSymbol: {
    color: '#A48145',
    fontSize: 22,
    fontWeight: '900',
    marginHorizontal: 14,
  },

  pairNames: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
  },

  scoreCircle: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.navy,
    borderWidth: 4,
    borderColor:
      COLORS.gold,
    borderRadius: 46,
    marginTop: 16,
  },

  scoreCircleValue: {
    color: '#FFF2D1',
    fontSize: 28,
    fontWeight: '900',
  },

  scoreCircleLabel: {
    color: '#D9C58D',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 1,
  },

  toneTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 13,
  },

  toneMessage: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },

  dimensionsCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 19,
    padding: 15,
    marginTop: 12,
  },

  dimensionRow: {
    marginBottom: 12,
  },

  dimensionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dimensionLabel: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
  },

  dimensionValue: {
    color: '#8B6832',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 'auto',
  },

  dimensionTrack: {
    height: 8,
    backgroundColor: '#E7E0D5',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },

  dimensionFill: {
    height: '100%',
    backgroundColor:
      COLORS.gold,
  },

  insightGrid: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
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

  suggestionsCard: {
    backgroundColor: '#E9EEF4',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },

  suggestionsTitle: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
  },

  suggestionItem: {
    color: '#5D6470',
    fontSize: 9.5,
    lineHeight: 16,
    marginTop: 6,
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
