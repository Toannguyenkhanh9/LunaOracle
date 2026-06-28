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

import AnimatedTarotCard
  from '../components/AnimatedTarotCard';

import LunaShareButton
  from '../components/LunaShareButton';

import {
  buildLoveModeAdvanced,
  type LoveModeAdvancedResult,
} from '../services/loveModeAdvanced';

import {
  formatLoveSignature,
} from '../services/loveCenter';

import {
  recordOracleActivity,
} from '../services/oracleEngagement';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
};

export default function LoveModeAdvancedScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    result,
    setResult,
  ] =
    useState<LoveModeAdvancedResult | undefined>();

  const load = useCallback(
    async () => {
      setResult(
        await buildLoveModeAdvanced(),
      );

      recordOracleActivity('loveMode').catch(error => {
        console.warn(
          'Unable to record love mode activity:',
          error,
        );
      });
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
            {t('common.loading', {
              defaultValue: 'Loading...',
            })}
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
            'loveMode.eyebrow',
            {
              defaultValue:
                'Love Mode',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'loveMode.title',
            {
              defaultValue:
                'Advanced Love Center',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'loveMode.subtitle',
            {
              defaultValue:
                'A deeper relationship reading with Venus, Mars, Moon, tarot, and reflection prompts.',
            },
          )}
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.loveOrb}>
            <Text style={styles.loveScore}>
              {result.love.loveScore}
            </Text>

            <Text style={styles.loveLabel}>
              LOVE
            </Text>
          </View>

          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>
              {t(
                `loveMode.languages.${result.loveLanguageId}`,
                {
                  defaultValue:
                    'Love language focus',
                },
              )}
            </Text>

            <Text style={styles.heroSubtitle}>
              {formatLoveSignature(
                result.love,
              )}
            </Text>
          </View>
        </View>

        <View style={styles.tarotSection}>
          <View style={styles.tarotText}>
            <Text style={styles.sectionTitle}>
              {t(
                'loveMode.loveCard',
                {
                  defaultValue:
                    'Relationship card',
                },
              )}
            </Text>

            <Text style={styles.promptText}>
              {result.tarot.orientation ===
              'reversed'
                ? result.tarot.card.reversed
                : result.tarot.card.upright}
            </Text>
          </View>

          <AnimatedTarotCard
            draw={result.tarot}
            width={88}
            height={140}
            autoReveal
            resetKey={
              result.tarot.card.id
            }
          />
        </View>

        <PromptCard
          label={t(
            'loveMode.conversation',
            {
              defaultValue:
                'Conversation',
            },
          )}
          text={t(
            `loveMode.conversationPrompts.${result.conversationPromptId}`,
            {
              defaultValue:
                'Ask what each person needs more of this week.',
            },
          )}
        />

        <PromptCard
          label={t(
            'loveMode.healing',
            {
              defaultValue:
                'Healing',
            },
          )}
          text={t(
            `loveMode.healingPrompts.${result.healingPromptId}`,
            {
              defaultValue:
                'Name what you are ready to release before asking for more.',
            },
          )}
        />

        <View style={styles.flagRow}>
          <FlagCard
            label={t(
              'loveMode.greenFlag',
              {
                defaultValue:
                  'Green flag',
              },
            )}
            text={t(
              `loveMode.greenFlags.${result.greenFlagId}`,
              {
                defaultValue:
                  'Consistency',
              },
            )}
          />

          <FlagCard
            label={t(
              'loveMode.redFlag',
              {
                defaultValue:
                  'Red flag',
              },
            )}
            text={t(
              `loveMode.redFlags.${result.redFlagId}`,
              {
                defaultValue:
                  'Pressure',
              },
            )}
          />
        </View>

        <PromptCard
          label={t(
            'loveMode.dateIdea',
            {
              defaultValue:
                'Date idea',
            },
          )}
          text={t(
            `loveMode.dateIdeas.${result.dateIdeaId}`,
            {
              defaultValue:
                'Take a slow walk and ask one honest question.',
            },
          )}
        />

        <View style={styles.actionRow}>
          <Pressable
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate(
                'ProfileCompatibility',
              )
            }>
            <Text style={styles.actionButtonText}>
              {t(
                'loveMode.compatibility',
                {
                  defaultValue:
                    'Compatibility',
                },
              )}
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={load}>
            <Text style={styles.actionButtonText}>
              {t(
                'loveMode.refresh',
                {
                  defaultValue:
                    'Refresh',
                },
              )}
            </Text>
          </Pressable>
        </View>

        <LunaShareButton
          data={{
            variant: 'love',
            title:
              t(
                'loveMode.title',
                {
                  defaultValue:
                    'Advanced Love Center',
                },
              ),
            subtitle:
              formatLoveSignature(
                result.love,
              ),
            message:
              t(
                `loveMode.conversationPrompts.${result.conversationPromptId}`,
                {
                  defaultValue:
                    'Ask what each person needs more of this week.',
                },
              ),
            score:
              result.love.loveScore,
            cardId:
              result.tarot.card.id ??
              result.tarot.card.name,
            cardName:
              result.tarot.card.name,
            reversed:
              result.tarot.orientation ===
              'reversed',
            badge: 'LOVE',
            tags: [
              'love',
              'venus',
              'tarot',
            ],
          }}
        />

        <Text style={styles.notice}>
          {t(
            'loveMode.notice',
            {
              defaultValue:
                'Love Mode is for reflection and communication, not certainty or control.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PromptCard({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <View style={styles.promptCard}>
      <Text style={styles.promptLabel}>
        {label}
      </Text>

      <Text style={styles.promptText}>
        {text}
      </Text>
    </View>
  );
}

function FlagCard({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <View style={styles.flagCard}>
      <Text style={styles.flagLabel}>
        {label}
      </Text>

      <Text style={styles.flagText}>
        {text}
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
  rose: '#B7477C',
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
    fontSize: 30,
    lineHeight: 35,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 18,
    marginTop: 16,
  },

  loveOrb: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232,165,195,0.16)',
    borderWidth: 1,
    borderColor: '#E8A5C3',
    borderRadius: 52,
  },

  loveScore: {
    color: '#FFF8EA',
    fontSize: 42,
    fontWeight: '900',
  },

  loveLabel: {
    color: '#E8A5C3',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  heroText: {
    flex: 1,
    marginLeft: 16,
  },

  heroTitle: {
    color: '#FFF8EA',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
  },

  heroSubtitle: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 6,
  },

  tarotSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },

  tarotText: {
    flex: 1,
    paddingRight: 12,
  },

  sectionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },

  promptCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 15,
    marginTop: 12,
  },

  promptLabel: {
    color: COLORS.rose,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  promptText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 6,
  },

  flagRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 12,
  },

  flagCard: {
    flex: 1,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 5,
  },

  flagLabel: {
    color: COLORS.rose,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  flagText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '900',
    marginTop: 7,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 16,
    paddingVertical: 13,
    marginHorizontal: 4,
  },

  actionButtonText: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '900',
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
