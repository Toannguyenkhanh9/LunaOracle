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
  TextInput,
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
  deleteUserProfile,
  duplicateUserProfile,
  getUserProfiles,
  toggleUserProfileFavorite,
  type UserProfile,
  type UserProfileRelationship,
} from '../services/userProfiles';

import {
  importProfilesFromSavedBaziCharts,
} from '../services/userProfileMigration';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'UserProfiles'
>;

const RELATIONSHIP_ICONS: Record<
  UserProfileRelationship,
  string
> = {
  self: '●',
  partner: '♥',
  parent: '↑',
  child: '↓',
  sibling: '◇',
  friend: '☆',
  client: '▣',
  other: '…',
};

function twoDigits(
  value: number,
): string {
  return String(value).padStart(
    2,
    '0',
  );
}

function formatBirthDate(
  profile: UserProfile,
): string {
  return [
    twoDigits(
      profile.birthDate.day,
    ),
    twoDigits(
      profile.birthDate.month,
    ),
    profile.birthDate.year,
  ].join('/');
}

function formatBirthTime(
  profile: UserProfile,
  unknownLabel: string,
  approximateLabel: string,
): string {
  if (
    profile.birthTime.accuracy ===
    'unknown'
  ) {
    return unknownLabel;
  }

  const value =
    `${twoDigits(
      profile.birthTime.hour,
    )}:${twoDigits(
      profile.birthTime.minute,
    )}`;

  if (
    profile.birthTime.accuracy ===
    'approximate'
  ) {
    return `${approximateLabel} ${value}`;
  }

  return value;
}

