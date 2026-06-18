import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import type {
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';

import type {
  RootTabParamList,
} from '../navigation/RootNavigator';

type Props = {
  termId: string;
  label: string;
};

export default function GlossaryTermLink({
  termId,
  label,
}: Props) {
  const navigation =
    useNavigation<
      BottomTabNavigationProp<
        RootTabParamList
      >
    >();

  return (
    <Pressable
      style={({pressed}) => [
        styles.link,
        pressed && styles.pressed,
      ]}
      onPress={() =>
        navigation.navigate(
          'Glossary',
          {
            termId,
          },
        )
      }>
      <Text style={styles.linkText}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EDF3',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  linkText: {
    color: '#17243A',
    fontSize: 9,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.72,
    transform: [{scale: 0.985}],
  },
});
