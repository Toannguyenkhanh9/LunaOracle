import React, {
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import AnimatedTarotCard
  from '../components/AnimatedTarotCard';

import LunaShareButton
  from '../components/LunaShareButton';

import {
  askOracle,
  getOracleCardMessage,
  type OracleAnswer,
} from '../services/askOracle';

import {
  recordOracleActivity,
} from '../services/oracleEngagement';

const SUGGESTED_QUESTIONS = [
  'What should I focus on today?',
  'What is the energy of this relationship?',
  'What should I release?',
  'What will help my career now?',
];

export default function AskOracleScreen() {
  const {t} =
    useTranslation();

  const [
    question,
    setQuestion,
  ] =
    useState('');

  const [
    answer,
    setAnswer,
  ] =
    useState<OracleAnswer | undefined>();

  const [
    isLoading,
    setLoading,
  ] =
    useState(false);

  const submit =
    async (
      nextQuestion = question,
    ) => {
      setLoading(true);

      try {
        const nextAnswer =
          await askOracle(
            nextQuestion,
          );

        setAnswer(nextAnswer);

        recordOracleActivity('askOracle').catch(error => {
          console.warn(
            'Unable to record ask oracle activity:',
            error,
          );
        });
      } finally {
        setLoading(false);
      }
    };

  const cardMessage =
    answer
      ? getOracleCardMessage(answer)
      : '';

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'askOracle.eyebrow',
            {
              defaultValue:
                'Oracle',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'askOracle.title',
            {
              defaultValue:
                'Ask the Oracle',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'askOracle.subtitle',
            {
              defaultValue:
                'Ask a calm question. Luna Oracle will draw a card and create a reflective message.',
            },
          )}
        </Text>

        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder={t(
            'askOracle.placeholder',
            {
              defaultValue:
                'Type your question...',
            },
          )}
          placeholderTextColor="#A99DAF"
          multiline
          style={styles.input}
        />

        <View style={styles.suggestionWrap}>
          {SUGGESTED_QUESTIONS.map(item => (
            <Pressable
              key={item}
              style={styles.suggestion}
              onPress={() => {
                setQuestion(item);
                void submit(item);
              }}>
              <Text style={styles.suggestionText}>
                {t(
                  `askOracle.suggestions.${item}`,
                  {
                    defaultValue:
                      item,
                  },
                )}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.askButton}
          disabled={isLoading}
          onPress={() =>
            submit()
          }>
          {isLoading ? (
            <ActivityIndicator
              color="#1B1537"
            />
          ) : (
            <Text style={styles.askText}>
              {t(
                'askOracle.askButton',
                {
                  defaultValue:
                    'Ask Oracle',
                },
              )}
            </Text>
          )}
        </Pressable>

        {answer ? (
          <View style={styles.answerCard}>
            <View style={styles.answerTop}>
              <View style={styles.answerCopy}>
                <Text style={styles.answerEyebrow}>
                  {t(
                    answer.titleId,
                    {
                      defaultValue:
                        'Oracle Message',
                    },
                  )}
                </Text>

                <Text style={styles.answerTitle}>
                  {answer.draw.card.name}
                </Text>

                <Text style={styles.orientation}>
                  {t(
                    `western.tarot.orientations.${answer.draw.orientation}`,
                    {
                      defaultValue:
                        answer.draw.orientation,
                    },
                  )}
                </Text>
              </View>

              <AnimatedTarotCard
                draw={answer.draw}
                width={88}
                height={140}
                autoReveal
                resetKey={answer.seed}
              />
            </View>

            <Text style={styles.message}>
              {t(
                answer.messageId,
                {
                  card:
                    answer.draw.card.name,
                  cardMessage,
                  question:
                    answer.question,
                  defaultValue:
                    `${cardMessage}`,
                },
              )}
            </Text>

            <View style={styles.promptBox}>
              <Text style={styles.promptLabel}>
                {t(
                  'askOracle.actionLabel',
                  {
                    defaultValue:
                      'Action',
                  },
                )}
              </Text>

              <Text style={styles.promptText}>
                {t(
                  answer.actionId,
                  {
                    defaultValue:
                      answer.draw.card.advice,
                  },
                )}
              </Text>
            </View>

            <View style={styles.promptBox}>
              <Text style={styles.promptLabel}>
                {t(
                  'askOracle.cautionLabel',
                  {
                    defaultValue:
                      'Remember',
                  },
                )}
              </Text>

              <Text style={styles.promptText}>
                {t(
                  answer.cautionId,
                  {
                    defaultValue:
                      'Use this reading as reflection, not certainty.',
                  },
                )}
              </Text>
            </View>

            <LunaShareButton
              data={{
                variant: 'tarot',
                title:
                  answer.draw.card.name,
                subtitle:
                  t(
                    'askOracle.title',
                    {
                      defaultValue:
                        'Ask the Oracle',
                    },
                  ),
                message:
                  cardMessage,
                cardId:
                  answer.draw.card.id ??
                  answer.draw.card.name,
                cardName:
                  answer.draw.card.name,
                reversed:
                  answer.draw.orientation ===
                  'reversed',
                badge: 'ORACLE',
                tags: [
                  'oracle',
                  answer.intent,
                  'luna',
                ],
              }}
            />
          </View>
        ) : null}

        <Text style={styles.notice}>
          {t(
            'askOracle.notice',
            {
              defaultValue:
                'Ask the Oracle is for reflection and self-awareness. It should not replace professional advice.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
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

  input: {
    minHeight: 96,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    color: COLORS.text,
    fontSize: 14,
    textAlignVertical: 'top',
    padding: 14,
    marginTop: 16,
  },

  suggestionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 12,
  },

  suggestion: {
    backgroundColor: '#EEE6F4',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  suggestionText: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '900',
  },

  askButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    backgroundColor: COLORS.gold,
    borderRadius: 18,
    marginTop: 8,
  },

  askText: {
    color: COLORS.night,
    fontSize: 14,
    fontWeight: '900',
  },

  answerCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 26,
    padding: 15,
    marginTop: 16,
  },

  answerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  answerCopy: {
    flex: 1,
    paddingRight: 12,
  },

  answerEyebrow: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  answerTitle: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    marginTop: 5,
  },

  orientation: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'capitalize',
  },

  message: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '800',
    marginTop: 14,
  },

  promptBox: {
    backgroundColor: '#F7F2EA',
    borderRadius: 18,
    padding: 12,
    marginTop: 11,
  },

  promptLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  promptText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 5,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 15,
  },
});
