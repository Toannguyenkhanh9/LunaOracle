import React, {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

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
  DEFAULT_USER_PROFILE_DRAFT,
  getUserProfile,
  saveUserProfile,
  userProfileToDraft,
  type BirthTimeAccuracy,
  type UserProfileDraft,
  type UserProfileGender,
  type UserProfileRelationship,
} from '../services/userProfiles';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'UserProfileEditor'
>;

type Choice<T extends string> = {
  value: T;
  icon: string;
  labelKey: string;
};

const RELATIONSHIP_OPTIONS: Array<
  Choice<UserProfileRelationship>
> = [
  {
    value: 'self',
    icon: '●',
    labelKey:
      'userProfiles.relationships.self',
  },
  {
    value: 'partner',
    icon: '♥',
    labelKey:
      'userProfiles.relationships.partner',
  },
  {
    value: 'parent',
    icon: '↑',
    labelKey:
      'userProfiles.relationships.parent',
  },
  {
    value: 'child',
    icon: '↓',
    labelKey:
      'userProfiles.relationships.child',
  },
  {
    value: 'sibling',
    icon: '◇',
    labelKey:
      'userProfiles.relationships.sibling',
  },
  {
    value: 'friend',
    icon: '☆',
    labelKey:
      'userProfiles.relationships.friend',
  },
  {
    value: 'client',
    icon: '▣',
    labelKey:
      'userProfiles.relationships.client',
  },
  {
    value: 'other',
    icon: '…',
    labelKey:
      'userProfiles.relationships.other',
  },
];

const GENDER_OPTIONS: Array<
  Choice<UserProfileGender>
> = [
  {
    value: 'male',
    icon: '♂',
    labelKey:
      'userProfiles.genders.male',
  },
  {
    value: 'female',
    icon: '♀',
    labelKey:
      'userProfiles.genders.female',
  },
  {
    value: 'unspecified',
    icon: '◌',
    labelKey:
      'userProfiles.genders.unspecified',
  },
];

const TIME_ACCURACY_OPTIONS: Array<
  Choice<BirthTimeAccuracy>
> = [
  {
    value: 'exact',
    icon: '●',
    labelKey:
      'userProfiles.timeAccuracy.exact',
  },
  {
    value: 'approximate',
    icon: '≈',
    labelKey:
      'userProfiles.timeAccuracy.approximate',
  },
  {
    value: 'unknown',
    icon: '?',
    labelKey:
      'userProfiles.timeAccuracy.unknown',
  },
];

function errorKey(
  error: unknown,
): string {
  const code =
    error instanceof Error
      ? error.message
      : '';

  switch (code) {
    case 'DISPLAY_NAME_REQUIRED':
      return 'userProfiles.errors.displayNameRequired';

    case 'INVALID_DAY':
    case 'INVALID_MONTH':
    case 'INVALID_YEAR':
    case 'INVALID_BIRTH_DATE':
      return 'userProfiles.errors.invalidDate';

    case 'INVALID_HOUR':
    case 'INVALID_MINUTE':
    case 'INVALID_BIRTH_TIME':
      return 'userProfiles.errors.invalidTime';

    case 'TIME_ZONE_REQUIRED':
      return 'userProfiles.errors.timeZoneRequired';

    case 'INVALID_LONGITUDE':
    case 'INVALID_LATITUDE':
      return 'userProfiles.errors.invalidCoordinate';

    default:
      return 'userProfiles.errors.saveFailed';
  }
}

function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Text style={styles.fieldLabel}>
      {children}
    </Text>
  );
}

