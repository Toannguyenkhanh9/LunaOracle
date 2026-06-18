import React, {
  useCallback,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  DEFAULT_SMART_NOTIFICATION_SETTINGS,
  getSmartNotificationSettings,
  refreshSmartNotifications,
  requestNotificationPermission,
  saveSmartNotificationSettings,
  type SmartNotificationSettings,
  type SmartReminderTime,
} from '../services/smartNotifications';
import {updateHomeWidget} from '../services/widget';
import {colors} from '../theme/colors';

const TIME_OPTIONS: SmartReminderTime[] = [
  {
    hour: 7,
    minute: 0,
  },
  {
    hour: 12,
    minute: 0,
  },
  {
    hour: 20,
    minute: 0,
  },
  {
    hour: 21,
    minute: 30,
  },
];

function timeKey(
  value: SmartReminderTime,
): string {
  return `${String(value.hour).padStart(
    2,
    '0',
  )}:${String(value.minute).padStart(
    2,
    '0',
  )}`;
}

type TimePickerProps = {
  value: SmartReminderTime;
  onChange: (
    value: SmartReminderTime,
  ) => void;
};

function TimePicker({
  value,
  onChange,
}: TimePickerProps) {
  return (
    <View style={styles.timeRow}>
      {TIME_OPTIONS.map(option => {
        const selected =
          timeKey(option) ===
          timeKey(value);

        return (
          <Pressable
            key={timeKey(option)}
            style={[
              styles.timeButton,
              selected &&
                styles.timeButtonSelected,
            ]}
            onPress={() =>
              onChange(option)
            }>
            <Text
              style={[
                styles.timeButtonText,
                selected &&
                  styles.timeButtonTextSelected,
              ]}>
              {timeKey(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SmartReminderScreen() {
  const {t} = useTranslation();

  const [settings, setSettings] =
    useState<SmartNotificationSettings>(
      DEFAULT_SMART_NOTIFICATION_SETTINGS,
    );

  const [isWorking, setIsWorking] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      getSmartNotificationSettings().then(
        setSettings,
      );
    }, []),
  );

  const buildCopy = () => ({
    dailyTitle: t(
      'smartFeatures.dailyTitle',
    ),
    dailyBody: t(
      'smartFeatures.dailyBody',
    ),
    streakTitle: t(
      'smartFeatures.streakTitle',
    ),
    streakBody: t(
      'smartFeatures.streakBody',
    ),
    buddhistTitle: (
      day: number,
      month: number,
    ) =>
      t(
        'smartFeatures.buddhistTitle',
        {
          day,
          month,
        },
      ),
    buddhistBody: (
      eventTitleKey: string,
    ) =>
      t(
        'smartFeatures.buddhistBody',
        {
          event: t(eventTitleKey),
        },
      ),
  });

  const saveAndSchedule = async () => {
    setIsWorking(true);

    try {
      const granted =
        await requestNotificationPermission();

      if (!granted) {
        Alert.alert(
          t(
            'smartFeatures.permissionTitle',
          ),
          t(
            'smartFeatures.permissionMessage',
          ),
        );

        return;
      }

      await saveSmartNotificationSettings(
        settings,
      );

      await refreshSmartNotifications(
        buildCopy(),
      );

      Alert.alert(
        t('smartFeatures.savedTitle'),
        t('smartFeatures.savedMessage'),
      );
    } catch (error) {
      console.warn(error);

      Alert.alert(
        t('smartFeatures.errorTitle'),
        t('smartFeatures.errorMessage'),
      );
    } finally {
      setIsWorking(false);
    }
  };

  const refreshWidget = async () => {
    const updated = await updateHomeWidget(
      t('smartFeatures.widgetTitle'),
      t(
        'smartFeatures.widgetSubtitle',
      ),
    );

    Alert.alert(
      updated
        ? t(
            'smartFeatures.widgetUpdatedTitle',
          )
        : t(
            'smartFeatures.widgetUnavailableTitle',
          ),
      updated
        ? t(
            'smartFeatures.widgetUpdatedMessage',
          )
        : t(
            'smartFeatures.widgetUnavailableMessage',
          ),
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>
            🔔
          </Text>

          <Text style={styles.title}>
            {t('smartFeatures.title')}
          </Text>

          <Text style={styles.subtitle}>
            {t('smartFeatures.subtitle')}
          </Text>
        </View>

        <SettingCard
          title={t(
            'smartFeatures.masterTitle',
          )}
          description={t(
            'smartFeatures.masterDescription',
          )}
          value={settings.enabled}
          onChange={value =>
            setSettings(current => ({
              ...current,
              enabled: value,
            }))
          }
        />

        <SettingCard
          title={t(
            'smartFeatures.dailyReminder',
          )}
          description={t(
            'smartFeatures.dailyReminderDescription',
          )}
          value={
            settings.dailyPracticeEnabled
          }
          onChange={value =>
            setSettings(current => ({
              ...current,
              dailyPracticeEnabled: value,
            }))
          }>
          <TimePicker
            value={
              settings.dailyPracticeTime
            }
            onChange={value =>
              setSettings(current => ({
                ...current,
                dailyPracticeTime:
                  value,
              }))
            }
          />
        </SettingCard>

        <SettingCard
          title={t(
            'smartFeatures.streakProtection',
          )}
          description={t(
            'smartFeatures.streakProtectionDescription',
          )}
          value={
            settings.streakProtectionEnabled
          }
          onChange={value =>
            setSettings(current => ({
              ...current,
              streakProtectionEnabled:
                value,
            }))
          }>
          <TimePicker
            value={
              settings.streakProtectionTime
            }
            onChange={value =>
              setSettings(current => ({
                ...current,
                streakProtectionTime:
                  value,
              }))
            }
          />
        </SettingCard>

        <SettingCard
          title={t(
            'smartFeatures.buddhistCalendarReminder',
          )}
          description={t(
            'smartFeatures.buddhistCalendarReminderDescription',
          )}
          value={
            settings.buddhistCalendarEnabled
          }
          onChange={value =>
            setSettings(current => ({
              ...current,
              buddhistCalendarEnabled:
                value,
            }))
          }>
          <TimePicker
            value={
              settings.buddhistCalendarTime
            }
            onChange={value =>
              setSettings(current => ({
                ...current,
                buddhistCalendarTime:
                  value,
              }))
            }
          />
        </SettingCard>

        <Pressable
          disabled={isWorking}
          style={[
            styles.saveButton,
            isWorking &&
              styles.buttonDisabled,
          ]}
          onPress={saveAndSchedule}>
          <Text
            style={styles.saveButtonText}>
            {isWorking
              ? t(
                  'smartFeatures.saving',
                )
              : t(
                  'smartFeatures.save',
                )}
          </Text>
        </Pressable>

        <View style={styles.widgetCard}>
          <Text style={styles.widgetIcon}>
            🪷
          </Text>

          <View style={styles.widgetInfo}>
            <Text
              style={styles.widgetTitle}>
              {t(
                'smartFeatures.widgetSectionTitle',
              )}
            </Text>

            <Text
              style={
                styles.widgetDescription
              }>
              {t(
                'smartFeatures.widgetDescription',
              )}
            </Text>
          </View>

          <Pressable
            style={
              styles.widgetRefreshButton
            }
            onPress={refreshWidget}>
            <Text
              style={
                styles.widgetRefreshText
              }>
              {t(
                'smartFeatures.refreshWidget',
              )}
            </Text>
          </Pressable>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            {t('smartFeatures.notice')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingCard({
  title,
  description,
  value,
  onChange,
  children,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.settingCard}>
      <View style={styles.settingHeader}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>
            {title}
          </Text>

          <Text
            style={
              styles.settingDescription
            }>
            {description}
          </Text>
        </View>

        <Switch
          value={value}
          onValueChange={onChange}
        />
      </View>

      {value && children}
    </View>
  );
}

const BROWN = '#4A2A1A';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#F0DFC5',
    borderRadius: 24,
    padding: 22,
  },
  heroIcon: {
    fontSize: 44,
  },
  title: {
    color: BROWN,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 7,
  },
  subtitle: {
    color: '#775F4B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 7,
  },
  settingCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E7D8BE',
    borderRadius: 19,
    padding: 16,
    marginTop: 12,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '800',
  },
  settingDescription: {
    color: '#7B6653',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 13,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#D9C5A6',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginRight: 7,
    marginBottom: 7,
  },
  timeButtonSelected: {
    backgroundColor: BROWN,
    borderColor: BROWN,
  },
  timeButtonText: {
    color: '#765F4C',
    fontSize: 11,
    fontWeight: '700',
  },
  timeButtonTextSelected: {
    color: '#FFE4A5',
  },
  saveButton: {
    minHeight: 53,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderRadius: 16,
    marginTop: 18,
  },
  saveButtonText: {
    color: '#FFE4A5',
    fontSize: 14,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  widgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4D8',
    borderWidth: 1,
    borderColor: '#D8AD60',
    borderRadius: 18,
    padding: 15,
    marginTop: 14,
  },
  widgetIcon: {
    fontSize: 30,
    marginRight: 11,
  },
  widgetInfo: {
    flex: 1,
  },
  widgetTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '800',
  },
  widgetDescription: {
    color: '#765F4C',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
  widgetRefreshButton: {
    backgroundColor: BROWN,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 8,
  },
  widgetRefreshText: {
    color: '#FFE4A5',
    fontSize: 10,
    fontWeight: '800',
  },
  noticeCard: {
    backgroundColor: '#F4E8D7',
    borderRadius: 16,
    padding: 15,
    marginTop: 14,
  },
  noticeText: {
    color: '#75604D',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});
