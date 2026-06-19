import React, {
  useMemo,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useTranslation,
} from 'react-i18next';

import {
  buildDailyHoroscope,
} from '../services/dailyHoroscope';

import {
  translateAffirmation,
  translateDailyText,
} from '../utils/lunaContentLocalization';

import {
  ZODIAC_SIGNS,
  type ZodiacSignId,
} from '../services/zodiac';

const SIGN_IDS =
  Object.keys(
    ZODIAC_SIGNS,
  ) as ZodiacSignId[];

export default function DailyHoroscopeScreen() {
  const {t} =
    useTranslation();

  const [selectedSign, setSelectedSign] =
    useState<ZodiacSignId>('aries');

  const reading =
    useMemo(
      () =>
        buildDailyHoroscope(
          selectedSign,
        ),
      [selectedSign],
    );

  const profile =
    ZODIAC_SIGNS[selectedSign];

  const signName =
    t(
      `western.signs.${selectedSign}`,
      {
        defaultValue:
          selectedSign,
      },
    );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }>
        <Text style={styles.eyebrow}>
          {t(
            'western.daily.eyebrow',
            {
              defaultValue:
                'Daily Horoscope',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {profile.symbol}{' '}
          {signName.toUpperCase()}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.signRow}>
          {SIGN_IDS.map(sign => {
            const item =
              ZODIAC_SIGNS[sign];

            const active =
              sign === selectedSign;

            return (
              <Pressable
                key={sign}
                style={[
                  styles.signChip,
                  active &&
                    styles.signChipActive,
                ]}
                onPress={() =>
                  setSelectedSign(sign)
                }>
                <Text
                  style={[
                    styles.signSymbol,
                    active &&
                      styles.signTextActive,
                  ]}>
                  {item.symbol}
                </Text>

                <Text
                  style={[
                    styles.signName,
                    active &&
                      styles.signTextActive,
                  ]}
                  numberOfLines={1}>
                  {t(
                    `western.signs.${sign}`,
                    {
                      defaultValue:
                        sign,
                    },
                  )}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.mainCard}>
          <Text style={styles.cardLabel}>
            {t(
              'western.daily.today',
              {
                defaultValue:
                  'Today',
              },
            )}
          </Text>

          <Text style={styles.headline}>
            {translateDailyText(t, 'headlines', reading.headline)}
          </Text>

          <Text style={styles.affirmation}>
            {translateAffirmation(t, profile.element, reading.affirmation)}
          </Text>
        </View>

        <View style={styles.grid}>
          <InfoCard
            title={t(
              'western.daily.love',
              {
                defaultValue:
                  'Love',
              },
            )}
            text={translateDailyText(t, 'love', reading.love)}
          />

          <InfoCard
            title={t(
              'western.daily.career',
              {
                defaultValue:
                  'Career',
              },
            )}
            text={translateDailyText(t, 'career', reading.career)}
          />

          <InfoCard
            title={t(
              'western.daily.money',
              {
                defaultValue:
                  'Money',
              },
            )}
            text={translateDailyText(t, 'money', reading.money)}
          />

          <InfoCard
            title={t(
              'western.daily.energy',
              {
                defaultValue:
                  'Energy',
              },
            )}
            text={translateDailyText(t, 'energy', reading.energy)}
          />
        </View>

        <View style={styles.luckyCard}>
          <Text style={styles.luckyText}>
            {t(
              'western.daily.luckyColor',
              {
                defaultValue:
                  'Lucky color',
              },
            )}
            : {reading.luckyColor}
          </Text>

          <Text style={styles.luckyText}>
            {t(
              'western.daily.luckyNumber',
              {
                defaultValue:
                  'Lucky number',
              },
            )}
            : {reading.luckyNumber}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>
        {title}
      </Text>

      <Text style={styles.infoText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F2EA',
  },

  content: {
    padding: 18,
    paddingBottom: 100,
  },

  eyebrow: {
    color: '#9A7939',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  title: {
    color: '#282236',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 6,
  },

  signRow: {
    marginTop: 16,
  },

  signChip: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 82,
    minHeight: 66,
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 18,
    marginRight: 9,
    paddingHorizontal: 9,
  },

  signChipActive: {
    backgroundColor: '#1B1537',
    borderColor: '#D9B76E',
  },

  signSymbol: {
    color: '#6E4DA8',
    fontSize: 21,
    fontWeight: '900',
  },

  signName: {
    color: '#746D7C',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 4,
    textTransform: 'capitalize',
  },

  signTextActive: {
    color: '#F8EBCB',
  },

  mainCard: {
    backgroundColor: '#1B1537',
    borderRadius: 24,
    padding: 18,
    marginTop: 20,
  },

  cardLabel: {
    color: '#D9B76E',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  headline: {
    color: '#FFF8EA',
    fontSize: 21,
    lineHeight: 29,
    fontWeight: '900',
    marginTop: 9,
  },

  affirmation: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 12,
  },

  grid: {
    marginTop: 14,
  },

  infoCard: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E9DCC5',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
  },

  infoTitle: {
    color: '#6E4DA8',
    fontSize: 13,
    fontWeight: '900',
  },

  infoText: {
    color: '#756D7D',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  luckyCard: {
    backgroundColor: '#EEE6F4',
    borderRadius: 20,
    padding: 15,
    marginTop: 4,
  },

  luckyText: {
    color: '#4D405E',
    fontSize: 12,
    fontWeight: '800',
    marginVertical: 2,
  },
});
