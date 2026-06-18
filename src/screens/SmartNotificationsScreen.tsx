import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

import {
  getSmartNotificationPreferences,
  requestSmartNotificationPermission,
  scheduleSmartNotifications,
  type SmartNotificationPreferences,
} from '../services/smartNotifications';

import {
  getUserProfiles,
  type UserProfile,
} from '../services/userProfiles';

import {
  refreshHomeWidget,
} from '../services/homeWidget';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'SmartNotifications'
>;

function Stepper({
  value,
  min,
  max,
  onChange,
  format,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (
    value: number,
  ) => void;
  format?: (
    value: number,
  ) => string;
}) {
  const normalize = (
    next: number,
  ) => {
    if (next < min) {
      return max;
    }

    if (next > max) {
      return min;
    }

    return next;
  };

  return (
    <View style={styles.stepper}>
      <Pressable
        style={styles.stepButton}
        onPress={() =>
          onChange(
            normalize(
              value - 1,
            ),
          )
        }>
        <Text style={styles.stepButtonText}>
          −
        </Text>
      </Pressable>

      <Text style={styles.stepValue}>
        {format
          ? format(value)
          : value}
      </Text>

      <Pressable
        style={styles.stepButton}
        onPress={() =>
          onChange(
            normalize(
              value + 1,
            ),
          )
        }>
        <Text style={styles.stepButtonText}>
          ＋
        </Text>
      </Pressable>
    </View>
  );
}

