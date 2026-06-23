import React, {
  useMemo,
  useState,
} from 'react';

import {
  Alert,
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

import {
  ADVANCED_TAROT_SPREADS,
  drawAdvancedTarotSpread,
  type AdvancedTarotSpreadId,
} from '../services/advancedTarotSpreads';

import {
  saveTarotJournalEntry,
} from '../services/tarotJournal';

import {
  translateTarotCardAdvice,
  translateTarotCardMeaning,
  translateTarotCardName,
} from '../utils/lunaContentLocalization';

import TarotCardImage
  from '../components/TarotCardImage';

const SPREAD_IDS:
  AdvancedTarotSpreadId[] = [
    'fiveCardPath',
    'relationship',
    'celticCross',
  ];

export default function AdvancedTarotSpreadScreen() {
  const {t} =
    useTranslation();

  const [
    spreadId,
    setSpreadId,
  ] =
    useState<AdvancedTarotSpreadId>(
      'fiveCardPath',
    );

  const [seed, setSeed] =
    useState(`${Date.now()}`);

  const [question, setQuestion] =
    useState('');

  const [note, setNote] =
    useState('');

  const cards =
    useMemo(
      () =>
        drawAdvancedTarotSpread(
          spreadId,
          seed,
        ),
      [
        spreadId,
        seed,
      ],
    );

  const drawAgain = () => {
    setSeed(`${Date.now()}`);
  };

  const saveReading =
    async () => {
      try {
        await saveTarotJournalEntry({
          title:
            t(
              `lunaAdvanced.tarot.spreads.${spreadId}.title`,
              {
                defaultValue:
                  ADVANCED_TAROT_SPREADS[
                    spreadId
                  ].id,
              },
            ),
          question:
            question.trim() ||
            undefined,
          spread:
            spreadId,
          cards,
          note:
            note.trim() ||
            undefined,
        } as never);

        Alert.alert(
          t(
            'western.tarot.savedTitle',
            {
              defaultValue:
                'Saved',
            },
          ),
          t(
            'western.tarot.savedMessage',
            {
              defaultValue:
                'Your tarot reading was saved to the journal.',
            },
          ),
        );
      } catch (error) {
        console.warn(
          'Unable to save advanced tarot:',
          error,
        );

        Alert.alert(
          t(
            'western.tarot.saveErrorTitle',
            {
              defaultValue:
                'Unable to save',
            },
          ),
          t(
            'western.tarot.saveErrorMessage',
            {
              defaultValue:
                'Please try again.',
            },
          ),
        );
      }
    };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaAdvanced.tarot.eyebrow',
            {
              defaultValue:
                'Advanced Tarot',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'lunaAdvanced.tarot.title',
            {
              defaultValue:
                'Deep Tarot Spreads',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'lunaAdvanced.tarot.subtitle',
            {
              defaultValue:
                'Use multi-card spreads for love, direction, shadow work, and long-form reflection.',
            },
          )}
        </Text>

        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder={t(
            'western.tarot.questionPlaceholder',
            {
              defaultValue:
                'Optional question...',
            },
          )}
          placeholderTextColor="#A99DAF"
          style={styles.questionInput}
        />

        <View style={styles.spreadGrid}>
          {SPREAD_IDS.map(id => (
            <Pressable
              key={id}
              style={[
                styles.spreadButton,
                spreadId === id &&
                  styles.spreadButtonActive,
              ]}
              onPress={() =>
                setSpreadId(id)
              }>
              <Text
                style={[
                  styles.spreadTitle,
                  spreadId === id &&
                    styles.spreadTitleActive,
                ]}>
                {t(
                  `lunaAdvanced.tarot.spreads.${id}.title`,
                  {
                    defaultValue:
                      id,
                  },
                )}
              </Text>

              <Text
                style={[
                  styles.spreadSubtitle,
                  spreadId === id &&
                    styles.spreadSubtitleActive,
                ]}>
                {t(
                  'lunaAdvanced.tarot.cardCount',
                  {
                    count:
                      ADVANCED_TAROT_SPREADS[
                        id
                      ].cardCount,
                    defaultValue:
                      `${ADVANCED_TAROT_SPREADS[id].cardCount} cards`,
                  },
                )}
              </Text>
            </Pressable>
          ))}
        </View>

        {cards.map(draw => (
          <View
            key={`${draw.position}-${draw.card.id}`}
            style={styles.card}>
            <TarotCardImage
              cardId={
                draw.card.id ??
                draw.card.name
              }
              title={
                translateTarotCardName(
                  t,
                  draw.card,
                )
              }
              roman={draw.card.number}
              reversed={
                draw.orientation ===
                'reversed'
              }
              width={96}
              height={152}
            />

            <View style={styles.cardCopy}>
              <Text style={styles.position}>
                {t(
                  `lunaAdvanced.tarot.positions.${draw.position}`,
                  {
                    defaultValue:
                      draw.position,
                  },
                )}
              </Text>

              <Text style={styles.cardName}>
                {translateTarotCardName(
                  t,
                  draw.card,
                )}
              </Text>

              <Text style={styles.orientation}>
                {t(
                  `western.tarot.orientations.${draw.orientation}`,
                  {
                    defaultValue:
                      draw.orientation,
                  },
                )}
              </Text>

              <Text style={styles.meaning}>
                {translateTarotCardMeaning(
                  t,
                  draw.card,
                  draw.orientation,
                )}
              </Text>

              <Text style={styles.advice}>
                {t('western.tarot.advice', {
                  defaultValue: 'Advice',
                })}
                :{' '}
                {translateTarotCardAdvice(
                  t,
                  draw.card,
                )}
              </Text>
            </View>
          </View>
        ))}

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={t(
            'western.tarot.notePlaceholder',
            {
              defaultValue:
                'Optional note for your journal...',
            },
          )}
          placeholderTextColor="#A99DAF"
          multiline
          style={styles.noteInput}
        />

        <View style={styles.actionRow}>
          <Pressable
            style={styles.drawButton}
            onPress={drawAgain}>
            <Text style={styles.drawText}>
              {t('western.tarot.drawAgain', {
                defaultValue: 'Draw Again',
              })}
            </Text>
          </Pressable>

          <Pressable
            style={styles.saveButton}
            onPress={saveReading}>
            <Text style={styles.saveText}>
              {t('western.tarot.saveReading', {
                defaultValue: 'Save Reading',
              })}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.notice}>
          {t('western.tarot.notice', {
            defaultValue:
              'Tarot content is for reflection and self-awareness. It should not replace professional advice.',
          })}
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
    fontWeight: '900',
    marginTop: 5,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  questionInput: {
    minHeight: 50,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 15,
    marginTop: 16,
  },
  spreadGrid: {
    marginTop: 14,
  },
  spreadButton: {
    backgroundColor: '#EEE6F4',
    borderRadius: 18,
    padding: 14,
    marginBottom: 9,
  },
  spreadButtonActive: {
    backgroundColor: COLORS.night,
  },
  spreadTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },
  spreadTitleActive: {
    color: '#F8EBCB',
  },
  spreadSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  spreadSubtitleActive: {
    color: '#DCD2F3',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 14,
    marginTop: 14,
  },
  cardCopy: {
    flex: 1,
    marginLeft: 14,
  },
  position: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardName: {
    color: COLORS.text,
    fontSize: 18,
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
  meaning: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  advice: {
    color: '#4D405E',
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 8,
  },
  noteInput: {
    minHeight: 86,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    color: COLORS.text,
    fontSize: 13,
    textAlignVertical: 'top',
    padding: 14,
    marginTop: 14,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  drawButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: COLORS.gold,
    borderRadius: 17,
    marginRight: 8,
  },
  drawText: {
    color: COLORS.night,
    fontSize: 13,
    fontWeight: '900',
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: COLORS.night,
    borderRadius: 17,
    marginLeft: 8,
  },
  saveText: {
    color: '#F8EBCB',
    fontSize: 13,
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
