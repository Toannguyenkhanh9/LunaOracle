import React, {
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
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
  launchCamera,
} from 'react-native-image-picker';

import {
  useTranslation,
} from 'react-i18next';

import type {
  PalmDominantHand,
  PalmHandSide,
  PalmReadingFocus,
} from '../services/palmReading';

type Params = {
  handSide: PalmHandSide;
  dominantHand: PalmDominantHand;
  focus: PalmReadingFocus;
};

type Props = {
  navigation: {
    navigate: (
      routeName: string,
      params?: Record<string, unknown>,
    ) => void;
    replace?: (
      routeName: string,
      params?: Record<string, unknown>,
    ) => void;
  };
  route: {
    params: Params;
  };
};

export default function PalmReadingCameraScreen({
  navigation,
  route,
}: Props) {
  const {t} =
    useTranslation();

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const requestCameraPermission =
    async (): Promise<boolean> => {
      if (Platform.OS !== 'android') {
        return true;
      }

      try {
        const permission =
          PermissionsAndroid.PERMISSIONS.CAMERA;

        const alreadyGranted =
          await PermissionsAndroid.check(
            permission,
          );

        if (alreadyGranted) {
          return true;
        }

        const result =
          await PermissionsAndroid.request(
            permission,
            {
              title:
                t(
                  'palmReading.cameraPermissionTitle',
                  {
                    defaultValue:
                      'Camera permission',
                  },
                ),
              message:
                t(
                  'palmReading.cameraPermissionMessage',
                  {
                    defaultValue:
                      'Luna Oracle needs camera access to capture your palm for a reflective palm reading.',
                  },
                ),
              buttonPositive:
                t(
                  'common.ok',
                  {
                    defaultValue:
                      'OK',
                  },
                ),
              buttonNegative:
                t(
                  'common.cancel',
                  {
                    defaultValue:
                      'Cancel',
                  },
                ),
            },
          );

        const granted =
          result ===
          PermissionsAndroid.RESULTS.GRANTED;

        if (!granted) {
          Alert.alert(
            t(
              'palmReading.cameraPermissionDeniedTitle',
              {
                defaultValue:
                  'Camera permission needed',
              },
            ),
            t(
              'palmReading.cameraPermissionDeniedMessage',
              {
                defaultValue:
                  'Please allow camera permission to capture your palm.',
              },
            ),
          );
        }

        return granted;
      } catch (error) {
        console.warn(
          'Unable to request camera permission:',
          error,
        );

        Alert.alert(
          t(
            'palmReading.cameraErrorTitle',
            {
              defaultValue:
                'Unable to open camera',
            },
          ),
          t(
            'palmReading.cameraErrorMessage',
            {
              defaultValue:
                'Please check camera permission and try again.',
            },
          ),
        );

        return false;
      }
    };

  const openCamera = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const hasPermission =
        await requestCameraPermission();

      if (!hasPermission) {
        return;
      }

      const result =
        await launchCamera({
          mediaType: 'photo',
          cameraType: 'back',
          quality: 0.92,
          saveToPhotos: false,
          includeBase64: false,
        });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          t(
            'palmReading.cameraErrorTitle',
            {
              defaultValue:
                'Unable to open camera',
            },
          ),
          result.errorMessage ??
            t(
              'palmReading.cameraErrorMessage',
              {
                defaultValue:
                  'Please check camera permission and try again.',
              },
            ),
        );

        return;
      }

      const imageUri =
        result.assets?.[0]?.uri;

      if (!imageUri) {
        Alert.alert(
          t(
            'palmReading.noImageTitle',
            {
              defaultValue:
                'No image captured',
            },
          ),
        );

        return;
      }

      const params = {
        ...route.params,
        imageUri,
      };

      if (navigation.replace) {
        navigation.replace(
          'PalmReadingLiteAnalysis',
          params,
        );
      } else {
        navigation.navigate(
          'PalmReadingLiteAnalysis',
          params,
        );
      }
    } catch (error) {
      console.warn(
        'Unable to capture palm:',
        error,
      );

      Alert.alert(
        t(
          'palmReading.cameraErrorTitle',
          {
            defaultValue:
              'Unable to open camera',
          },
        ),
        t(
          'palmReading.cameraErrorMessage',
          {
            defaultValue:
              'Please check camera permission and try again.',
          },
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'palmReading.cameraEyebrow',
            {
              defaultValue:
                'Camera',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'palmReading.cameraTitle',
            {
              defaultValue:
                'Capture your palm',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'palmReading.cameraSubtitle',
            {
              defaultValue:
                'Place your palm under good light. Keep the palm flat, open, and centered in the frame.',
            },
          )}
        </Text>

        <View style={styles.previewCard}>
          <Text style={styles.palmIcon}>
            ✋
          </Text>

          <View style={styles.guideBox}>
            <Text style={styles.guideTitle}>
              {t(
                'palmReading.photoTipsTitle',
                {
                  defaultValue:
                    'Photo tips',
                },
              )}
            </Text>

            <Text style={styles.guideText}>
              {t(
                'palmReading.photoTips',
                {
                  defaultValue:
                    'Use bright light, avoid shadows, keep the whole palm visible, and do not cover the main lines.',
                },
              )}
            </Text>
          </View>
        </View>

        <View style={styles.selectionCard}>
          <Info
            label={t(
              'palmReading.handToReadShort',
              {
                defaultValue:
                  'Reading hand',
              },
            )}
            value={t(
              `palmReading.hand.${route.params.handSide}`,
              {
                defaultValue:
                  route.params.handSide,
              },
            )}
          />

          <Info
            label={t(
              'palmReading.dominantHand',
              {
                defaultValue:
                  'Dominant hand',
              },
            )}
            value={t(
              `palmReading.hand.${route.params.dominantHand}`,
              {
                defaultValue:
                  route.params.dominantHand,
              },
            )}
          />

          <Info
            label={t(
              'palmReading.focus',
              {
                defaultValue:
                  'Reading focus',
              },
            )}
            value={t(
              `palmReading.focusOptions.${route.params.focus}`,
              {
                defaultValue:
                  route.params.focus,
              },
            )}
          />
        </View>

        <Pressable
          style={styles.captureButton}
          disabled={loading}
          onPress={openCamera}>
          {loading ? (
            <ActivityIndicator color="#1B1537" />
          ) : (
            <Text style={styles.captureText}>
              {t(
                'palmReading.captureButton',
                {
                  defaultValue:
                    'Capture Palm',
                },
              )}
            </Text>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>
          {t(
            'palmReading.v2.cameraNotice',
            {
              defaultValue:
                'After capture, V2 Lite will ask you to select visible palm features. Nothing is uploaded to an AI server.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
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
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  previewCard: {
    alignItems: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 28,
    padding: 22,
    marginTop: 16,
  },

  palmIcon: {
    fontSize: 88,
  },

  guideBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 13,
    marginTop: 14,
  },

  guideTitle: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  guideText: {
    color: '#DCD2F3',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  selectionCard: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    padding: 14,
    marginTop: 14,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  infoLabel: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
  },

  infoValue: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'capitalize',
  },

  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    backgroundColor: COLORS.gold,
    borderRadius: 18,
    marginTop: 16,
  },

  captureText: {
    color: COLORS.night,
    fontSize: 14,
    fontWeight: '900',
  },

  disclaimer: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
});
