import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';

import {
  buildHoroscopeLifeInsights,
  createBirthProfile,
  findAuspiciousDates,
  type AuspiciousActivity,
  type AuspiciousDateResult,
  type AuspiciousRating,
  type BirthGender,
  type BirthProfile,
  type HoroscopeLifeInsights,
  type InterpretationSchool,
  type LifeInsightRating,
} from '../services/auspiciousDates';

import {
  localizeBirthHourBranch,
  localizeCanChi,
  localizeZodiac,
} from '../utils/horoscopeValueLocalization';

import {
  getUserProfile,
} from '../services/userProfiles';

import {
  getUserProfileTimeWarningCode,
  userProfileToHoroscopeFields,
} from '../services/userProfileAdapters';

type ActivityOption = {
  id: AuspiciousActivity;
  icon: string;
  titleKey: string;
};

type GenderOption = {
  id: BirthGender;
  icon: string;
  titleKey: string;
};

type SchoolOption = {
  id: InterpretationSchool;
  icon: string;
  titleKey: string;
  descriptionKey: string;
};

const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: 'wedding',
    icon: '💍',
    titleKey:
      'horoscope.activities.wedding',
  },
  {
    id: 'construction',
    icon: '🏠',
    titleKey:
      'horoscope.activities.construction',
  },
  {
    id: 'opening',
    icon: '🎊',
    titleKey:
      'horoscope.activities.opening',
  },
  {
    id: 'moving',
    icon: '📦',
    titleKey:
      'horoscope.activities.moving',
  },
  {
    id: 'travel',
    icon: '🧳',
    titleKey:
      'horoscope.activities.travel',
  },
];

const GENDER_OPTIONS: GenderOption[] = [
  {
    id: 'male',
    icon: '♂',
    titleKey:
      'horoscope.genders.male',
  },
  {
    id: 'female',
    icon: '♀',
    titleKey:
      'horoscope.genders.female',
  },
  {
    id: 'unspecified',
    icon: '◌',
    titleKey:
      'horoscope.genders.unspecified',
  },
];

const SCHOOL_OPTIONS: SchoolOption[] = [
  {
    id: 'folk',
    icon: '🪷',
    titleKey:
      'horoscope.schools.folkTitle',
    descriptionKey:
      'horoscope.schools.folkDescription',
  },
  {
    id: 'bazi',
    icon: '☯',
    titleKey:
      'horoscope.schools.baziTitle',
    descriptionKey:
      'horoscope.schools.baziDescription',
  },
  {
    id: 'ziwei',
    icon: '✦',
    titleKey:
      'horoscope.schools.ziweiTitle',
    descriptionKey:
      'horoscope.schools.ziweiDescription',
  },
  {
    id: 'almanac',
    icon: '📜',
    titleKey:
      'horoscope.schools.almanacTitle',
    descriptionKey:
      'horoscope.schools.almanacDescription',
  },
];

const MONTH_OPTIONS = [
  3,
  6,
  12,
];