function SettingRow({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (
    value: boolean,
  ) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingTextWrap}>
        <Text style={styles.settingTitle}>
          {title}
        </Text>

        <Text style={styles.settingSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: '#C9C1B5',
          true: '#B8944D',
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function SmartNotificationsScreen({
  navigation,
}: Props) {
  const {t, i18n} =
    useTranslation();

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  const [profiles, setProfiles] =
    useState<UserProfile[]>([]);

  const [
    preferences,
    setPreferences,
  ] =
    useState<SmartNotificationPreferences | null>(
      null,
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const load = useCallback(async () => {
    try {
      const [
        nextPreferences,
        nextProfiles,
      ] = await Promise.all([
        getSmartNotificationPreferences(),
        getUserProfiles(),
      ]);

      setPreferences(
        nextPreferences,
      );

      setProfiles(
        nextProfiles,
      );
    } catch (error) {
      console.warn(
        'Unable to load notification settings:',
        error,
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const update = (
    patch: Partial<
      SmartNotificationPreferences
    >,
  ) => {
    if (!preferences) {
      return;
    }

    setPreferences({
      ...preferences,
      ...patch,
    });
  };

  const save = async () => {
    if (
      !preferences ||
      isSaving
    ) {
      return;
    }

    setIsSaving(true);

    try {
      if (
        preferences.dailyEnabled ||
        preferences.monthlyEnabled
      ) {
        const granted =
          await requestSmartNotificationPermission();

        if (!granted) {
          Alert.alert(
            t(
              'smartNotifications.permissionTitle',
            ),
            t(
              'smartNotifications.permissionMessage',
            ),
          );

          return;
        }
      }

      const result =
        await scheduleSmartNotifications(
          preferences,
          language,
        );

      await refreshHomeWidget(
        language,
        preferences.dailyProfileId,
      ).catch(() =>
        false,
      );

      Alert.alert(
        t(
          'smartNotifications.savedTitle',
        ),
        t(
          'smartNotifications.savedMessage',
          {
            daily:
              result.dailyScheduled,
            monthly:
              result.monthlyScheduled,
          },
        ),
      );
    } catch (error) {
      console.warn(
        'Unable to schedule smart notifications:',
        error,
      );

      Alert.alert(
        t(
          'smartNotifications.errorTitle',
        ),
        t(
          'smartNotifications.errorMessage',
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!preferences) {
    return (
      <SafeAreaView
        style={styles.loading}>
        <Text style={styles.loadingText}>
          {t(
            'smartNotifications.loading',
          )}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.navy
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.hero}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }>
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.heroTextWrap}>
            <Text style={styles.heroEyebrow}>
              EASTERN DESTINY
            </Text>

            <Text style={styles.heroTitle}>
              {t(
                'smartNotifications.title',
              )}
            </Text>

            <Text style={styles.heroSubtitle}>
              {t(
                'smartNotifications.subtitle',
              )}
            </Text>
          </View>

          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>
              ◉
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'smartNotifications.dailyEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'smartNotifications.dailyTitle',
            )}
          </Text>

          <View style={styles.settingsCard}>
            <SettingRow
              title={t(
                'smartNotifications.dailyToggleTitle',
              )}
              subtitle={t(
                'smartNotifications.dailyToggleSubtitle',
              )}
              value={
                preferences.dailyEnabled
              }
              onChange={value =>
                update({
                  dailyEnabled:
                    value,
                })
              }
            />

            <View
              style={[
                styles.timeRow,
                !preferences.dailyEnabled &&
                  styles.disabled,
              ]}>
              <Text style={styles.timeLabel}>
                {t(
                  'smartNotifications.deliveryTime',
                )}
              </Text>

              <View style={styles.timeControls}>
                <Stepper
                  value={
                    preferences.dailyHour
                  }
                  min={0}
                  max={23}
                  onChange={value =>
                    update({
                      dailyHour:
                        value,
                    })
                  }
                  format={value =>
                    String(
                      value,
                    ).padStart(
                      2,
                      '0',
                    )
                  }
                />

                <Text style={styles.timeColon}>
                  :
                </Text>

                <Stepper
                  value={
                    preferences.dailyMinute
                  }
                  min={0}
                  max={59}
                  onChange={value =>
                    update({
                      dailyMinute:
                        value,
                    })
                  }
                  format={value =>
                    String(
                      value,
                    ).padStart(
                      2,
                      '0',
                    )
                  }
                />
              </View>
            </View>
          </View>
        </View>

        {profiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>
              {t(
                'smartNotifications.profileEyebrow',
              )}
            </Text>

            <Text style={styles.sectionTitle}>
              {t(
                'smartNotifications.profileTitle',
              )}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.profileRow
              }>
              {profiles.map(
                profile => {
                  const selected =
                    preferences.dailyProfileId ===
                    profile.id;

                  return (
                    <Pressable
                      key={profile.id}
                      style={[
                        styles.profileChip,
                        selected &&
                          styles.profileChipActive,
                      ]}
                      onPress={() =>
                        update({
                          dailyProfileId:
                            profile.id,
                        })
                      }>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.profileChipText,
                          selected &&
                            styles.profileChipTextActive,
                        ]}>
                        {
                          profile.displayName
                        }
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            {t(
              'smartNotifications.monthlyEyebrow',
            )}
          </Text>

          <Text style={styles.sectionTitle}>
            {t(
              'smartNotifications.monthlyTitle',
            )}
          </Text>

          <View style={styles.settingsCard}>
            <SettingRow
              title={t(
                'smartNotifications.monthlyToggleTitle',
              )}
              subtitle={t(
                'smartNotifications.monthlyToggleSubtitle',
              )}
              value={
                preferences.monthlyEnabled
              }
              onChange={value =>
                update({
                  monthlyEnabled:
                    value,
                })
              }
            />

            <View
              style={[
                styles.monthlyControls,
                !preferences.monthlyEnabled &&
                  styles.disabled,
              ]}>
              <View style={styles.monthlyControlBlock}>
                <Text style={styles.timeLabel}>
                  {t(
                    'smartNotifications.dayOfMonth',
                  )}
                </Text>

                <Stepper
                  value={
                    preferences.monthlyDay
                  }
                  min={1}
                  max={28}
                  onChange={value =>
                    update({
                      monthlyDay:
                        value,
                    })
                  }
                />
              </View>

              <View style={styles.monthlyControlBlock}>
                <Text style={styles.timeLabel}>
                  {t(
                    'smartNotifications.deliveryTime',
                  )}
                </Text>

                <View style={styles.timeControls}>
                  <Stepper
                    value={
                      preferences.monthlyHour
                    }
                    min={0}
                    max={23}
                    onChange={value =>
                      update({
                        monthlyHour:
                          value,
                      })
                    }
                    format={value =>
                      String(
                        value,
                      ).padStart(
                        2,
                        '0',
                      )
                    }
                  />

                  <Text style={styles.timeColon}>
                    :
                  </Text>

                  <Stepper
                    value={
                      preferences.monthlyMinute
                    }
                    min={0}
                    max={59}
                    onChange={value =>
                      update({
                        monthlyMinute:
                          value,
                      })
                    }
                    format={value =>
                      String(
                        value,
                      ).padStart(
                        2,
                        '0',
                      )
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.widgetCard}>
          <Text style={styles.widgetTitle}>
            {t(
              'smartNotifications.widgetTitle',
            )}
          </Text>

          <Text style={styles.widgetText}>
            {t(
              'smartNotifications.widgetMessage',
            )}
          </Text>

          <Pressable
            style={styles.widgetButton}
            onPress={() =>
              void refreshHomeWidget(
                language,
                preferences.dailyProfileId,
              )
            }>
            <Text style={styles.widgetButtonText}>
              {t(
                'smartNotifications.refreshWidget',
              )}
            </Text>
          </Pressable>
        </View>

        <Pressable
          disabled={isSaving}
          style={[
            styles.saveButton,
            isSaving &&
              styles.disabled,
          ]}
          onPress={() =>
            void save()
          }>
          <Text style={styles.saveButtonText}>
            {isSaving
              ? t(
                  'smartNotifications.saving',
                )
              : t(
                  'smartNotifications.save',
                )}
          </Text>
        </Pressable>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>
            {t(
              'smartNotifications.noticeTitle',
            )}
          </Text>

          <Text style={styles.noticeText}>
            {t(
              'smartNotifications.notice',
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  navy: '#17243A',
  gold: '#D7AF5E',
  cream: '#F7F2E8',
  surface: '#FFFDF8',
  text: '#282D36',
  muted: '#6C726F',
  border: '#E2D7C5',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.cream,
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  content: {
    paddingBottom: 145,
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.navy,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 13,
  },

  backText: {
    color: '#FFF3D3',
    fontSize: 29,
  },

  heroTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  heroEyebrow: {
    color: '#D5B672',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#FFF7E5',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 3,
  },

  heroSubtitle: {
    color: '#C8CFD9',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },

  heroIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.14)',
    borderRadius: 14,
  },

  heroIconText: {
    color: '#F0D18B',
    fontSize: 21,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 21,
  },

  sectionEyebrow: {
    color: '#9B783B',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  settingsCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    marginTop: 11,
    overflow: 'hidden',
  },

  settingRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor:
      COLORS.border,
  },

  settingTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  settingTitle: {
    color: COLORS.text,
    fontSize: 11.5,
    fontWeight: '900',
  },

  settingSubtitle: {
    color: COLORS.muted,
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 4,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  timeLabel: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '900',
  },

  timeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },

  timeColon: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    marginHorizontal: 5,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEE7DC',
    borderRadius: 11,
    overflow: 'hidden',
  },

  stepButton: {
    width: 31,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepButtonText: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '900',
  },

  stepValue: {
    minWidth: 34,
    color: COLORS.text,
    fontSize: 10.5,
    fontWeight: '900',
    textAlign: 'center',
  },

  profileRow: {
    paddingTop: 10,
    paddingRight: 12,
  },

  profileChip: {
    minWidth: 108,
    maxWidth: 170,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },

  profileChipActive: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  profileChipText: {
    color: COLORS.text,
    fontSize: 9.5,
    fontWeight: '800',
  },

  profileChipTextActive: {
    color: '#FFF1D0',
  },

  monthlyControls: {
    padding: 14,
  },

  monthlyControlBlock: {
    marginBottom: 14,
  },

  widgetCard: {
    backgroundColor: '#E8EDF3',
    borderRadius: 17,
    padding: 15,
    marginHorizontal: 16,
    marginTop: 22,
  },

  widgetTitle: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '900',
  },

  widgetText: {
    color: '#5F6875',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  widgetButton: {
    alignSelf: 'flex-start',
    backgroundColor:
      COLORS.gold,
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 11,
  },

  widgetButtonText: {
    color: COLORS.navy,
    fontSize: 9,
    fontWeight: '900',
  },

  saveButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.gold,
    borderRadius: 15,
    marginHorizontal: 16,
    marginTop: 16,
  },

  saveButtonText: {
    color: COLORS.navy,
    fontSize: 10.5,
    fontWeight: '900',
  },

  noticeCard: {
    backgroundColor: '#F6EAE6',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
  },

  noticeTitle: {
    color: '#7F4E47',
    fontSize: 10.5,
    fontWeight: '900',
  },

  noticeText: {
    color: '#765D59',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  disabled: {
    opacity: 0.48,
  },
});
