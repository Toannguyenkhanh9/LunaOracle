// Examples for adding a Share button to existing screens

// 1) TarotReadingScreen
import {
  buildTarotShareParams,
} from '../examples/lunaShareExamples';

// Inside component after you have `cards`:
<Pressable
  style={styles.shareButton}
  onPress={() =>
    navigation.navigate(
      'ShareImage',
      buildTarotShareParams(
        t,
        cards[0],
      ),
    )
  }>
  <Text style={styles.shareButtonText}>
    {t('lunaShare.shareButton', {
      defaultValue: 'Share Image',
    })}
  </Text>
</Pressable>

// 2) DailyInsightScreen
navigation.navigate('ShareImage', {
  variant: 'dailyInsight',
  title: t('lunaDailyInsight.title', {
    defaultValue: 'Daily Personalized Insight',
  }),
  subtitle: `Moon focus · House ${insight.moonHouse}`,
  message: t(`lunaDailyInsight.actions.${insight.actionId}`),
  score: insight.energyScore,
  badge: 'TODAY',
  tags: ['daily', 'moon', 'oracle'],
});

// 3) LoveCenterScreen
navigation.navigate('ShareImage', {
  variant: 'love',
  title: t('lunaLoveCenter.title', {
    defaultValue: 'Love Center',
  }),
  subtitle: 'Venus · Mars · Moon',
  message: t(`lunaLoveCenter.themes.${result.dailyThemeId}`),
  score: result.loveScore,
  badge: 'LOVE',
  tags: ['love', 'venus', 'luna'],
});

// 4) YearMonthlyForecastScreen
navigation.navigate('ShareImage', {
  variant: 'forecast',
  title: `${monthLabel} Forecast`,
  subtitle: t('lunaForecast.title', {
    defaultValue: 'Year / Monthly Forecast',
  }),
  message: t(`lunaForecast.monthThemes.${selected.themeId}`),
  score: selected.overallScore,
  badge: 'FORECAST',
  tags: ['forecast', 'astrology', 'luna'],
});
