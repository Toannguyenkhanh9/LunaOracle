export type BirthPlace = {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  keywords: string[];
};

export const BIRTH_PLACES: BirthPlace[] = [
  {
    id: 'vn-ho-chi-minh',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    latitude: 10.7769,
    longitude: 106.7009,
    timezoneOffset: 7,
    keywords: [
      'saigon',
      'sai gon',
      'hcm',
      'tphcm',
      'vietnam',
      'viet nam',
      'hồ chí minh',
      'ho chi minh',
    ],
  },
  {
    id: 'vn-ha-noi',
    city: 'Hanoi',
    country: 'Vietnam',
    latitude: 21.0278,
    longitude: 105.8342,
    timezoneOffset: 7,
    keywords: [
      'ha noi',
      'hà nội',
      'hanoi',
      'vietnam',
      'viet nam',
    ],
  },
  {
    id: 'vn-da-nang',
    city: 'Da Nang',
    country: 'Vietnam',
    latitude: 16.0544,
    longitude: 108.2022,
    timezoneOffset: 7,
    keywords: [
      'da nang',
      'đà nẵng',
      'danang',
      'vietnam',
      'viet nam',
    ],
  },
  {
    id: 'th-bangkok',
    city: 'Bangkok',
    country: 'Thailand',
    latitude: 13.7563,
    longitude: 100.5018,
    timezoneOffset: 7,
    keywords: [
      'bangkok',
      'thailand',
      'thai',
    ],
  },
  {
    id: 'id-jakarta',
    city: 'Jakarta',
    country: 'Indonesia',
    latitude: -6.2088,
    longitude: 106.8456,
    timezoneOffset: 7,
    keywords: [
      'jakarta',
      'indonesia',
    ],
  },
  {
    id: 'my-kuala-lumpur',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    latitude: 3.139,
    longitude: 101.6869,
    timezoneOffset: 8,
    keywords: [
      'kuala lumpur',
      'malaysia',
      'kl',
    ],
  },
  {
    id: 'sg-singapore',
    city: 'Singapore',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    timezoneOffset: 8,
    keywords: [
      'singapore',
      'sg',
    ],
  },
  {
    id: 'ph-manila',
    city: 'Manila',
    country: 'Philippines',
    latitude: 14.5995,
    longitude: 120.9842,
    timezoneOffset: 8,
    keywords: [
      'manila',
      'philippines',
      'filipino',
      'pinoy',
    ],
  },
  {
    id: 'jp-tokyo',
    city: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezoneOffset: 9,
    keywords: [
      'tokyo',
      'japan',
      '日本',
    ],
  },
  {
    id: 'kr-seoul',
    city: 'Seoul',
    country: 'South Korea',
    latitude: 37.5665,
    longitude: 126.978,
    timezoneOffset: 9,
    keywords: [
      'seoul',
      'korea',
      'south korea',
      '한국',
    ],
  },
  {
    id: 'cn-beijing',
    city: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
    timezoneOffset: 8,
    keywords: [
      'beijing',
      'peking',
      'china',
      '中国',
    ],
  },
  {
    id: 'cn-shanghai',
    city: 'Shanghai',
    country: 'China',
    latitude: 31.2304,
    longitude: 121.4737,
    timezoneOffset: 8,
    keywords: [
      'shanghai',
      'china',
      '上海',
    ],
  },
  {
    id: 'hk-hong-kong',
    city: 'Hong Kong',
    country: 'Hong Kong',
    latitude: 22.3193,
    longitude: 114.1694,
    timezoneOffset: 8,
    keywords: [
      'hong kong',
      'hk',
      '香港',
    ],
  },
  {
    id: 'tw-taipei',
    city: 'Taipei',
    country: 'Taiwan',
    latitude: 25.033,
    longitude: 121.5654,
    timezoneOffset: 8,
    keywords: [
      'taipei',
      'taiwan',
      '台北',
    ],
  },
  {
    id: 'in-new-delhi',
    city: 'New Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    timezoneOffset: 5.5,
    keywords: [
      'delhi',
      'new delhi',
      'india',
      'भारत',
    ],
  },
  {
    id: 'in-mumbai',
    city: 'Mumbai',
    country: 'India',
    latitude: 19.076,
    longitude: 72.8777,
    timezoneOffset: 5.5,
    keywords: [
      'mumbai',
      'bombay',
      'india',
    ],
  },
  {
    id: 'ae-dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.2048,
    longitude: 55.2708,
    timezoneOffset: 4,
    keywords: [
      'dubai',
      'uae',
      'emirates',
      'دبي',
    ],
  },
  {
    id: 'gb-london',
    city: 'London',
    country: 'United Kingdom',
    latitude: 51.5072,
    longitude: -0.1276,
    timezoneOffset: 0,
    keywords: [
      'london',
      'uk',
      'united kingdom',
      'england',
    ],
  },
  {
    id: 'fr-paris',
    city: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezoneOffset: 1,
    keywords: [
      'paris',
      'france',
      'français',
    ],
  },
  {
    id: 'de-berlin',
    city: 'Berlin',
    country: 'Germany',
    latitude: 52.52,
    longitude: 13.405,
    timezoneOffset: 1,
    keywords: [
      'berlin',
      'germany',
      'deutschland',
    ],
  },
  {
    id: 'it-rome',
    city: 'Rome',
    country: 'Italy',
    latitude: 41.9028,
    longitude: 12.4964,
    timezoneOffset: 1,
    keywords: [
      'rome',
      'roma',
      'italy',
      'italia',
    ],
  },
  {
    id: 'es-madrid',
    city: 'Madrid',
    country: 'Spain',
    latitude: 40.4168,
    longitude: -3.7038,
    timezoneOffset: 1,
    keywords: [
      'madrid',
      'spain',
      'españa',
    ],
  },
  {
    id: 'pt-lisbon',
    city: 'Lisbon',
    country: 'Portugal',
    latitude: 38.7223,
    longitude: -9.1393,
    timezoneOffset: 0,
    keywords: [
      'lisbon',
      'lisboa',
      'portugal',
    ],
  },
  {
    id: 'nl-amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
    timezoneOffset: 1,
    keywords: [
      'amsterdam',
      'netherlands',
      'holland',
      'nederland',
    ],
  },
  {
    id: 'us-new-york',
    city: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
    timezoneOffset: -5,
    keywords: [
      'new york',
      'nyc',
      'usa',
      'united states',
    ],
  },
  {
    id: 'us-los-angeles',
    city: 'Los Angeles',
    country: 'United States',
    latitude: 34.0522,
    longitude: -118.2437,
    timezoneOffset: -8,
    keywords: [
      'los angeles',
      'la',
      'usa',
      'california',
    ],
  },
  {
    id: 'ca-toronto',
    city: 'Toronto',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    timezoneOffset: -5,
    keywords: [
      'toronto',
      'canada',
    ],
  },
  {
    id: 'au-sydney',
    city: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    timezoneOffset: 10,
    keywords: [
      'sydney',
      'australia',
    ],
  },
];

function normalizeSearchText(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    );
}

export function searchBirthPlaces(
  query: string,
): BirthPlace[] {
  const normalized =
    normalizeSearchText(query);

  if (!normalized) {
    return BIRTH_PLACES.slice(0, 12);
  }

  return BIRTH_PLACES.filter(place => {
    const haystack =
      normalizeSearchText(
        [
          place.city,
          place.country,
          ...place.keywords,
        ].join(' '),
      );

    return haystack.includes(
      normalized,
    );
  }).slice(0, 20);
}

export function formatBirthPlace(
  place: BirthPlace,
): string {
  return `${place.city}, ${place.country}`;
}
