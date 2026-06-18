import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
  FORTUNE_STICKS,
  type FortuneStick,
  type FortuneStickLevel,
  type LocalizedText,
} from '../data/fortuneSticks';

import {
  deleteSavedFortuneStick,
  getSavedFortuneSticks,
  saveFortuneStick,
  type SavedFortuneStick,
} from '../services/fortuneStorage';

const DRAW_DURATION_MS = 2200;

function getLocalizedText(
  text: LocalizedText,
  language: string,
): string {
  return language
    .toLowerCase()
    .startsWith('vi')
    ? text.vi
    : text.en;
}

function formatSavedDate(
  value: string,
  language: string,
): string {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(
      language,
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    ).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function getLevelColors(
  level: FortuneStickLevel,
) {
  switch (level) {
    case 'great':
      return {
        background: '#6D3918',
        text: '#FFE2A1',
        border: '#D8A648',
      };

    case 'good':
      return {
        background: '#7A5528',
        text: '#FFF0C2',
        border: '#D7B66C',
      };

    case 'caution':
      return {
        background: '#783C2D',
        text: '#FFE1D5',
        border: '#C97C63',
      };

    default:
      return {
        background: '#665747',
        text: '#F8EDE0',
        border: '#A99782',
      };
  }
}

export default function FortuneStickScreen() {
  const {t, i18n} = useTranslation();

  const shakeX =
    useRef(
      new Animated.Value(0),
    ).current;

  const shakeRotate =
    useRef(
      new Animated.Value(0),
    ).current;

  const stickRise =
    useRef(
      new Animated.Value(0),
    ).current;

  const lastNumberRef =
    useRef<number | null>(null);

  const [intention, setIntention] =
    useState('');

  const [isDrawing, setIsDrawing] =
    useState(false);

  const [result, setResult] =
    useState<FortuneStick | null>(null);

  const [savedItems, setSavedItems] =
    useState<SavedFortuneStick[]>([]);

  const [isHistoryVisible, setIsHistoryVisible] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  useEffect(() => {
    const loadHistory = async () => {
      const items =
        await getSavedFortuneSticks();

      setSavedItems(items);
    };

    loadHistory();
  }, []);

  const selectRandomStick = () => {
    if (
      FORTUNE_STICKS.length === 1
    ) {
      return FORTUNE_STICKS[0];
    }

    let selected =
      FORTUNE_STICKS[
        Math.floor(
          Math.random() *
            FORTUNE_STICKS.length,
        )
      ];

    while (
      selected.number ===
      lastNumberRef.current
    ) {
      selected =
        FORTUNE_STICKS[
          Math.floor(
            Math.random() *
              FORTUNE_STICKS.length,
          )
        ];
    }

    lastNumberRef.current =
      selected.number;

    return selected;
  };

  const animateDraw = (
    onComplete: () => void,
  ) => {
    shakeX.setValue(0);
    shakeRotate.setValue(0);
    stickRise.setValue(0);

    const shake = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(
            shakeX,
            {
              toValue: -10,
              duration: 70,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            shakeRotate,
            {
              toValue: -1,
              duration: 70,
              useNativeDriver: true,
            },
          ),
        ]),

        Animated.parallel([
          Animated.timing(
            shakeX,
            {
              toValue: 10,
              duration: 70,
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            shakeRotate,
            {
              toValue: 1,
              duration: 70,
              useNativeDriver: true,
            },
          ),
        ]),
      ]),

      {
        iterations: 14,
      },
    );

    shake.start();

    setTimeout(() => {
      shake.stop();

      Animated.parallel([
        Animated.spring(
          shakeX,
          {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          shakeRotate,
          {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          stickRise,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          },
        ),
      ]).start(onComplete);
    }, DRAW_DURATION_MS);
  };

  const drawFortuneStick = () => {
    if (isDrawing) {
      return;
    }

    setResult(null);
    setIsHistoryVisible(false);
    setIsDrawing(true);

    Vibration.vibrate(
      [0, 80, 70, 80, 70, 120],
    );

    animateDraw(() => {
      const selected =
        selectRandomStick();

      setResult(selected);
      setIsDrawing(false);
    });
  };

  const saveCurrentResult = async () => {
    if (
      !result ||
      isSaving
    ) {
      return;
    }

    setIsSaving(true);

    try {
      const updated =
        await saveFortuneStick(
          result,
          intention,
        );

      setSavedItems(updated);

      Alert.alert(
        t(
          'fortuneStick.savedTitle',
          {
            defaultValue:
              'Đã lưu quẻ xăm',
          },
        ),

        t(
          'fortuneStick.savedMessage',
          {
            defaultValue:
              'Quẻ xăm đã được lưu trên thiết bị.',
          },
        ),
      );
    } catch (error) {
      console.warn(
        'Cannot save fortune stick:',
        error,
      );

      Alert.alert(
        t(
          'fortuneStick.saveErrorTitle',
          {
            defaultValue:
              'Không thể lưu',
          },
        ),

        t(
          'fortuneStick.saveErrorMessage',
          {
            defaultValue:
              'Đã xảy ra lỗi khi lưu quẻ xăm.',
          },
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const removeHistoryItem = (
    item: SavedFortuneStick,
  ) => {
    Alert.alert(
      t(
        'fortuneStick.deleteTitle',
        {
          defaultValue:
            'Xóa quẻ đã lưu',
        },
      ),

      t(
        'fortuneStick.deleteMessage',
        {
          defaultValue:
            'Bạn có chắc muốn xóa quẻ này?',
        },
      ),

      [
        {
          text: t(
            'common.cancel',
          ),
          style: 'cancel',
        },

        {
          text: t(
            'common.delete',
          ),
          style: 'destructive',

          onPress: async () => {
            const updated =
              await deleteSavedFortuneStick(
                item.id,
              );

            setSavedItems(updated);
          },
        },
      ],
    );
  };

  const rotation =
    shakeRotate.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [
        '-7deg',
        '0deg',
        '7deg',
      ],
    });

  const selectedStickY =
    stickRise.interpolate({
      inputRange: [0, 1],
      outputRange: [62, -74],
    });

  const selectedStickOpacity =
    stickRise.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 1, 1],
    });

  const levelColors = result
    ? getLevelColors(
        result.level,
      )
    : null;

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
            🧧
          </Text>

          <Text style={styles.title}>
            {t(
              'fortuneStick.title',
              {
                defaultValue:
                  'Xin xăm',
              },
            )}
          </Text>

          <Text style={styles.subtitle}>
            {t(
              'fortuneStick.subtitle',
              {
                defaultValue:
                  'Giữ tâm bình an, nghĩ về điều bạn đang quan tâm và xin một quẻ để chiêm nghiệm.',
              },
            )}
          </Text>
        </View>

        <View style={styles.intentionCard}>
          <Text style={styles.intentionLabel}>
            {t(
              'fortuneStick.intentionLabel',
              {
                defaultValue:
                  'Điều bạn đang cầu nguyện',
              },
            )}
          </Text>

          <TextInput
            value={intention}
            onChangeText={setIntention}
            placeholder={t(
              'fortuneStick.intentionPlaceholder',
              {
                defaultValue:
                  'Có thể để trống hoặc viết điều bạn đang quan tâm...',
              },
            )}
            placeholderTextColor="#9A8573"
            multiline
            maxLength={300}
            textAlignVertical="top"
            style={styles.intentionInput}
          />

          <Text style={styles.characterCount}>
            {intention.length}/300
          </Text>
        </View>

        <View style={styles.drawCard}>
          <View style={styles.glowCircle}>
            <Animated.View
              style={[
                styles.fortuneCylinder,
                {
                  transform: [
                    {
                      translateX:
                        shakeX,
                    },
                    {
                      rotate:
                        rotation,
                    },
                  ],
                },
              ]}>
              <View style={styles.cylinderTop}>
                <View style={styles.cylinderTopLine} />
              </View>

              <View style={styles.sticksWrap}>
                {[0, 1, 2, 3, 4, 5].map(
                  item => (
                    <View
                      key={item}
                      style={[
                        styles.smallStick,
                        {
                          transform: [
                            {
                              rotate:
                                `${(item - 2.5) * 4}deg`,
                            },
                          ],
                        },
                      ]}>
                      <Text style={styles.smallStickText}>
                        吉
                      </Text>
                    </View>
                  ),
                )}

                <Animated.View
                  style={[
                    styles.selectedStick,
                    {
                      opacity:
                        selectedStickOpacity,
                      transform: [
                        {
                          translateY:
                            selectedStickY,
                        },
                      ],
                    },
                  ]}>
                  <Text style={styles.selectedStickText}>
                    {result
                      ? result.number
                      : '?'}
                  </Text>
                </Animated.View>
              </View>

              <View style={styles.cylinderBody}>
                <Text style={styles.cylinderSymbol}>
                  福
                </Text>

                <View style={styles.cylinderDecor} />
              </View>

              <View style={styles.cylinderBase} />
            </Animated.View>
          </View>

          <Text style={styles.drawHint}>
            {isDrawing
              ? t(
                  'fortuneStick.drawing',
                  {
                    defaultValue:
                      'Đang xin quẻ...',
                  },
                )
              : t(
                  'fortuneStick.drawHint',
                  {
                    defaultValue:
                      'Thành tâm, hít thở chậm và nhấn nút bên dưới.',
                  },
                )}
          </Text>

          <Pressable
            disabled={isDrawing}
            style={({pressed}) => [
              styles.drawButton,
              isDrawing &&
                styles.drawButtonDisabled,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={drawFortuneStick}>
            <Text style={styles.drawButtonText}>
              {isDrawing
                ? t(
                    'fortuneStick.drawingButton',
                    {
                      defaultValue:
                        'Đang gieo quẻ',
                    },
                  )
                : t(
                    'fortuneStick.drawButton',
                    {
                      defaultValue:
                        'Xin một quẻ xăm',
                    },
                  )}
            </Text>
          </Pressable>
        </View>

        {result && levelColors && (
          <View style={styles.resultCard}>
            <View style={styles.resultTopRow}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberLabel}>
                  {t(
                    'fortuneStick.stickNumber',
                    {
                      defaultValue:
                        'Quẻ số',
                    },
                  )}
                </Text>

                <Text style={styles.numberValue}>
                  {String(
                    result.number,
                  ).padStart(
                    2,
                    '0',
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.levelBadge,
                  {
                    backgroundColor:
                      levelColors.background,
                    borderColor:
                      levelColors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.levelText,
                    {
                      color:
                        levelColors.text,
                    },
                  ]}>
                  {t(
                    `fortuneStick.levels.${result.level}`,
                    {
                      defaultValue:
                        result.level,
                    },
                  )}
                </Text>
              </View>
            </View>

            <Text style={styles.resultTitle}>
              {getLocalizedText(
                result.title,
                language,
              )}
            </Text>

            <View style={styles.verseCard}>
              <Text style={styles.verseText}>
                {getLocalizedText(
                  result.verse,
                  language,
                )}
              </Text>
            </View>

            <Text style={styles.resultSectionTitle}>
              {t(
                'fortuneStick.interpretationTitle',
                {
                  defaultValue:
                    'Luận giải',
                },
              )}
            </Text>

            <Text style={styles.resultBody}>
              {getLocalizedText(
                result.interpretation,
                language,
              )}
            </Text>

            <Text style={styles.resultSectionTitle}>
              {t(
                'fortuneStick.adviceTitle',
                {
                  defaultValue:
                    'Lời khuyên',
                },
              )}
            </Text>

            <Text style={styles.adviceText}>
              {getLocalizedText(
                result.advice,
                language,
              )}
            </Text>

            <View style={styles.resultActions}>
              <Pressable
                style={({pressed}) => [
                  styles.secondaryButton,
                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={drawFortuneStick}>
                <Text style={styles.secondaryButtonText}>
                  {t(
                    'fortuneStick.drawAgain',
                    {
                      defaultValue:
                        'Xin quẻ khác',
                    },
                  )}
                </Text>
              </Pressable>

              <Pressable
                disabled={isSaving}
                style={({pressed}) => [
                  styles.saveButton,
                  isSaving &&
                    styles.drawButtonDisabled,
                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={saveCurrentResult}>
                <Text style={styles.saveButtonText}>
                  {isSaving
                    ? t(
                        'fortuneStick.saving',
                        {
                          defaultValue:
                            'Đang lưu...',
                        },
                      )
                    : t(
                        'fortuneStick.save',
                        {
                          defaultValue:
                            'Lưu quẻ',
                        },
                      )}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <Pressable
          style={({pressed}) => [
            styles.historyHeader,
            pressed &&
              styles.buttonPressed,
          ]}
          onPress={() =>
            setIsHistoryVisible(
              current => !current,
            )
          }>
          <View>
            <Text style={styles.historyTitle}>
              {t(
                'fortuneStick.historyTitle',
                {
                  defaultValue:
                    'Quẻ đã lưu',
                },
              )}
            </Text>

            <Text style={styles.historySubtitle}>
              {t(
                'fortuneStick.historyCount',
                {
                  count:
                    savedItems.length,
                  defaultValue:
                    `${savedItems.length} quẻ`,
                },
              )}
            </Text>
          </View>

          <Text style={styles.historyArrow}>
            {isHistoryVisible
              ? '⌃'
              : '⌄'}
          </Text>
        </Pressable>

        {isHistoryVisible && (
          <View style={styles.historyList}>
            {savedItems.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryIcon}>
                  🪷
                </Text>

                <Text style={styles.emptyHistoryText}>
                  {t(
                    'fortuneStick.emptyHistory',
                    {
                      defaultValue:
                        'Bạn chưa lưu quẻ xăm nào.',
                    },
                  )}
                </Text>
              </View>
            ) : (
              savedItems.map(item => {
                const colors =
                  getLevelColors(
                    item.stick.level,
                  );

                return (
                  <View
                    key={item.id}
                    style={styles.historyCard}>
                    <View style={styles.historyCardTop}>
                      <View style={styles.historyNumber}>
                        <Text style={styles.historyNumberText}>
                          {String(
                            item.stick.number,
                          ).padStart(
                            2,
                            '0',
                          )}
                        </Text>
                      </View>

                      <View style={styles.historyInfo}>
                        <Text style={styles.historyItemTitle}>
                          {getLocalizedText(
                            item.stick.title,
                            language,
                          )}
                        </Text>

                        <Text style={styles.historyDate}>
                          {formatSavedDate(
                            item.createdAt,
                            language,
                          )}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.smallLevelBadge,
                          {
                            backgroundColor:
                              colors.background,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.smallLevelText,
                            {
                              color:
                                colors.text,
                            },
                          ]}>
                          {t(
                            `fortuneStick.levels.${item.stick.level}`,
                            {
                              defaultValue:
                                item.stick.level,
                            },
                          )}
                        </Text>
                      </View>
                    </View>

                    {!!item.intention && (
                      <Text
                        style={styles.historyIntention}
                        numberOfLines={2}>
                        {item.intention}
                      </Text>
                    )}

                    <View style={styles.historyFooter}>
                      <Text
                        style={styles.historyAdvice}
                        numberOfLines={2}>
                        {getLocalizedText(
                          item.stick.advice,
                          language,
                        )}
                      </Text>

                      <Pressable
                        hitSlop={10}
                        style={({pressed}) => [
                          styles.deleteButton,
                          pressed &&
                            styles.buttonPressed,
                        ]}
                        onPress={() =>
                          removeHistoryItem(
                            item,
                          )
                        }>
                        <Text style={styles.deleteText}>
                          {t(
                            'common.delete',
                          )}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerIcon}>
            ℹ
          </Text>

          <Text style={styles.disclaimerText}>
            {t(
              'fortuneStick.disclaimer',
              {
                defaultValue:
                  'Nội dung xin xăm chỉ mang tính tham khảo và chiêm nghiệm cá nhân, không thay thế tư vấn chuyên môn hoặc quyết định thực tế.',
              },
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BACKGROUND = '#FFF8EE';
const SURFACE = '#FFFDF8';
const BROWN = '#4C2A19';
const BROWN_LIGHT = '#7A4B2A';
const GOLD = '#D2A24C';
const GOLD_LIGHT = '#FFE0A0';
const BORDER = '#E5CDA7';

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
    color: GOLD_LIGHT,
    fontSize: 29,
    fontWeight: '900',
    marginTop: 6,
  },

  subtitle: {
    color: '#ECD6B5',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },

  intentionCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
  },

  intentionLabel: {
    color: BROWN,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 9,
  },

  intentionInput: {
    minHeight: 90,
    color: '#493326',
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: '#FFF6E7',
    borderWidth: 1,
    borderColor: '#E3C596',
    borderRadius: 15,
    padding: 13,
  },

  characterCount: {
    color: '#9B826B',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },

  drawCard: {
    alignItems: 'center',
    backgroundColor: '#F5E1BE',
    borderWidth: 1,
    borderColor: '#D8B16B',
    borderRadius: 24,
    padding: 18,
    marginTop: 14,
    overflow: 'hidden',
  },

  glowCircle: {
    width: 230,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 244, 207, 0.70)',
    borderRadius: 115,
  },

  fortuneCylinder: {
    width: 150,
    height: 210,
    alignItems: 'center',
  },

  cylinderTop: {
    width: 112,
    height: 18,
    backgroundColor: '#8A431C',
    borderWidth: 3,
    borderColor: '#D69A43',
    borderRadius: 9,
    zIndex: 5,
  },

  cylinderTopLine: {
    height: 3,
    backgroundColor: '#F6C66D',
    borderRadius: 2,
    marginHorizontal: 12,
    marginTop: 4,
  },

  sticksWrap: {
    position: 'absolute',
    top: -40,
    width: 130,
    height: 110,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
  },

  smallStick: {
    width: 14,
    height: 105,
    alignItems: 'center',
    backgroundColor: '#E7B85D',
    borderWidth: 1,
    borderColor: '#8A4B22',
    borderRadius: 6,
    marginHorizontal: -1,
    paddingTop: 8,
  },

  smallStickText: {
    color: '#7A2E1E',
    fontSize: 9,
    fontWeight: '900',
  },

  selectedStick: {
    position: 'absolute',
    left: 57,
    bottom: -10,
    width: 18,
    height: 125,
    alignItems: 'center',
    backgroundColor: '#FFD374',
    borderWidth: 2,
    borderColor: '#8A4B22',
    borderRadius: 7,
    paddingTop: 11,
    zIndex: 10,
  },

  selectedStickText: {
    color: '#8A2F20',
    fontSize: 12,
    fontWeight: '900',
  },

  cylinderBody: {
    width: 126,
    height: 142,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9B4C20',
    borderWidth: 4,
    borderColor: '#D99C43',
    borderRadius: 26,
    marginTop: -2,
    zIndex: 3,
  },

  cylinderSymbol: {
    color: '#F8D37B',
    fontSize: 48,
    fontWeight: '900',
  },

  cylinderDecor: {
    position: 'absolute',
    bottom: 18,
    width: 70,
    height: 3,
    backgroundColor: '#D99C43',
    borderRadius: 2,
  },

  cylinderBase: {
    width: 112,
    height: 16,
    backgroundColor: '#743516',
    borderWidth: 3,
    borderColor: '#D69A43',
    borderRadius: 8,
    marginTop: -4,
  },

  drawHint: {
    color: '#6A4A34',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 13,
  },

  drawButton: {
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderRadius: 15,
  },

  drawButtonDisabled: {
    opacity: 0.55,
  },

  drawButtonText: {
    color: GOLD_LIGHT,
    fontSize: 15,
    fontWeight: '900',
  },

  resultCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    padding: 18,
    marginTop: 15,

    shadowColor: '#5A351F',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 4,
  },

  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  numberBadge: {
    minWidth: 82,
    alignItems: 'center',
    backgroundColor: '#F3DFC0',
    borderWidth: 1,
    borderColor: '#D8B06A',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  numberLabel: {
    color: '#8A6B4E',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  numberValue: {
    color: BROWN,
    fontSize: 25,
    fontWeight: '900',
  },

  levelBadge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  levelText: {
    fontSize: 12,
    fontWeight: '900',
  },

  resultTitle: {
    color: BROWN,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 18,
  },

  verseCard: {
    backgroundColor: '#FFF4DB',
    borderLeftWidth: 4,
    borderLeftColor: GOLD,
    borderRadius: 14,
    padding: 15,
    marginTop: 14,
  },

  verseText: {
    color: '#6B472E',
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  resultSectionTitle: {
    color: BROWN,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 17,
    marginBottom: 6,
  },

  resultBody: {
    color: '#6D5849',
    fontSize: 14,
    lineHeight: 22,
  },

  adviceText: {
    color: BROWN_LIGHT,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '700',
  },

  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 19,
  },

  secondaryButton: {
    width: '48%',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4E7D3',
    borderWidth: 1,
    borderColor: '#D8BA8F',
    borderRadius: 14,
  },

  secondaryButtonText: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '800',
  },

  saveButton: {
    width: '48%',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderRadius: 14,
  },

  saveButtonText: {
    color: GOLD_LIGHT,
    fontSize: 13,
    fontWeight: '900',
  },

  historyHeader: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginTop: 16,
  },

  historyTitle: {
    color: BROWN,
    fontSize: 17,
    fontWeight: '900',
  },

  historySubtitle: {
    color: '#927861',
    fontSize: 12,
    marginTop: 3,
  },

  historyArrow: {
    color: BROWN_LIGHT,
    fontSize: 22,
  },

  historyList: {
    marginTop: 10,
  },

  emptyHistory: {
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 24,
  },

  emptyHistoryIcon: {
    fontSize: 35,
  },

  emptyHistoryText: {
    color: '#79634F',
    fontSize: 13,
    marginTop: 8,
  },

  historyCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },

  historyCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  historyNumber: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3DFC0',
    borderRadius: 13,
    marginRight: 10,
  },

  historyNumberText: {
    color: BROWN,
    fontSize: 16,
    fontWeight: '900',
  },

  historyInfo: {
    flex: 1,
  },

  historyItemTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '900',
  },

  historyDate: {
    color: '#9A806B',
    fontSize: 10,
    marginTop: 3,
  },

  smallLevelBadge: {
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  smallLevelText: {
    fontSize: 9,
    fontWeight: '900',
  },

  historyIntention: {
    color: '#795F4A',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 11,
  },

  historyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEDFC9',
    marginTop: 11,
    paddingTop: 10,
  },

  historyAdvice: {
    flex: 1,
    color: '#7D6756',
    fontSize: 11,
    lineHeight: 17,
    marginRight: 10,
  },

  deleteButton: {
    backgroundColor: '#FFF0ED',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  deleteText: {
    color: '#B24D3D',
    fontSize: 11,
    fontWeight: '800',
  },

  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7EBD8',
    borderWidth: 1,
    borderColor: '#E1C59A',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  },

  disclaimerIcon: {
    width: 24,
    height: 24,
    color: BROWN,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginRight: 8,
  },

  disclaimerText: {
    flex: 1,
    color: '#745C47',
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
