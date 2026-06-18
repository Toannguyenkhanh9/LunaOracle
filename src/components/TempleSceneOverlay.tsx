import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  AppState,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import {
  DEFAULT_ALTAR_PREFERENCES,
  getAltarPreferences,
  type AltarPreferences,
  type TempleSceneMode,
} from '../services/altarPreferences';

export type TempleDayPhase =
  | 'dawn'
  | 'day'
  | 'dusk'
  | 'night';

type Props = {
  preferences?: AltarPreferences;
  showDecorations?: boolean;
};

const ACCENT_COLORS = {
  amber: {
    glow: 'rgba(255, 170, 62, 0.22)',
    strong: '#FFB347',
  },
  gold: {
    glow: 'rgba(255, 209, 102, 0.21)',
    strong: '#FFD166',
  },
  rose: {
    glow: 'rgba(232, 126, 144, 0.20)',
    strong: '#E87E90',
  },
  jade: {
    glow: 'rgba(72, 172, 141, 0.18)',
    strong: '#48AC8D',
  },
  none: {
    glow: 'rgba(0, 0, 0, 0)',
    strong: 'transparent',
  },
} as const;

function getAutomaticPhase(
  date = new Date(),
): TempleDayPhase {
  const hour = date.getHours();

  if (hour >= 5 && hour < 8) {
    return 'dawn';
  }

  if (hour >= 8 && hour < 17) {
    return 'day';
  }

  if (hour >= 17 && hour < 20) {
    return 'dusk';
  }

  return 'night';
}

function resolvePhase(
  mode: TempleSceneMode,
): TempleDayPhase {
  return mode === 'auto'
    ? getAutomaticPhase()
    : mode;
}

function getCenterpieceIcon(
  value: AltarPreferences['centerpiece'],
): string {
  if (value === 'lotus') {
    return '🪷';
  }

  if (value === 'dharmaWheel') {
    return '☸';
  }

  if (value === 'none') {
    return '';
  }

  return '🧘';
}

function getFlowerIcon(
  value: AltarPreferences['flower'],
): string {
  if (value === 'lotus') {
    return '🪷';
  }

  if (value === 'orchid') {
    return '🌸';
  }

  if (value === 'none') {
    return '';
  }

  return '🌼';
}

function getLampIcon(
  value: AltarPreferences['lamp'],
): string {
  if (value === 'candle') {
    return '🕯️';
  }

  if (value === 'lotusLamp') {
    return '🪷';
  }

  if (value === 'none') {
    return '';
  }

  return '🏮';
}

