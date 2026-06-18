import React, {
  useCallback,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  downloadBackupFromCloud,
  getCloudSyncConfig,
  getCloudSyncMetadata,
  saveCloudSyncConfig,
  uploadBackupToCloud,
  type CloudSyncConfig,
  type CloudSyncMetadata,
} from '../services/cloudSync';
import {exportBackupFile} from '../services/backupFile';
import {colors} from '../theme/colors';

export default function DataSyncScreen() {
  const {t, i18n} = useTranslation();

  const [config, setConfig] =
    useState<CloudSyncConfig>({
      endpoint: '',
      accessToken: '',
      autoSync: false,
    });

  const [metadata, setMetadata] =
    useState<CloudSyncMetadata>({});

  const [isWorking, setIsWorking] =
    useState(false);

  const load = useCallback(async () => {
    const [savedConfig, savedMetadata] =
      await Promise.all([
        getCloudSyncConfig(),
        getCloudSyncMetadata(),
      ]);

    setConfig(savedConfig);
    setMetadata(savedMetadata);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const formatDate = (
    value?: string,
  ) => {
    if (!value) {
      return t('dataSync.never');
    }

    try {
      return new Intl.DateTimeFormat(
        i18n.resolvedLanguage ??
          i18n.language ??
          'en',
        {
          dateStyle: 'medium',
          timeStyle: 'short',
        },
      ).format(new Date(value));
    } catch {
      return value;
    }
  };

  const saveConfig = async () => {
    await saveCloudSyncConfig(config);

    Alert.alert(
      t('dataSync.savedTitle'),
      t('dataSync.savedMessage'),
    );
  };

  const runUpload = async () => {
    setIsWorking(true);

    try {
      await saveCloudSyncConfig(config);
      await uploadBackupToCloud();
      await load();

      Alert.alert(
        t('dataSync.uploadedTitle'),
        t('dataSync.uploadedMessage'),
      );
    } catch (error) {
      console.warn(error);

      Alert.alert(
        t('dataSync.errorTitle'),
        t('dataSync.errorMessage'),
      );
    } finally {
      setIsWorking(false);
    }
  };

  const runDownload = () => {
    Alert.alert(
      t('dataSync.restoreTitle'),
      t('dataSync.restoreMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('dataSync.restore'),
          style: 'destructive',
          onPress: async () => {
            setIsWorking(true);

            try {
              await saveCloudSyncConfig(
                config,
              );

              await downloadBackupFromCloud();
              await load();

              Alert.alert(
                t(
                  'dataSync.restoredTitle',
                ),
                t(
                  'dataSync.restoredMessage',
                ),
              );
            } catch (error) {
              console.warn(error);

              Alert.alert(
                t('dataSync.errorTitle'),
                t(
                  'dataSync.errorMessage',
                ),
              );
            } finally {
              setIsWorking(false);
            }
          },
        },
      ],
    );
  };

  const runLocalExport = async () => {
    setIsWorking(true);

    try {
      await exportBackupFile();
    } catch (error) {
      console.warn(error);

      Alert.alert(
        t('dataSync.errorTitle'),
        t('dataSync.exportError'),
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>
            ☁️
          </Text>

          <Text style={styles.title}>
            {t('dataSync.title')}
          </Text>

          <Text style={styles.subtitle}>
            {t('dataSync.subtitle')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t('dataSync.cloudConfig')}
          </Text>

          <Text style={styles.label}>
            {t('dataSync.endpoint')}
          </Text>

          <TextInput
            value={config.endpoint}
            onChangeText={value =>
              setConfig(current => ({
                ...current,
                endpoint: value,
              }))
            }
            placeholder="https://example.com/api"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            style={styles.input}
          />

          <Text style={styles.label}>
            {t('dataSync.accessToken')}
          </Text>

          <TextInput
            value={config.accessToken}
            onChangeText={value =>
              setConfig(current => ({
                ...current,
                accessToken: value,
              }))
            }
            placeholder={t(
              'dataSync.accessTokenPlaceholder',
            )}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={styles.input}
          />

          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>
                {t('dataSync.autoSync')}
              </Text>
              <Text
                style={
                  styles.switchDescription
                }>
                {t(
                  'dataSync.autoSyncDescription',
                )}
              </Text>
            </View>

            <Switch
              value={config.autoSync}
              onValueChange={value =>
                setConfig(current => ({
                  ...current,
                  autoSync: value,
                }))
              }
            />
          </View>

          <Pressable
            style={styles.secondaryButton}
            onPress={saveConfig}>
            <Text
              style={
                styles.secondaryButtonText
              }>
              {t('dataSync.saveConfig')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>
            {t('dataSync.status')}
          </Text>

          <StatusRow
            label={t(
              'dataSync.lastUpload',
            )}
            value={formatDate(
              metadata.lastUploadAt,
            )}
          />

          <StatusRow
            label={t(
              'dataSync.lastDownload',
            )}
            value={formatDate(
              metadata.lastDownloadAt,
            )}
          />
        </View>

        <Pressable
          disabled={isWorking}
          style={[
            styles.primaryButton,
            isWorking &&
              styles.buttonDisabled,
          ]}
          onPress={runUpload}>
          <Text
            style={styles.primaryButtonText}>
            {t('dataSync.upload')}
          </Text>
        </Pressable>

        <Pressable
          disabled={isWorking}
          style={styles.secondaryButtonLarge}
          onPress={runDownload}>
          <Text
            style={
              styles.secondaryButtonLargeText
            }>
            {t('dataSync.download')}
          </Text>
        </Pressable>

        <Pressable
          disabled={isWorking}
          style={styles.secondaryButtonLarge}
          onPress={runLocalExport}>
          <Text
            style={
              styles.secondaryButtonLargeText
            }>
            {t('dataSync.exportBackup')}
          </Text>
        </Pressable>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            {t('dataSync.notice')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>
        {label}
      </Text>
      <Text style={styles.statusValue}>
        {value}
      </Text>
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
    fontSize: 44,
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
  card: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#E7D8BE',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },
  statusCard: {
    backgroundColor: '#FFF9EF',
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
  },
  cardTitle: {
    color: BROWN,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  label: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    color: BROWN,
    backgroundColor: '#F7EFE4',
    borderWidth: 1,
    borderColor: '#E5D5BE',
    borderRadius: 14,
    paddingHorizontal: 13,
    marginBottom: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchTitle: {
    color: BROWN,
    fontSize: 14,
    fontWeight: '800',
  },
  switchDescription: {
    color: '#7A6653',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  statusLabel: {
    color: '#7B6652',
    fontSize: 12,
  },
  statusValue: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BROWN,
    borderRadius: 16,
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#FFE4A5',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#C99A58',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 14,
  },
  secondaryButtonText: {
    color: BROWN,
    fontSize: 12,
    fontWeight: '800',
  },
  secondaryButtonLarge: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C9A46E',
    borderRadius: 16,
    marginTop: 11,
  },
  secondaryButtonLargeText: {
    color: BROWN,
    fontSize: 13,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  noticeCard: {
    backgroundColor: '#F4E8D7',
    borderRadius: 16,
    padding: 15,
    marginTop: 16,
  },
  noticeText: {
    color: '#75604D',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});
