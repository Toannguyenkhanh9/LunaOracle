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
  DEFAULT_DAILY_PRACTICE_REMINDER_SETTINGS,
  getDailyPracticeReminderSettings,
  scheduleDailyPracticeReminder,
  type DailyPracticeReminderSettings,
  type DailyPracticeType,
} from '../services/dailyPracticeNotifications';

import {colors} from '../theme/colors';

const PRACTICE_TYPES: {
  id: DailyPracticeType;
  icon: string;
  titleKey: string;
}[] = [
  {
    id: 'meditation',
    icon: '🧘',
    titleKey:
      'dailyPracticeNotifications.typeMeditation',
  },
  {
    id: 'sutra',
    icon: '📿',
    titleKey:
      'dailyPracticeNotifications.typeSutra',
  },
  {
    id: 'both',
    icon: '🪷',
    titleKey:
      'dailyPracticeNotifications.typeBoth',
  },
];

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
    label: '12:00',
    hour: 12,
    minute: 0,
  },
  {
    label: '20:00',
    hour: 20,
    minute: 0,
  },
] as const;

function formatTime(
  hour: number,
  minute: number,
): string {
  return `${String(hour).padStart(
    2,
    '0',
  )}:${String(minute).padStart(
    2,
    '0',
  )}`;
}

export default function DailyPracticeReminderCard() {
  const {t} = useTranslation();

  const [settings, setSettings] =
    useState<DailyPracticeReminderSettings>(
      DEFAULT_DAILY_PRACTICE_REMINDER_SETTINGS,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved =
          await getDailyPracticeReminderSettings();

        setSettings(saved);
      } catch (error) {
        console.warn(
          'Cannot load daily practice reminder settings:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const applySettings = async (
    nextSettings: DailyPracticeReminderSettings,
    showEnabledMessage = false,
  ) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSettings(nextSettings);

    try {
      const result =
        await scheduleDailyPracticeReminder(
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

        await scheduleDailyPracticeReminder(
          disabledSettings,
        );

        Alert.alert(
          t(
            'dailyPracticeNotifications.permissionTitle',
          ),

          t(
            'dailyPracticeNotifications.permissionMessage',
          ),
        );

        return;
      }

      if (
        showEnabledMessage &&
        nextSettings.enabled &&
        result.scheduled
      ) {
        Alert.alert(
          t(
            'dailyPracticeNotifications.enabledTitle',
          ),

          t(
            'dailyPracticeNotifications.enabledMessage',
            {
              time: formatTime(
                nextSettings.hour,
                nextSettings.minute,
              ),
            },
          ),
        );
      }
    } catch (error) {
      console.warn(
        'Cannot schedule daily practice reminder:',
        error,
      );

      Alert.alert(
        t(
          'dailyPracticeNotifications.errorTitle',
        ),

        t(
          'dailyPracticeNotifications.errorMessage',
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEnabled = (
    enabled: boolean,
  ) => {
    applySettings(
      {
        ...settings,
        enabled,
      },
      enabled,
    );
  };

  const selectType = (
    type: DailyPracticeType,
  ) => {
    applySettings({
      ...settings,
      type,
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
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>
            🔔
          </Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {t(
              'dailyPracticeNotifications.settingTitle',
            )}
          </Text>

          <Text style={styles.description}>
            {t(
              'dailyPracticeNotifications.settingDescription',
            )}
          </Text>
        </View>

        <Switch
          value={settings.enabled}
          disabled={isLoading || isSaving}
          onValueChange={toggleEnabled}
          trackColor={{
            false: '#D4C4B6',
            true: colors.primaryLight,
          }}
          thumbColor={
            settings.enabled
              ? colors.primary
              : '#F8F3ED'
          }
        />
      </View>

      <Text style={styles.groupTitle}>
        {t(
          'dailyPracticeNotifications.practiceType',
        )}
      </Text>

      <View style={styles.typeRow}>
        {PRACTICE_TYPES.map(item => {
          const isSelected =
            settings.type === item.id;

          return (
            <Pressable
              key={item.id}
              disabled={
                isLoading ||
                isSaving ||
                !settings.enabled
              }
              style={({pressed}) => [
                styles.typeButton,
                isSelected &&
                  styles.typeButtonSelected,
                !settings.enabled &&
                  styles.disabled,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={() =>
                selectType(item.id)
              }>
              <Text style={styles.typeIcon}>
                {item.icon}
              </Text>

              <Text
                style={[
                  styles.typeText,
                  isSelected &&
                    styles.typeTextSelected,
                ]}>
                {t(item.titleKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.groupTitle}>
        {t(
          'dailyPracticeNotifications.reminderTime',
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
                  styles.disabled,
                pressed &&
                  styles.buttonPressed,
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

      <View style={styles.previewCard}>
        <Text style={styles.previewLabel}>
          {t(
            'dailyPracticeNotifications.previewLabel',
          )}
        </Text>

        <Text style={styles.previewTitle}>
          {settings.type === 'sutra'
            ? t(
                'dailyPracticeNotifications.sutraTitle',
              )
            : settings.type === 'both'
              ? t(
                  'dailyPracticeNotifications.bothTitle',
                )
              : t(
                  'dailyPracticeNotifications.meditationTitle',
                )}
        </Text>

        <Text style={styles.previewTime}>
          {formatTime(
            settings.hour,
            settings.minute,
          )}
        </Text>
      </View>

      <Text style={styles.note}>
        {t(
          'dailyPracticeNotifications.settingNote',
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
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    shadowColor: '#5A351F',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4E5D2',
    borderRadius: 15,
    marginRight: 12,
  },

  headerIconText: {
    fontSize: 23,
  },

  headerContent: {
    flex: 1,
    marginRight: 12,
  },

  title: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: '800',
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  groupTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 10,
  },

  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  typeButton: {
    width: '31.5%',
    minHeight: 78,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E7DA',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 15,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },

  typeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },

  typeIcon: {
    fontSize: 25,
  },

  typeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },

  typeTextSelected: {
    color: colors.white,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  timeButton: {
    width: '23%',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E7DA',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 13,
  },

  timeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },

  timeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },

  timeTextSelected: {
    color: colors.white,
  },

  previewCard: {
    backgroundColor: '#FFF6E8',
    borderWidth: 1,
    borderColor: '#E8CFAB',
    borderRadius: 15,
    padding: 13,
    marginTop: 16,
  },

  previewLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  previewTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 5,
  },

  previewTime: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },

  note: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },

  disabled: {
    opacity: 0.45,
  },

  buttonPressed: {
    opacity: 0.68,
    transform: [{scale: 0.98}],
  },
});
