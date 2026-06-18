import React, {useEffect, useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
  playTempleSound,
  preloadTempleSounds,
  releaseTempleSounds,
  startLoopingTempleSound,
  stopAllTempleSounds,
  stopTempleSound,
  type TempleSound,
} from '../services/audio';

import {colors} from '../theme/colors';

type SoundButtonProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function SoundButton({
  title,
  isActive,
  onPress,
  onLongPress,
}: SoundButtonProps) {
  const {t} = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        selected: isActive,
      }}
      delayLongPress={500}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({pressed}) => [
        styles.soundButton,
        isActive && styles.soundButtonActive,
        pressed && styles.soundButtonPressed,
      ]}>
      <Text
        style={[
          styles.soundButtonTitle,
          isActive && styles.soundButtonTitleActive,
        ]}>
        {isActive
          ? t('audio.playingContinuously')
          : title}
      </Text>

      <Text
        style={[
          styles.soundButtonHint,
          isActive && styles.soundButtonHintActive,
        ]}>
        {isActive
          ? t('audio.tapToStop')
          : t('audio.tapOrHoldHint')}
      </Text>
    </Pressable>
  );
}

export default function AudioLibraryScreen() {
  const {t} = useTranslation();

  const [loopingSound, setLoopingSound] =
    useState<TempleSound | null>(null);

  /*
   * Khi onLongPress chạy, một số thiết bị có thể tiếp tục gọi
   * onPress lúc người dùng thả tay. Biến này ngăn việc âm thanh
   * vừa bật xong đã bị tắt ngay.
   */
  const ignorePressUntilRef = useRef(0);

  useEffect(() => {
    preloadTempleSounds();

    return () => {
      stopAllTempleSounds();
      releaseTempleSounds();
    };
  }, []);

  const handleSoundPress = async (type: TempleSound) => {
    if (Date.now() < ignorePressUntilRef.current) {
      return;
    }

    // Nút đang sáng: chạm để dừng.
    if (loopingSound === type) {
      stopTempleSound(type);
      setLoopingSound(null);
      return;
    }

    // Nếu âm thanh khác đang chạy lặp, dừng nó trước.
    if (loopingSound) {
      stopAllTempleSounds();
      setLoopingSound(null);
    }

    await playTempleSound(type);
  };

  const handleSoundLongPress = async (type: TempleSound) => {
    // Bỏ qua sự kiện onPress có thể xuất hiện sau onLongPress.
    ignorePressUntilRef.current = Date.now() + 800;

    await startLoopingTempleSound(type);

    setLoopingSound(type);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {t('audio.title')}
        </Text>

        <Text style={styles.subtitle}>
          {t('audio.subtitle')}
        </Text>

        <View
          style={[
            styles.card,
            loopingSound === 'woodenFish' && styles.cardActive,
          ]}>
          <Text style={styles.icon}>🪵</Text>

          <Text style={styles.cardTitle}>
            {t('audio.woodenFishTitle')}
          </Text>

          <SoundButton
            title={t('audio.playWoodenFish')}
            isActive={loopingSound === 'woodenFish'}
            onPress={() => handleSoundPress('woodenFish')}
            onLongPress={() =>
              handleSoundLongPress('woodenFish')
            }
          />
        </View>

        <View
          style={[
            styles.card,
            loopingSound === 'bell' && styles.cardActive,
          ]}>
          <Text style={styles.icon}>🔔</Text>

          <Text style={styles.cardTitle}>
            {t('audio.bellTitle')}
          </Text>

          <SoundButton
            title={t('audio.playBell')}
            isActive={loopingSound === 'bell'}
            onPress={() => handleSoundPress('bell')}
            onLongPress={() =>
              handleSoundLongPress('bell')
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  title: {
    color: colors.primaryDark,
    fontSize: 29,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
  },

  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
  },

  cardActive: {
    borderColor: colors.gold,
    backgroundColor: '#FFF7DF',

    shadowColor: colors.gold,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 9,
  },

  icon: {
    fontSize: 58,
  },

  cardTitle: {
    color: colors.primaryDark,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 18,
  },

  soundButton: {
    width: '100%',
    minHeight: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  soundButtonActive: {
    backgroundColor: colors.gold,
    borderColor: '#FFE9A8',

    shadowColor: colors.gold,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 10,
  },

  soundButtonPressed: {
    opacity: 0.78,
    transform: [{scale: 0.98}],
  },

  soundButtonTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  soundButtonTitleActive: {
    color: colors.primaryDark,
  },

  soundButtonHint: {
    color: '#F9E5D7',
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 4,
  },

  soundButtonHintActive: {
    color: '#65401F',
  },
});