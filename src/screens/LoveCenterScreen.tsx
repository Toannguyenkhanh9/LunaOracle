import React, {
  useCallback,
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
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import LunaShareButton
  from '../components/LunaShareButton';

import {
  buildLoveCenter,
  formatLoveSignature,
  type LoveCenterResult,
} from '../services/loveCenter';

import {
  getZodiacSymbol,
} from '../services/astroBirthChart';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function LoveCenterScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    result,
    setResult,
  ] =
    useState<LoveCenterResult | undefined>();

  const load = useCallback(
    async () => {
      setResult(
        await buildLoveCenter(),
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

  if (!result) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            {t(
              'common.loading',
              {
                defaultValue:
                  'Loading...',
              },
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaLoveCenter.eyebrow',
            {
              defaultValue:
                'Love Center',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'lunaLoveCenter.title',
            {
              defaultValue:
                'Love Center',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'lunaLoveCenter.subtitle',
            {
              defaultValue:
                'Daily love insight, compatibility, relationship tarot, and Venus-Mars reflection in one place.',
            },
          )}
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>
            {t(
              'lunaLoveCenter.dailyScore',
              {
                defaultValue:
                  'Love energy',
              },
            )}
          </Text>

          <Text style={styles.score}>
            {result.loveScore}
          </Text>

          <Text style={styles.signature}>
            {formatLoveSignature(
              result,
            ) ||
              t(
                'lunaLoveCenter.noProfile',
                {
                  defaultValue:
                    'Add a birth profile to personalize love insights.',
                },
              )}
          </Text>

          <Text style={styles.themeText}>
            {t(
              `lunaLoveCenter.themes.${result.dailyThemeId}`,
              {
                defaultValue:
                  'Choose honesty, warmth, and self-respect today.',
              },
            )}
          </Text>
        </View>

        <View style={styles.actionGrid}>
          <ActionCard
            icon="♡"
            title={t(
              'lunaLoveCenter.actions.compatibility',
              {
                defaultValue:
                  'Profile Compatibility',
              },
            )}
            subtitle={t(
              'lunaLoveCenter.actions.compatibilitySub',
              {
                defaultValue:
                  'Compare two birth profiles with synastry.',
              },
            )}
            onPress={() =>
              navigation.navigate(
                'ProfileCompatibility',
              )
            }
          />

          <ActionCard
            icon="✦"
            title={t(
              'lunaLoveCenter.actions.relationshipTarot',
              {
                defaultValue:
                  'Relationship Tarot',
              },
            )}
            subtitle={t(
              'lunaLoveCenter.actions.relationshipTarotSub',
              {
                defaultValue:
                  'Use a deeper spread for love questions.',
              },
            )}
            onPress={() =>
              navigation.navigate(
                'AdvancedTarotSpread',
                {
                  spreadId:
                    'relationship',
                },
              )
            }
          />

          <ActionCard
            icon="♀"
            title={t(
              'lunaLoveCenter.actions.venus',
              {
                defaultValue:
                  'Venus & Mars',
              },
            )}
            subtitle={t(
              'lunaLoveCenter.actions.venusSub',
              {
                defaultValue:
                  'Review attraction, affection, and desire style.',
              },
            )}
            onPress={() =>
              navigation.navigate(
                'BirthChartWheel',
              )
            }
          />

          <ActionCard
            icon="✎"
            title={t(
              'lunaLoveCenter.actions.journal',
              {
                defaultValue:
                  'Love Journal',
              },
            )}
            subtitle={t(
              'lunaLoveCenter.actions.journalSub',
              {
                defaultValue:
                  'Save reflections and recurring relationship themes.',
              },
            )}
            onPress={() =>
              navigation.navigate(
                'AdvancedTarotJournal',
                {
                  tag:
                    'love',
                },
              )
            }
          />
        </View>

        {result.partnerPreview ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'lunaLoveCenter.partnerPreview',
                {
                  defaultValue:
                    'Partner preview',
                },
              )}
            </Text>

            <View style={styles.partnerRow}>
              <View>
                <Text style={styles.partnerName}>
                  {
                    result.partnerPreview.partner
                      .name
                  }
                </Text>

                <Text style={styles.partnerMeta}>
                  {t(
                    'lunaLoveCenter.compatibilityHint',
                    {
                      defaultValue:
                        'Quick love compatibility score',
                    },
                  )}
                </Text>
              </View>

              <Text style={styles.partnerScore}>
                {result.partnerPreview.score}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'lunaLoveCenter.addPartnerTitle',
                {
                  defaultValue:
                    'Add another profile',
                },
              )}
            </Text>

            <Text style={styles.sectionText}>
              {t(
                'lunaLoveCenter.addPartnerText',
                {
                  defaultValue:
                    'Create a second birth profile to unlock partner preview and deeper love compatibility.',
                },
              )}
            </Text>

            <Pressable
              style={styles.profileButton}
              onPress={() =>
                navigation.navigate(
                  'BirthProfiles',
                )
              }>
              <Text style={styles.profileButtonText}>
                {t(
                  'lunaLoveCenter.openProfiles',
                  {
                    defaultValue:
                      'Open Profiles',
                  },
                )}
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'lunaLoveCenter.todayFocus',
              {
                defaultValue:
                  'Today’s love focus',
              },
            )}
          </Text>

          <FocusRow
            label="Venus"
            sign={result.venusSign}
            fallback={t(
              'lunaLoveCenter.venusFallback',
              {
                defaultValue:
                  'Affection and values',
              },
            )}
          />

          <FocusRow
            label="Mars"
            sign={result.marsSign}
            fallback={t(
              'lunaLoveCenter.marsFallback',
              {
                defaultValue:
                  'Desire and action',
              },
            )}
          />

          <FocusRow
            label="Moon"
            sign={result.moonSign}
            fallback={t(
              'lunaLoveCenter.moonFallback',
              {
                defaultValue:
                  'Emotional needs',
              },
            )}
          />
        </View>

        <LunaShareButton
          data={{
            variant: 'love',
            title:
              t(
                'lunaLoveCenter.title',
                {
                  defaultValue:
                    'Love Center',
                },
              ),
            subtitle:
              formatLoveSignature(result) ||
              t(
                'lunaLoveCenter.todayFocus',
                {
                  defaultValue:
                    'Today’s love focus',
                },
              ),
            message:
              t(
                `lunaLoveCenter.themes.${result.dailyThemeId}`,
                {
                  defaultValue:
                    'Choose honesty, warmth, and self-respect today.',
                },
              ),
            score:
              result.loveScore,
            badge: 'LOVE',
            tags: [
              'love',
              'venus',
              'luna',
            ],
          }}
        />

        <Text style={styles.notice}>
          {t(
            'lunaLoveCenter.notice',
            {
              defaultValue:
                'Love insights are for reflection and communication, not certainty or control.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
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

      <Text style={styles.actionSubtitle}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

function FocusRow({
  label,
  sign,
  fallback,
}: {
  label: string;
  sign?: string;
  fallback: string;
}) {
  const {t} =
    useTranslation();

  return (
    <View style={styles.focusRow}>
      <Text style={styles.focusLabel}>
        {label}
      </Text>

      <Text style={styles.focusValue}>
        {sign
          ? `${getZodiacSymbol(sign as never)} ${t(
              `western.signs.${sign}`,
              {
                defaultValue:
                  sign,
              },
            )}`
          : fallback}
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
  rose: '#A74372',
  text: '#282236',
  muted: '#756D7D',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.muted,
    fontWeight: '800',
  },
  content: {
    padding: 18,
    paddingBottom: 110,
  },
  eyebrow: {
    color: COLORS.rose,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 5,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  heroCard: {
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 16,
  },
  heroLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  score: {
    color: '#FFF8EA',
    fontSize: 62,
    fontWeight: '900',
    marginTop: 4,
  },
  signature: {
    color: '#DCD2F3',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  themeText: {
    color: '#F8EBCB',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '800',
    marginTop: 13,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginTop: 14,
  },
  actionCard: {
    width: '50%',
    padding: 5,
  },
  actionIcon: {
    color: COLORS.rose,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: COLORS.paper,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.border,
    paddingTop: 14,
  },
  actionTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: COLORS.paper,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 9,
    paddingTop: 7,
  },
  actionSubtitle: {
    minHeight: 58,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    backgroundColor: COLORS.paper,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.border,
    paddingHorizontal: 9,
    paddingTop: 5,
    paddingBottom: 12,
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
    color: COLORS.rose,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  sectionText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  partnerMeta: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  partnerScore: {
    color: COLORS.rose,
    fontSize: 35,
    fontWeight: '900',
  },
  profileButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.night,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
  },
  profileButtonText: {
    color: '#F8EBCB',
    fontSize: 11,
    fontWeight: '900',
  },
  focusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F2EA',
    borderRadius: 15,
    padding: 12,
    marginBottom: 8,
  },
  focusLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },
  focusValue: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 15,
  },
  pressed: {
    opacity: 0.76,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
});
