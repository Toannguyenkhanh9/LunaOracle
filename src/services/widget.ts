import {
  NativeModules,
  Platform,
} from 'react-native';

import {getPracticeStats} from './practice';

type TempleWidgetNativeModule = {
  updateWidget(
    title: string,
    subtitle: string,
    streak: number,
  ): Promise<void>;
};

const NativeWidget =
  NativeModules.TempleWidget as
    | TempleWidgetNativeModule
    | undefined;

export async function updateHomeWidget(
  title: string,
  subtitle: string,
): Promise<boolean> {
  if (
    Platform.OS !== 'android' ||
    !NativeWidget
  ) {
    return false;
  }

  const stats =
    await getPracticeStats();

  await NativeWidget.updateWidget(
    title,
    subtitle,
    stats.currentStreak,
  );

  return true;
}
