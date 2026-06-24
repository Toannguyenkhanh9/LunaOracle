import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  cancelSmartLunaNotifications,
  getSmartNotificationSettings,
  saveSmartNotificationSettings,
  scheduleSmartLunaNotifications,
  type SmartNotificationSettings,
} from '../services/smartLunaNotifications';

const TIMES = [
  {
    hour: 7,
    minute: 30,
    label: '07:30',
  },
  {
    hour: 8,
    minute: 30,
    label: '08:30',
  },
  {
    hour: 12,
    minute: 0,
    label: '12:00',
  },
  {
    hour: 20,
    minute: 30,
    label: '20:30',
  },
];

export default function SmartNotificationSettingsScreen() {
  const {t} =
    useTranslation();

  const [
    settings,
    setSettings,
  ] =
    useState<SmartNotificationSettings | undefined>();

  const load = useCallback(
    async () => {
      setSettings(
        await getSmartNotificationSettings(),
      );
    },
    [],
  );

  useFocusEffect(
    useCallback(
      () => {
        void load();
      },
      [load],
    ),
  );

  const update =
    async (
      next: SmartNotificationSettings,
    ) => {
      setSettings(next);
      await saveSmartNotificationSettings(
        next,
      );
    };

  const schedule =
    async () => {
      if (!settings) {
        return;
      }

      await scheduleSmartLunaNotifications(
        settings,
      );

      Alert.alert(
        t(
          'smartNotifications.savedTitle',
          {
            defaultValue:
              'Scheduled',
          },
        ),
        t(
          'smartNotifications.savedMessage',
          {
            defaultValue:
              'Smart Luna reminders are ready.',
          },
        ),
      );
    };

  const cancel =
    async () => {
      await cancelSmartLunaNotifications();

      if (settings) {
        await update({
          ...settings,
          enabled: false,
        });
      }

      Alert.alert(
        t(
          'smartNotifications.cancelledTitle',
          {
            defaultValue:
              'Cancelled',
          },
        ),
        t(
          'smartNotifications.cancelledMessage',
          {
            defaultValue:
              'Smart reminders were turned off.',
          },
        ),
      );
    };

  if (!settings) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>
            {t('common.loading', {
              defaultValue: 'Loading...',
            })}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'smartNotifications.eyebrow',
            {
              defaultValue:
                'Notifications',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'smartNotifications.title',
            {
              defaultValue:
                'Smart Push Notifications',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'smartNotifications.subtitle',
            {
              defaultValue:
                'Personalized reminders using your daily card, energy, and love signal.',
            },
          )}
        </Text>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.switchTitle}>
                {t(
                  'smartNotifications.enable',
                  {
                    defaultValue:
                      'Enable reminders',
                  },
                )}
              </Text>

              <Text style={styles.switchSubtitle}>
                {t(
                  'smartNotifications.enableSubtitle',
                  {
                    defaultValue:
                      'One personalized Luna reminder each day.',
                  },
                )}
              </Text>
            </View>

            <Switch
              value={settings.enabled}
              onValueChange={value =>
                update({
                  ...settings,
                  enabled:
                    value,
                })
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t(
              'smartNotifications.time',
              {
                defaultValue:
                  'Reminder time',
              },
            )}
          </Text>

          <View style={styles.timeGrid}>
            {TIMES.map(item => {
              const active =
                settings.hour ===
                  item.hour &&
                settings.minute ===
                  item.minute;

              return (
                <Pressable
                  key={item.label}
                  style={[
                    styles.timeButton,
                    active &&
                      styles.timeButtonActive,
                  ]}
                  onPress={() =>
                    update({
                      ...settings,
                      hour:
                        item.hour,
                      minute:
                        item.minute,
                    })
                  }>
                  <Text
                    style={[
                      styles.timeText,
                      active &&
                        styles.timeTextActive,
                    ]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {t(
              'smartNotifications.content',
              {
                defaultValue:
                  'Reminder focus',
              },
            )}
          </Text>

          <ToggleRow
            label={t(
              'smartNotifications.tarot',
              {
                defaultValue:
                  'Tarot card',
              },
            )}
            value={settings.tarotEnabled}
            onValueChange={value =>
              update({
                ...settings,
                tarotEnabled:
                  value,
              })
            }
          />

          <ToggleRow
            label={t(
              'smartNotifications.love',
              {
                defaultValue:
                  'Love signal',
              },
            )}
            value={settings.loveEnabled}
            onValueChange={value =>
              update({
                ...settings,
                loveEnabled:
                  value,
              })
            }
          />

          <ToggleRow
            label={t(
              'smartNotifications.forecast',
              {
                defaultValue:
                  'Forecast note',
              },
            )}
            value={settings.forecastEnabled}
            onValueChange={value =>
              update({
                ...settings,
                forecastEnabled:
                  value,
              })
            }
          />
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={schedule}>
          <Text style={styles.saveText}>
            {t(
              'smartNotifications.schedule',
              {
                defaultValue:
                  'Schedule Smart Reminders',
              },
            )}
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={cancel}>
          <Text style={styles.cancelText}>
            {t(
              'smartNotifications.cancel',
              {
                defaultValue:
                  'Turn Off Reminders',
              },
            )}
          </Text>
        </Pressable>

        <Text style={styles.notice}>
          {t(
            'smartNotifications.notice',
            {
              defaultValue:
                'On some Android versions, exact alarms may require additional permission.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>
        {label}
      </Text>

      <Switch
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  night: '#1B1537',
  purple: '#6E4DA8',
  gold: '#D9B76E',
  text: '#282236',
  muted: '#756D7D',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.muted,
    fontWeight: '800',
  },

  content: {
    padding: 18,
    paddingBottom: 110,
  },

  eyebrow: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  title: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  card: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 15,
    marginTop: 14,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  switchTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  switchTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },

  switchSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  sectionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  timeButton: {
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  timeButtonActive: {
    backgroundColor: COLORS.night,
  },

  timeText: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '900',
  },

  timeTextActive: {
    color: '#F8EBCB',
  },

  toggleRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  toggleLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    backgroundColor: COLORS.gold,
    borderRadius: 18,
    marginTop: 16,
  },

  saveText: {
    color: COLORS.night,
    fontSize: 14,
    fontWeight: '900',
  },

  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    backgroundColor: '#EEE6F4',
    borderRadius: 18,
    marginTop: 10,
  },

  cancelText: {
    color: COLORS.purple,
    fontSize: 13,
    fontWeight: '900',
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
