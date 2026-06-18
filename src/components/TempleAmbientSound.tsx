import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppState,
  Image,
  StyleSheet,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import Video from 'react-native-video';

import {
  getAltarPreferences,
  type TempleSoundscape,
} from '../services/altarPreferences';

type AudioSource = number | {uri: string};

const SOUNDS: Partial<
  Record<TempleSoundscape, AudioSource>
> = {
  rain: require('../assets/audio/temple_rain.mp3'),
  forest: require('../assets/audio/forest_birds.mp3'),
  bell: require('../assets/audio/singing_bowl.mp3'),
};

function resolveSource(
  source: AudioSource,
): {uri: string} {
  if (typeof source === 'number') {
    const resolved =
      Image.resolveAssetSource(source);

    return {
      uri: resolved?.uri ?? '',
    };
  }

  return source;
}

export default function TempleAmbientSound() {
  const [soundscape, setSoundscape] =
    useState<TempleSoundscape>('none');

  const reload = React.useCallback(() => {
    getAltarPreferences().then(
      preferences => {
        setSoundscape(
          preferences.soundscape,
        );
      },
    );
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      reload();
    }, [reload]),
  );

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        'change',
        state => {
          if (state === 'active') {
            reload();
          }
        },
      );

    return () => {
      subscription.remove();
    };
  }, [reload]);

  const source = useMemo(() => {
    const selected = SOUNDS[soundscape];

    return selected
      ? resolveSource(selected)
      : null;
  }, [soundscape]);

  if (!source) {
    return null;
  }

  return (
    <Video
      key={soundscape}
      source={source}
      paused={false}
      repeat
      playInBackground={false}
      playWhenInactive={false}
      ignoreSilentSwitch="ignore"
      volume={0.28}
      controls={false}
      style={styles.hidden}
    />
  );
}

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
