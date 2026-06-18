import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import PrimaryButton from '../components/PrimaryButton';
import {recordMeditationSession} from '../services/practice';
import {colors} from '../theme/colors';

const MEDITATION_DURATIONS = [
  300,
  600,
  1200,
  1800,
];

type BreathPhase = 'inhale' | 'hold' | 'exhale';

const PHASE_SECONDS: Record<BreathPhase, number> = {
  inhale: 4,
  hold: 2,
  exhale: 6,
};

function nextPhase(
  phase: BreathPhase,
): BreathPhase {
  if (phase === 'inhale') {
    return 'hold';
  }

  if (phase === 'hold') {
    return 'exhale';
  }

  return 'inhale';
}

export default function MeditationScreen() {
  const {t} = useTranslation();

  const [selectedDuration, setSelectedDuration] =
    useState(600);
  const [remainingSeconds, setRemainingSeconds] =
    useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [breathPhase, setBreathPhase] =
    useState<BreathPhase>('inhale');
  const [phaseRemaining, setPhaseRemaining] =
    useState(PHASE_SECONDS.inhale);

  const breathScale =
    useRef(new Animated.Value(0.72)).current;
  const breathOpacity =
    useRef(new Animated.Value(0.55)).current;
  const hasStartedRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isRunning) {
      breathScale.stopAnimation();
      breathOpacity.stopAnimation();
      return;
    }

    const duration =
      PHASE_SECONDS[breathPhase] * 1000;

    const targetScale =
      breathPhase === 'inhale'
        ? 1
        : breathPhase === 'hold'
          ? 1
          : 0.72;

    const targetOpacity =
      breathPhase === 'exhale'
        ? 0.55
        : 0.92;

    Animated.parallel([
      Animated.timing(breathScale, {
        toValue: targetScale,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(breathOpacity, {
        toValue: targetOpacity,
        duration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    breathOpacity,
    breathPhase,
    breathScale,
    isRunning,
  ]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(current =>
        current <= 1 ? 0 : current - 1,
      );

      setPhaseRemaining(current => {
        if (current <= 1) {
          const followingPhase =
            nextPhase(breathPhase);

          setBreathPhase(followingPhase);

          return PHASE_SECONDS[followingPhase];
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [breathPhase, isRunning]);

  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      !hasStartedRef.current ||
      completedRef.current
    ) {
      return;
    }

    completedRef.current = true;
    setIsRunning(false);

    recordMeditationSession(
      selectedDuration / 60,
    ).catch(error => {
      console.warn(
        'Unable to save meditation session:',
        error,
      );
    });

    Alert.alert(
      t('meditation.completedTitle'),
      t('meditation.completedMessage'),
    );
  }, [
    remainingSeconds,
    selectedDuration,
    t,
  ]);

  const selectDuration = (seconds: number) => {
    setSelectedDuration(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
    setBreathPhase('inhale');
    setPhaseRemaining(PHASE_SECONDS.inhale);
    completedRef.current = false;
    hasStartedRef.current = false;
    breathScale.setValue(0.72);
    breathOpacity.setValue(0.55);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(selectedDuration);
    setBreathPhase('inhale');
    setPhaseRemaining(PHASE_SECONDS.inhale);
    completedRef.current = false;
    hasStartedRef.current = false;
    breathScale.setValue(0.72);
    breathOpacity.setValue(0.55);
  };

  const toggleTimer = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(selectedDuration);
      completedRef.current = false;
    }

    hasStartedRef.current = true;
    setIsRunning(current => !current);
  };

  const minutes =
    Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {t('meditation.title')}
        </Text>

        <Text style={styles.subtitle}>
          {t('meditation.subtitle')}
        </Text>

        <View style={styles.durationRow}>
          {MEDITATION_DURATIONS.map(duration => {
            const selected =
              selectedDuration === duration;

            return (
              <Pressable
                key={duration}
                style={[
                  styles.durationButton,
                  selected &&
                    styles.durationButtonSelected,
                ]}
                onPress={() =>
                  selectDuration(duration)
                }>
                <Text
                  style={[
                    styles.durationButtonText,
                    selected &&
                      styles.durationButtonTextSelected,
                  ]}>
                  {t('meditation.minutes', {
                    count: duration / 60,
                  })}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.breathArea}>
          <Animated.View
            style={[
              styles.breathGlow,
              {
                opacity: breathOpacity,
                transform: [
                  {scale: breathScale},
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.breathCircle,
              {
                transform: [
                  {scale: breathScale},
                ],
              },
            ]}>
            <Text style={styles.phaseText}>
              {t(
                `practiceMeditation.phases.${breathPhase}`,
              )}
            </Text>

            <Text style={styles.phaseSeconds}>
              {phaseRemaining}
            </Text>
          </Animated.View>

          <Text style={styles.breathHint}>
            {t('practiceMeditation.breathHint')}
          </Text>
        </View>

        <View style={styles.timerCard}>
          <Text style={styles.timerText}>
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </Text>

          <Text style={styles.timerStatus}>
            {isRunning
              ? t('meditation.running')
              : t('meditation.ready')}
          </Text>
        </View>

        <PrimaryButton
          title={
            isRunning
              ? t('meditation.pause')
              : t('meditation.start')
          }
          onPress={toggleTimer}
        />

        <Pressable
          style={({pressed}) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
          onPress={resetTimer}>
          <Text style={styles.secondaryButtonText}>
            {t('meditation.resetTime')}
          </Text>
        </Pressable>

        <View style={styles.breathCard}>
          <Text style={styles.breathTitle}>
            {t('meditation.breathTitle')}
          </Text>

          <Text style={styles.breathText}>
            {t('meditation.inhale')}
          </Text>
          <Text style={styles.breathText}>
            {t('meditation.hold')}
          </Text>
          <Text style={styles.breathText}>
            {t('meditation.exhale')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const GOLD = '#D5A347';
const BROWN = '#4B2C1B';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    color: BROWN,
    fontSize: 29,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 22,
  },
  durationRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    width: '23%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE1CF',
    borderRadius: 14,
    paddingHorizontal: 3,
  },
  durationButtonSelected: {
    backgroundColor: BROWN,
  },
  durationButtonText: {
    color: '#765B45',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  durationButtonTextSelected: {
    color: '#FFE5A6',
  },
  breathArea: {
    width: 270,
    height: 290,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathGlow: {
    position: 'absolute',
    width: 230,
    height: 230,
    backgroundColor: 'rgba(221, 172, 75, 0.22)',
    borderRadius: 115,
  },
  breathCircle: {
    width: 185,
    height: 185,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8C98F',
    borderWidth: 5,
    borderColor: '#F7DFA7',
    borderRadius: 93,
    shadowColor: GOLD,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 8,
  },
  phaseText: {
    color: BROWN,
    fontSize: 21,
    fontWeight: '800',
  },
  phaseSeconds: {
    color: '#8A5B25',
    fontSize: 39,
    fontWeight: '900',
    marginTop: 5,
  },
  breathHint: {
    position: 'absolute',
    bottom: 5,
    color: '#8A7058',
    fontSize: 12,
    textAlign: 'center',
  },
  timerCard: {
    alignItems: 'center',
    marginBottom: 18,
  },
  timerText: {
    color: BROWN,
    fontSize: 42,
    fontWeight: '900',
  },
  timerStatus: {
    color: '#84684F',
    fontSize: 13,
    marginTop: 3,
  },
  secondaryButton: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CFAE77',
    borderRadius: 15,
    marginTop: 11,
  },
  secondaryButtonText: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '700',
  },
  breathCard: {
    width: '100%',
    backgroundColor: '#FFF9F0',
    borderRadius: 19,
    padding: 19,
    marginTop: 22,
  },
  breathTitle: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  breathText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 25,
  },
  pressed: {
    opacity: 0.65,
    transform: [{scale: 0.98}],
  },
});
