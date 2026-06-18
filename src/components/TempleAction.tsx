import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {colors} from '../theme/colors';

type TempleActionEffect = 'woodenFish' | 'bell';

type TempleActionProps = {
  title: string;
  count: string;
  isActive?: boolean;
  onPress: () => void;
  onLongPress?: () => void;

  imageSource: ImageSourcePropType;
  effectType: TempleActionEffect;
};

export default function TempleAction({
  title,
  count,
  isActive = false,
  onPress,
  onLongPress,
  imageSource,
  effectType,
}: TempleActionProps) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const strike = useRef(new Animated.Value(0)).current;
  const bellSwing = useRef(new Animated.Value(0)).current;

  const didLongPressRef = useRef(false);

  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const effectLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const stopAllAnimations = () => {
      pulseLoopRef.current?.stop();
      effectLoopRef.current?.stop();

      pulse.stopAnimation();
      strike.stopAnimation();
      bellSwing.stopAnimation();

      pulse.setValue(0);
      strike.setValue(0);
      bellSwing.setValue(0);
    };

    if (isActive) {
      pulseLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );

      pulseLoopRef.current.start();

      if (effectType === 'woodenFish') {
        effectLoopRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(strike, {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }),
            Animated.timing(strike, {
              toValue: 0,
              duration: 260,
              useNativeDriver: true,
            }),
          ]),
        );
      } else {
        effectLoopRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(bellSwing, {
              toValue: -1,
              duration: 140,
              useNativeDriver: true,
            }),
            Animated.timing(bellSwing, {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }),
            Animated.timing(bellSwing, {
              toValue: -0.6,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(bellSwing, {
              toValue: 0.6,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(bellSwing, {
              toValue: 0,
              duration: 160,
              useNativeDriver: true,
            }),
          ]),
        );
      }

      effectLoopRef.current.start();
    } else {
      stopAllAnimations();
    }

    return stopAllAnimations;
  }, [bellSwing, effectType, isActive, pulse, strike]);

  const animateTap = () => {
    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 0.94,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }

    animateTap();
    onPress();
  };

  const handleLongPress = () => {
    didLongPressRef.current = true;
    animateTap();
    onLongPress?.();
  };

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.7],
  });

  const strikerRotate = strike.interpolate({
    inputRange: [0, 1],
    outputRange: ['-35deg', '30deg'],
  });

  const strikerTranslateX = strike.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -8],
  });

  const strikerTranslateY = strike.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const impactScale = strike.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1.15],
  });

  const impactOpacity = strike.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0.55, 0],
  });

  const bellRotate = bellSwing.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-12deg', '12deg'],
  });

  const waveOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.7],
  });

  const waveScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.2],
  });

  return (
    <Pressable
      delayLongPress={500}
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={({pressed}) => [
        styles.container,
        isActive && styles.containerActive,
        pressed && styles.containerPressed,
      ]}>
      <Animated.View
        style={[
          styles.visualBox,
          {
            transform: [{scale: pressScale}],
          },
        ]}>
        <Animated.View
          style={[
            styles.glow,
            isActive && styles.glowActive,
            {
              opacity: isActive ? pulseOpacity : 0,
              transform: [{scale: pulseScale}],
            },
          ]}
        />

        {effectType === 'woodenFish' ? (
          <View style={styles.imageWrap}>
            <Image source={imageSource} style={styles.mainImage} resizeMode="contain" />

            {isActive && (
              <>
                <Animated.View
                  style={[
                    styles.impactRing,
                    {
                      opacity: impactOpacity,
                      transform: [{scale: impactScale}],
                    },
                  ]}
                />

                <Animated.View
                  style={[
                    styles.strikerWrap,
                    {
                      transform: [
                        {translateX: strikerTranslateX},
                        {translateY: strikerTranslateY},
                        {rotate: strikerRotate},
                      ],
                    },
                  ]}>
                  <View style={styles.strikerHead} />
                  <View style={styles.strikerHandle} />
                </Animated.View>
              </>
            )}
          </View>
        ) : (
          <View style={styles.imageWrap}>
            {isActive && (
              <>
                <Animated.View
                  style={[
                    styles.soundWaveLeft,
                    {
                      opacity: waveOpacity,
                      transform: [{scale: waveScale}],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.soundWaveRight,
                    {
                      opacity: waveOpacity,
                      transform: [{scale: waveScale}],
                    },
                  ]}
                />
              </>
            )}

            <Animated.Image
              source={imageSource}
              resizeMode="contain"
              style={[
                styles.mainImage,
                {
                  transform: [{rotate: isActive ? bellRotate : '0deg'}],
                },
              ]}
            />
          </View>
        )}
      </Animated.View>

      <Text style={[styles.title, isActive && styles.titleActive]}>
        {title}
      </Text>

      <Text style={[styles.count, isActive && styles.countActive]}>
        {count}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.templeCard,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 22,
    padding: 16,
  },

  containerActive: {
    backgroundColor: '#7A5526',
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.75,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 0},
    elevation: 10,
  },

  containerPressed: {
    opacity: 0.85,
  },

  visualBox: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  imageWrap: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainImage: {
    width: 92,
    height: 92,
  },

  glow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFD76A',
  },

  glowActive: {
    backgroundColor: '#FFE28D',
  },

  strikerWrap: {
    position: 'absolute',
    right: 6,
    top: 8,
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },

  strikerHead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#C68A47',
    marginBottom: -1,
  },

  strikerHandle: {
    width: 5,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#8B5A2B',
  },

  impactRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#FFE49A',
  },

  soundWaveLeft: {
    position: 'absolute',
    left: -6,
    width: 28,
    height: 56,
    borderWidth: 3,
    borderColor: '#FFE49A',
    borderRightWidth: 0,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },

  soundWaveRight: {
    position: 'absolute',
    right: -6,
    width: 28,
    height: 56,
    borderWidth: 3,
    borderColor: '#FFE49A',
    borderLeftWidth: 0,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    color: colors.goldLight,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 6,
  },

  titleActive: {
    color: '#FFF4BA',
  },

  count: {
    color: '#D4B499',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },

  countActive: {
    color: '#FFF1C8',
  },
});