function ChoiceGroup<T extends string>({
  options,
  value,
  onChange,
  t,
}: {
  options: Array<Choice<T>>;
  value: T;
  onChange: (
    value: T,
  ) => void;
  t: (
    key: string,
  ) => string;
}) {
  return (
    <View style={styles.choiceGrid}>
      {options.map(option => {
        const selected =
          option.value === value;

        return (
          <Pressable
            key={option.value}
            style={({pressed}) => [
              styles.choiceButton,
              selected &&
                styles.choiceButtonSelected,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              onChange(option.value)
            }>
            <Text
              style={[
                styles.choiceIcon,
                selected &&
                  styles.choiceIconSelected,
              ]}>
              {option.icon}
            </Text>

            <Text
              style={[
                styles.choiceLabel,
                selected &&
                  styles.choiceLabelSelected,
              ]}>
              {t(option.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function UserProfileEditorScreen({
  navigation,
  route,
}: Props) {
  const {t} =
    useTranslation();

  const profileId =
    route.params?.profileId;

  const [draft, setDraft] =
    useState<UserProfileDraft>(
      DEFAULT_USER_PROFILE_DRAFT,
    );

  const [isLoading, setIsLoading] =
    useState(Boolean(profileId));

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    if (!profileId) {
      setDraft(
        DEFAULT_USER_PROFILE_DRAFT,
      );
      setIsLoading(false);
      return;
    }

    let active = true;

    getUserProfile(profileId)
      .then(profile => {
        if (!active || !profile) {
          return;
        }

        setDraft(
          userProfileToDraft(
            profile,
          ),
        );
      })
      .catch(error => {
        console.warn(
          'Unable to load user profile:',
          error,
        );
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [profileId]);

  const update = <
    K extends keyof UserProfileDraft,
  >(
    key: K,
    value: UserProfileDraft[K],
  ) => {
    setDraft(current => ({
      ...current,
      [key]: value,
    }));
  };

  const save = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await saveUserProfile(
        draft,
        profileId,
      );

      Alert.alert(
        t(
          'userProfiles.savedTitle',
        ),
        t(
          'userProfiles.savedMessage',
        ),
        [
          {
            text: t(
              'userProfiles.done',
            ),
            onPress: () =>
              navigation.navigate(
                'UserProfiles',
              ),
          },
        ],
      );
    } catch (error) {
      console.warn(
        'Unable to save user profile:',
        error,
      );

      Alert.alert(
        t(
          'userProfiles.errors.title',
        ),
        t(
          errorKey(error),
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>
            {t(
              'userProfiles.loading',
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const timeUnknown =
    draft.birthTimeAccuracy ===
    'unknown';

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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        <View style={styles.header}>
          <Pressable
            style={({pressed}) => [
              styles.headerButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.goBack()
            }>
            <Text
              style={
                styles.headerButtonText
              }>
              ‹
            </Text>
          </Pressable>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>
              {profileId
                ? t(
                    'userProfiles.editTitle',
                  )
                : t(
                    'userProfiles.createTitle',
                  )}
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }>
              {t(
                'userProfiles.editorSubtitle',
              )}
            </Text>
          </View>

          <View
            style={
              styles.headerPlaceholder
            }
          />
        </View>

        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }>
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'userProfiles.basicInformation',
              )}
            </Text>

            <FieldLabel>
              {t(
                'userProfiles.displayName',
              )}
            </FieldLabel>

            <TextInput
              value={
                draft.displayName
              }
              onChangeText={value =>
                update(
                  'displayName',
                  value,
                )
              }
              placeholder={t(
                'userProfiles.displayNamePlaceholder',
              )}
              placeholderTextColor="#8E8B84"
              maxLength={80}
              style={styles.fullInput}
            />

            <FieldLabel>
              {t(
                'userProfiles.relationship',
              )}
            </FieldLabel>

            <ChoiceGroup
              options={
                RELATIONSHIP_OPTIONS
              }
              value={
                draft.relationship
              }
              onChange={value =>
                update(
                  'relationship',
                  value,
                )
              }
              t={key => String(t(key))}
            />

            <FieldLabel>
              {t(
                'userProfiles.gender',
              )}
            </FieldLabel>

            <ChoiceGroup
              options={
                GENDER_OPTIONS
              }
              value={draft.gender}
              onChange={value =>
                update(
                  'gender',
                  value,
                )
              }
              t={key => String(t(key))}
            />
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'userProfiles.birthInformation',
              )}
            </Text>

            <FieldLabel>
              {t(
                'userProfiles.solarBirthDate',
              )}
            </FieldLabel>

            <View style={styles.dateRow}>
              <TextInput
                value={draft.day}
                onChangeText={value =>
                  update(
                    'day',
                    value,
                  )
                }
                keyboardType="number-pad"
                maxLength={2}
                placeholder="DD"
                placeholderTextColor="#8E8B84"
                style={styles.dateInput}
              />

              <Text style={styles.separator}>
                /
              </Text>

              <TextInput
                value={
                  draft.month
                }
                onChangeText={value =>
                  update(
                    'month',
                    value,
                  )
                }
                keyboardType="number-pad"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor="#8E8B84"
                style={styles.dateInput}
              />

              <Text style={styles.separator}>
                /
              </Text>

              <TextInput
                value={draft.year}
                onChangeText={value =>
                  update(
                    'year',
                    value,
                  )
                }
                keyboardType="number-pad"
                maxLength={4}
                placeholder="YYYY"
                placeholderTextColor="#8E8B84"
                style={styles.yearInput}
              />
            </View>

            <FieldLabel>
              {t(
                'userProfiles.birthTimeAccuracy',
              )}
            </FieldLabel>

            <ChoiceGroup
              options={
                TIME_ACCURACY_OPTIONS
              }
              value={
                draft.birthTimeAccuracy
              }
              onChange={value =>
                update(
                  'birthTimeAccuracy',
                  value,
                )
              }
              t={key => String(t(key))}
            />

            {!timeUnknown && (
              <>
                <FieldLabel>
                  {t(
                    'userProfiles.birthTime',
                  )}
                </FieldLabel>

                <View style={styles.timeRow}>
                  <TextInput
                    value={
                      draft.hour
                    }
                    onChangeText={value =>
                      update(
                        'hour',
                        value,
                      )
                    }
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="HH"
                    placeholderTextColor="#8E8B84"
                    style={styles.timeInput}
                  />

                  <Text
                    style={
                      styles.timeColon
                    }>
                    :
                  </Text>

                  <TextInput
                    value={
                      draft.minute
                    }
                    onChangeText={value =>
                      update(
                        'minute',
                        value,
                      )
                    }
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="MM"
                    placeholderTextColor="#8E8B84"
                    style={styles.timeInput}
                  />
                </View>
              </>
            )}

            {timeUnknown && (
              <View style={styles.warningCard}>
                <Text
                  style={
                    styles.warningText
                  }>
                  {t(
                    'userProfiles.unknownTimeNotice',
                  )}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'userProfiles.birthLocation',
              )}
            </Text>

            <FieldLabel>
              {t(
                'userProfiles.placeName',
              )}
            </FieldLabel>

            <TextInput
              value={
                draft.placeName
              }
              onChangeText={value =>
                update(
                  'placeName',
                  value,
                )
              }
              placeholder={t(
                'userProfiles.placeNamePlaceholder',
              )}
              placeholderTextColor="#8E8B84"
              style={styles.fullInput}
            />

            <FieldLabel>
              {t(
                'userProfiles.timeZone',
              )}
            </FieldLabel>

            <TextInput
              value={
                draft.timeZone
              }
              onChangeText={value =>
                update(
                  'timeZone',
                  value,
                )
              }
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Asia/Ho_Chi_Minh"
              placeholderTextColor="#8E8B84"
              style={styles.fullInput}
            />

            <View style={styles.coordinateRow}>
              <View
                style={
                  styles.coordinateColumn
                }>
                <FieldLabel>
                  {t(
                    'userProfiles.longitude',
                  )}
                </FieldLabel>

                <TextInput
                  value={
                    draft.longitude
                  }
                  onChangeText={value =>
                    update(
                      'longitude',
                      value,
                    )
                  }
                  keyboardType="numbers-and-punctuation"
                  placeholder="106.7009"
                  placeholderTextColor="#8E8B84"
                  style={styles.fullInput}
                />
              </View>

              <View
                style={
                  styles.coordinateSpacer
                }
              />

              <View
                style={
                  styles.coordinateColumn
                }>
                <FieldLabel>
                  {t(
                    'userProfiles.latitude',
                  )}
                </FieldLabel>

                <TextInput
                  value={
                    draft.latitude
                  }
                  onChangeText={value =>
                    update(
                      'latitude',
                      value,
                    )
                  }
                  keyboardType="numbers-and-punctuation"
                  placeholder="10.7769"
                  placeholderTextColor="#8E8B84"
                  style={styles.fullInput}
                />
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>
              {t(
                'userProfiles.notesAndOptions',
              )}
            </Text>

            <FieldLabel>
              {t(
                'userProfiles.notes',
              )}
            </FieldLabel>

            <TextInput
              value={draft.notes}
              onChangeText={value =>
                update(
                  'notes',
                  value,
                )
              }
              multiline
              textAlignVertical="top"
              maxLength={1000}
              placeholder={t(
                'userProfiles.notesPlaceholder',
              )}
              placeholderTextColor="#8E8B84"
              style={styles.notesInput}
            />

            <View style={styles.favoriteRow}>
              <View style={styles.favoriteTextWrap}>
                <Text
                  style={
                    styles.favoriteTitle
                  }>
                  {t(
                    'userProfiles.favorite',
                  )}
                </Text>

                <Text
                  style={
                    styles.favoriteSubtitle
                  }>
                  {t(
                    'userProfiles.favoriteSubtitle',
                  )}
                </Text>
              </View>

              <Switch
                value={
                  draft.isFavorite
                }
                onValueChange={value =>
                  update(
                    'isFavorite',
                    value,
                  )
                }
                trackColor={{
                  false: '#CBC4B8',
                  true: '#B8944D',
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <Pressable
            disabled={isSaving}
            style={({pressed}) => [
              styles.saveButton,
              isSaving &&
                styles.disabled,
              pressed &&
                styles.pressed,
            ]}
            onPress={save}>
            <Text
              style={
                styles.saveButtonText
              }>
              {isSaving
                ? t(
                    'userProfiles.saving',
                  )
                : t(
                    'userProfiles.save',
                  )}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor:
      COLORS.cream,
  },

  header: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.navy,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  headerButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.08)',
    borderRadius: 14,
  },

  headerButtonText: {
    color: '#FFF7E5',
    fontSize: 31,
    lineHeight: 33,
  },

  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  headerTitle: {
    color: '#FFF7E5',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },

  headerSubtitle: {
    color: '#C8CED7',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 3,
  },

  headerPlaceholder: {
    width: 42,
  },

  content: {
    padding: 16,
    paddingBottom: 150,
  },

  formCard: {
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 21,
    padding: 16,
    marginBottom: 13,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 13,
  },

  fieldLabel: {
    color: '#4C5360',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 11,
    marginBottom: 7,
  },

  fullInput: {
    minHeight: 48,
    color: COLORS.text,
    fontSize: 14,
    backgroundColor: '#F6F1E8',
    borderWidth: 1,
    borderColor: '#E1D5C3',
    borderRadius: 14,
    paddingHorizontal: 13,
  },

  notesInput: {
    minHeight: 120,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 21,
    backgroundColor: '#F6F1E8',
    borderWidth: 1,
    borderColor: '#E1D5C3',
    borderRadius: 14,
    padding: 13,
  },

  choiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  choiceButton: {
    minWidth: '30%',
    flexGrow: 1,
    flexBasis: '30%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2EBDD',
    borderWidth: 1,
    borderColor: '#E3D6C3',
    borderRadius: 13,
    paddingHorizontal: 8,
    margin: 4,
  },

  choiceButtonSelected: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  choiceIcon: {
    color: '#856A3D',
    fontSize: 15,
    fontWeight: '900',
    marginRight: 6,
  },

  choiceIconSelected: {
    color: COLORS.gold,
  },

  choiceLabel: {
    color: '#5D5F60',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },

  choiceLabelSelected: {
    color: '#FFF4D7',
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateInput: {
    flex: 1,
    minHeight: 48,
    color: COLORS.text,
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#F6F1E8',
    borderWidth: 1,
    borderColor: '#E1D5C3',
    borderRadius: 14,
  },

  yearInput: {
    flex: 1.35,
    minHeight: 48,
    color: COLORS.text,
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#F6F1E8',
    borderWidth: 1,
    borderColor: '#E1D5C3',
    borderRadius: 14,
  },

  separator: {
    color: '#A39480',
    fontSize: 18,
    marginHorizontal: 7,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 220,
  },

  timeInput: {
    flex: 1,
    minHeight: 48,
    color: COLORS.text,
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#F6F1E8',
    borderWidth: 1,
    borderColor: '#E1D5C3',
    borderRadius: 14,
  },

  timeColon: {
    color: '#867968',
    fontSize: 20,
    fontWeight: '900',
    marginHorizontal: 9,
  },

  warningCard: {
    backgroundColor: '#FFF1D4',
    borderWidth: 1,
    borderColor: '#E2C17A',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },

  warningText: {
    color: '#765722',
    fontSize: 11,
    lineHeight: 17,
  },

  coordinateRow: {
    flexDirection: 'row',
  },

  coordinateColumn: {
    flex: 1,
  },

  coordinateSpacer: {
    width: 10,
  },

  favoriteRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4EDDF',
    borderRadius: 14,
    paddingHorizontal: 13,
    marginTop: 16,
  },

  favoriteTextWrap: {
    flex: 1,
    marginRight: 10,
  },

  favoriteTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  favoriteSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  saveButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.gold,
    borderRadius: 17,
    marginTop: 3,
  },

  saveButtonText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '900',
  },

  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 13,
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  disabled: {
    opacity: 0.55,
  },
});
