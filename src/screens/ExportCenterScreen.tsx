import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
  exportWellbeingPdf,
  sharePdf,
  type PdfExportSections,
} from '../services/pdfExport';
import {colors} from '../theme/colors';

export default function ExportCenterScreen() {
  const {t, i18n} = useTranslation();

  const [sections, setSections] =
    useState<PdfExportSections>({
      practice: true,
      journal: true,
      altar: false,
    });

  const [isWorking, setIsWorking] =
    useState(false);

  const toggle = (
    key: keyof PdfExportSections,
  ) => {
    setSections(current => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleExport = async () => {
    if (
      !sections.practice &&
      !sections.journal &&
      !sections.altar
    ) {
      Alert.alert(
        t('pdfExport.selectTitle'),
        t('pdfExport.selectMessage'),
      );

      return;
    }

    setIsWorking(true);

    try {
      const filePath =
        await exportWellbeingPdf({
          language:
            i18n.resolvedLanguage ??
            i18n.language ??
            'en',
          sections,
          labels: {
            reportTitle: t(
              'pdfExport.reportTitle',
            ),
            generatedAt: t(
              'pdfExport.generatedAt',
            ),
            practiceTitle: t(
              'pdfExport.practiceTitle',
            ),
            currentStreak: t(
              'practice.currentStreak',
            ),
            longestStreak: t(
              'practice.longestStreak',
            ),
            practiceDays: t(
              'practice.practiceDays',
            ),
            completedRituals: t(
              'practice.completedRituals',
            ),
            meditationMinutes: t(
              'practice.meditationMinutes',
            ),
            todayProgress: t(
              'pdfExport.todayProgress',
            ),
            journalTitle: t(
              'peaceJournal.title',
            ),
            journalEmpty: t(
              'peaceJournal.empty',
            ),
            gratitude: t(
              'peaceJournal.gratitudeLabel',
            ),
            release: t(
              'peaceJournal.releaseLabel',
            ),
            prayer: t(
              'peaceJournal.prayerLabel',
            ),
            note: t(
              'peaceJournal.noteLabel',
            ),
            beforeMood: t(
              'peaceJournal.beforeMood',
            ),
            afterMood: t(
              'peaceJournal.afterMood',
            ),
            altarTitle: t(
              'altarCustomization.title',
            ),
            sceneMode: t(
              'altarCustomization.sceneTitle',
            ),
            centerpiece: t(
              'altarCustomization.centerpieceTitle',
            ),
            flower: t(
              'altarCustomization.flowerTitle',
            ),
            lamp: t(
              'altarCustomization.lampTitle',
            ),
            accent: t(
              'altarCustomization.accentTitle',
            ),
            soundscape: t(
              'altarCustomization.soundscapeTitle',
            ),
            privacyNotice: t(
              'pdfExport.privacyNotice',
            ),
          },
        });

      await sharePdf(filePath);

      Alert.alert(
        t('pdfExport.successTitle'),
        t('pdfExport.successMessage'),
      );
    } catch (error) {
      console.warn(error);

      Alert.alert(
        t('pdfExport.errorTitle'),
        t('pdfExport.errorMessage'),
      );
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>
            📄
          </Text>
          <Text style={styles.title}>
            {t('pdfExport.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('pdfExport.subtitle')}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {t('pdfExport.chooseSections')}
        </Text>

        <SectionSwitch
          icon="🔥"
          title={t(
            'pdfExport.practiceTitle',
          )}
          description={t(
            'pdfExport.practiceDescription',
          )}
          value={sections.practice}
          onChange={() =>
            toggle('practice')
          }
        />

        <SectionSwitch
          icon="📖"
          title={t(
            'peaceJournal.title',
          )}
          description={t(
            'pdfExport.journalDescription',
          )}
          value={sections.journal}
          onChange={() =>
            toggle('journal')
          }
        />

        <SectionSwitch
          icon="🪔"
          title={t(
            'altarCustomization.title',
          )}
          description={t(
            'pdfExport.altarDescription',
          )}
          value={sections.altar}
          onChange={() =>
            toggle('altar')
          }
        />

        <Pressable
          disabled={isWorking}
          style={[
            styles.exportButton,
            isWorking &&
              styles.buttonDisabled,
          ]}
          onPress={handleExport}>
          <Text
            style={styles.exportButtonText}>
            {isWorking
              ? t('pdfExport.exporting')
              : t('pdfExport.export')}
          </Text>
        </Pressable>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            {t('pdfExport.notice')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionSwitch({
  icon,
  title,
  description,
  value,
  onChange,
}: {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <View style={styles.optionCard}>
      <Text style={styles.optionIcon}>
        {icon}
      </Text>

      <View style={styles.optionInfo}>
        <Text style={styles.optionTitle}>
          {title}
        </Text>

        <Text
          style={styles.optionDescription}>
          {description}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
}

const BROWN = '#4A2A1A';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#F0DFC5',
    borderRadius: 24,
    padding: 22,
  },
  heroIcon: {
    fontSize: 43,
  },
  title: {
    color: BROWN,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 7,
  },
  subtitle: {
    color: '#775F4B',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 7,
  },
  sectionTitle: {
    color: BROWN,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 22,
    marginBottom: 11,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E7D8BE',
    borderRadius: 18,
    padding: 15,
    marginBottom: 11,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
    marginRight: 10,
  },
  optionTitle: {
    color: BROWN,
    fontSize: 15,
    fontWeight: '800',
  },
  optionDescription: {
    color: '#7A6653',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  exportButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderRadius: 17,
    marginTop: 12,
  },
  exportButtonText: {
    color: '#FFE4A5',
    fontSize: 15,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  noticeCard: {
    backgroundColor: '#F4E8D7',
    borderRadius: 16,
    padding: 15,
    marginTop: 15,
  },
  noticeText: {
    color: '#75604D',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});
