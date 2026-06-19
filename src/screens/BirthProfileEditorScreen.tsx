import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  Modal,
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
  useRoute,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  buildBirthChart,
  getZodiacSymbol,
} from '../services/astroBirthChart';

import {
  createDefaultBirthInput,
  getBirthProfileById,
  upsertBirthProfile,
} from '../services/birthProfiles';

import {
  formatBirthPlace,
  searchBirthPlaces,
  type BirthPlace,
} from '../services/birthPlaces';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Record<string, unknown>,
  ) => void;
  goBack: () => void;
};

type RouteLike = {
  params?: {
    profileId?: string;
  };
};

function numberText(
  value: number,
): string {
  return Number.isInteger(value)
    ? String(value)
    : String(value);
}

export default function BirthProfileEditorScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const route =
    useRoute<RouteLike>();

  const profileId =
    route.params?.profileId;

  const defaultInput =
    createDefaultBirthInput();

  const [name, setName] =
    useState('');

  const [year, setYear] =
    useState(String(defaultInput.year));

  const [month, setMonth] =
    useState(String(defaultInput.month));

  const [day, setDay] =
    useState(String(defaultInput.day));

  const [hour, setHour] =
    useState(String(defaultInput.hour));

  const [minute, setMinute] =
    useState(String(defaultInput.minute));

  const [
    timezoneOffset,
    setTimezoneOffset,
  ] =
    useState(
      numberText(
        defaultInput.timezoneOffset,
      ),
    );

  const [latitude, setLatitude] =
    useState(
      numberText(
        defaultInput.latitude,
      ),
    );

  const [longitude, setLongitude] =
    useState(
      numberText(
        defaultInput.longitude,
      ),
    );

  const [note, setNote] =
    useState('');

  const [
    selectedPlace,
    setSelectedPlace,
  ] =
    useState<BirthPlace | undefined>();

  const [
    isPlaceModalVisible,
    setPlaceModalVisible,
  ] =
    useState(false);

  const [
    placeQuery,
    setPlaceQuery,
  ] =
    useState('');

  useEffect(
    () => {
      let mounted = true;

      if (!profileId) {
        setName(
          t(
            'lunaBirthProfiles.defaultName',
            {
              defaultValue:
                'My Birth Chart',
            },
          ),
        );
        return;
      }

      void getBirthProfileById(
        profileId,
      ).then(profile => {
        if (
          !mounted ||
          !profile
        ) {
          return;
        }

        setName(profile.name);
        setYear(
          String(profile.input.year),
        );
        setMonth(
          String(profile.input.month),
        );
        setDay(
          String(profile.input.day),
        );
        setHour(
          String(profile.input.hour),
        );
        setMinute(
          String(profile.input.minute),
        );
        setTimezoneOffset(
          numberText(
            profile.input.timezoneOffset,
          ),
        );
        setLatitude(
          numberText(
            profile.input.latitude,
          ),
        );
        setLongitude(
          numberText(
            profile.input.longitude,
          ),
        );
        setSelectedPlace(
          profile.place,
        );
        setNote(
          profile.note ?? '',
        );
      });

      return () => {
        mounted = false;
      };
    },
    [profileId, t],
  );

  const input =
    useMemo(
      () => ({
        year:
          Number(year),
        month:
          Number(month),
        day:
          Number(day),
        hour:
          Number(hour),
        minute:
          Number(minute),
        timezoneOffset:
          Number(timezoneOffset),
        latitude:
          Number(latitude),
        longitude:
          Number(longitude),
      }),
      [
        year,
        month,
        day,
        hour,
        minute,
        timezoneOffset,
        latitude,
        longitude,
      ],
    );

  const chart =
    useMemo(
      () =>
        buildBirthChart(
          input,
        ),
      [input],
    );

  const places =
    useMemo(
      () =>
        searchBirthPlaces(
          placeQuery,
        ),
      [placeQuery],
    );

  const choosePlace = (
    place: BirthPlace,
  ) => {
    setSelectedPlace(place);
    setTimezoneOffset(
      numberText(
        place.timezoneOffset,
      ),
    );
    setLatitude(
      numberText(place.latitude),
    );
    setLongitude(
      numberText(place.longitude),
    );
    setPlaceModalVisible(false);
  };

  const save = async () => {
    try {
      await upsertBirthProfile({
        id:
          profileId,
        name,
        input,
        place:
          selectedPlace,
        note,
        makeActive: true,
      });

      Alert.alert(
        t(
          'lunaBirthProfiles.savedTitle',
          {
            defaultValue:
              'Saved',
          },
        ),
        t(
          'lunaBirthProfiles.savedMessage',
          {
            defaultValue:
              'Birth profile was saved.',
          },
        ),
      );

      navigation.navigate(
        'BirthProfiles',
      );
    } catch (error) {
      console.warn(
        'Unable to save birth profile:',
        error,
      );

      Alert.alert(
        t(
          'lunaBirthProfiles.saveErrorTitle',
          {
            defaultValue:
              'Unable to save',
          },
        ),
        t(
          'lunaBirthProfiles.saveErrorMessage',
          {
            defaultValue:
              'Please try again.',
          },
        ),
      );
    }
  };

  const sun =
    chart.points.sun;

  const moon =
    chart.points.moon;

  const rising =
    chart.points.ascendant;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'lunaBirthProfiles.editorEyebrow',
            {
              defaultValue:
                'Birth Profile',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {profileId
            ? t(
                'lunaBirthProfiles.editProfile',
                {
                  defaultValue:
                    'Edit Profile',
                },
              )
            : t(
                'lunaBirthProfiles.newProfile',
                {
                  defaultValue:
                    'New Profile',
                },
              )}
        </Text>

        <View style={styles.inputCard}>
          <Text style={styles.sectionLabel}>
            {t(
              'lunaBirthProfiles.profileName',
              {
                defaultValue:
                  'Profile name',
              },
            )}
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t(
              'lunaBirthProfiles.profileNamePlaceholder',
              {
                defaultValue:
                  'Name',
              },
            )}
            placeholderTextColor="#A99DAF"
            style={styles.nameInput}
          />

          <Pressable
            style={styles.placeButton}
            onPress={() =>
              setPlaceModalVisible(true)
            }>
            <View style={styles.placeIcon}>
              <Text style={styles.placeIconText}>
                ◎
              </Text>
            </View>

            <View style={styles.placeCopy}>
              <Text style={styles.placeLabel}>
                {t(
                  'lunaBirthProfiles.birthPlace',
                  {
                    defaultValue:
                      'Birth place',
                  },
                )}
              </Text>

              <Text
                style={styles.placeValue}
                numberOfLines={1}>
                {selectedPlace
                  ? formatBirthPlace(
                      selectedPlace,
                    )
                  : t(
                      'lunaBirthProfiles.chooseBirthPlace',
                      {
                        defaultValue:
                          'Choose birth city',
                      },
                    )}
              </Text>
            </View>

            <Text style={styles.placeArrow}>
              ›
            </Text>
          </Pressable>

          <View style={styles.inputRow}>
            <InputBox
              label={t(
                'lunaBirthProfiles.year',
                {
                  defaultValue:
                    'Year',
                },
              )}
              value={year}
              onChange={setYear}
            />

            <InputBox
              label={t(
                'lunaBirthProfiles.month',
                {
                  defaultValue:
                    'Month',
                },
              )}
              value={month}
              onChange={setMonth}
            />

            <InputBox
              label={t(
                'lunaBirthProfiles.day',
                {
                  defaultValue:
                    'Day',
                },
              )}
              value={day}
              onChange={setDay}
            />
          </View>

          <View style={styles.inputRow}>
            <InputBox
              label={t(
                'lunaBirthProfiles.hour',
                {
                  defaultValue:
                    'Hour',
                },
              )}
              value={hour}
              onChange={setHour}
            />

            <InputBox
              label={t(
                'lunaBirthProfiles.minute',
                {
                  defaultValue:
                    'Minute',
                },
              )}
              value={minute}
              onChange={setMinute}
            />

            <InputBox
              label={t(
                'lunaBirthProfiles.timezone',
                {
                  defaultValue:
                    'UTC',
                },
              )}
              value={timezoneOffset}
              onChange={setTimezoneOffset}
            />
          </View>

          <View style={styles.inputRow}>
            <InputBox
              label={t(
                'lunaBirthProfiles.latitude',
                {
                  defaultValue:
                    'Latitude',
                },
              )}
              value={latitude}
              onChange={setLatitude}
            />

            <InputBox
              label={t(
                'lunaBirthProfiles.longitude',
                {
                  defaultValue:
                    'Longitude',
                },
              )}
              value={longitude}
              onChange={setLongitude}
            />
          </View>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t(
              'lunaBirthProfiles.notePlaceholder',
              {
                defaultValue:
                  'Optional note...',
              },
            )}
            placeholderTextColor="#A99DAF"
            multiline
            style={styles.noteInput}
          />
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.sectionLabelGold}>
            {t(
              'lunaBirthProfiles.preview',
              {
                defaultValue:
                  'Preview',
              },
            )}
          </Text>

          <View style={styles.bigThreeRow}>
            <MiniPoint
              label={t(
                'lunaBirthProfiles.sun',
                {
                  defaultValue:
                    'Sun',
                },
              )}
              symbol={getZodiacSymbol(
                sun.sign,
              )}
              sign={t(
                `western.signs.${sun.sign}`,
                {
                  defaultValue:
                    sun.sign,
                },
              )}
            />

            <MiniPoint
              label={t(
                'lunaBirthProfiles.moon',
                {
                  defaultValue:
                    'Moon',
                },
              )}
              symbol={getZodiacSymbol(
                moon.sign,
              )}
              sign={t(
                `western.signs.${moon.sign}`,
                {
                  defaultValue:
                    moon.sign,
                },
              )}
            />

            <MiniPoint
              label={t(
                'lunaBirthProfiles.rising',
                {
                  defaultValue:
                    'Rising',
                },
              )}
              symbol={getZodiacSymbol(
                rising.sign,
              )}
              sign={t(
                `western.signs.${rising.sign}`,
                {
                  defaultValue:
                    rising.sign,
                },
              )}
            />
          </View>
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={save}>
          <Text style={styles.saveText}>
            {t(
              'lunaBirthProfiles.saveProfile',
              {
                defaultValue:
                  'Save Profile',
              },
            )}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={isPlaceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setPlaceModalVisible(false)
        }>
        <View style={styles.modalBackdrop}>
          <View style={styles.placeModal}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {t(
                    'lunaBirthProfiles.chooseBirthPlace',
                    {
                      defaultValue:
                        'Choose birth city',
                    },
                  )}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {t(
                    'lunaBirthProfiles.cityHint',
                    {
                      defaultValue:
                        'This fills UTC, latitude, and longitude automatically.',
                    },
                  )}
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() =>
                  setPlaceModalVisible(false)
                }>
                <Text style={styles.closeText}>
                  ×
                </Text>
              </Pressable>
            </View>

            <TextInput
              value={placeQuery}
              onChangeText={setPlaceQuery}
              placeholder={t(
                'lunaBirthProfiles.searchCity',
                {
                  defaultValue:
                    'Search city...',
                },
              )}
              placeholderTextColor="#A99DAF"
              style={styles.searchInput}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.placeList}>
              {places.map(place => (
                <Pressable
                  key={place.id}
                  style={({pressed}) => [
                    styles.placeOption,
                    pressed &&
                      styles.pressed,
                  ]}
                  onPress={() =>
                    choosePlace(place)
                  }>
                  <View style={styles.placeOptionIcon}>
                    <Text style={styles.placeOptionIconText}>
                      ◎
                    </Text>
                  </View>

                  <View style={styles.placeOptionCopy}>
                    <Text style={styles.placeOptionTitle}>
                      {place.city}
                    </Text>

                    <Text style={styles.placeOptionSubtitle}>
                      {place.country} • UTC {place.timezoneOffset >= 0 ? '+' : ''}
                      {place.timezoneOffset} • {place.latitude}, {place.longitude}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InputBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <View style={styles.inputBox}>
      <Text style={styles.inputLabel}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="numbers-and-punctuation"
        style={styles.input}
      />
    </View>
  );
}

function MiniPoint({
  label,
  symbol,
  sign,
}: {
  label: string;
  symbol: string;
  sign: string;
}) {
  return (
    <View style={styles.miniPoint}>
      <Text style={styles.miniSymbol}>
        {symbol}
      </Text>

      <Text style={styles.miniLabel}>
        {label}
      </Text>

      <Text
        style={styles.miniSign}
        numberOfLines={1}>
        {sign}
      </Text>
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
    fontWeight: '900',
    marginTop: 5,
  },

  inputCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 14,
    marginTop: 16,
  },

  sectionLabel: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 9,
  },

  sectionLabelGold: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  nameInput: {
    minHeight: 50,
    backgroundColor: '#F7F2EA',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  placeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F2EA',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },

  placeIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
  },

  placeIconText: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: '900',
  },

  placeCopy: {
    flex: 1,
    marginLeft: 11,
  },

  placeLabel: {
    color: '#9A7939',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  placeValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },

  placeArrow: {
    color: COLORS.purple,
    fontSize: 24,
    fontWeight: '900',
  },

  inputRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },

  inputBox: {
    flex: 1,
    backgroundColor: '#FBF7F0',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginHorizontal: 4,
    marginBottom: 8,
  },

  inputLabel: {
    color: '#9A7939',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  input: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
    padding: 0,
    marginTop: 4,
  },

  noteInput: {
    minHeight: 78,
    backgroundColor: '#F7F2EA',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    color: COLORS.text,
    fontSize: 13,
    textAlignVertical: 'top',
    padding: 12,
    marginTop: 2,
  },

  previewCard: {
    backgroundColor: COLORS.night,
    borderRadius: 24,
    padding: 16,
    marginTop: 14,
  },

  bigThreeRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },

  miniPoint: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
  },

  miniSymbol: {
    color: COLORS.gold,
    fontSize: 27,
    fontWeight: '900',
  },

  miniLabel: {
    color: '#BEB3DD',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 4,
  },

  miniSign: {
    color: '#FFF8EA',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'capitalize',
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
    fontSize: 15,
    fontWeight: '900',
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.48)',
  },

  placeModal: {
    maxHeight: '82%',
    backgroundColor: COLORS.paper,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },

  modalHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    backgroundColor: '#D6C8B8',
    borderRadius: 99,
    marginBottom: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
  },

  modalSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6EFE7',
    borderRadius: 20,
    marginLeft: 10,
  },

  closeText: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: -2,
  },

  searchInput: {
    minHeight: 50,
    backgroundColor: '#F7F2EA',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 14,
    marginTop: 14,
  },

  placeList: {
    paddingTop: 12,
    paddingBottom: 20,
  },

  placeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF7F0',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 12,
    marginBottom: 9,
  },

  pressed: {
    opacity: 0.75,
  },

  placeOptionIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE6F4',
    borderRadius: 14,
  },

  placeOptionIconText: {
    color: COLORS.purple,
    fontSize: 17,
    fontWeight: '900',
  },

  placeOptionCopy: {
    flex: 1,
    marginLeft: 11,
  },

  placeOptionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },

  placeOptionSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
});
