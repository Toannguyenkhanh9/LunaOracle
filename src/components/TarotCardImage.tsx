import React from 'react';

import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getTarotCardImage,
} from '../services/tarotCardImages';

type Props = {
  cardId?: string;
  title?: string;
  roman?: string;
  width?: number;
  height?: number;
  reversed?: boolean;
};

export default function TarotCardImage({
  cardId,
  title,
  roman,
  width = 92,
  height = 146,
  reversed = false,
}: Props) {
  const source =
    getTarotCardImage(
      cardId,
      title,
    );

  if (!source) {
    return (
      <View
        style={[
          styles.fallback,
          {
            width,
            height,
          },
        ]}>
        <Text style={styles.roman}>
          {roman ?? '✦'}
        </Text>

        <Text style={styles.symbol}>
          ✦
        </Text>

        <Text
          style={styles.title}
          numberOfLines={2}>
          {title ?? 'Luna Oracle'}
        </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={source}
      resizeMode="cover"
      style={[
        styles.image,
        {
          width,
          height,
          transform: [
            {
              rotate:
                reversed ? '180deg' : '0deg',
            },
          ],
        },
      ]}
      imageStyle={styles.imageStyle}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#1B1537',
  },

  imageStyle: {
    borderRadius: 18,
  },

  fallback: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1B1537',
    borderWidth: 1,
    borderColor: '#D9B76E',
    borderRadius: 18,
    padding: 10,
  },

  roman: {
    alignSelf: 'flex-start',
    color: '#F2D38A',
    fontSize: 11,
    fontWeight: '900',
  },

  symbol: {
    color: '#FFF8EA',
    fontSize: 34,
    fontWeight: '900',
  },

  title: {
    color: '#FFF8EA',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