export default function TempleSceneOverlay({
  preferences: providedPreferences,
  showDecorations = true,
}: Props) {
  const [storedPreferences, setStoredPreferences] =
    useState<AltarPreferences>(
      DEFAULT_ALTAR_PREFERENCES,
    );
  const [clockTick, setClockTick] =
    useState(0);

  const pulse =
    useRef(new Animated.Value(0.45)).current;
  const petalFloat =
    useRef(new Animated.Value(0)).current;

  const preferences =
    providedPreferences ?? storedPreferences;

  const reloadPreferences = React.useCallback(() => {
    if (providedPreferences) {
      return;
    }

    getAltarPreferences().then(
      setStoredPreferences,
    );
  }, [providedPreferences]);

  useFocusEffect(
    React.useCallback(() => {
      reloadPreferences();
    }, [reloadPreferences]),
  );

  useEffect(() => {
    if (providedPreferences) {
      return;
    }

    const subscription =
      AppState.addEventListener(
        'change',
        state => {
          if (state === 'active') {
            reloadPreferences();
          }
        },
      );

    return () => {
      subscription.remove();
    };
  }, [
    providedPreferences,
    reloadPreferences,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setClockTick(current => current + 1);
    }, 60_000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.82,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.42,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const petalAnimation = Animated.loop(
      Animated.timing(petalFloat, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    pulseAnimation.start();
    petalAnimation.start();

    return () => {
      pulseAnimation.stop();
      petalAnimation.stop();
    };
  }, [petalFloat, pulse]);

  const phase = useMemo(
    () =>
      resolvePhase(
        preferences.sceneMode,
      ),
    [
      clockTick,
      preferences.sceneMode,
    ],
  );

  const phaseOverlay = useMemo(() => {
    if (phase === 'dawn') {
      return 'rgba(255, 190, 120, 0.10)';
    }

    if (phase === 'day') {
      return 'rgba(255, 236, 192, 0.03)';
    }

    if (phase === 'dusk') {
      return 'rgba(148, 74, 36, 0.14)';
    }

    return 'rgba(13, 25, 60, 0.30)';
  }, [phase]);

  const accent =
    ACCENT_COLORS[preferences.accent];

  const petalTranslateY =
    petalFloat.interpolate({
      inputRange: [0, 1],
      outputRange: [-20, 280],
    });

  const petalTranslateX =
    petalFloat.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 18, -8],
    });

  return (
    <View
      pointerEvents="none"
      style={styles.fullScreen}>
      <View
        style={[
          styles.fullScreen,
          {
            backgroundColor: phaseOverlay,
          },
        ]}
      />

      {phase === 'night' && (
        <>
          <Text style={styles.moon}>☾</Text>
          <Text
            style={[
              styles.star,
              styles.starOne,
            ]}>
            ✦
          </Text>
          <Text
            style={[
              styles.star,
              styles.starTwo,
            ]}>
            ·
          </Text>
          <Text
            style={[
              styles.star,
              styles.starThree,
            ]}>
            ✧
          </Text>
        </>
      )}

      {preferences.accent !== 'none' && (
        <>
          <Animated.View
            style={[
              styles.centerGlow,
              {
                backgroundColor: accent.glow,
                opacity: pulse,
                shadowColor: accent.strong,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.leftLampGlow,
              {
                backgroundColor: accent.glow,
                opacity: pulse,
                shadowColor: accent.strong,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.rightLampGlow,
              {
                backgroundColor: accent.glow,
                opacity: pulse,
                shadowColor: accent.strong,
              },
            ]}
          />
        </>
      )}

      {showDecorations && (
        <>
          <View style={styles.centerpiece}>
            <Text style={styles.centerpieceIcon}>
              {getCenterpieceIcon(
                preferences.centerpiece,
              )}
            </Text>
          </View>

          <Text style={styles.leftFlower}>
            {getFlowerIcon(
              preferences.flower,
            )}
          </Text>
          <Text style={styles.rightFlower}>
            {getFlowerIcon(
              preferences.flower,
            )}
          </Text>

          <Text style={styles.leftLamp}>
            {getLampIcon(preferences.lamp)}
          </Text>
          <Text style={styles.rightLamp}>
            {getLampIcon(preferences.lamp)}
          </Text>

          {preferences.showFloatingPetals && (
            <>
              <Animated.Text
                style={[
                  styles.floatingPetal,
                  styles.floatingPetalOne,
                  {
                    transform: [
                      {
                        translateY:
                          petalTranslateY,
                      },
                      {
                        translateX:
                          petalTranslateX,
                      },
                      {rotate: '18deg'},
                    ],
                  },
                ]}>
                ✿
              </Animated.Text>

              <Animated.Text
                style={[
                  styles.floatingPetal,
                  styles.floatingPetalTwo,
                  {
                    transform: [
                      {
                        translateY:
                          petalTranslateY,
                      },
                      {
                        translateX:
                          petalTranslateX,
                      },
                      {rotate: '-14deg'},
                    ],
                  },
                ]}>
                ❀
              </Animated.Text>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  centerGlow: {
    position: 'absolute',
    left: '26%',
    top: '27%',
    width: '48%',
    height: '34%',
    borderRadius: 170,
    shadowOpacity: 0.95,
    shadowRadius: 36,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 4,
  },
  leftLampGlow: {
    position: 'absolute',
    left: '4%',
    top: '18%',
    width: 86,
    height: 120,
    borderRadius: 60,
    shadowOpacity: 0.95,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 5,
  },
  rightLampGlow: {
    position: 'absolute',
    right: '4%',
    top: '18%',
    width: 86,
    height: 120,
    borderRadius: 60,
    shadowOpacity: 0.95,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 5,
  },
  moon: {
    position: 'absolute',
    top: 34,
    right: 28,
    color: '#FFF3C4',
    fontSize: 30,
  },
  star: {
    position: 'absolute',
    color: 'rgba(255,255,224,0.78)',
  },
  starOne: {
    top: 90,
    left: 42,
    fontSize: 14,
  },
  starTwo: {
    top: 54,
    left: '44%',
    fontSize: 24,
  },
  starThree: {
    top: 125,
    right: 82,
    fontSize: 12,
  },
  centerpiece: {
    position: 'absolute',
    top: '39%',
    left: '42%',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerpieceIcon: {
    fontSize: 43,
  },
  leftFlower: {
    position: 'absolute',
    left: '15%',
    top: '54%',
    fontSize: 34,
  },
  rightFlower: {
    position: 'absolute',
    right: '15%',
    top: '54%',
    fontSize: 34,
  },
  leftLamp: {
    position: 'absolute',
    left: '7%',
    top: '24%',
    fontSize: 35,
  },
  rightLamp: {
    position: 'absolute',
    right: '7%',
    top: '24%',
    fontSize: 35,
  },
  floatingPetal: {
    position: 'absolute',
    color: 'rgba(255,220,225,0.72)',
    fontSize: 17,
  },
  floatingPetalOne: {
    left: '24%',
    top: 0,
  },
  floatingPetalTwo: {
    right: '22%',
    top: -80,
  },
});
