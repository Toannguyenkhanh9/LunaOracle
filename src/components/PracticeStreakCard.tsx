import React, {
  useCallback,
  useState,
} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  getPracticeStats,
  getTodayPractice,
} from '../services/practice';

type Props = {
  onPress: () => void;
};

export default function PracticeStreakCard({
  onPress,
}: Props) {
  const {t} = useTranslation();
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] =
    useState(0);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        getPracticeStats(),
        getTodayPractice(),
      ]).then(([stats, today]) => {
        setStreak(stats.currentStreak);
        setCompleted(
          Object.values(
            today.activities,
          ).filter(Boolean).length,
        );
      });
    }, []),
  );

  return (
    <Pressable
      style={({pressed}) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>🔥</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>
          {t('practice.homeTitle')}
        </Text>

        <Text style={styles.subtitle}>
          {t('practice.homeProgress', {
            completed,
            total: 4,
          })}
        </Text>
      </View>

      <View style={styles.streakWrap}>
        <Text style={styles.streakValue}>
          {streak}
        </Text>
        <Text style={styles.streakLabel}>
          {t('practice.days')}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B2B19',
    borderWidth: 1,
    borderColor: '#D5A347',
    borderRadius: 20,
    padding: 15,
    marginBottom: 18,
  },
  iconWrap: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#67401F',
    borderRadius: 16,
  },
  icon: {
    fontSize: 27,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#FFE4A3',
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    color: '#D9C09D',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  streakWrap: {
    alignItems: 'center',
    marginHorizontal: 11,
  },
  streakValue: {
    color: '#FFE4A3',
    fontSize: 23,
    fontWeight: '900',
  },
  streakLabel: {
    color: '#D9C09D',
    fontSize: 9,
  },
  arrow: {
    color: '#D5A347',
    fontSize: 30,
  },
  pressed: {
    opacity: 0.72,
    transform: [{scale: 0.99}],
  },
});
