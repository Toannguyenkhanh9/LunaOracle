declare module 'react-native-sound' {
  import type {
    ImageRequireSource,
  } from 'react-native';

  type SoundCallback =
    (error?: unknown) => void;

  export default class Sound {
    static MAIN_BUNDLE: string;
    static DOCUMENT: string;
    static LIBRARY: string;
    static CACHES: string;

    static setCategory(
      category: string,
    ): void;

    constructor(
      filename:
        | string
        | ImageRequireSource,
      basePath:
        | string
        | SoundCallback,
      onError?: SoundCallback,
    );

    play(
      onEnd?: (success: boolean) => void,
    ): void;

    stop(
      callback?: () => void,
    ): void;

    release(): void;

    setCurrentTime(
      seconds: number,
    ): void;
  }
}
