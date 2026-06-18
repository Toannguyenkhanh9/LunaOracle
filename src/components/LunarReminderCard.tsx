import React, {useEffect, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
  DEFAULT_LUNAR_REMINDER_SETTINGS,
  getLunarReminderSettings,
  scheduleLunarReminders,
  type LunarReminderSettings,
} from '../services/lunarNotifications';

import {colors} from '../theme/colors';

const TIME_OPTIONS = [
  {
    label: '06:00',
    hour: 6,
    minute: 0,
  },
  {
    label: '07:00',
    hour: 7,
    minute: 0,
  },
  {
    label: '20:00',
    hour: 20,
    minute: 0,
  },
] as const;

export default function LunarReminderCard() {
  const {t} = useTranslation();

  const [settings, setSettings] =
    useState<LunarReminderSettings>(
      DEFAULT_LUNAR_REMINDER_SETTINGS,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved =
          await getLunarReminderSettings();

        setSettings(saved);
      } catch (error) {
        console.warn(
          'Cannot load lunar reminder settings:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const applySettings = async (
    nextSettings: LunarReminderSettings,
  ) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSettings(nextSettings);

    try {
      const result =
        await scheduleLunarReminders(
          nextSettings,
        );

      if (
        nextSettings.enabled &&
        !result.permissionGranted
      ) {
        const disabledSettings = {
          ...nextSettings,
          enabled: false,
        };

        setSettings(disabledSettings);

        await scheduleLunarReminders(
          disabledSettings,
        );

        Alert.alert(
          t(
            'lunarNotifications.permissionTitle',
            {
              defaultValue:
                'Notifications are disabled',
            },
          ),

          t(
            'lunarNotifications.permissionMessage',
            {
              defaultValue:
                'Please allow notifications in your device settings to receive lunar calendar reminders.',
            },
          ),
        );

        return;
      }

      if (nextSettings.enabled) {
        Alert.alert(
          t(
            'lunarNotifications.enabledTitle',
            {
              defaultValue:
                'Lunar reminders enabled',
            },
          ),

          t(
            'lunarNotifications.enabledMessage',
            {
              count:
                result.scheduledCount,

              time: `${String(
                nextSettings.hour,
              ).padStart(2, '0')}:${String(
                nextSettings.minute,
              ).padStart(2, '0')}`,

              defaultValue:
                '{{count}} reminders were scheduled at {{time}}.',
            },
          ),
        );
      }
    } catch (error) {
      console.warn(
        'Cannot schedule lunar reminders:',
        error,
      );

      Alert.alert(
        t(
          'lunarNotifications.errorTitle',
          {
            defaultValue:
              'Unable to schedule reminders',
          },
        ),

        t(
          'lunarNotifications.errorMessage',
          {
            defaultValue:
              'An error occurred while scheduling lunar calendar reminders.',
          },
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEnabled = (
    enabled: boolean,
  ) => {
    applySettings({
      ...settings,
      enabled,
    });
  };

  const selectTime = (
    hour: number,
    minute: number,
  ) => {
    applySettings({
      ...settings,
      hour,
      minute,
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {t(
              'lunarNotifications.settingTitle',
              {
                defaultValue:
                  'First-day and full-moon reminders',
              },
            )}
          </Text>

          <Text style={styles.description}>
            {t(
              'lunarNotifications.settingDescription',
              {
                defaultValue:
                  'Receive a reminder on the first and fifteenth lunar days.',
              },
            )}
          </Text>
        </View>

        <Switch
          value={settings.enabled}
          disabled={isLoading || isSaving}
          onValueChange={toggleEnabled}
          trackColor={{
            false: '#CDBDAE',
            true: colors.primaryLight,
          }}
          thumbColor={
            settings.enabled
              ? colors.primary
              : '#F5EFE8'
          }
        />
      </View>

      <Text style={styles.timeLabel}>
        {t(
          'lunarNotifications.reminderTime',
          {
            defaultValue:
              'Reminder time',
          },
        )}
      </Text>

      <View style={styles.timeRow}>
        {TIME_OPTIONS.map(option => {
          const isSelected =
            settings.hour ===
              option.hour &&
            settings.minute ===
              option.minute;

          return (
            <Pressable
              key={option.label}
              disabled={
                isLoading ||
                isSaving ||
                !settings.enabled
              }
              style={({pressed}) => [
                styles.timeButton,
                isSelected &&
                  styles.timeButtonSelected,
                !settings.enabled &&
                  styles.timeButtonDisabled,
                pressed &&
                  styles.timeButtonPressed,
              ]}
              onPress={() =>
                selectTime(
                  option.hour,
                  option.minute,
                )
              }>
              <Text
                style={[
                  styles.timeText,
                  isSelected &&
                    styles.timeTextSelected,
                ]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.note}>
        {t(
          'lunarNotifications.settingNote',
          {
            defaultValue:
              'The app schedules reminders for the next 12 months and refreshes them when the app opens.',
          },
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerContent: {
    flex: 1,
    marginRight: 14,
  },

  title: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: '800',
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },

  timeLabel: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  timeButton: {
    width: '31%',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE1D2',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 13,
  },

  timeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },

  timeButtonDisabled: {
    opacity: 0.45,
  },

  timeButtonPressed: {
    opacity: 0.7,
  },

  timeText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },

  timeTextSelected: {
    color: colors.white,
  },

  note: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 13,
  },
});
