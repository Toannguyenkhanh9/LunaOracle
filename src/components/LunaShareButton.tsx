import React from 'react';

import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  LunaShareImageParams,
} from '../types/lunaShare';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Partial<LunaShareImageParams>,
  ) => void;
};

type Props = {
  data:
    | Partial<LunaShareImageParams>
    | (() => Partial<LunaShareImageParams>);
  label?: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function LunaShareButton({
  data,
  label,
  compact = false,
  style,
}: Props) {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const openShare = () => {
    try {
      const params =
        typeof data === 'function'
          ? data()
          : data;

      navigation.navigate(
        'ShareImage',
        params,
      );
    } catch (error) {
      console.warn(
        'Unable to open share image:',
        error,
      );

      Alert.alert(
        t(
          'lunaShare.errorTitle',
          {
            defaultValue:
              'Unable to share',
          },
        ),
        t(
          'lunaShare.errorMessage',
          {
            defaultValue:
              'Please try again.',
          },
        ),
      );
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      style={({pressed}) => [
        styles.button,
        compact &&
          styles.compact,
        pressed &&
          styles.pressed,
        style,
      ]}
      onPress={openShare}>
      <Text style={styles.icon}>
        ↗
      </Text>

      <Text style={styles.text}>
        {label ??
          t(
            'lunaShare.shareButton',
            {
              defaultValue:
                'Share Image',
            },
          )}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9B76E',
    borderRadius: 17,
    paddingHorizontal: 16,
    marginTop: 12,
  },

  compact: {
    minHeight: 42,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
  },

  icon: {
    color: '#1B1537',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 7,
  },

  text: {
    color: '#1B1537',
    fontSize: 13,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.78,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
});