function initials(
  value: string,
): string {
  const parts =
    value
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (parts.length === 0) {
    return 'ED';
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

function ActionButton({
  icon,
  label,
  onPress,
  disabled = false,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      style={({pressed}) => [
        styles.actionButton,
        disabled &&
          styles.actionButtonDisabled,
        pressed &&
          styles.pressed,
      ]}
      onPress={onPress}>
      <Text style={styles.actionIcon}>
        {icon}
      </Text>

      <Text style={styles.actionLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function UserProfilesScreen({
  navigation,
}: Props) {
  const {t} =
    useTranslation();

  const [profiles, setProfiles] =
    useState<UserProfile[]>([]);

  const [query, setQuery] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isImporting, setIsImporting] =
    useState(false);

  const load = useCallback(async () => {
    try {
      const items =
        await getUserProfiles();

      setProfiles(items);
    } catch (error) {
      console.warn(
        'Unable to load user profiles:',
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filteredProfiles =
    useMemo(() => {
      const normalized =
        query.trim().toLowerCase();

      if (!normalized) {
        return profiles;
      }

      return profiles.filter(
        profile =>
          [
            profile.displayName,
            profile.location.placeName,
            profile.location.timeZone,
            profile.notes,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalized),
      );
    }, [profiles, query]);

  const openZiwei = (
    profile: UserProfile,
  ) => {
    if (
      profile.gender ===
      'unspecified'
    ) {
      Alert.alert(
        t(
          'userProfiles.ziweiGenderTitle',
        ),
        t(
          'userProfiles.ziweiGenderMessage',
        ),
        [
          {
            text: t(
              'userProfiles.cancel',
            ),
            style: 'cancel',
          },
          {
            text: t(
              'userProfiles.edit',
            ),
            onPress: () =>
              navigation.navigate(
                'UserProfileEditor',
                {
                  profileId:
                    profile.id,
                },
              ),
          },
        ],
      );

      return;
    }

    navigation.navigate(
      'ZiweiChart',
      {
        profileId:
          profile.id,
      },
    );
  };

  const remove = (
    profile: UserProfile,
  ) => {
    Alert.alert(
      t(
        'userProfiles.deleteTitle',
      ),
      t(
        'userProfiles.deleteMessage',
        {
          name:
            profile.displayName,
        },
      ),
      [
        {
          text: t(
            'userProfiles.cancel',
          ),
          style: 'cancel',
        },
        {
          text: t(
            'userProfiles.delete',
          ),
          style: 'destructive',
          onPress: async () => {
            try {
              const next =
                await deleteUserProfile(
                  profile.id,
                );

              setProfiles(next);
            } catch (error) {
              console.warn(
                'Unable to delete user profile:',
                error,
              );
            }
          },
        },
      ],
    );
  };

  const duplicate = async (
    profile: UserProfile,
  ) => {
    try {
      await duplicateUserProfile(
        profile.id,
      );

      await load();
    } catch (error) {
      console.warn(
        'Unable to duplicate profile:',
        error,
      );
    }
  };

  const importSavedCharts = async () => {
    if (isImporting) {
      return;
    }

    setIsImporting(true);

    try {
      const count =
        await importProfilesFromSavedBaziCharts();

      await load();

      Alert.alert(
        t(
          'userProfiles.importCompletedTitle',
        ),
        count > 0
          ? t(
              'userProfiles.importCompletedMessage',
              {
                count,
              },
            )
          : t(
              'userProfiles.importNothingMessage',
            ),
      );
    } catch (error) {
      console.warn(
        'Unable to import profiles from BaZi history:',
        error,
      );

      Alert.alert(
        t(
          'userProfiles.importErrorTitle',
        ),
        t(
          'userProfiles.importErrorMessage',
        ),
      );
    } finally {
      setIsImporting(false);
    }
  };

  const toggleFavorite = async (
    profile: UserProfile,
  ) => {
    try {
      const next =
        await toggleUserProfileFavorite(
          profile.id,
        );

      setProfiles(next);
    } catch (error) {
      console.warn(
        'Unable to update favorite profile:',
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

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text
              style={
                styles.headerEyebrow
              }>
              EASTERN DESTINY
            </Text>

            <Text
              style={
                styles.headerTitle
              }>
              {t(
                'userProfiles.title',
              )}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            style={({pressed}) => [
              styles.addButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate(
                'UserProfileEditor',
              )
            }>
            <Text
              style={
                styles.addButtonIcon
              }>
              ＋
            </Text>

            <Text
              style={
                styles.addButtonText
              }>
              {t(
                'userProfiles.add',
              )}
            </Text>
          </Pressable>
        </View>

        <Text
          style={
            styles.headerSubtitle
          }>
          {t(
            'userProfiles.subtitle',
          )}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.searchWrap}>
          <Text
            style={
              styles.searchIcon
            }>
            ⌕
          </Text>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t(
              'userProfiles.searchPlaceholder',
            )}
            placeholderTextColor="#8A8B89"
            style={styles.searchInput}
          />

          {!!query && (
            <Pressable
              style={
                styles.clearSearch
              }
              onPress={() =>
                setQuery('')
              }>
              <Text
                style={
                  styles.clearSearchText
                }>
                ×
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text
              style={
                styles.summaryValue
              }>
              {profiles.length}
            </Text>

            <Text
              style={
                styles.summaryLabel
              }>
              {t(
                'userProfiles.profileCount',
                {
                  count:
                    profiles.length,
                },
              )}
            </Text>
          </View>

          <View
            style={
              styles.summaryDivider
            }
          />

          <View>
            <Text
              style={
                styles.summaryValue
              }>
              {
                profiles.filter(
                  item =>
                    item.isFavorite,
                ).length
              }
            </Text>

            <Text
              style={
                styles.summaryLabel
              }>
              {t(
                'userProfiles.favoriteCount',
              )}
            </Text>
          </View>

          <View
            style={
              styles.summaryDivider
            }
          />

          <View
            style={
              styles.summaryTextColumn
            }>
            <Text
              style={
                styles.summaryHint
              }>
              {t(
                'userProfiles.summaryHint',
              )}
            </Text>
          </View>
        </View>

        <Pressable
          disabled={isImporting}
          style={({pressed}) => [
            styles.importButton,
            isImporting &&
              styles.importButtonDisabled,
            pressed &&
              styles.pressed,
          ]}
          onPress={importSavedCharts}>
          <Text style={styles.importButtonIcon}>
            ⇩
          </Text>

          <View style={styles.importButtonTextWrap}>
            <Text style={styles.importButtonTitle}>
              {isImporting
                ? t(
                    'userProfiles.importing',
                  )
                : t(
                    'userProfiles.importFromBazi',
                  )}
            </Text>

            <Text style={styles.importButtonSubtitle}>
              {t(
                'userProfiles.importFromBaziSubtitle',
              )}
            </Text>
          </View>
        </Pressable>

        {isLoading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ◌
            </Text>

            <Text
              style={
                styles.emptyTitle
              }>
              {t(
                'userProfiles.loading',
              )}
            </Text>
          </View>
        ) : filteredProfiles.length ===
          0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ◇
            </Text>

            <Text
              style={
                styles.emptyTitle
              }>
              {profiles.length === 0
                ? t(
                    'userProfiles.emptyTitle',
                  )
                : t(
                    'userProfiles.noResultsTitle',
                  )}
            </Text>

            <Text
              style={
                styles.emptyText
              }>
              {profiles.length === 0
                ? t(
                    'userProfiles.emptyMessage',
                  )
                : t(
                    'userProfiles.noResultsMessage',
                  )}
            </Text>

            {profiles.length === 0 && (
              <Pressable
                style={
                  styles.emptyButton
                }
                onPress={() =>
                  navigation.navigate(
                    'UserProfileEditor',
                  )
                }>
                <Text
                  style={
                    styles.emptyButtonText
                  }>
                  {t(
                    'userProfiles.createFirst',
                  )}
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          filteredProfiles.map(
            profile => (
              <View
                key={profile.id}
                style={
                  styles.profileCard
                }>
                <View
                  style={
                    styles.profileHeader
                  }>
                  <View
                    style={
                      styles.avatar
                    }>
                    <Text
                      style={
                        styles.avatarText
                      }>
                      {initials(
                        profile.displayName,
                      )}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.profileTitleWrap
                    }>
                    <View
                      style={
                        styles.nameRow
                      }>
                      <Text
                        style={
                          styles.profileName
                        }
                        numberOfLines={1}>
                        {
                          profile.displayName
                        }
                      </Text>

                      {profile.isFavorite && (
                        <Text
                          style={
                            styles.favoriteStar
                          }>
                          ★
                        </Text>
                      )}
                    </View>

                    <Text
                      style={
                        styles.relationship
                      }>
                      {
                        RELATIONSHIP_ICONS[
                          profile.relationship
                        ]
                      }{' '}
                      {t(
                        `userProfiles.relationships.${profile.relationship}`,
                      )}
                    </Text>
                  </View>

                  <Pressable
                    hitSlop={8}
                    style={({pressed}) => [
                      styles.favoriteButton,
                      pressed &&
                        styles.pressed,
                    ]}
                    onPress={() =>
                      toggleFavorite(
                        profile,
                      )
                    }>
                    <Text
                      style={[
                        styles.favoriteButtonText,
                        profile.isFavorite &&
                          styles.favoriteButtonTextActive,
                      ]}>
                      {profile.isFavorite
                        ? '★'
                        : '☆'}
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={
                    styles.profileDetails
                  }>
                  <View
                    style={
                      styles.detailItem
                    }>
                    <Text
                      style={
                        styles.detailLabel
                      }>
                      {t(
                        'userProfiles.birthDateShort',
                      )}
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }>
                      {formatBirthDate(
                        profile,
                      )}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.detailItem
                    }>
                    <Text
                      style={
                        styles.detailLabel
                      }>
                      {t(
                        'userProfiles.birthTimeShort',
                      )}
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }>
                      {formatBirthTime(
                        profile,
                        t(
                          'userProfiles.timeAccuracy.unknown',
                        ),
                        t(
                          'userProfiles.approximatePrefix',
                        ),
                      )}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.detailItem,
                      styles.detailItemWide,
                    ]}>
                    <Text
                      style={
                        styles.detailLabel
                      }>
                      {t(
                        'userProfiles.locationShort',
                      )}
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }
                      numberOfLines={1}>
                      {profile.location
                        .placeName ||
                        profile.location
                          .timeZone}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.primaryActions
                  }>
                  <ActionButton
                    icon="☯"
                    label={t(
                      'userProfiles.actions.bazi',
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

                  <ActionButton
                    icon="紫"
                    label={t(
                      'userProfiles.actions.ziwei',
                    )}
                    onPress={() =>
                      openZiwei(
                        profile,
                      )
                    }
                  />

                  <ActionButton
                    icon="✦"
                    label={t(
                      'userProfiles.actions.dates',
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
                </View>

                <View
                  style={
                    styles.secondaryActions
                  }>
                  <Pressable
                    style={({pressed}) => [
                      styles.textAction,
                      pressed &&
                        styles.pressed,
                    ]}
                    onPress={() =>
                      navigation.navigate(
                        'ProfileOverview',
                        {
                          profileId:
                            profile.id,
                        },
                      )
                    }>
                    <Text
                      style={
                        styles.textActionPrimary
                      }>
                      {t(
                        'profileOverview.action',
                      )}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({pressed}) => [
                      styles.textAction,
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
                        styles.textActionPrimary
                      }>
                      {t(
                        'userProfiles.edit',
                      )}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({pressed}) => [
                      styles.textAction,
                      pressed &&
                        styles.pressed,
                    ]}
                    onPress={() =>
                      duplicate(profile)
                    }>
                    <Text
                      style={
                        styles.textActionText
                      }>
                      {t(
                        'userProfiles.duplicate',
                      )}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({pressed}) => [
                      styles.textAction,
                      pressed &&
                        styles.pressed,
                    ]}
                    onPress={() =>
                      remove(profile)
                    }>
                    <Text
                      style={
                        styles.textActionDanger
                      }>
                      {t(
                        'userProfiles.delete',
                      )}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ),
          )
        )}

        <View style={styles.noticeCard}>
          <Text
            style={
              styles.noticeTitle
            }>
            {t(
              'userProfiles.privacyTitle',
            )}
          </Text>

          <Text
            style={
              styles.noticeText
            }>
            {t(
              'userProfiles.privacyMessage',
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

  header: {
    backgroundColor:
      COLORS.navy,
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerEyebrow: {
    color: '#D9BB7B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  headerTitle: {
    color: '#FFF7E5',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 3,
  },

  headerSubtitle: {
    maxWidth: 350,
    color: '#C9CED7',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  addButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.gold,
    borderRadius: 14,
    paddingHorizontal: 13,
    marginLeft: 'auto',
  },

  addButtonIcon: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '900',
    marginRight: 4,
  },

  addButtonText: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '900',
  },

  content: {
    padding: 16,
    paddingBottom: 145,
  },

  searchWrap: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 13,
  },

  searchIcon: {
    color: '#7A6E60',
    fontSize: 22,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },

  clearSearch: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearSearchText: {
    color: '#7B746B',
    fontSize: 21,
  },

  summaryCard: {
    minHeight: 83,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEE5D4',
    borderRadius: 18,
    paddingHorizontal: 15,
    marginTop: 12,
  },

  summaryValue: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  summaryLabel: {
    color: '#786D60',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 2,
  },

  summaryDivider: {
    width: 1,
    height: 42,
    backgroundColor:
      '#D8CCB9',
    marginHorizontal: 14,
  },

  summaryTextColumn: {
    flex: 1,
  },

  summaryHint: {
    color: '#6F6559',
    fontSize: 10,
    lineHeight: 16,
  },

  importButton: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7EDF3',
    borderWidth: 1,
    borderColor: '#CFD9E4',
    borderRadius: 17,
    paddingHorizontal: 14,
    marginTop: 12,
  },

  importButtonDisabled: {
    opacity: 0.55,
  },

  importButtonIcon: {
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: '900',
    marginRight: 11,
  },

  importButtonTextWrap: {
    flex: 1,
  },

  importButtonTitle: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '900',
  },

  importButtonSubtitle: {
    color: '#6C7480',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 3,
  },

  profileCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 21,
    padding: 15,
    marginTop: 13,
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.navy,
    borderRadius: 16,
  },

  avatarText: {
    color: '#F2D795',
    fontSize: 15,
    fontWeight: '900',
  },

  profileTitleWrap: {
    flex: 1,
    marginLeft: 11,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileName: {
    flexShrink: 1,
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
  },

  favoriteStar: {
    color: '#C99A39',
    fontSize: 13,
    marginLeft: 6,
  },

  relationship: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },

  favoriteButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2EBDD',
    borderRadius: 13,
  },

  favoriteButtonText: {
    color: '#9A8B77',
    fontSize: 20,
  },

  favoriteButtonTextActive: {
    color: '#C99732',
  },

  profileDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F5F0E7',
    borderRadius: 15,
    padding: 11,
    marginTop: 13,
  },

  detailItem: {
    width: '50%',
    marginBottom: 8,
  },

  detailItemWide: {
    width: '100%',
    marginBottom: 0,
  },

  detailLabel: {
    color: '#918678',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  detailValue: {
    color: '#3D434C',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },

  primaryActions: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 12,
  },

  actionButton: {
    flex: 1,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.navy,
    borderRadius: 14,
    paddingHorizontal: 5,
    marginHorizontal: 4,
  },

  actionButtonDisabled: {
    opacity: 0.45,
  },

  actionIcon: {
    color: COLORS.gold,
    fontSize: 17,
    fontWeight: '900',
  },

  actionLabel: {
    color: '#FFF4D7',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },

  secondaryActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
  },

  textAction: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: 6,
  },

  textActionPrimary: {
    color: '#805F25',
    fontSize: 10,
    fontWeight: '900',
  },

  textActionText: {
    color: '#6E716F',
    fontSize: 10,
    fontWeight: '800',
  },

  textActionDanger: {
    color: '#A44E43',
    fontSize: 10,
    fontWeight: '800',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 21,
    padding: 28,
    marginTop: 13,
  },

  emptyIcon: {
    color: '#B38C43',
    fontSize: 38,
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

  emptyButton: {
    backgroundColor:
      COLORS.gold,
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginTop: 15,
  },

  emptyButtonText: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '900',
  },

  noticeCard: {
    backgroundColor: '#E9E4DB',
    borderRadius: 17,
    padding: 15,
    marginTop: 15,
  },

  noticeTitle: {
    color: '#5A554D',
    fontSize: 11,
    fontWeight: '900',
  },

  noticeText: {
    color: '#736D65',
    fontSize: 10,
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