function formatDate(
  date: Date,
  language: string,
): string {
  try {
    return new Intl.DateTimeFormat(
      language,
      {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    ).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

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

function getRatingStyle(
  rating: AuspiciousRating,
) {
  switch (rating) {
    case 'excellent':
      return {
        backgroundColor:
          '#5F3A1E',
        borderColor:
          '#D7A84F',
        color:
          '#FFE5A2',
      };

    case 'good':
      return {
        backgroundColor:
          '#746026',
        borderColor:
          '#CDB35B',
        color:
          '#FFF2C4',
      };

    case 'fair':
      return {
        backgroundColor:
          '#6A645C',
        borderColor:
          '#AFA397',
        color:
          '#FFF8EF',
      };

    default:
      return {
        backgroundColor:
          '#7B4335',
        borderColor:
          '#C9826A',
        color:
          '#FFE4DA',
      };
  }
}

function getLifeRatingStyle(
  rating: LifeInsightRating,
) {
  switch (rating) {
    case 'veryStrong':
      return {
        backgroundColor: '#5B331D',
        borderColor: '#D5A348',
        color: '#FFE4A5',
      };

    case 'favorable':
      return {
        backgroundColor: '#6D5B28',
        borderColor: '#C8B15F',
        color: '#FFF0BC',
      };

    case 'balanced':
      return {
        backgroundColor: '#5F6653',
        borderColor: '#9DA88C',
        color: '#F2F6EA',
      };

    default:
      return {
        backgroundColor: '#725044',
        borderColor: '#B99383',
        color: '#FCE8DE',
      };
  }
}

export default function HoroscopeScreen() {
  const {t, i18n} =
    useTranslation();

  const route = useRoute<any>();

  const now = useMemo(
    () => new Date(),
    [],
  );

  const [day, setDay] =
    useState(
      String(now.getDate()),
    );

  const [month, setMonth] =
    useState(
      String(
        now.getMonth() + 1,
      ),
    );

  const [year, setYear] =
    useState(
      String(
        now.getFullYear() - 30,
      ),
    );

  const [birthHour, setBirthHour] =
    useState('08');

  const [birthMinute, setBirthMinute] =
    useState('00');

  const [gender, setGender] =
    useState<BirthGender>(
      'unspecified',
    );

  const [school, setSchool] =
    useState<InterpretationSchool>(
      'folk',
    );

  const [activity, setActivity] =
    useState<AuspiciousActivity>(
      'wedding',
    );

  const [monthsAhead, setMonthsAhead] =
    useState(6);

  const [profile, setProfile] =
    useState<BirthProfile | null>(
      null,
    );

  const [results, setResults] =
    useState<
      AuspiciousDateResult[]
    >([]);

  const [lifeInsights, setLifeInsights] =
    useState<HoroscopeLifeInsights | null>(
      null,
    );

  const [activeLifeSection, setActiveLifeSection] =
    useState<'love' | 'career'>(
      'love',
    );

  const [isCalculating, setIsCalculating] =
    useState(false);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  useEffect(() => {
    const profileId =
      route.params?.profileId as
        | string
        | undefined;

    if (!profileId) {
      return;
    }

    let active = true;

    getUserProfile(profileId)
      .then(sharedProfile => {
        if (
          !active ||
          !sharedProfile
        ) {
          return;
        }

        const fields =
          userProfileToHoroscopeFields(
            sharedProfile,
          );

        setDay(fields.day);
        setMonth(fields.month);
        setYear(fields.year);
        setBirthHour(
          fields.birthHour,
        );
        setBirthMinute(
          fields.birthMinute,
        );
        setGender(
          fields.gender,
        );

        setProfile(null);
        setResults([]);
        setLifeInsights(null);
        setActiveLifeSection(
          'love',
        );

        const warningCode =
          getUserProfileTimeWarningCode(
            sharedProfile,
          );

        if (warningCode) {
          Alert.alert(
            t(
              'userProfiles.profileTimeWarningTitle',
            ),
            t(
              warningCode === 'unknown'
                ? 'userProfiles.profileTimeUnknownMessage'
                : 'userProfiles.profileTimeApproximateMessage',
            ),
          );
        }
      })
      .catch(error => {
        console.warn(
          'Cannot load shared profile for horoscope:',
          error,
        );
      });

    return () => {
      active = false;
    };
  }, [
    route.params?.profileId,
    t,
  ]);

  const reasonLabel = (
    key: string,
  ) =>
    t(
      `horoscope.reasons.${key}`,
      {
        defaultValue: key,
      },
    );

  const selectedSchool =
    SCHOOL_OPTIONS.find(
      item => item.id === school,
    ) ?? SCHOOL_OPTIONS[0];

  const activeLifeInsight =
    lifeInsights
      ? lifeInsights[
          activeLifeSection
        ]
      : null;

  const insightLabel = (
    key: string,
  ) =>
    t(
      `horoscope.insights.${key}`,
      {
        defaultValue: key,
      },
    );

  const calculate = () => {
    if (isCalculating) {
      return;
    }

    const parsedDay =
      Number(day);

    const parsedMonth =
      Number(month);

    const parsedYear =
      Number(year);

    const parsedHour =
      Number(birthHour);

    const parsedMinute =
      Number(birthMinute);

    setIsCalculating(true);

    try {
      const birthProfile =
        createBirthProfile(
          parsedDay,
          parsedMonth,
          parsedYear,
          parsedHour,
          parsedMinute,
          gender,
          school,
        );

      const auspiciousDates =
        findAuspiciousDates(
          birthProfile,
          activity,
          monthsAhead,
          12,
        );

      setProfile(
        birthProfile,
      );

      setLifeInsights(
        buildHoroscopeLifeInsights(
          birthProfile,
        ),
      );

      setActiveLifeSection(
        'love',
      );

      setResults(
        auspiciousDates,
      );
    } catch (error) {
      console.warn(
        'Cannot calculate horoscope:',
        error,
      );

      const message =
        error instanceof Error &&
        error.message ===
          'INVALID_BIRTH_TIME'
          ? t(
              'horoscope.invalidTimeMessage',
              {
                defaultValue:
                  'Giờ sinh phải từ 00:00 đến 23:59.',
              },
            )
          : t(
              'horoscope.invalidDateMessage',
              {
                defaultValue:
                  'Hãy nhập đúng ngày, tháng và năm sinh dương lịch.',
              },
            );

      Alert.alert(
        t(
          'horoscope.invalidInputTitle',
          {
            defaultValue:
              'Thông tin chưa hợp lệ',
          },
        ),

        message,
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.headerIcon}>
            🔮
          </Text>

          <Text style={styles.title}>
            {t(
              'horoscope.title',
              {
                defaultValue:
                  'Tử vi và ngày phù hợp',
              },
            )}
          </Text>

          <Text style={styles.subtitle}>
            {t(
              'horoscope.subtitleExtended',
              {
                defaultValue:
                  'Nhập ngày giờ sinh dương lịch, giới tính và trường phái để xem ngày âm, giờ sinh và gợi ý ngày phù hợp.',
              },
            )}
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>
            {t(
              'horoscope.birthDateTitle',
              {
                defaultValue:
                  'Ngày sinh dương lịch',
              },
            )}
          </Text>

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.inputLabel}>
                {t(
                  'horoscope.day',
                  {
                    defaultValue:
                      'Ngày',
                  },
                )}
              </Text>

              <TextInput
                value={day}
                onChangeText={setDay}
                keyboardType="number-pad"
                maxLength={2}
                style={styles.dateInput}
                placeholder="DD"
                placeholderTextColor="#A18B78"
              />
            </View>

            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>
                /
              </Text>
            </View>

            <View style={styles.dateField}>
              <Text style={styles.inputLabel}>
                {t(
                  'horoscope.month',
                  {
                    defaultValue:
                      'Tháng',
                  },
                )}
              </Text>

              <TextInput
                value={month}
                onChangeText={setMonth}
                keyboardType="number-pad"
                maxLength={2}
                style={styles.dateInput}
                placeholder="MM"
                placeholderTextColor="#A18B78"
              />
            </View>

            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>
                /
              </Text>
            </View>

            <View style={styles.yearField}>
              <Text style={styles.inputLabel}>
                {t(
                  'horoscope.year',
                  {
                    defaultValue:
                      'Năm',
                  },
                )}
              </Text>

              <TextInput
                value={year}
                onChangeText={setYear}
                keyboardType="number-pad"
                maxLength={4}
                style={styles.dateInput}
                placeholder="YYYY"
                placeholderTextColor="#A18B78"
              />
            </View>
          </View>

          <Text style={styles.sectionTitleSecondary}>
            {t(
              'horoscope.birthTimeTitle',
              {
                defaultValue:
                  'Giờ sinh',
              },
            )}
          </Text>

          <View style={styles.timeInputRow}>
            <View style={styles.timeField}>
              <Text style={styles.inputLabel}>
                {t(
                  'horoscope.hour',
                  {
                    defaultValue:
                      'Giờ',
                  },
                )}
              </Text>

              <TextInput
                value={birthHour}
                onChangeText={setBirthHour}
                keyboardType="number-pad"
                maxLength={2}
                style={styles.timeInput}
                placeholder="HH"
                placeholderTextColor="#A18B78"
              />
            </View>

            <Text style={styles.timeColon}>
              :
            </Text>

            <View style={styles.timeField}>
              <Text style={styles.inputLabel}>
                {t(
                  'horoscope.minute',
                  {
                    defaultValue:
                      'Phút',
                  },
                )}
              </Text>

              <TextInput
                value={birthMinute}
                onChangeText={setBirthMinute}
                keyboardType="number-pad"
                maxLength={2}
                style={styles.timeInput}
                placeholder="MM"
                placeholderTextColor="#A18B78"
              />
            </View>

            <View style={styles.timeHintCard}>
              <Text style={styles.timeHintIcon}>
                🕰️
              </Text>

              <Text style={styles.timeHintText}>
                {t(
                  'horoscope.birthTimeHint',
                  {
                    defaultValue:
                      'Giờ địa phương nơi sinh',
                  },
                )}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitleSecondary}>
            {t(
              'horoscope.genderTitle',
              {
                defaultValue:
                  'Giới tính',
              },
            )}
          </Text>

          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map(
              option => {
                const selected =
                  gender ===
                  option.id;

                return (
                  <Pressable
                    key={option.id}
                    style={({pressed}) => [
                      styles.genderButton,
                      selected &&
                        styles.genderButtonSelected,
                      pressed &&
                        styles.buttonPressed,
                    ]}
                    onPress={() =>
                      setGender(
                        option.id,
                      )
                    }>
                    <Text
                      style={[
                        styles.genderIcon,
                        selected &&
                          styles.genderTextSelected,
                      ]}>
                      {option.icon}
                    </Text>

                    <Text
                      style={[
                        styles.genderText,
                        selected &&
                          styles.genderTextSelected,
                      ]}>
                      {t(
                        option.titleKey,
                      )}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>

          <Text style={styles.sectionTitleSecondary}>
            {t(
              'horoscope.schoolTitle',
              {
                defaultValue:
                  'Trường phái luận giải',
              },
            )}
          </Text>

          <View style={styles.schoolGrid}>
            {SCHOOL_OPTIONS.map(
              option => {
                const selected =
                  school ===
                  option.id;

                return (
                  <Pressable
                    key={option.id}
                    style={({pressed}) => [
                      styles.schoolButton,
                      selected &&
                        styles.schoolButtonSelected,
                      pressed &&
                        styles.buttonPressed,
                    ]}
                    onPress={() =>
                      setSchool(
                        option.id,
                      )
                    }>
                    <View
                      style={[
                        styles.schoolIconWrap,
                        selected &&
                          styles.schoolIconWrapSelected,
                      ]}>
                      <Text style={styles.schoolIcon}>
                        {option.icon}
                      </Text>
                    </View>

                    <View style={styles.schoolTextWrap}>
                      <Text
                        style={[
                          styles.schoolTitle,
                          selected &&
                            styles.schoolTitleSelected,
                        ]}>
                        {t(
                          option.titleKey,
                        )}
                      </Text>

                      <Text
                        style={[
                          styles.schoolDescription,
                          selected &&
                            styles.schoolDescriptionSelected,
                        ]}
                        numberOfLines={3}>
                        {t(
                          option.descriptionKey,
                        )}
                      </Text>
                    </View>
                  </Pressable>
                );
              },
            )}
          </View>

          <View style={styles.selectedMethodCard}>
            <Text style={styles.selectedMethodLabel}>
              {t(
                'horoscope.selectedMethod',
                {
                  defaultValue:
                    'Đang dùng',
                },
              )}
            </Text>

            <Text style={styles.selectedMethodTitle}>
              {selectedSchool.icon}{' '}
              {t(
                selectedSchool.titleKey,
              )}
            </Text>

            <Text style={styles.selectedMethodDescription}>
              {t(
                selectedSchool.descriptionKey,
              )}
            </Text>
          </View>

          <Text style={styles.sectionTitleSecondary}>
            {t(
              'horoscope.activityTitle',
              {
                defaultValue:
                  'Việc cần xem ngày',
              },
            )}
          </Text>

          <View style={styles.activityGrid}>
            {ACTIVITY_OPTIONS.map(
              option => {
                const selected =
                  activity ===
                  option.id;

                return (
                  <Pressable
                    key={option.id}
                    style={({pressed}) => [
                      styles.activityButton,
                      selected &&
                        styles.activityButtonSelected,
                      pressed &&
                        styles.buttonPressed,
                    ]}
                    onPress={() =>
                      setActivity(
                        option.id,
                      )
                    }>
                    <Text style={styles.activityIcon}>
                      {option.icon}
                    </Text>

                    <Text
                      style={[
                        styles.activityText,
                        selected &&
                          styles.activityTextSelected,
                      ]}>
                      {t(
                        option.titleKey,
                      )}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>

          <Text style={styles.sectionTitleSecondary}>
            {t(
              'horoscope.searchPeriod',
              {
                defaultValue:
                  'Khoảng thời gian tìm',
              },
            )}
          </Text>

          <View style={styles.monthOptionsRow}>
            {MONTH_OPTIONS.map(
              option => {
                const selected =
                  monthsAhead ===
                  option;

                return (
                  <Pressable
                    key={option}
                    style={({pressed}) => [
                      styles.monthButton,
                      selected &&
                        styles.monthButtonSelected,
                      pressed &&
                        styles.buttonPressed,
                    ]}
                    onPress={() =>
                      setMonthsAhead(
                        option,
                      )
                    }>
                    <Text
                      style={[
                        styles.monthButtonText,
                        selected &&
                          styles.monthButtonTextSelected,
                      ]}>
                      {t(
                        'horoscope.monthCount',
                        {
                          count: option,
                          defaultValue:
                            `${option} tháng`,
                        },
                      )}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>

          <Pressable
            disabled={isCalculating}
            style={({pressed}) => [
              styles.calculateButton,
              isCalculating &&
                styles.calculateButtonDisabled,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={calculate}>
            <Text style={styles.calculateButtonText}>
              {isCalculating
                ? t(
                    'horoscope.calculating',
                    {
                      defaultValue:
                        'Đang tính...',
                    },
                  )
                : t(
                    'horoscope.calculateExtended',
                    {
                      defaultValue:
                        'Lập hồ sơ và tìm ngày phù hợp',
                    },
                  )}
            </Text>
          </Pressable>
        </View>

        {profile && (
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileIcon}>
                🪷
              </Text>

              <View style={styles.profileHeaderText}>
                <Text style={styles.profileTitle}>
                  {t(
                    'horoscope.profileTitle',
                    {
                      defaultValue:
                        'Thông tin ngày giờ sinh',
                    },
                  )}
                </Text>

                <Text style={styles.profileSubtitle}>
                  {formatDate(
                    profile.solarDate,
                    language,
                  )}{' '}
                  •{' '}
                  {formatTime(
                    profile.birthHour,
                    profile.birthMinute,
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.profileGrid}>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>
                  {t(
                    'horoscope.lunarBirthDate',
                    {
                      defaultValue:
                        'Ngày sinh âm lịch',
                    },
                  )}
                </Text>

                <Text style={styles.profileValue}>
                  {profile.lunarDay}/
                  {profile.lunarMonth}/
                  {profile.lunarYear}
                  {profile.isLeapMonth
                    ? ` (${t(
                        'horoscope.leapMonth',
                        {
                          defaultValue:
                            'nhuận',
                        },
                      )})`
                    : ''}
                </Text>
              </View>

              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>
                  {t(
                    'horoscope.birthHourBranch',
                    {
                      defaultValue:
                        'Giờ sinh Can Chi',
                    },
                  )}
                </Text>

                <Text style={styles.profileValue}>
                  {localizeBirthHourBranch(
                    profile.birthHourBranchEn ||
                      profile.birthHourBranchVi,
                    language,
                  )}
                </Text>
              </View>

              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>
                  {t(
                    'horoscope.zodiac',
                    {
                      defaultValue:
                        'Con giáp',
                    },
                  )}
                </Text>

                <Text style={styles.profileValue}>
                  {localizeZodiac(
                    profile.zodiacEn ||
                      profile.zodiacVi,
                    language,
                  )}
                </Text>
              </View>

              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>
                  {t(
                    'horoscope.canChiYear',
                    {
                      defaultValue:
                        'Năm Can Chi',
                    },
                  )}
                </Text>

                <Text style={styles.profileValue}>
                  {localizeCanChi(
                    profile.canChiYear,
                    language,
                  )}
                </Text>
              </View>

              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>
                  {t(
                    'horoscope.profileGender',
                    {
                      defaultValue:
                        'Giới tính',
                    },
                  )}
                </Text>

                <Text style={styles.profileValue}>
                  {t(
                    `horoscope.genders.${profile.gender}`,
                    {
                      defaultValue:
                        profile.gender,
                    },
                  )}
                </Text>
              </View>

              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>
                  {t(
                    'horoscope.profileSchool',
                    {
                      defaultValue:
                        'Trường phái',
                    },
                  )}
                </Text>

                <Text style={styles.profileValue}>
                  {t(
                    `horoscope.schools.${profile.school}Title`,
                    {
                      defaultValue:
                        profile.school,
                    },
                  )}
                </Text>
              </View>

              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>
                  {t(
                    'horoscope.yearPolarity',
                    {
                      defaultValue:
                        'Âm dương năm sinh',
                    },
                  )}
                </Text>

                <Text style={styles.profileValue}>
                  {t(
                    `horoscope.polarity.${profile.yearPolarity}`,
                    {
                      defaultValue:
                        profile.yearPolarity,
                    },
                  )}
                </Text>
              </View>

              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>
                  {t(
                    'horoscope.cycleDirection',
                    {
                      defaultValue:
                        'Chiều an vòng tham khảo',
                    },
                  )}
                </Text>

                <Text style={styles.profileValue}>
                  {t(
                    `horoscope.directions.${profile.cycleDirection}`,
                    {
                      defaultValue:
                        profile.cycleDirection,
                    },
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.profileNote}>
              <Text style={styles.profileNoteIcon}>
                ✦
              </Text>

              <Text style={styles.profileNoteText}>
                {t(
                  `horoscope.schoolNotes.${profile.school}`,
                  {
                    defaultValue:
                      'Kết quả đang sử dụng bộ trọng số của trường phái đã chọn.',
                  },
                )}
              </Text>
            </View>
          </View>
        )}

        {lifeInsights && activeLifeInsight && (
          <View style={styles.lifeSection}>
            <View style={styles.lifeHeader}>
              <View>
                <Text style={styles.lifeTitle}>
                  {t(
                    'horoscope.lifeOverviewTitle',
                    {
                      defaultValue:
                        'Tình duyên và sự nghiệp',
                    },
                  )}
                </Text>

                <Text style={styles.lifeSubtitle}>
                  {t(
                    'horoscope.lifeOverviewSubtitle',
                    {
                      defaultValue:
                        'Luận giải tham khảo từ ngày giờ sinh và trường phái đã chọn.',
                    },
                  )}
                </Text>
              </View>

              <Text style={styles.lifeHeaderIcon}>
                ✦
              </Text>
            </View>

            <View style={styles.lifeTabs}>
              <Pressable
                style={({pressed}) => [
                  styles.lifeTab,
                  activeLifeSection ===
                    'love' &&
                    styles.lifeTabSelected,
                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={() =>
                  setActiveLifeSection(
                    'love',
                  )
                }>
                <Text
                  style={[
                    styles.lifeTabIcon,
                    activeLifeSection ===
                      'love' &&
                      styles.lifeTabTextSelected,
                  ]}>
                  ♥
                </Text>

                <Text
                  style={[
                    styles.lifeTabText,
                    activeLifeSection ===
                      'love' &&
                      styles.lifeTabTextSelected,
                  ]}>
                  {t(
                    'horoscope.love.title',
                    {
                      defaultValue:
                        'Tình duyên',
                    },
                  )}
                </Text>
              </Pressable>

              <Pressable
                style={({pressed}) => [
                  styles.lifeTab,
                  activeLifeSection ===
                    'career' &&
                    styles.lifeTabSelected,
                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={() =>
                  setActiveLifeSection(
                    'career',
                  )
                }>
                <Text
                  style={[
                    styles.lifeTabIcon,
                    activeLifeSection ===
                      'career' &&
                      styles.lifeTabTextSelected,
                  ]}>
                  ◆
                </Text>

                <Text
                  style={[
                    styles.lifeTabText,
                    activeLifeSection ===
                      'career' &&
                      styles.lifeTabTextSelected,
                  ]}>
                  {t(
                    'horoscope.career.title',
                    {
                      defaultValue:
                        'Sự nghiệp',
                    },
                  )}
                </Text>
              </Pressable>
            </View>

            <View style={styles.lifeCard}>
              <View style={styles.lifeCardTop}>
                <View
                  style={[
                    styles.lifeScoreCircle,
                    {
                      backgroundColor:
                        getLifeRatingStyle(
                          activeLifeInsight.rating,
                        ).backgroundColor,
                      borderColor:
                        getLifeRatingStyle(
                          activeLifeInsight.rating,
                        ).borderColor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.lifeScoreValue,
                      {
                        color:
                          getLifeRatingStyle(
                            activeLifeInsight.rating,
                          ).color,
                      },
                    ]}>
                    {activeLifeInsight.score}
                  </Text>

                  <Text
                    style={[
                      styles.lifeScoreLabel,
                      {
                        color:
                          getLifeRatingStyle(
                            activeLifeInsight.rating,
                          ).color,
                      },
                    ]}>
                    /100
                  </Text>
                </View>

                <View style={styles.lifeCardHeading}>
                  <Text style={styles.lifeCardEyebrow}>
                    {t(
                      `horoscope.lifeRatings.${activeLifeInsight.rating}`,
                      {
                        defaultValue:
                          activeLifeInsight.rating,
                      },
                    )}
                  </Text>

                  <Text style={styles.lifeCardTitle}>
                    {t(
                      `horoscope.${activeLifeSection}.styles.${activeLifeInsight.style}`,
                      {
                        defaultValue:
                          activeLifeInsight.style,
                      },
                    )}
                  </Text>

                  <Text style={styles.lifeSummary}>
                    {t(
                      `horoscope.${activeLifeSection}.summaries.${activeLifeInsight.style}`,
                      {
                        defaultValue:
                          activeLifeInsight.style,
                      },
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.lifeDivider} />

              <Text style={styles.lifeGroupTitle}>
                {t(
                  'horoscope.lifeStrengths',
                  {
                    defaultValue:
                      'Điểm mạnh',
                  },
                )}
              </Text>

              {activeLifeInsight.strengths.map(
                item => (
                  <View
                    key={item}
                    style={styles.lifeListRow}>
                    <View style={styles.lifeGoodDot}>
                      <Text style={styles.lifeGoodDotText}>
                        ✓
                      </Text>
                    </View>

                    <Text style={styles.lifeListText}>
                      {insightLabel(
                        item,
                      )}
                    </Text>
                  </View>
                ),
              )}

              {activeLifeInsight.cautions.length > 0 && (
                <>
                  <Text style={styles.lifeGroupTitle}>
                    {t(
                      'horoscope.lifeCautions',
                      {
                        defaultValue:
                          'Điểm cần cân bằng',
                      },
                    )}
                  </Text>

                  {activeLifeInsight.cautions.map(
                    item => (
                      <View
                        key={item}
                        style={styles.lifeListRow}>
                        <View style={styles.lifeCautionDot}>
                          <Text style={styles.lifeCautionDotText}>
                            !
                          </Text>
                        </View>

                        <Text style={styles.lifeListText}>
                          {insightLabel(
                            item,
                          )}
                        </Text>
                      </View>
                    ),
                  )}
                </>
              )}

              <View style={styles.lifeAdviceCard}>
                <Text style={styles.lifeAdviceTitle}>
                  {t(
                    'horoscope.lifeAdvice',
                    {
                      defaultValue:
                        'Gợi ý phát triển',
                    },
                  )}
                </Text>

                {activeLifeInsight.advice.map(
                  item => (
                    <Text
                      key={item}
                      style={styles.lifeAdviceText}>
                      •{' '}
                      {insightLabel(
                        item,
                      )}
                    </Text>
                  ),
                )}
              </View>
            </View>
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {t(
                'horoscope.resultsTitle',
                {
                  defaultValue:
                    'Ngày phù hợp được gợi ý',
                },
              )}
            </Text>

            <Text style={styles.resultsSubtitle}>
              {t(
                'horoscope.resultsSubtitleExtended',
                {
                  defaultValue:
                    'Các ngày được xếp theo trường phái, tuổi và giờ sinh đã chọn.',
                },
              )}
            </Text>

            {results.map(
              (
                item,
                index,
              ) => {
                const ratingStyle =
                  getRatingStyle(
                    item.rating,
                  );

                return (
                  <View
                    key={
                      item.solarDate.toISOString()
                    }
                    style={styles.resultCard}>
                    <View style={styles.resultTop}>
                      <View style={styles.resultRank}>
                        <Text style={styles.resultRankText}>
                          {index + 1}
                        </Text>
                      </View>

                      <View style={styles.resultDateWrap}>
                        <Text style={styles.resultDate}>
                          {formatDate(
                            item.solarDate,
                            language,
                          )}
                        </Text>

                        <Text style={styles.resultLunar}>
                          {t(
                            'horoscope.lunarDateLine',
                            {
                              day:
                                item.lunarDay,
                              month:
                                item.lunarMonth,
                              year:
                                item.lunarYear,
                              defaultValue:
                                `Âm lịch ${item.lunarDay}/${item.lunarMonth}/${item.lunarYear}`,
                            },
                          )}
                        </Text>

                        {!!item.dayCanChi && (
                          <Text style={styles.resultCanChi}>
                            {localizeCanChi(
                              item.dayCanChi,
                              language,
                            )}
                          </Text>
                        )}
                      </View>

                      <View
                        style={[
                          styles.ratingBadge,
                          {
                            backgroundColor:
                              ratingStyle.backgroundColor,
                            borderColor:
                              ratingStyle.borderColor,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.ratingText,
                            {
                              color:
                                ratingStyle.color,
                            },
                          ]}>
                          {t(
                            `horoscope.ratings.${item.rating}`,
                            {
                              defaultValue:
                                item.rating,
                            },
                          )}
                        </Text>

                        <Text
                          style={[
                            styles.scoreText,
                            {
                              color:
                                ratingStyle.color,
                            },
                          ]}>
                          {item.score}
                        </Text>
                      </View>
                    </View>

                    {item.reasons.length > 0 && (
                      <View style={styles.reasonGroup}>
                        <Text style={styles.reasonGroupTitle}>
                          {t(
                            'horoscope.suitableReasons',
                            {
                              defaultValue:
                                'Điểm thuận',
                            },
                          )}
                        </Text>

                        <View style={styles.chipWrap}>
                          {item.reasons.map(
                            reason => (
                              <View
                                key={reason}
                                style={styles.goodChip}>
                                <Text style={styles.goodChipText}>
                                  {reasonLabel(
                                    reason,
                                  )}
                                </Text>
                              </View>
                            ),
                          )}
                        </View>
                      </View>
                    )}

                    {item.avoidReasons.length > 0 && (
                      <View style={styles.reasonGroup}>
                        <Text style={styles.reasonGroupTitle}>
                          {t(
                            'horoscope.cautionReasons',
                            {
                              defaultValue:
                                'Điểm cần lưu ý',
                            },
                          )}
                        </Text>

                        <View style={styles.chipWrap}>
                          {item.avoidReasons.map(
                            reason => (
                              <View
                                key={reason}
                                style={styles.cautionChip}>
                                <Text style={styles.cautionChipText}>
                                  {reasonLabel(
                                    reason,
                                  )}
                                </Text>
                              </View>
                            ),
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                );
              },
            )}
          </View>
        )}

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerIcon}>
            ℹ
          </Text>

          <Text style={styles.disclaimerText}>
            {t(
              'horoscope.disclaimerExtended',
              {
                defaultValue:
                  'Đây là mô hình luận giải rút gọn dựa trên lịch âm, tuổi, giờ sinh và bộ trọng số theo trường phái. Không phải lá số Tử vi Đẩu số hay Bát tự hoàn chỉnh và không nên là cơ sở duy nhất cho quyết định quan trọng.',
              },
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BACKGROUND = '#FFF8EF';
const SURFACE = '#FFFDF8';
const BROWN = '#4E2C1C';
const GOLD = '#D0A04C';
const BORDER = '#E5CDA8';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  headerCard: {
    alignItems: 'center',
    backgroundColor: BROWN,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 24,
    padding: 20,
  },

  headerIcon: {
    fontSize: 44,
  },

  title: {
    color: '#FFE3A3',
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 7,
  },

  subtitle: {
    color: '#ECD7B8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },

  formCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    padding: 17,
    marginTop: 14,
  },

  sectionTitle: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '900',
  },

  sectionTitleSecondary: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 10,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
  },

  dateField: {
    flex: 1,
  },

  yearField: {
    flex: 1.35,
  },

  dateSeparator: {
    width: 23,
    alignItems: 'center',
    paddingBottom: 13,
  },

  dateSeparatorText: {
    color: '#967A62',
    fontSize: 20,
  },

  inputLabel: {
    color: '#806550',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },

  dateInput: {
    minHeight: 48,
    color: BROWN,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: '#FFF5E5',
    borderWidth: 1,
    borderColor: '#E0C292',
    borderRadius: 13,
    paddingHorizontal: 8,
  },

  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  timeField: {
    width: 72,
  },

  timeInput: {
    minHeight: 48,
    color: BROWN,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: '#FFF5E5',
    borderWidth: 1,
    borderColor: '#E0C292',
    borderRadius: 13,
  },

  timeColon: {
    color: BROWN,
    fontSize: 24,
    fontWeight: '900',
    paddingHorizontal: 9,
    paddingBottom: 10,
  },

  timeHintCard: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E9D9',
    borderRadius: 13,
    paddingHorizontal: 10,
    marginLeft: 12,
  },

  timeHintIcon: {
    fontSize: 20,
    marginRight: 7,
  },

  timeHintText: {
    flex: 1,
    color: '#7D6654',
    fontSize: 11,
    lineHeight: 16,
  },

  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  genderButton: {
    width: '31.5%',
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E7D7',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 14,
  },

  genderButtonSelected: {
    backgroundColor: BROWN,
    borderColor: GOLD,
  },

  genderIcon: {
    color: BROWN,
    fontSize: 20,
    fontWeight: '900',
  },

  genderText: {
    color: '#6F5745',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },

  genderTextSelected: {
    color: '#FFE7B0',
  },

  schoolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  schoolButton: {
    width: '48.5%',
    minHeight: 118,
    backgroundColor: '#F5E9D9',
    borderWidth: 1,
    borderColor: '#E4CBA7',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },

  schoolButtonSelected: {
    backgroundColor: BROWN,
    borderColor: GOLD,
  },

  schoolIconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8EC',
    borderRadius: 11,
  },

  schoolIconWrapSelected: {
    backgroundColor: '#F0CC83',
  },

  schoolIcon: {
    fontSize: 20,
  },

  schoolTextWrap: {
    marginTop: 8,
  },

  schoolTitle: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '900',
  },

  schoolTitleSelected: {
    color: '#FFE7B0',
  },

  schoolDescription: {
    color: '#7B6552',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  schoolDescriptionSelected: {
    color: '#EFD7B7',
  },

  selectedMethodCard: {
    backgroundColor: '#FFF3D7',
    borderWidth: 1,
    borderColor: '#DDBE83',
    borderRadius: 15,
    padding: 13,
    marginTop: 2,
  },

  selectedMethodLabel: {
    color: '#987343',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  selectedMethodTitle: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
  },

  selectedMethodDescription: {
    color: '#725B47',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  activityButton: {
    width: '48.5%',
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E7D7',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 15,
    paddingHorizontal: 12,
    marginBottom: 9,
  },

  activityButtonSelected: {
    backgroundColor: BROWN,
    borderColor: GOLD,
  },

  activityIcon: {
    fontSize: 24,
    marginRight: 9,
  },

  activityText: {
    flex: 1,
    color: '#6F5745',
    fontSize: 13,
    fontWeight: '800',
  },

  activityTextSelected: {
    color: '#FFE7B0',
  },

  monthOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  monthButton: {
    width: '31.5%',
    minHeight: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E7D7',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 13,
  },

  monthButtonSelected: {
    backgroundColor: BROWN,
    borderColor: GOLD,
  },

  monthButtonText: {
    color: '#6F5745',
    fontSize: 13,
    fontWeight: '800',
  },

  monthButtonTextSelected: {
    color: '#FFE7B0',
  },

  calculateButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    borderRadius: 15,
    marginTop: 20,
  },

  calculateButtonDisabled: {
    opacity: 0.55,
  },

  calculateButtonText: {
    color: '#3E2416',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },

  profileCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    padding: 17,
    marginTop: 15,
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileIcon: {
    fontSize: 36,
    marginRight: 11,
  },

  profileHeaderText: {
    flex: 1,
  },

  profileTitle: {
    color: BROWN,
    fontSize: 18,
    fontWeight: '900',
  },

  profileSubtitle: {
    color: '#8E735E',
    fontSize: 12,
    marginTop: 3,
  },

  profileGrid: {
    marginTop: 14,
  },

  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEDFCA',
    paddingVertical: 11,
  },

  profileLabel: {
    color: '#846B56',
    fontSize: 13,
  },

  profileValue: {
    flexShrink: 1,
    color: BROWN,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
    marginLeft: 14,
  },

  profileNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3D9',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },

  profileNoteIcon: {
    color: GOLD,
    fontSize: 16,
    marginRight: 8,
  },

  profileNoteText: {
    flex: 1,
    color: '#745B46',
    fontSize: 11,
    lineHeight: 17,
  },

  lifeSection: {
    marginTop: 20,
  },

  lifeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  lifeTitle: {
    color: BROWN,
    fontSize: 22,
    fontWeight: '900',
  },

  lifeSubtitle: {
    maxWidth: 290,
    color: '#846E5B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  lifeHeaderIcon: {
    color: GOLD,
    fontSize: 23,
    marginTop: 2,
  },

  lifeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F2E5D3',
    borderRadius: 16,
    padding: 4,
    marginTop: 13,
  },

  lifeTab: {
    flex: 1,
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },

  lifeTabSelected: {
    backgroundColor: BROWN,
  },

  lifeTabIcon: {
    color: '#7E624B',
    fontSize: 17,
    fontWeight: '900',
    marginRight: 7,
  },

  lifeTabText: {
    color: '#6E5644',
    fontSize: 13,
    fontWeight: '900',
  },

  lifeTabTextSelected: {
    color: '#FFE4A6',
  },

  lifeCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    padding: 17,
    marginTop: 12,

    shadowColor: '#5B351F',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  lifeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  lifeScoreCircle: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 41,
    marginRight: 14,
  },

  lifeScoreValue: {
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 30,
  },

  lifeScoreLabel: {
    fontSize: 10,
    fontWeight: '800',
  },

  lifeCardHeading: {
    flex: 1,
  },

  lifeCardEyebrow: {
    color: '#A1763F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },

  lifeCardTitle: {
    color: BROWN,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 4,
  },

  lifeSummary: {
    color: '#735C49',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  lifeDivider: {
    height: 1,
    backgroundColor: '#EEDFCB',
    marginVertical: 15,
  },

  lifeGroupTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 9,
    marginBottom: 8,
  },

  lifeListRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  lifeGoodDot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2DF',
    borderRadius: 11,
    marginRight: 9,
  },

  lifeGoodDotText: {
    color: '#5C733F',
    fontSize: 11,
    fontWeight: '900',
  },

  lifeCautionDot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBE9E1',
    borderRadius: 11,
    marginRight: 9,
  },

  lifeCautionDotText: {
    color: '#9B5946',
    fontSize: 11,
    fontWeight: '900',
  },

  lifeListText: {
    flex: 1,
    color: '#6E5847',
    fontSize: 12,
    lineHeight: 19,
  },

  lifeAdviceCard: {
    backgroundColor: '#FFF2D9',
    borderWidth: 1,
    borderColor: '#E2C28B',
    borderRadius: 15,
    padding: 13,
    marginTop: 10,
  },

  lifeAdviceTitle: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 6,
  },

  lifeAdviceText: {
    color: '#725A45',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 2,
  },

  resultsSection: {
    marginTop: 20,
  },

  resultsTitle: {
    color: BROWN,
    fontSize: 22,
    fontWeight: '900',
  },

  resultsSubtitle: {
    color: '#846E5B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 12,
  },

  resultCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },

  resultTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  resultRank: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1DEC0',
    borderRadius: 12,
    marginRight: 10,
  },

  resultRankText: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '900',
  },

  resultDateWrap: {
    flex: 1,
    marginRight: 8,
  },

  resultDate: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
  },

  resultLunar: {
    color: '#8D725B',
    fontSize: 11,
    marginTop: 3,
  },

  resultCanChi: {
    color: '#A07845',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },

  ratingBadge: {
    minWidth: 66,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  ratingText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  scoreText: {
    fontSize: 19,
    fontWeight: '900',
    marginTop: 1,
  },

  reasonGroup: {
    marginTop: 12,
  },

  reasonGroupTitle: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 7,
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  goodChip: {
    backgroundColor: '#EEF4E5',
    borderWidth: 1,
    borderColor: '#B8C99D',
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },

  goodChipText: {
    color: '#53643F',
    fontSize: 10,
    fontWeight: '700',
  },

  cautionChip: {
    backgroundColor: '#FFF0E9',
    borderWidth: 1,
    borderColor: '#DCB19C',
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },

  cautionChipText: {
    color: '#8A4C3B',
    fontSize: 10,
    fontWeight: '700',
  },

  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7EAD6',
    borderWidth: 1,
    borderColor: '#DFC59C',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  },

  disclaimerIcon: {
    width: 24,
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginRight: 8,
  },

  disclaimerText: {
    flex: 1,
    color: '#745C48',
    fontSize: 11,
    lineHeight: 17,
  },

  buttonPressed: {
    opacity: 0.68,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
