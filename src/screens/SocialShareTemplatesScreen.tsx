import React from 'react';

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
  useNavigation,
} from '@react-navigation/native';

import {
  useTranslation,
} from 'react-i18next';

import type {
  LunaShareImageParams,
} from '../types/lunaShare';

import {
  SOCIAL_SHARE_TEMPLATES,
  buildTemplateShareParams,
  type SocialShareTemplate,
} from '../services/socialShareTemplates';

type NavigationLike = {
  navigate: (
    routeName: string,
    params?: Partial<LunaShareImageParams>,
  ) => void;
};

export default function SocialShareTemplatesScreen() {
  const {t} =
    useTranslation();

  const navigation =
    useNavigation<NavigationLike>();

  const openTemplate =
    (
      template: SocialShareTemplate,
    ) => {
      navigation.navigate(
        'ShareImage',
        {
          ...buildTemplateShareParams(
            template,
          ),
          title:
            t(
              template.titleKey,
              {
                defaultValue:
                  template.titleFallback,
              },
            ),
          subtitle:
            t(
              template.descriptionKey,
              {
                defaultValue:
                  template.descriptionFallback,
              },
            ),
        },
      );
    };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>
          {t(
            'shareTemplates.eyebrow',
            {
              defaultValue:
                'Share',
            },
          )}
        </Text>

        <Text style={styles.title}>
          {t(
            'shareTemplates.title',
            {
              defaultValue:
                'Social Share Templates',
            },
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'shareTemplates.subtitle',
            {
              defaultValue:
                'Choose a beautiful template and create a share image for social apps.',
            },
          )}
        </Text>

        <View style={styles.grid}>
          {SOCIAL_SHARE_TEMPLATES.map(
            template => (
              <Pressable
                key={template.id}
                style={({pressed}) => [
                  styles.templateCard,
                  pressed &&
                    styles.pressed,
                ]}
                onPress={() =>
                  openTemplate(template)
                }>
                <View style={styles.templatePreview}>
                  <Text style={styles.previewIcon}>
                    {template.variant ===
                    'love'
                      ? '♡'
                      : template.variant ===
                          'moon'
                        ? '☾'
                        : template.variant ===
                            'tarot'
                          ? '✦'
                          : template.variant ===
                              'forecast'
                            ? '♃'
                            : '☉'}
                  </Text>

                  <Text style={styles.previewBadge}>
                    {template.badge}
                  </Text>
                </View>

                <Text style={styles.templateTitle}>
                  {t(
                    template.titleKey,
                    {
                      defaultValue:
                        template.titleFallback,
                    },
                  )}
                </Text>

                <Text style={styles.templateDescription}>
                  {t(
                    template.descriptionKey,
                    {
                      defaultValue:
                        template.descriptionFallback,
                    },
                  )}
                </Text>
              </Pressable>
            ),
          )}
        </View>

        <Text style={styles.notice}>
          {t(
            'shareTemplates.notice',
            {
              defaultValue:
                'Templates open the existing Share Image screen with ready-made styling and text.',
            },
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
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
    lineHeight: 35,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginTop: 16,
  },

  templateCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  templatePreview: {
    height: 156,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.night,
    borderRadius: 24,
    marginBottom: 9,
  },

  previewIcon: {
    color: COLORS.gold,
    fontSize: 54,
    fontWeight: '900',
  },

  previewBadge: {
    color: '#F8EBCB',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 8,
  },

  templateTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },

  templateDescription: {
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 4,
  },

  notice: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
  },

  pressed: {
    opacity: 0.76,
  },
});
