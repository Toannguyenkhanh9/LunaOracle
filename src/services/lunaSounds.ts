import Sound
  from 'react-native-sound';

type LunaSoundKey =
  | 'cardFlip'
  | 'mysticChime'
  | 'softTap'
  | 'loveChime';

const SOUND_ASSETS: Record<LunaSoundKey, number> = {
  cardFlip: require('../assets/sounds/card_flip.wav'),
  mysticChime: require('../assets/sounds/mystic_chime.wav'),
  softTap: require('../assets/sounds/soft_tap.wav'),
  loveChime: require('../assets/sounds/love_chime.wav'),
};

try {
  if (
    Sound &&
    typeof Sound.setCategory ===
      'function'
  ) {
    Sound.setCategory('Playback');
  }
} catch (error) {
  console.warn(
    'Unable to set sound category:',
    error,
  );
}

let enabled = true;

const cache:
  Partial<Record<LunaSoundKey, Sound>> = {};

function getSound(
  key: LunaSoundKey,
): Promise<Sound | undefined> {
  if (!Sound) {
    return Promise.resolve(undefined);
  }

  if (cache[key]) {
    return Promise.resolve(
      cache[key],
    );
  }

  return new Promise(resolve => {
    try {
      const sound =
        new Sound(
          SOUND_ASSETS[key],
          error => {
            if (error) {
              console.warn(
                'Unable to load sound',
                key,
                error,
              );
              resolve(undefined);
              return;
            }

            cache[key] = sound;
            resolve(sound);
          },
        );

      // Một số bản react-native-sound cũ
      // không gọi callback với require asset.
      setTimeout(() => {
        if (!cache[key]) {
          cache[key] = sound;
          resolve(sound);
        }
      }, 300);
    } catch (error) {
      console.warn(
        'Unable to create sound',
        key,
        error,
      );
      resolve(undefined);
    }
  });
}

export function setLunaSoundEnabled(
  value: boolean,
): void {
  enabled = value;
}

export function getLunaSoundEnabled():
boolean {
  return enabled;
}

export async function playLunaSound(
  key: LunaSoundKey,
): Promise<void> {
  if (!enabled) {
    return;
  }

  try {
    const sound =
      await getSound(key);

    if (
      !sound ||
      typeof sound.play !==
        'function'
    ) {
      return;
    }

    if (
      typeof sound.stop ===
      'function'
    ) {
      sound.stop(() => {
        if (
          typeof sound.setCurrentTime ===
          'function'
        ) {
          sound.setCurrentTime(0);
        }

        sound.play(() => {});
      });

      return;
    }

    sound.play(() => {});
  } catch (error) {
    console.warn(
      'Unable to play Luna sound:',
      error,
    );
  }
}

export async function playCardFlipSound():
Promise<void> {
  await playLunaSound('cardFlip');
}

export async function playMysticChime():
Promise<void> {
  await playLunaSound('mysticChime');
}

export async function playSoftTap():
Promise<void> {
  await playLunaSound('softTap');
}

export async function playLoveChime():
Promise<void> {
  await playLunaSound('loveChime');
}

export function releaseLunaSounds():
void {
  Object.values(cache).forEach(sound => {
    try {
      if (
        sound &&
        typeof sound.release ===
          'function'
      ) {
        sound.release();
      }
    } catch {}
  });

  Object.keys(cache).forEach(key => {
    delete cache[
      key as LunaSoundKey
    ];
  });
}
