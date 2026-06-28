import React, {
  useEffect,
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

import LunaShareButton
  from '../components/LunaShareButton';

import {
  drawTarotCards,
  type TarotDraw,
} from '../services/tarot';

import {
  recordTarotDraws,
} from '../services/tarotCollection';

import {
  saveTarotJournalEntry,
} from '../services/tarotJournal';

import TarotPremiumGate
  from '../components/TarotPremiumGate';

import AnimatedTarotDraw
  from '../components/AnimatedTarotDraw';

import {
  translateTarotCardAdvice,
  translateTarotCardMeaning,
  translateTarotCardName,
} from '../utils/lunaContentLocalization';
// import {
//   recordOracleActivity,
// } from '../services/oracleEngagement';

type Spread =
  | 1
  | 3;

export default function TarotReadingScreen() {
  const {t} =
    useTranslation();

  const [spread, setSpread] =
    useState<Spread>(1);

  const [seed, setSeed] =
    useState(
      `${Date.now()}`,
    );

  const [question, setQuestion] =
    useState('');

  const [note, setNote] =
    useState('');

  const cards =
    useMemo(
      () =>
        drawTarotCards(
          spread,
          seed,
        ),
      [spread, seed],
    );


  useEffect(
    () => {
      void recordTarotDraws(cards);
    },
    [cards],
  );

  const drawAgain = () => {
    setSeed(`${Date.now()}`);
  };

  const saveReading =
    async (
      savedCards: TarotDraw[],
    ) => {
      try {
        await saveTarotJournalEntry({
          title:
            spread === 1
              ? t(
                  'western.tarot.oneCard',
                  {
                    defaultValue:
                      '1 Card',
                  },
                )
              : t(
                  'western.tarot.threeCards',
                  {
                    defaultValue:
                      '3 Cards',
                  },
                ),
          question:
            question.trim() ||
            undefined,
          spread:
            spread === 1
              ? 'oneCard'
              : 'threeCard',
          cards:
            savedCards,
          note:
            note.trim() ||
            undefined,
        });

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
          'Unable to save tarot reading:',
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

  const readingContent = (
    <View>
      <AnimatedTarotDraw
        draws={cards}
        resetKey={seed}
        cardWidth={96}
        cardHeight={152}
        drawButtonLabel={t(
          'lunaTarotAnimation.draw',
          {
            defaultValue:
              'Draw Cards',
          },
        )}
        renderDetails={draw => (
          <TarotCardDetails
            draw={draw}
          />
        )}
      />

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
            {t(
              'western.tarot.drawAgain',
              {
                defaultValue:
                  'Draw Again',
              },
            )}
          </Text>
        </Pressable>

        <Pressable
          style={styles.saveButton}
          onPress={() =>
            saveReading(cards)
          }>
          <Text style={styles.saveText}>
            {t(
              'western.tarot.saveReading',
              {
                defaultValue:
                  'Save Reading',
              },
            )}
          </Text>
        </Pressable>
      </View>

      <LunaShareButton
        data={{
          variant: 'tarot',
          title:
            cards[0]?.card.name ??
            t(
              'western.tarot.title',
              {
                defaultValue:
                  'Tarot Reading',
              },
            ),
          subtitle:
            spread === 1
              ? t(
                  'western.tarot.oneCard',
                  {
                    defaultValue:
                      '1 Card',
                  },
                )
              : t(
                  'western.tarot.threeCards',
                  {
                    defaultValue:
                      '3 Cards',
                  },
                ),
          message:
            cards[0]
              ? translateTarotCardMeaning(
                  t,
                  cards[0].card,
                  cards[0].orientation,
                )
              : t(
                  'western.tarot.subtitle',
                  {
                    defaultValue:
                      'A reflective tarot reading from Luna Oracle.',
                  },
                ),
          cardId:
            cards[0]?.card.id ??
            cards[0]?.card.name,
          cardName:
            cards[0]?.card.name,
          reversed:
            cards[0]?.orientation ===
            'reversed',
          badge: 'TAROT',
          tags: [
            'tarot',
            'luna',
            spread === 1
              ? 'daily'
              : 'spread',
          ],
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'western.tarot.eyebrow',
            {
              defaultValue:
                'Tarot',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'western.tarot.title',
            {
              defaultValue:
                'Reflective Reading',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'western.tarot.subtitle',
            {
              defaultValue:
                'Ask a calm question, draw the cards, and save meaningful readings to your journal.',
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

        <View style={styles.switchRow}>
          <Pressable
            style={[
              styles.switchButton,
              spread === 1 &&
                styles.switchActive,
            ]}
            onPress={() =>
              setSpread(1)
            }>
            <Text
              style={[
                styles.switchText,
                spread === 1 &&
                  styles.switchTextActive,
              ]}>
              {t(
                'western.tarot.oneCard',
                {
                  defaultValue:
                    '1 Card',
                },
              )}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.switchButton,
              spread === 3 &&
                styles.switchActive,
            ]}
            onPress={() =>
              setSpread(3)
            }>
            <Text
              style={[
                styles.switchText,
                spread === 3 &&
                  styles.switchTextActive,
              ]}>
              {t(
                'western.tarot.threeCards',
                {
                  defaultValue:
                    '3 Cards',
                },
              )}
            </Text>
          </Pressable>
        </View>

        {spread === 3 ? (
          <TarotPremiumGate
            featureKey="tarot:three-card"
            title={t(
              'luna.premium.tarotAdvancedTitle',
              {
                defaultValue:
                  'Unlock advanced Tarot',
              },
            )}
            message={t(
              'luna.premium.tarotAdvancedMessage',
              {
                defaultValue:
                  'Watch one rewarded ad to unlock this Tarot spread for 24 hours. Premium users can open it anytime.',
              },
            )}>
            {readingContent}
          </TarotPremiumGate>
        ) : (
          readingContent
        )}

        <Text style={styles.notice}>
          {t(
            'western.tarot.notice',
            {
              defaultValue:
                'Tarot content is for reflection and self-awareness. It should not replace professional advice.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function TarotCardDetails({
  draw,
}: {
  draw: TarotDraw;
}) {
  const {t} =
    useTranslation();

  const meaning =
    translateTarotCardMeaning(
      t,
      draw.card,
      draw.orientation,
    );

  const positionKey =
    draw.position === 'Past'
      ? 'past'
      : draw.position === 'Present'
        ? 'present'
        : draw.position === 'Future'
          ? 'future'
          : 'dailyGuidance';

  return (
    <View style={styles.detailsCard}>
      <Text style={styles.position}>
        {t(
          `western.tarot.positions.${positionKey}`,
          {
            defaultValue:
              draw.position,
          },
        )}
      </Text>

      <Text style={styles.cardName}>
        {translateTarotCardName(t, draw.card)}
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
        {meaning}
      </Text>

      <Text style={styles.advice}>
        {t(
          'western.tarot.advice',
          {
            defaultValue:
              'Advice',
          },
        )}
        : {translateTarotCardAdvice(t, draw.card)}
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
    fontSize: 28,
    lineHeight: 34,
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

  switchRow: {
    flexDirection: 'row',
    backgroundColor: '#EEE6F4',
    borderRadius: 16,
    padding: 5,
    marginTop: 14,
  },

  switchButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 11,
  },

  switchActive: {
    backgroundColor: COLORS.night,
  },

  switchText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '900',
  },

  switchTextActive: {
    color: '#F8EBCB',
  },

  detailsCard: {
    width: 142,
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 18,
    padding: 10,
  },

  position: {
    color: '#9A7939',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  cardName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 5,
  },

  orientation: {
    color: COLORS.purple,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'capitalize',
  },

  meaning: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 15,
    marginTop: 6,
  },

  advice: {
    color: '#4D405E',
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '800',
    marginTop: 6,
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
