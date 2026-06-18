import React, {
  useEffect,
  useMemo,
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
  getUserProfile,
  type UserProfile,
} from '../services/userProfiles';

import {
  getTimelineEvent,
  parseTimelineEventTags,
  saveTimelineEvent,
  type TimelineEventCategory,
  type TimelineEventImportance,
  type TimelineEventTone,
} from '../services/timelineEvents';

type Props = BottomTabScreenProps<
  RootTabParamList,
  'TimelineEventEditor'
>;

const CATEGORIES:
  TimelineEventCategory[] = [
    'career',
    'finance',
    'relationship',
    'family',
    'health',
    'education',
    'relocation',
    'spiritual',
    'achievement',
    'other',
  ];

const TONES:
  TimelineEventTone[] = [
    'positive',
    'neutral',
    'challenging',
  ];

const IMPORTANCE_LEVELS:
  TimelineEventImportance[] = [
    1,
    2,
    3,
  ];

function parseInteger(
  value: string,
): number {
  const parsed =
    Number.parseInt(
      value.trim(),
      10,
    );

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

export default function TimelineEventEditorScreen({
  navigation,
  route,
}: Props) {
  const {t} =
    useTranslation();

  const profileId =
    route.params.profileId;

  const eventId =
    route.params.eventId;

  const initialYear =
    route.params.year ??
    new Date().getFullYear();

  const [
    profile,
    setProfile,
  ] =
    useState<UserProfile | null>(
      null,
    );

  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] =
    useState('');

  const [year, setYear] =
    useState(
      String(initialYear),
    );

  const [month, setMonth] =
    useState(
      String(
        new Date().getMonth() +
          1,
      ),
    );

  const [day, setDay] =
    useState(
      String(
        new Date().getDate(),
      ),
    );

  const [
    category,
    setCategory,
  ] =
    useState<
      TimelineEventCategory
    >('other');

  const [tone, setTone] =
    useState<
      TimelineEventTone
    >('neutral');

  const [
    importance,
    setImportance,
  ] =
    useState<
      TimelineEventImportance
    >(2);

  const [tags, setTags] =
    useState('');

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([
      getUserProfile(
        profileId,
      ),
      eventId
        ? getTimelineEvent(
            eventId,
          )
        : Promise.resolve(
            null,
          ),
    ])
      .then(
        ([
          nextProfile,
          event,
        ]) => {
          if (!active) {
            return;
          }

          setProfile(
            nextProfile,
          );

          if (event) {
            setTitle(
              event.title,
            );

            setDescription(
              event.description,
            );

            setYear(
              String(
                event.year,
              ),
            );

            setMonth(
              String(
                event.month,
              ),
            );

            setDay(
              String(
                event.day,
              ),
            );

            setCategory(
              event.category,
            );

            setTone(
              event.tone,
            );

            setImportance(
              event.importance,
            );

            setTags(
              event.tags.join(
                ', ',
              ),
            );
          }
        },
      )
      .catch(error => {
        console.warn(
          'Unable to load timeline event editor:',
          error,
        );
      })
      .finally(() => {
        if (active) {
          setIsLoading(
            false,
          );
        }
      });

    return () => {
      active = false;
    };
  }, [
    eventId,
    profileId,
  ]);

  const isEditing =
    Boolean(eventId);

  const datePreview =
    useMemo(() => {
      const y =
        parseInteger(year);

      const m =
        parseInteger(month);

      const d =
        parseInteger(day);

      if (
        !y ||
        !m ||
        !d
      ) {
        return '';
      }

      try {
        return new Intl.DateTimeFormat(
          undefined,
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          },
        ).format(
          new Date(
            y,
            m - 1,
            d,
            12,
            0,
            0,
            0,
          ),
        );
      } catch {
        return `${d}/${m}/${y}`;
      }
    }, [
      day,
      month,
      year,
    ]);

  const save = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await saveTimelineEvent({
        id: eventId,
        profileId,
        title,
        description,
        year:
          parseInteger(
            year,
          ),
        month:
          parseInteger(
            month,
          ),
        day:
          parseInteger(
            day,
          ),
        category,
        tone,
        importance,
        tags:
          parseTimelineEventTags(
            tags,
          ),
      });

      Alert.alert(
        t(
          'timelineEvents.savedTitle',
        ),
        t(
          isEditing
            ? 'timelineEvents.updatedMessage'
            : 'timelineEvents.createdMessage',
        ),
        [
          {
            text: t(
              'timelineEvents.done',
            ),
            onPress: () =>
              navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      const code =
        error instanceof Error
          ? error.message
          : '';

      Alert.alert(
        t(
          'timelineEvents.errors.title',
        ),
        code ===
        'TITLE_REQUIRED'
          ? t(
              'timelineEvents.errors.titleRequired',
            )
          : code ===
            'INVALID_DATE'
            ? t(
                'timelineEvents.errors.invalidDate',
              )
            : t(
                'timelineEvents.errors.saveFailed',
              ),
      );
    } finally {
      setIsSaving(
        false,
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.loading}>
        <Text
          style={
            styles.loadingText
          }>
          {t(
            'timelineEvents.loading',
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }>
          <View style={styles.hero}>
            <Pressable
              style={({pressed}) => [
                styles.backButton,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                navigation.goBack()
              }>
              <Text
                style={
                  styles.backText
                }>
                ‹
              </Text>
            </Pressable>

            <View
              style={
                styles.heroTextWrap
              }>
              <Text
                style={
                  styles.heroEyebrow
                }>
                EASTERN DESTINY
              </Text>

              <Text
                style={
                  styles.heroTitle
                }>
                {t(
                  isEditing
                    ? 'timelineEvents.editTitle'
                    : 'timelineEvents.createTitle',
                )}
              </Text>

              <Text
                style={
                  styles.heroSubtitle
                }>
                {profile
                  ? t(
                      'timelineEvents.profileLine',
                      {
                        name:
                          profile.displayName,
                      },
                    )
                  : t(
                      'timelineEvents.profileUnavailable',
                    )}
              </Text>
            </View>

            <View
              style={
                styles.heroIcon
              }>
              <Text
                style={
                  styles.heroIconText
                }>
                ✦
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={
                styles.sectionTitle
              }>
              {t(
                'timelineEvents.basicInformation',
              )}
            </Text>

            <Text
              style={
                styles.inputLabel
              }>
              {t(
                'timelineEvents.eventTitle',
              )}
            </Text>

            <TextInput
              value={title}
              onChangeText={
                setTitle
              }
              placeholder={t(
                'timelineEvents.eventTitlePlaceholder',
              )}
              placeholderTextColor="#8A8B89"
              style={styles.input}
            />

            <Text
              style={
                styles.inputLabel
              }>
              {t(
                'timelineEvents.description',
              )}
            </Text>

            <TextInput
              value={description}
              onChangeText={
                setDescription
              }
              multiline
              textAlignVertical="top"
              placeholder={t(
                'timelineEvents.descriptionPlaceholder',
              )}
              placeholderTextColor="#8A8B89"
              style={[
                styles.input,
                styles.textArea,
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text
              style={
                styles.sectionTitle
              }>
              {t(
                'timelineEvents.dateTitle',
              )}
            </Text>

            <View style={styles.dateRow}>
              <View
                style={
                  styles.dateField
                }>
                <Text
                  style={
                    styles.inputLabel
                  }>
                  {t(
                    'timelineEvents.day',
                  )}
                </Text>

                <TextInput
                  value={day}
                  onChangeText={
                    setDay
                  }
                  keyboardType="number-pad"
                  maxLength={2}
                  style={styles.input}
                />
              </View>

              <View
                style={
                  styles.dateField
                }>
                <Text
                  style={
                    styles.inputLabel
                  }>
                  {t(
                    'timelineEvents.month',
                  )}
                </Text>

                <TextInput
                  value={month}
                  onChangeText={
                    setMonth
                  }
                  keyboardType="number-pad"
                  maxLength={2}
                  style={styles.input}
                />
              </View>

              <View
                style={[
                  styles.dateField,
                  styles.yearField,
                ]}>
                <Text
                  style={
                    styles.inputLabel
                  }>
                  {t(
                    'timelineEvents.year',
                  )}
                </Text>

                <TextInput
                  value={year}
                  onChangeText={
                    setYear
                  }
                  keyboardType="number-pad"
                  maxLength={4}
                  style={styles.input}
                />
              </View>
            </View>

            {!!datePreview && (
              <Text
                style={
                  styles.datePreview
                }>
                {datePreview}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text
              style={
                styles.sectionTitle
              }>
              {t(
                'timelineEvents.categoryTitle',
              )}
            </Text>

            <View style={styles.chipGrid}>
              {CATEGORIES.map(
                item => (
                  <Pressable
                    key={item}
                    style={[
                      styles.chip,
                      category ===
                        item &&
                        styles.chipActive,
                    ]}
                    onPress={() =>
                      setCategory(
                        item,
                      )
                    }>
                    <Text
                      style={[
                        styles.chipText,
                        category ===
                          item &&
                          styles.chipTextActive,
                      ]}>
                      {t(
                        `timelineEvents.categories.${item}`,
                      )}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={
                styles.sectionTitle
              }>
              {t(
                'timelineEvents.toneTitle',
              )}
            </Text>

            <View style={styles.chipGrid}>
              {TONES.map(
                item => (
                  <Pressable
                    key={item}
                    style={[
                      styles.chip,
                      tone ===
                        item &&
                        styles.chipActive,
                    ]}
                    onPress={() =>
                      setTone(
                        item,
                      )
                    }>
                    <Text
                      style={[
                        styles.chipText,
                        tone ===
                          item &&
                          styles.chipTextActive,
                      ]}>
                      {t(
                        `timelineEvents.tones.${item}`,
                      )}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={
                styles.sectionTitle
              }>
              {t(
                'timelineEvents.importanceTitle',
              )}
            </Text>

            <View style={styles.importanceRow}>
              {IMPORTANCE_LEVELS.map(
                item => (
                  <Pressable
                    key={item}
                    style={[
                      styles.importanceButton,
                      importance ===
                        item &&
                        styles.importanceButtonActive,
                    ]}
                    onPress={() =>
                      setImportance(
                        item,
                      )
                    }>
                    <Text
                      style={[
                        styles.importanceValue,
                        importance ===
                          item &&
                          styles.importanceValueActive,
                      ]}>
                      {
                        '★'.repeat(
                          item,
                        )
                      }
                    </Text>

                    <Text
                      style={[
                        styles.importanceLabel,
                        importance ===
                          item &&
                          styles.importanceLabelActive,
                      ]}>
                      {t(
                        `timelineEvents.importance.${item}`,
                      )}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={
                styles.sectionTitle
              }>
              {t(
                'timelineEvents.tagsTitle',
              )}
            </Text>

            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder={t(
                'timelineEvents.tagsPlaceholder',
              )}
              placeholderTextColor="#8A8B89"
              style={styles.input}
            />

            <Text
              style={
                styles.helpText
              }>
              {t(
                'timelineEvents.tagsHelp',
              )}
            </Text>
          </View>

          <Pressable
            disabled={isSaving}
            style={({pressed}) => [
              styles.saveButton,
              isSaving &&
                styles.saveButtonDisabled,
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
                    'timelineEvents.saving',
                  )
                : t(
                    isEditing
                      ? 'timelineEvents.update'
                      : 'timelineEvents.save',
                  )}
            </Text>
          </Pressable>

          <View
            style={
              styles.privacyCard
            }>
            <Text
              style={
                styles.privacyTitle
              }>
              {t(
                'timelineEvents.privacyTitle',
              )}
            </Text>

            <Text
              style={
                styles.privacyText
              }>
              {t(
                'timelineEvents.privacyMessage',
              )}
            </Text>
          </View>
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
    paddingBottom: 90,
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.navy,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 21,
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
    lineHeight: 31,
  },

  heroTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  heroEyebrow: {
    color: '#D5B672',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#FFF7E5',
    fontSize: 23,
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
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(215,175,94,0.12)',
    borderWidth: 1,
    borderColor:
      'rgba(215,175,94,0.35)',
    borderRadius: 14,
  },

  heroIconText: {
    color: '#E9CA82',
    fontSize: 21,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 21,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 11,
  },

  inputLabel: {
    color: '#5F6570',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    minHeight: 48,
    color: COLORS.text,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    fontSize: 12,
  },

  textArea: {
    minHeight: 130,
    paddingTop: 12,
    paddingBottom: 12,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  dateField: {
    flex: 1,
    marginRight: 8,
  },

  yearField: {
    flex: 1.35,
    marginRight: 0,
  },

  datePreview: {
    color: '#8E6A34',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 9,
  },

  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: '#EEE7DC',
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginRight: 7,
    marginBottom: 8,
  },

  chipActive: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  chipText: {
    color: '#6B645C',
    fontSize: 9.5,
    fontWeight: '800',
  },

  chipTextActive: {
    color: '#FFF1D0',
  },

  importanceRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  importanceButton: {
    width: '31.5%',
    alignItems: 'center',
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 15,
    paddingVertical: 12,
  },

  importanceButtonActive: {
    backgroundColor:
      COLORS.navy,
    borderColor:
      COLORS.navy,
  },

  importanceValue: {
    color: '#A77F3D',
    fontSize: 12,
    fontWeight: '900',
  },

  importanceValueActive: {
    color: '#F0D18B',
  },

  importanceLabel: {
    color: COLORS.muted,
    fontSize: 8.5,
    fontWeight: '800',
    marginTop: 5,
  },

  importanceLabelActive: {
    color: '#CBD2DC',
  },

  helpText: {
    color: COLORS.muted,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 6,
  },

  saveButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.gold,
    borderRadius: 15,
    marginHorizontal: 16,
    marginTop: 24,
  },

  saveButtonDisabled: {
    opacity: 0.55,
  },

  saveButtonText: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '900',
  },

  privacyCard: {
    backgroundColor: '#E8EDF3',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
  },

  privacyTitle: {
    color: COLORS.navy,
    fontSize: 10.5,
    fontWeight: '900',
  },

  privacyText: {
    color: '#5F6875',
    fontSize: 9.5,
    lineHeight: 15,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
