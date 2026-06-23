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
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  buildProfileCompatibility,
  type ProfileCompatibilityResult,
} from '../services/profileCompatibility';

import {
  listBirthProfiles,
  type BirthProfile,
} from '../services/birthProfiles';

import {
  getChartPointLabel,
  getZodiacSymbol,
} from '../services/astroBirthChart';

export default function ProfileCompatibilityScreen() {
  const {t} =
    useTranslation();

  const [
    profiles,
    setProfiles,
  ] =
    useState<BirthProfile[]>([]);

  const [
    firstId,
    setFirstId,
  ] =
    useState<string | undefined>();

  const [
    secondId,
    setSecondId,
  ] =
    useState<string | undefined>();

  const load = useCallback(
    async () => {
      const state =
        await listBirthProfiles();

      setProfiles(
        state.profiles,
      );

      setFirstId(
        current =>
          current ??
          state.profiles[0]?.id,
      );

      setSecondId(
        current =>
          current ??
          state.profiles[1]?.id,
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

  const first =
    profiles.find(
      item =>
        item.id === firstId,
    );

  const second =
    profiles.find(
      item =>
        item.id === secondId,
    );

  const result:
    ProfileCompatibilityResult | undefined =
    useMemo(
      () => {
        if (
          !first ||
          !second ||
          first.id === second.id
        ) {
          return undefined;
        }

        return buildProfileCompatibility(
          first,
          second,
        );
      },
      [
        first,
        second,
      ],
    );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t('lunaAdvanced.compat.eyebrow', {
            defaultValue: 'Compatibility',
          })}
        </Text>

        <Text style={styles.title}>
          {t('lunaAdvanced.compat.title', {
            defaultValue: 'Profile Compatibility',
          })}
        </Text>

        <Text style={styles.subtitle}>
          {t('lunaAdvanced.compat.subtitle', {
            defaultValue:
              'Compare two birth profiles using Sun, Moon, Venus, Mars, Rising, and key synastry aspects.',
          })}
        </Text>

        <View style={styles.selectorCard}>
          <Text style={styles.selectorLabel}>
            {t('lunaAdvanced.compat.firstProfile', {
              defaultValue: 'First profile',
            })}
          </Text>

          <ProfileChips
            profiles={profiles}
            selectedId={firstId}
            onSelect={setFirstId}
          />

          <Text style={styles.selectorLabel}>
            {t('lunaAdvanced.compat.secondProfile', {
              defaultValue: 'Second profile',
            })}
          </Text>

          <ProfileChips
            profiles={profiles}
            selectedId={secondId}
            onSelect={setSecondId}
          />
        </View>

        {!result ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {t('lunaAdvanced.compat.needProfiles', {
                defaultValue:
                  'Add at least two birth profiles',
              })}
            </Text>

            <Text style={styles.emptyText}>
              {t('lunaAdvanced.compat.needProfilesHint', {
                defaultValue:
                  'Create profiles first, then return here to compare them.',
              })}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>
                {result.firstProfile.name} × {result.secondProfile.name}
              </Text>

              <Text style={styles.scoreNumber}>
                {result.totalScore}
              </Text>

              <Text style={styles.scoreText}>
                {t(
                  `lunaAdvanced.compat.scoreMeaning.${
                    result.totalScore >= 75
                      ? 'strong'
                      : result.totalScore >= 58
                        ? 'balanced'
                        : 'growth'
                  }`,
                  {
                    defaultValue:
                      'This connection has meaningful lessons and potential.',
                  },
                )}
              </Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                {t('lunaAdvanced.compat.scoreBreakdown', {
                  defaultValue: 'Score breakdown',
                })}
              </Text>

              <MeterRow
                label={t('lunaAdvanced.compat.love', {
                  defaultValue: 'Love',
                })}
                value={result.loveScore}
              />

              <MeterRow
                label={t('lunaAdvanced.compat.emotional', {
                  defaultValue: 'Emotional',
                })}
                value={result.emotionalScore}
              />

              <MeterRow
                label={t('lunaAdvanced.compat.dailyLife', {
                  defaultValue: 'Daily life',
                })}
                value={result.dailyLifeScore}
              />

              <MeterRow
                label={t('lunaAdvanced.compat.growth', {
                  defaultValue: 'Growth',
                })}
                value={result.growthScore}
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                {t('lunaAdvanced.compat.bigThree', {
                  defaultValue: 'Big three comparison',
                })}
              </Text>

              <CompareRow
                label="Sun"
                firstSign={
                  result.firstChart.points.sun.sign
                }
                secondSign={
                  result.secondChart.points.sun.sign
                }
              />

              <CompareRow
                label="Moon"
                firstSign={
                  result.firstChart.points.moon.sign
                }
                secondSign={
                  result.secondChart.points.moon.sign
                }
              />

              <CompareRow
                label="Rising"
                firstSign={
                  result.firstChart.points.ascendant.sign
                }
                secondSign={
                  result.secondChart.points.ascendant.sign
                }
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                {t('lunaAdvanced.compat.keyAspects', {
                  defaultValue: 'Key synastry aspects',
                })}
              </Text>

              {result.aspects.length === 0 ? (
                <Text style={styles.emptyText}>
                  {t('lunaAdvanced.compat.noAspects', {
                    defaultValue:
                      'No very tight major aspects found. The connection may rely more on conscious choice and daily rhythm.',
                  })}
                </Text>
              ) : (
                result.aspects.map(aspect => (
                  <View
                    key={`${aspect.firstPoint}-${aspect.secondPoint}-${aspect.type}`}
                    style={styles.aspectRow}>
                    <Text style={styles.aspectTitle}>
                      {t(
                        `lunaAdvanced.points.${aspect.firstPoint}`,
                        {
                          defaultValue:
                            getChartPointLabel(
                              aspect.firstPoint,
                            ),
                        },
                      )}{' '}
                      {t(
                        `lunaAdvanced.aspectNames.${aspect.type}`,
                        {
                          defaultValue:
                            aspect.type,
                        },
                      )}{' '}
                      {t(
                        `lunaAdvanced.points.${aspect.secondPoint}`,
                        {
                          defaultValue:
                            getChartPointLabel(
                              aspect.secondPoint,
                            ),
                        },
                      )}
                    </Text>

                    <Text style={styles.aspectMeta}>
                      {t('lunaAdvanced.common.orb', {
                        value: aspect.orb,
                        defaultValue: `orb ${aspect.orb}°`,
                      })}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>
                {t('lunaAdvanced.compat.guidance', {
                  defaultValue: 'Guidance',
                })}
              </Text>

              <TagGroup
                title={t('lunaAdvanced.compat.strengths', {
                  defaultValue: 'Strengths',
                })}
                values={result.strengths}
              />

              <TagGroup
                title={t('lunaAdvanced.compat.challenges', {
                  defaultValue: 'Growth lessons',
                })}
                values={result.challenges}
              />
            </View>
          </>
        )}

        <Text style={styles.notice}>
          {t('lunaAdvanced.common.notice', {
            defaultValue:
              'Astrology content is for reflection and self-awareness only.',
          })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileChips({
  profiles,
  selectedId,
  onSelect,
}: {
  profiles: BirthProfile[];
  selectedId?: string;
  onSelect: (
    id: string,
  ) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}>
      {profiles.map(profile => (
        <Pressable
          key={profile.id}
          style={[
            styles.profileChip,
            selectedId === profile.id &&
              styles.profileChipActive,
          ]}
          onPress={() =>
            onSelect(profile.id)
          }>
          <Text
            style={[
              styles.profileChipText,
              selectedId === profile.id &&
                styles.profileChipTextActive,
            ]}>
            {profile.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function MeterRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.meterRow}>
      <Text style={styles.meterLabel}>
        {label}
      </Text>

      <View style={styles.meterTrack}>
        <View
          style={[
            styles.meterFill,
            {
              width: `${value}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.meterValue}>
        {value}
      </Text>
    </View>
  );
}

function CompareRow({
  label,
  firstSign,
  secondSign,
}: {
  label: string;
  firstSign: string;
  secondSign: string;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.compareRow}>
      <Text style={styles.compareLabel}>
        {label}
      </Text>

      <Text style={styles.compareValue}>
        {getZodiacSymbol(firstSign as never)}{' '}
        {t(`western.signs.${firstSign}`, {
          defaultValue: firstSign,
        })}
      </Text>

      <Text style={styles.compareDivider}>
        ×
      </Text>

      <Text style={styles.compareValue}>
        {getZodiacSymbol(secondSign as never)}{' '}
        {t(`western.signs.${secondSign}`, {
          defaultValue: secondSign,
        })}
      </Text>
    </View>
  );
}

function TagGroup({
  title,
  values,
}: {
  title: string;
  values: string[];
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.tagGroup}>
      <Text style={styles.tagTitle}>
        {title}
      </Text>

      <View style={styles.tags}>
        {values.map(value => (
          <View
            key={value}
            style={styles.tag}>
            <Text style={styles.tagText}>
              {t(
                `lunaAdvanced.compat.tags.${value}`,
                {
                  defaultValue:
                    value,
                },
              )}
            </Text>
          </View>
        ))}
      </View>
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
  selectorCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 14,
    marginTop: 16,
  },
  selectorLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  chipRow: {
    paddingBottom: 12,
  },
  profileChip: {
    backgroundColor: '#EEE6F4',
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 8,
  },
  profileChipActive: {
    backgroundColor: COLORS.night,
  },
  profileChipText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  profileChipTextActive: {
    color: '#F8EBCB',
  },
  emptyCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 20,
    marginTop: 14,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 20,
    marginTop: 16,
  },
  scoreLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  scoreNumber: {
    color: '#FFF8EA',
    fontSize: 58,
    fontWeight: '900',
    marginTop: 6,
  },
  scoreText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
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
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  meterLabel: {
    width: 82,
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
  },
  meterTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEE6F4',
    borderRadius: 99,
    overflow: 'hidden',
  },
  meterFill: {
    height: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 99,
  },
  meterValue: {
    width: 34,
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
  },
  compareRow: {
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  compareLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  compareValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  compareDivider: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  aspectRow: {
    backgroundColor: '#F7F2EA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  aspectTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  aspectMeta: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },
  tagGroup: {
    marginBottom: 10,
  },
  tagTitle: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 7,
    marginBottom: 7,
  },
  tagText: {
    color: '#4D405E',
    fontSize: 11,
    fontWeight: '900',
  },
  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
