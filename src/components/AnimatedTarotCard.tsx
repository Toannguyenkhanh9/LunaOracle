import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';

import type {
  TarotDraw,
} from '../services/tarot';

import TarotCardImage
  from './TarotCardImage';

import {
  playCardFlipSound,
} from '../services/lunaSounds';

const CARD_BACK_IMAGE =
  require('../assets/images/tarot/tarot_card_back_luna.png');

type Props = {
  draw: TarotDraw;
  width?: number;
  height?: number;
  revealed?: boolean;
  autoReveal?: boolean;
  resetKey?: string | number;
  onRevealComplete?: () => void;
};

export default function AnimatedTarotCard({
  draw,
  width = 96,
  height = 152,
  revealed = false,
  autoReveal = false,
  resetKey,
  onRevealComplete,
}: Props) {
  const [isRevealed, setRevealed] =
    useState(revealed);

  const flip =
    useRef(
      new Animated.Value(
        revealed ? 1 : 0,
      ),
    ).current;

  const lift =
    useRef(
      new Animated.Value(
        revealed ? 1 : 0,
      ),
    ).current;

  const glow =
    useRef(new Animated.Value(0))
      .current;

  const shake =
    useRef(new Animated.Value(0))
      .current;

  const reveal = useCallback(() => {
    if (isRevealed) {
      return;
    }

    Vibration.vibrate(18);
    void playCardFlipSound();

    Animated.sequence([
      Animated.timing(shake, {
        toValue: 1,
        duration: 90,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -1,
        duration: 90,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 90,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(lift, {
          toValue: 1,
          duration: 360,
          easing:
            Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(flip, {
          toValue: 1,
          duration: 620,
          easing:
            Easing.inOut(
              Easing.cubic,
            ),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 260,
            easing:
              Easing.out(
                Easing.quad,
              ),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 520,
            easing:
              Easing.inOut(
                Easing.quad,
              ),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(({finished}) => {
      if (finished) {
        setRevealed(true);
        onRevealComplete?.();
      }
    });
  }, [
    flip,
    glow,
    isRevealed,
    lift,
    onRevealComplete,
    shake,
  ]);

  useEffect(() => {
    setRevealed(revealed);

    flip.setValue(
      revealed ? 1 : 0,
    );
    lift.setValue(
      revealed ? 1 : 0,
    );
    glow.setValue(0);
    shake.setValue(0);
  }, [
    resetKey,
    revealed,
    flip,
    lift,
    glow,
    shake,
  ]);

  useEffect(() => {
    if (
      autoReveal ||
      revealed
    ) {
      const timer =
        setTimeout(
          reveal,
          90,
        );

      return () =>
        clearTimeout(timer);
    }

    return undefined;
  }, [
    autoReveal,
    revealed,
    reveal,
  ]);

  const backOpacity =
    flip.interpolate({
      inputRange: [
        0,
        0.49,
        0.5,
        1,
      ],
      outputRange: [
        1,
        1,
        0,
        0,
      ],
    });

  const frontOpacity =
    flip.interpolate({
      inputRange: [
        0,
        0.49,
        0.5,
        1,
      ],
      outputRange: [
        0,
        0,
        1,
        1,
      ],
    });

  const backRotate =
    flip.interpolate({
      inputRange: [
        0,
        1,
      ],
      outputRange: [
        '0deg',
        '180deg',
      ],
    });

  const frontRotate =
    flip.interpolate({
      inputRange: [
        0,
        1,
      ],
      outputRange: [
        '180deg',
        '360deg',
      ],
    });

  const translateY =
    lift.interpolate({
      inputRange: [
        0,
        1,
      ],
      outputRange: [
        28,
        0,
      ],
    });

  const scale =
    lift.interpolate({
      inputRange: [
        0,
        1,
      ],
      outputRange: [
        0.92,
        1,
      ],
    });

  const rotateZ =
    shake.interpolate({
      inputRange: [
        -1,
        0,
        1,
      ],
      outputRange: [
        '-3deg',
        '0deg',
        '3deg',
      ],
    });

  const glowOpacity =
    glow.interpolate({
      inputRange: [
        0,
        1,
      ],
      outputRange: [
        0,
        0.78,
      ],
    });

  return (
    <Pressable
      accessibilityRole="button"
      onPress={reveal}>
      <Animated.View
        style={[
          styles.wrap,
          {
            width,
            height,
            transform: [
              {
                translateY,
              },
              {
                scale,
              },
              {
                rotateZ,
              },
            ],
          },
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              width:
                width + 30,
              height:
                height + 30,
              borderRadius:
                Math.max(
                  width,
                  height,
                ),
              opacity:
                glowOpacity,
              transform: [
                {
                  scale:
                    glow.interpolate({
                      inputRange: [
                        0,
                        1,
                      ],
                      outputRange: [
                        0.7,
                        1.15,
                      ],
                    }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.face,
            {
              opacity:
                backOpacity,
              transform: [
                {
                  perspective: 900,
                },
                {
                  rotateY:
                    backRotate,
                },
              ],
            },
          ]}>
          <Image
            source={CARD_BACK_IMAGE}
            style={[
              styles.cardBackImage,
              {
                width,
                height,
                borderRadius:
                  Math.max(
                    14,
                    width * 0.14,
                  ),
              },
            ]}
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.face,
            {
              opacity:
                frontOpacity,
              transform: [
                {
                  perspective: 900,
                },
                {
                  rotateY:
                    frontRotate,
                },
              ],
            },
          ]}>
          <TarotCardImage
            cardId={
              draw.card.id ??
              draw.card.name
            }
            title={draw.card.name}
            roman={draw.card.number}
            reversed={
              draw.orientation ===
              'reversed'
            }
            width={width}
            height={height}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  face: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },

  cardBackImage: {
    borderWidth: 1,
    borderColor: '#D9B76E',
  },

  glow: {
    position: 'absolute',
    backgroundColor: '#D9B76E',
    shadowColor: '#D9B76E',
    shadowOpacity: 0.8,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});
