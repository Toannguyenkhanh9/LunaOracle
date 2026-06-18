export type AudioCategory =
  | 'sutra'
  | 'meditation'
  | 'nature';

export type AudioTrack = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: AudioCategory;
  artwork: number;
  source: number;
  durationLabel: string;
};

export const audioTracks: AudioTrack[] = [
  {
    id: 'great_compassion_mantra',
    titleKey: 'library.greatCompassionTitle',
    descriptionKey: 'library.greatCompassionDescription',
    category: 'sutra',
    artwork: require('../assets/images/main_hall_background.png'),
    source: require('../assets/audio/great_compassion_mantra.mp3'),
    durationLabel: '21:00',
  },
  {
    id: 'buddha_name',
    titleKey: 'library.buddhaNameTitle',
    descriptionKey: 'library.buddhaNameDescription',
    category: 'sutra',
    artwork: require('../assets/images/main_hall_background.png'),
    source: require('../assets/audio/buddha_name.mp3'),
    durationLabel: '30:00',
  },
  {
    id: 'meditation_music',
    titleKey: 'library.meditationMusicTitle',
    descriptionKey: 'library.meditationMusicDescription',
    category: 'meditation',
    artwork: require('../assets/images/main_hall_background.png'),
    source: require('../assets/audio/meditation_music.mp3'),
    durationLabel: '15:00',
  },
  {
    id: 'temple_rain',
    titleKey: 'library.templeRainTitle',
    descriptionKey: 'library.templeRainDescription',
    category: 'nature',
    artwork: require('../assets/images/main_hall_background.png'),
    source: require('../assets/audio/temple_rain.mp3'),
    durationLabel: '20:00',
  },
];