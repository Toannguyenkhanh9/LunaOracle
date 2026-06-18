import {
  Platform,
  Vibration,
} from 'react-native';
import Sound from 'react-native-sound';

import type {
  ChantPracticeType,
} from './chantCounter';

if (Platform.OS === 'ios') {
  Sound.setCategory('Playback');
}

type CounterSound =
  | 'woodenFish'
  | 'milestoneBell';

const soundFiles: Record<
  CounterSound,
  string
> = {
  woodenFish: 'wooden_fish.mp3',
  milestoneBell: 'temple_bell.mp3',
};

const cache: Partial<
  Record<CounterSound, Sound>
> = {};

const loading: Partial<
  Record<CounterSound, Promise<Sound>>
> = {};

function loadSound(
  type: CounterSound,
): Promise<Sound> {
  const cached = cache[type];

  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = loading[type];

  if (pending) {
    return pending;
  }

  const promise =
    new Promise<Sound>(
      (resolve, reject) => {
        const instance = new Sound(
          soundFiles[type],
          Sound.MAIN_BUNDLE,
          error => {
            delete loading[type];

            if (error) {
              instance.release();
              reject(error);
              return;
            }

            cache[type] = instance;
            resolve(instance);
          },
        );
      },
    );

  loading[type] = promise;

  return promise;
}

async function replay(
  type: CounterSound,
): Promise<void> {
  try {
    const sound = await loadSound(type);

    sound.stop(() => {
      sound.setNumberOfLoops(0);

      sound.play(success => {
        if (!success) {
          console.warn(
            'Unable to play chant counter sound:',
            type,
          );
        }
      });
    });
  } catch (error) {
    console.warn(
      'Unable to load chant counter sound:',
      error,
    );
  }
}

export function triggerCounterHaptic(): void {
  Vibration.vibrate(
    Platform.OS === 'ios'
      ? 8
      : 12,
  );
}

export function playCounterTapFeedback(
  practiceType: ChantPracticeType,
  soundEnabled = true,
  hapticEnabled = true,
): void {
  if (hapticEnabled) {
    triggerCounterHaptic();
  }

  if (
    soundEnabled &&
    practiceType === 'woodenFish'
  ) {
    void replay('woodenFish');
  }
}

export function playCounterMilestoneFeedback(
  soundEnabled = true,
  hapticEnabled = true,
): void {
  if (hapticEnabled) {
    Vibration.vibrate(
      Platform.OS === 'ios'
        ? 40
        : [0, 45, 55, 45],
    );
  }

  if (soundEnabled) {
    void replay('milestoneBell');
  }
}

export async function preloadChantCounterSounds(): Promise<void> {
  await Promise.allSettled([
    loadSound('woodenFish'),
    loadSound('milestoneBell'),
  ]);
}

export function releaseChantCounterSounds(): void {
  Object.values(cache).forEach(
    sound => {
      sound?.stop(() => {
        sound.release();
      });
    },
  );

  delete cache.woodenFish;
  delete cache.milestoneBell;

  delete loading.woodenFish;
  delete loading.milestoneBell;
}
