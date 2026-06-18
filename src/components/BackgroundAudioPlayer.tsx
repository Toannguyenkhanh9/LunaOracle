import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Video from 'react-native-video';

type AudioSource =
  | number
  | {
      uri: string;
    };

type BackgroundAudioPlayerProps = {
  source: AudioSource | null;
  paused: boolean;
  repeat?: boolean;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
};

export default function BackgroundAudioPlayer({
  source,
  paused,
  repeat = false,
  onEnd,
  onError,
}: BackgroundAudioPlayerProps) {
  if (!source) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={styles.hidden}>
      <Video
        source={source}
        paused={paused}
        repeat={repeat}
        playInBackground
        playWhenInactive
        ignoreSilentSwitch="ignore"
        controls={false}
        resizeMode="contain"
        onEnd={onEnd}
        onError={onError}
        style={styles.player}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  player: {
    width: 1,
    height: 1,
  },
});