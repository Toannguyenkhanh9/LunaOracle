import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
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
  buildBirthChart,
  getZodiacSymbol,
} from '../services/astroBirthChart';

import {
  deleteBirthProfile,
  listBirthProfiles,
  setActiveBirthProfile,
  type BirthProfile,
} from '../services/birthProfiles';

import {
  formatBirthPlace,
} from '../services/birthPlaces';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function BirthProfilesScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    profiles,
    setProfiles,
  ] =
    useState<BirthProfile[]>([]);

  const [
    activeProfileId,
    setActiveProfileId,
  ] =
    useState<string | undefined>();

  const load = useCallback(
    async () => {
      const state =
        await listBirthProfiles();

      setProfiles(
        state.profiles,
      );
      setActiveProfileId(
        state.activeProfileId,
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

  const openEditor = (
    profileId?: string,
  ) => {
    navigation.navigate(
      'BirthProfileEditor',
      profileId
        ? {
            profileId,
          }
        : undefined,
    );
  };

  const makeActive =
    async (
      profileId: string,
    ) => {
      await setActiveBirthProfile(
        profileId,
      );

      await load();

      navigation.navigate(
        'ZodiacProfile',
      );
    };

  const confirmDelete = (
    profile: BirthProfile,
  ) => {
    Alert.alert(
      t(
        'lunaBirthProfiles.deleteTitle',
        {
          defaultValue:
            'Delete profile?',
        },
      ),
      t(
        'lunaBirthProfiles.deleteMessage',
        {
          name:
            profile.name,
          defaultValue:
            'This birth profile will be removed from this device.',
        },
      ),
      [
        {
          text: t(
            'common.cancel',
            {
              defaultValue:
                'Cancel',
            },
          ),
          style: 'cancel',
        },
        {
          text: t(
            'common.delete',
            {
              defaultValue:
                'Delete',
            },
          ),
          style: 'destructive',
          onPress: async () => {
            await deleteBirthProfile(
              profile.id,
            );
            await load();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaBirthProfiles.eyebrow',
            {
              defaultValue:
                'Profiles',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'lunaBirthProfiles.title',
            {
              defaultValue:
                'Birth Profiles',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'lunaBirthProfiles.subtitle',
            {
              defaultValue:
                'Create charts for yourself, friends, family, or clients.',
            },
          )}
        </Text>

        <Pressable
          style={styles.addButton}
          onPress={() =>
            openEditor()
          }>
          <Text style={styles.addText}>
            ＋{' '}
            {t(
              'lunaBirthProfiles.addProfile',
              {
                defaultValue:
                  'Add Profile',
              },
            )}
          </Text>
        </Pressable>

        {profiles.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ✦
            </Text>

            <Text style={styles.emptyTitle}>
              {t(
                'lunaBirthProfiles.empty',
                {
                  defaultValue:
                    'No profiles yet',
                },
              )}
            </Text>

            <Text style={styles.emptyText}>
              {t(
                'lunaBirthProfiles.emptyHint',
                {
                  defaultValue:
                    'Add a birth profile to calculate a chart quickly.',
                },
              )}
            </Text>
          </View>
        ) : (
          profiles.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isActive={
                profile.id ===
                activeProfileId
              }
              onOpen={() =>
                openEditor(
                  profile.id,
                )
              }
              onUse={() =>
                makeActive(
                  profile.id,
                )
              }
              onDelete={() =>
                confirmDelete(
                  profile,
                )
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileCard({
  profile,
  isActive,
  onOpen,
  onUse,
  onDelete,
}: {
  profile: BirthProfile;
  isActive: boolean;
  onOpen: () => void;
  onUse: () => void;
  onDelete: () => void;
}) {
  const {t} =
    useTranslation();

  const chart =
    buildBirthChart(
      profile.input,
    );

  const sun =
    chart.points.sun;

  const moon =
    chart.points.moon;

  const rising =
    chart.points.ascendant;

  const placeText =
    profile.place
      ? formatBirthPlace(
          profile.place,
        )
      : `${profile.input.latitude}, ${profile.input.longitude}`;

  return (
    <View
      style={[
        styles.profileCard,
        isActive &&
          styles.profileCardActive,
      ]}>
      <View style={styles.profileHeader}>
        <View style={styles.profileTitleBlock}>
          <Text style={styles.profileName}>
            {profile.name}
          </Text>

          <Text style={styles.profileMeta}>
            {profile.input.year}-
            {String(
              profile.input.month,
            ).padStart(2, '0')}
            -
            {String(
              profile.input.day,
            ).padStart(2, '0')}
            {' • '}
            {String(
              profile.input.hour,
            ).padStart(2, '0')}
            :
            {String(
              profile.input.minute,
            ).padStart(2, '0')}
          </Text>
        </View>

        {isActive ? (
          <View style={styles.activePill}>
            <Text style={styles.activeText}>
              {t(
                'lunaBirthProfiles.active',
                {
                  defaultValue:
                    'Active',
                },
              )}
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        style={styles.placeText}
        numberOfLines={1}>
        ◎ {placeText}
      </Text>

      <View style={styles.bigThreeRow}>
        <MiniPoint
          label={t(
            'lunaBirthProfiles.sun',
            {
              defaultValue:
                'Sun',
            },
          )}
          symbol={getZodiacSymbol(
            sun.sign,
          )}
          sign={t(
            `western.signs.${sun.sign}`,
            {
              defaultValue:
                sun.sign,
            },
          )}
        />

        <MiniPoint
          label={t(
            'lunaBirthProfiles.moon',
            {
              defaultValue:
                'Moon',
            },
          )}
          symbol={getZodiacSymbol(
            moon.sign,
          )}
          sign={t(
            `western.signs.${moon.sign}`,
            {
              defaultValue:
                moon.sign,
            },
          )}
        />

        <MiniPoint
          label={t(
            'lunaBirthProfiles.rising',
            {
              defaultValue:
                'Rising',
            },
          )}
          symbol={getZodiacSymbol(
            rising.sign,
          )}
          sign={t(
            `western.signs.${rising.sign}`,
            {
              defaultValue:
                rising.sign,
            },
          )}
        />
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={styles.secondaryButton}
          onPress={onOpen}>
          <Text style={styles.secondaryText}>
            {t(
              'lunaBirthProfiles.edit',
              {
                defaultValue:
                  'Edit',
              },
            )}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={onDelete}>
          <Text style={styles.secondaryText}>
            {t(
              'common.delete',
              {
                defaultValue:
                  'Delete',
              },
            )}
          </Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={onUse}>
          <Text style={styles.primaryText}>
            {t(
              'lunaBirthProfiles.useChart',
              {
                defaultValue:
                  'Use Chart',
              },
            )}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function MiniPoint({
  label,
  symbol,
  sign,
}: {
  label: string;
  symbol: string;
  sign: string;
}) {
  return (
    <View style={styles.miniPoint}>
      <Text style={styles.miniSymbol}>
        {symbol}
      </Text>

      <Text style={styles.miniLabel}>
        {label}
      </Text>

      <Text
        style={styles.miniSign}
        numberOfLines={1}>
        {sign}
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

  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    backgroundColor: COLORS.night,
    borderRadius: 18,
    marginTop: 18,
  },

  addText: {
    color: '#F8EBCB',
    fontSize: 14,
    fontWeight: '900',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 24,
    marginTop: 14,
  },

  emptyIcon: {
    color: COLORS.purple,
    fontSize: 44,
    fontWeight: '900',
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },

  profileCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },

  profileCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: '#FFF9EB',
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileTitleBlock: {
    flex: 1,
  },

  profileName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },

  profileMeta: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },

  activePill: {
    backgroundColor: COLORS.night,
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  activeText: {
    color: '#F8EBCB',
    fontSize: 10,
    fontWeight: '900',
  },

  placeText: {
    color: '#9A7939',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
  },

  bigThreeRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginHorizontal: -4,
  },

  miniPoint: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
  },

  miniSymbol: {
    color: COLORS.purple,
    fontSize: 24,
    fontWeight: '900',
  },

  miniLabel: {
    color: '#9A7939',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 4,
  },

  miniSign: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'capitalize',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 13,
  },

  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    backgroundColor: '#F6EFE7',
    borderRadius: 14,
    marginRight: 8,
  },

  secondaryText: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '900',
  },

  primaryButton: {
    flex: 1.25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    backgroundColor: COLORS.gold,
    borderRadius: 14,
  },

  primaryText: {
    color: COLORS.night,
    fontSize: 12,
    fontWeight: '900',
  },
});
