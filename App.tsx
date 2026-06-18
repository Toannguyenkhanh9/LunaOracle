
import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import mobileAds from 'react-native-google-mobile-ads';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {
  initializeI18n,
} from './src/i18n';

import RootNavigator
  from './src/navigation/RootNavigator';

import {
  refreshDailyPracticeReminder,
} from './src/services/dailyPracticeNotifications';

import {
  refreshLunarReminders,
} from './src/services/lunarNotifications';

import {
  colors,
} from './src/theme/colors';

export default function App() {
  const [
    isI18nReady,
    setIsI18nReady,
  ] = useState(false);

  useEffect(() => {
    let isMounted = true;

    /**
     * Khởi tạo Google Mobile Ads.
     *
     * Việc khởi tạo quảng cáo chạy độc lập,
     * không làm chặn quá trình mở ứng dụng.
     */
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log(
          'AdMob đã khởi tạo:',
          adapterStatuses,
        );
      })
      .catch(error => {
        console.warn(
          'Không thể khởi tạo AdMob:',
          error,
        );
      });

    /**
     * Khởi tạo ngôn ngữ và làm mới
     * các thông báo đã lên lịch.
     */
    initializeI18n()
      .then(async () => {
        const reminderResults =
          await Promise.allSettled([
            refreshLunarReminders(),
            refreshDailyPracticeReminder(),
          ]);

        reminderResults.forEach(
          (result, index) => {
            if (
              result.status !== 'rejected'
            ) {
              return;
            }

            const reminderName =
              index === 0
                ? 'lịch âm'
                : 'thực hành hằng ngày';

            console.warn(
              `Không thể làm mới thông báo ${reminderName}:`,
              result.reason,
            );
          },
        );
      })
      .catch(error => {
        console.warn(
          'Không thể khởi tạo ngôn ngữ:',
          error,
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsI18nReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isI18nReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          colors.background
        }
      />

      <RootNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      colors.background,
  },
});

