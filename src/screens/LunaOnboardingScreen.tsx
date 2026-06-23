import React, {
  useState,
} from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  completeLunaOnboarding,
  createBirthInputFromOnboarding,
  type OnboardingFocus,
} from '../services/lunaOnboarding';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
  reset?: (
    state: {
      index: number;
      routes: Array<{
        name: string;
      }>;
    },
  ) => void;
};

const FOCUS:
  OnboardingFocus[] = [
    'love',
    'career',
    'selfGrowth',
    'tarot',
    'moon',
  ];

export default function LunaOnboardingScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const [
    step,
    setStep,
  ] =
    useState(0);

  const [
    isSaving,
    setSaving,
  ] =
    useState(false);

  const [
    focus,
    setFocus,
  ] =
    useState<OnboardingFocus[]>([
      'selfGrowth',
    ]);

  const [
    form,
    setForm,
  ] =
    useState({
      name: '',
      year: '1995',
      month: '3',
      day: '21',
      hour: '12',
      minute: '0',
      timezoneOffset: '7',
      latitude: '10.7769',
      longitude: '106.7009',
    });

  const update = (
    key: keyof typeof form,
    value: string,
  ) => {
    setForm(
      current => ({
        ...current,
        [key]:
          value,
      }),
    );
  };

  const toggleFocus = (
    item: OnboardingFocus,
  ) => {
    setFocus(
      current =>
        current.includes(item)
          ? current.filter(
              value => value !== item,
            )
          : [
              ...current,
              item,
            ],
    );
  };

  const next = () => {
    setStep(
      current =>
        Math.min(
          3,
          current + 1,
        ),
    );
  };

  const back = () => {
    setStep(
      current =>
        Math.max(
          0,
          current - 1,
        ),
    );
  };

  const finish = async () => {
    setSaving(true);

    try {
      await completeLunaOnboarding({
        name:
          form.name,
        input:
          createBirthInputFromOnboarding(
            form,
          ),
        focus,
      });

      if (navigation.reset) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
            },
          ],
        });
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.warn(
        'Unable to complete onboarding:',
        error,
      );

      Alert.alert(
        t(
          'lunaOnboarding.errorTitle',
          {
            defaultValue:
              'Unable to finish',
          },
        ),
        t(
          'lunaOnboarding.errorMessage',
          {
            defaultValue:
              'Please check your details and try again.',
          },
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.progressDots}>
            {[0, 1, 2, 3].map(index => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index <= step &&
                    styles.dotActive,
                ]}
              />
            ))}
          </View>

          {step === 0 ? (
            <View style={styles.heroCard}>
              <Text style={styles.logo}>
                ☾
              </Text>

              <Text style={styles.eyebrow}>
                {t(
                  'lunaOnboarding.welcomeEyebrow',
                  {
                    defaultValue:
                      'Luna Oracle',
                  },
                )}
              </Text>

              <Text style={styles.title}>
                {t(
                  'lunaOnboarding.welcomeTitle',
                  {
                    defaultValue:
                      'Your sky, your cards, your rhythm',
                  },
                )}
              </Text>

              <Text style={styles.subtitle}>
                {t(
                  'lunaOnboarding.welcomeSubtitle',
                  {
                    defaultValue:
                      'Create a simple birth profile so Luna Oracle can personalize horoscope, tarot, Moon rhythm, and love insights.',
                  },
                )}
              </Text>
            </View>
          ) : null}

          {step === 1 ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                {t(
                  'lunaOnboarding.profileTitle',
                  {
                    defaultValue:
                      'Create your birth profile',
                  },
                )}
              </Text>

              <Field
                label={t(
                  'lunaOnboarding.name',
                  {
                    defaultValue:
                      'Name',
                  },
                )}
                value={form.name}
                onChangeText={value =>
                  update(
                    'name',
                    value,
                  )
                }
                placeholder="Luna"
              />

              <View style={styles.grid}>
                <Field
                  label={t(
                    'lunaOnboarding.year',
                    {
                      defaultValue:
                        'Year',
                    },
                  )}
                  value={form.year}
                  onChangeText={value =>
                    update(
                      'year',
                      value,
                    )
                  }
                  keyboardType="number-pad"
                />

                <Field
                  label={t(
                    'lunaOnboarding.month',
                    {
                      defaultValue:
                        'Month',
                    },
                  )}
                  value={form.month}
                  onChangeText={value =>
                    update(
                      'month',
                      value,
                    )
                  }
                  keyboardType="number-pad"
                />

                <Field
                  label={t(
                    'lunaOnboarding.day',
                    {
                      defaultValue:
                        'Day',
                    },
                  )}
                  value={form.day}
                  onChangeText={value =>
                    update(
                      'day',
                      value,
                    )
                  }
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.grid}>
                <Field
                  label={t(
                    'lunaOnboarding.hour',
                    {
                      defaultValue:
                        'Hour',
                    },
                  )}
                  value={form.hour}
                  onChangeText={value =>
                    update(
                      'hour',
                      value,
                    )
                  }
                  keyboardType="number-pad"
                />

                <Field
                  label={t(
                    'lunaOnboarding.minute',
                    {
                      defaultValue:
                        'Minute',
                    },
                  )}
                  value={form.minute}
                  onChangeText={value =>
                    update(
                      'minute',
                      value,
                    )
                  }
                  keyboardType="number-pad"
                />

                <Field
                  label={t(
                    'lunaOnboarding.utc',
                    {
                      defaultValue:
                        'UTC',
                    },
                  )}
                  value={form.timezoneOffset}
                  onChangeText={value =>
                    update(
                      'timezoneOffset',
                      value,
                    )
                  }
                  keyboardType="numbers-and-punctuation"
                />
              </View>

              <Text style={styles.hint}>
                {t(
                  'lunaOnboarding.timeHint',
                  {
                    defaultValue:
                      'Unknown birth time? Keep 12:00 for a general chart.',
                  },
                )}
              </Text>
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                {t(
                  'lunaOnboarding.placeTitle',
                  {
                    defaultValue:
                      'Birth place',
                  },
                )}
              </Text>

              <Text style={styles.hintTop}>
                {t(
                  'lunaOnboarding.placeHint',
                  {
                    defaultValue:
                      'You can adjust latitude and longitude later. Default is Ho Chi Minh City.',
                  },
                )}
              </Text>

              <Field
                label={t(
                  'lunaOnboarding.latitude',
                  {
                    defaultValue:
                      'Latitude',
                  },
                )}
                value={form.latitude}
                onChangeText={value =>
                  update(
                    'latitude',
                    value,
                  )
                }
                keyboardType="numbers-and-punctuation"
              />

              <Field
                label={t(
                  'lunaOnboarding.longitude',
                  {
                    defaultValue:
                      'Longitude',
                  },
                )}
                value={form.longitude}
                onChangeText={value =>
                  update(
                    'longitude',
                    value,
                  )
                }
                keyboardType="numbers-and-punctuation"
              />
            </View>
          ) : null}

          {step === 3 ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                {t(
                  'lunaOnboarding.focusTitle',
                  {
                    defaultValue:
                      'What should Luna focus on?',
                  },
                )}
              </Text>

              <Text style={styles.hintTop}>
                {t(
                  'lunaOnboarding.focusHint',
                  {
                    defaultValue:
                      'Choose the areas you want to see more often on Home.',
                  },
                )}
              </Text>

              <View style={styles.focusGrid}>
                {FOCUS.map(item => {
                  const active =
                    focus.includes(item);

                  return (
                    <Pressable
                      key={item}
                      style={[
                        styles.focusChip,
                        active &&
                          styles.focusChipActive,
                      ]}
                      onPress={() =>
                        toggleFocus(item)
                      }>
                      <Text
                        style={[
                          styles.focusIcon,
                          active &&
                            styles.focusTextActive,
                        ]}>
                        {t(
                          `lunaOnboarding.focus.${item}.icon`,
                          {
                            defaultValue:
                              '✦',
                          },
                        )}
                      </Text>

                      <Text
                        style={[
                          styles.focusText,
                          active &&
                            styles.focusTextActive,
                        ]}>
                        {t(
                          `lunaOnboarding.focus.${item}.label`,
                          {
                            defaultValue:
                              item,
                          },
                        )}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.footer}>
            {step > 0 ? (
              <Pressable
                style={styles.backButton}
                onPress={back}>
                <Text style={styles.backText}>
                  {t(
                    'common.back',
                    {
                      defaultValue:
                        'Back',
                    },
                  )}
                </Text>
              </Pressable>
            ) : (
              <View style={styles.backButtonGhost} />
            )}

            <Pressable
              style={styles.nextButton}
              disabled={isSaving}
              onPress={
                step === 3
                  ? finish
                  : next
              }>
              <Text style={styles.nextText}>
                {step === 3
                  ? isSaving
                    ? t(
                        'lunaOnboarding.saving',
                        {
                          defaultValue:
                            'Saving...',
                        },
                      )
                    : t(
                        'lunaOnboarding.finish',
                        {
                          defaultValue:
                            'Start Luna',
                        },
                      )
                  : t(
                      'common.next',
                      {
                        defaultValue:
                          'Next',
                      },
                    )}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (
    value: string,
  ) => void;
  placeholder?: string;
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'numbers-and-punctuation';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A99DAF"
        keyboardType={
          keyboardType ?? 'default'
        }
        style={styles.input}
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
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 36,
  },
  progressDots: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  dot: {
    width: 32,
    height: 6,
    backgroundColor: '#E7DCCB',
    borderRadius: 99,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.gold,
  },
  heroCard: {
    backgroundColor: COLORS.night,
    borderRadius: 32,
    padding: 24,
    minHeight: 460,
    justifyContent: 'center',
  },
  logo: {
    color: COLORS.gold,
    fontSize: 58,
    fontWeight: '900',
    textAlign: 'center',
  },
  eyebrow: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 18,
  },
  title: {
    color: '#FFF8EA',
    fontSize: 35,
    lineHeight: 42,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    color: '#DCD2F3',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 14,
  },
  card: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 28,
    padding: 18,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 14,
  },
  hintTop: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: -4,
    marginBottom: 12,
  },
  hint: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },
  field: {
    flex: 1,
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    backgroundColor: '#F7F2EA',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 12,
  },
  grid: {
    flexDirection: 'row',
    columnGap: 8,
  },
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  focusChip: {
    width: '50%',
    padding: 5,
  },
  focusChipActive: {},
  focusIcon: {
    color: COLORS.purple,
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#EEE6F4',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 14,
  },
  focusText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#EEE6F4',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingVertical: 12,
  },
  focusTextActive: {
    color: COLORS.gold,
    backgroundColor: COLORS.night,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  backButton: {
    minHeight: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  backButtonGhost: {
    width: 82,
    marginRight: 10,
  },
  backText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  nextButton: {
    flex: 1,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 17,
  },
  nextText: {
    color: '#F8EBCB',
    fontSize: 14,
    fontWeight: '900',
  },
});
