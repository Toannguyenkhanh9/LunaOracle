import React, {
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  Image,
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
  useFocusEffect,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import {
  deletePalmReadingResult,
  listPalmReadingHistory,
  type PalmReadingResult,
} from '../services/palmReading';
import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

type Props =
  BottomTabScreenProps<
    RootTabParamList,
    'PalmReadingHistory'
  >;
export default function PalmReadingHistoryScreen({
  navigation,
}: Props) {
  const {t} =
    useTranslation();

  const [
    readings,
    setReadings,
  ] =
    useState<PalmReadingResult[]>([]);

  const load = useCallback(
    async () => {
      setReadings(
        await listPalmReadingHistory(),
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

  const remove =
    (id: string) => {
      Alert.alert(
        t(
          'palmReading.deleteTitle',
          {
            defaultValue:
              'Delete palm reading?',
          },
        ),
        t(
          'palmReading.deleteMessage',
          {
            defaultValue:
              'This palm reading will be removed from this device.',
          },
        ),
        [
          {
            text:
              t(
                'common.cancel',
                {
                  defaultValue:
                    'Cancel',
                },
              ),
            style: 'cancel',
          },
          {
            text:
              t(
                'common.delete',
                {
                  defaultValue:
                    'Delete',
                },
              ),
            style: 'destructive',
            onPress:
              async () => {
                await deletePalmReadingResult(id);
                await load();
              },
          },
        ],
      );
    };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'palmReading.history',
            {
              defaultValue:
                'History',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'palmReading.historyTitle',
            {
              defaultValue:
                'Palm Reading History',
            },
          )}
        </Text>

        {readings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              ✋
            </Text>

            <Text style={styles.emptyTitle}>
              {t(
                'palmReading.emptyHistory',
                {
                  defaultValue:
                    'No palm readings yet',
                },
              )}
            </Text>
          </View>
        ) : null}

        {readings.map(item => (
          <Pressable
            key={item.id}
            style={({pressed}) => [
              styles.card,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate(
                'PalmReadingResult',
                {
                  savedReading: item,
                },
              )
            }>
            {item.imageUri ? (
              <Image
                source={{
                  uri: item.imageUri,
                }}
                style={styles.thumb}
              />
            ) : null}

            <View style={styles.copy}>
              <Text style={styles.cardTitle}>
                {item.overallScore} •{' '}
                {t(
                  `palmReading.shapes.${item.palmShape}`,
                  {
                    defaultValue:
                      item.palmShape,
                  },
                )}
              </Text>

              <Text style={styles.cardMeta}>
                {new Date(
                  item.createdAt,
                ).toLocaleDateString()}{' '}
                •{' '}
                {t(
                  `palmReading.focusOptions.${item.focus}`,
                  {
                    defaultValue:
                      item.focus,
                  },
                )}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                remove(item.id)
              }>
              <Text style={styles.deleteText}>
                ×
              </Text>
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  cream: '#F7F2EA',
  paper: '#FFFDF8',
  border: '#E9DCC5',
  purple: '#6E4DA8',
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
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    marginTop: 5,
    marginBottom: 16,
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 24,
  },

  emptyIcon: {
    fontSize: 56,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
  },

  thumb: {
    width: 58,
    height: 58,
    backgroundColor: '#DDD3E9',
    borderRadius: 16,
    marginRight: 12,
  },

  copy: {
    flex: 1,
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  cardMeta: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'capitalize',
  },

  deleteText: {
    color: COLORS.muted,
    fontSize: 24,
    fontWeight: '900',
    paddingHorizontal: 10,
  },

  pressed: {
    opacity: 0.76,
  },
});
