import {Platform} from 'react-native';
import Sound from 'react-native-sound';

if (Platform.OS === 'ios') {
  Sound.setCategory('Playback');
}

export type TempleSound =
  | 'woodenFish'
  | 'bell';

const soundFiles: Record<
  TempleSound,
  string
> = {
  woodenFish: 'wooden_fish.mp3',
  bell: 'temple_bell.mp3',
};

const soundCache: Partial<
  Record<TempleSound, Sound>
> = {};

const loadingCache: Partial<
  Record<TempleSound, Promise<Sound>>
> = {};

let currentLoopingSound:
  | TempleSound
  | null = null;

function loadSound(
  type: TempleSound,
): Promise<Sound> {
  const cachedSound = soundCache[type];

  if (cachedSound) {
    return Promise.resolve(cachedSound);
  }

  const loadingSound = loadingCache[type];

  if (loadingSound) {
    return loadingSound;
  }

  const loadingPromise =
    new Promise<Sound>(
      (resolve, reject) => {
        const soundInstance =
          new Sound(
            soundFiles[type],
            Sound.MAIN_BUNDLE,
            error => {
              delete loadingCache[type];

              if (error) {
                console.warn(
                  `Không thể tải âm thanh ${soundFiles[type]}:`,
                  error,
                );

                soundInstance.release();
                reject(error);
                return;
              }

              soundCache[type] =
                soundInstance;

              resolve(soundInstance);
            },
          );
      },
    );

  loadingCache[type] = loadingPromise;

  return loadingPromise;
}

export async function preloadTempleSounds(): Promise<void> {
  await Promise.allSettled([
    loadSound('woodenFish'),
    loadSound('bell'),
  ]);
}

export async function playTempleSound(
  type: TempleSound,
): Promise<void> {
  try {
    stopAllTempleSounds();

    const sound = await loadSound(type);

    sound.stop(() => {
      sound.setNumberOfLoops(0);

      sound.play(success => {
        if (!success) {
          console.warn(
            'Không thể phát âm thanh:',
            type,
          );
        }
      });
    });
  } catch (error) {
    console.warn(
      'Lỗi phát âm thanh:',
      error,
    );
  }
}

export async function startLoopingTempleSound(
  type: TempleSound,
): Promise<void> {
  try {
    stopAllTempleSounds();

    const sound = await loadSound(type);

    currentLoopingSound = type;

    sound.stop(() => {
      sound.setNumberOfLoops(-1);

      sound.play(success => {
        if (!success) {
          console.warn(
            'Không thể phát lặp âm thanh:',
            type,
          );

          if (
            currentLoopingSound === type
          ) {
            currentLoopingSound = null;
          }
        }
      });
    });
  } catch (error) {
    currentLoopingSound = null;

    console.warn(
      'Lỗi phát lặp âm thanh:',
      error,
    );
  }
}

export function stopTempleSound(
  type: TempleSound,
): void {
  const sound = soundCache[type];

  if (currentLoopingSound === type) {
    currentLoopingSound = null;
  }

  if (!sound) {
    return;
  }

  sound.stop(() => {
    sound.setNumberOfLoops(0);
  });
}

export function stopAllTempleSounds(): void {
  currentLoopingSound = null;

  Object.values(soundCache).forEach(
    sound => {
      if (!sound) {
        return;
      }

      sound.stop(() => {
        sound.setNumberOfLoops(0);
      });
    },
  );
}

export function getLoopingTempleSound():
  | TempleSound
  | null {
  return currentLoopingSound;
}

export function releaseTempleSounds(): void {
  stopAllTempleSounds();

  Object.values(soundCache).forEach(
    sound => {
      sound?.release();
    },
  );

  delete soundCache.woodenFish;
  delete soundCache.bell;

  delete loadingCache.woodenFish;
  delete loadingCache.bell;
}