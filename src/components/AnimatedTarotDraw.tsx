import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  TarotDraw,
} from '../services/tarot';

import AnimatedTarotCard
  from './AnimatedTarotCard';

type Props = {
  draws: TarotDraw[];
  resetKey?: string | number;
  cardWidth?: number;
  cardHeight?: number;
  drawButtonLabel?: string;
  revealedLabel?: string;
  renderDetails?: (
    draw: TarotDraw,
    index: number,
  ) => ReactNode;
  onRevealComplete?: () => void;
};

export default function AnimatedTarotDraw({
  draws,
  resetKey,
  cardWidth = 96,
  cardHeight = 152,
  drawButtonLabel,
  revealedLabel,
  renderDetails,
  onRevealComplete,
}: Props) {
  const {t} =
    useTranslation();

  const [
    revealedCount,
    setRevealedCount,
  ] =
    useState(0);

  const [
    isRevealing,
    setRevealing,
  ] =
    useState(false);

  const deckShake =
    useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setRevealedCount(0);
    setRevealing(false);
    deckShake.setValue(0);
  }, [
    resetKey,
    draws.length,
    deckShake,
  ]);

  const reveal = () => {
    if (
      isRevealing ||
      revealedCount >= draws.length
    ) {
      return;
    }

    setRevealing(true);

    Animated.sequence([
      Animated.timing(deckShake, {
        toValue: 1,
        duration: 70,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(deckShake, {
        toValue: -1,
        duration: 70,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(deckShake, {
        toValue: 1,
        duration: 70,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(deckShake, {
        toValue: 0,
        duration: 70,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

    draws.forEach((_, index) => {
      setTimeout(() => {
        setRevealedCount(index + 1);

        if (index === draws.length - 1) {
          setTimeout(() => {
            setRevealing(false);
            onRevealComplete?.();
          }, 760);
        }
      }, 320 + index * 520);
    });
  };

  const allRevealed =
    revealedCount >= draws.length;

  const rotate =
    deckShake.interpolate({
      inputRange: [
        -1,
        0,
        1,
      ],
      outputRange: [
        '-5deg',
        '0deg',
        '5deg',
      ],
    });

  return (
    <View style={styles.root}>
      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.deckHint,
            {
              transform: [
                {
                  rotate,
                },
              ],
              opacity:
                allRevealed ? 0.18 : 1,
            },
          ]}>
          <Text style={styles.deckMoon}>
            ☾
          </Text>

          <Text style={styles.deckText}>
            {t(
              'lunaTarotAnimation.deck',
              {
                defaultValue:
                  'Tap to reveal',
              },
            )}
          </Text>
        </Animated.View>

        <View style={styles.spread}>
          {draws.map((draw, index) => {
            const revealed =
              index < revealedCount;

            return (
              <View
                key={`${draw.position}-${draw.card.id}-${index}`}
                style={styles.cardBlock}>
                <AnimatedTarotCard
                  draw={draw}
                  width={cardWidth}
                  height={cardHeight}
                  revealed={revealed}
                  resetKey={`${resetKey ?? ''}-${index}-${revealed}`}
                />

                {revealed &&
                renderDetails ? (
                  <View style={styles.details}>
                    {renderDetails(
                      draw,
                      index,
                    )}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[
          styles.revealButton,
          allRevealed &&
            styles.revealButtonDone,
        ]}
        disabled={
          isRevealing ||
          allRevealed
        }
        onPress={reveal}>
        <Text
          style={[
            styles.revealText,
            allRevealed &&
              styles.revealTextDone,
          ]}>
          {allRevealed
            ? revealedLabel ??
              t(
                'lunaTarotAnimation.revealed',
                {
                  defaultValue:
                    'Cards Revealed',
                },
              )
            : drawButtonLabel ??
              t(
                'lunaTarotAnimation.draw',
                {
                  defaultValue:
                    'Draw Cards',
                },
              )}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 14,
  },

  stage: {
    overflow: 'hidden',
    backgroundColor: '#1B1537',
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 10,
  },

  deckHint: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 116,
    height: 56,
    backgroundColor: 'rgba(217,183,110,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(217,183,110,0.45)',
    borderRadius: 18,
    marginBottom: 14,
  },

  deckMoon: {
    color: '#D9B76E',
    fontSize: 22,
    fontWeight: '900',
  },

  deckText: {
    color: '#F8EBCB',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },

  spread: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  cardBlock: {
    alignItems: 'center',
    marginHorizontal: 7,
    marginVertical: 8,
    maxWidth: 142,
  },

  details: {
    width: 142,
    marginTop: 10,
  },

  revealButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: '#D9B76E',
    borderRadius: 17,
    marginTop: 12,
  },

  revealButtonDone: {
    backgroundColor: '#EEE6F4',
  },

  revealText: {
    color: '#1B1537',
    fontSize: 13,
    fontWeight: '900',
  },

  revealTextDone: {
    color: '#6E4DA8',
  },
});
