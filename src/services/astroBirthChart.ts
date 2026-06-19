import {
  ZODIAC_SIGNS,
  type ZodiacSignId,
} from './zodiac';

export type BirthChartInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  timezoneOffset: number;
  latitude: number;
  longitude: number;
};

export type ChartPointId =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'ascendant'
  | 'midheaven';

export type PlanetPointId = Exclude<
  ChartPointId,
  'ascendant' | 'midheaven'
>;

export type ChartPoint = {
  id: ChartPointId;
  longitude: number;
  sign: ZodiacSignId;
  degreeInSign: number;
  degreeText: string;
  house: number;
};

export type HouseCusp = {
  house: number;
  longitude: number;
  sign: ZodiacSignId;
  degreeInSign: number;
  degreeText: string;
};

export type AspectType =
  | 'conjunction'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'opposition';

export type ChartAspect = {
  first: ChartPointId;
  second: ChartPointId;
  type: AspectType;
  orb: number;
};

export type ElementBalance = Record<
  'fire' | 'earth' | 'air' | 'water',
  number
>;

export type ModalityBalance = Record<
  'cardinal' | 'fixed' | 'mutable',
  number
>;

export type BirthChartResult = {
  input: BirthChartInput;
  julianDay: number;
  points: Record<
    ChartPointId,
    ChartPoint
  >;
  houses: HouseCusp[];
  aspects: ChartAspect[];
  elementBalance: ElementBalance;
  modalityBalance: ModalityBalance;
  dominantElement:
    | keyof ElementBalance;
  dominantModality:
    | keyof ModalityBalance;
};

const SIGN_ORDER:
  ZodiacSignId[] = [
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
  ];

const POINT_ORDER:
  ChartPointId[] = [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
    'ascendant',
    'midheaven',
  ];

const ASPECTS: Array<{
  type: AspectType;
  angle: number;
  orb: number;
}> = [
  {
    type: 'conjunction',
    angle: 0,
    orb: 8,
  },
  {
    type: 'sextile',
    angle: 60,
    orb: 5,
  },
  {
    type: 'square',
    angle: 90,
    orb: 6,
  },
  {
    type: 'trine',
    angle: 120,
    orb: 6,
  },
  {
    type: 'opposition',
    angle: 180,
    orb: 8,
  },
];

type OrbitalElements = {
  N: number;
  i: number;
  w: number;
  a: number;
  e: number;
  M: number;
};

type HeliocentricPosition = {
  x: number;
  y: number;
  z: number;
};

const PLANET_ELEMENTS:
  Record<
    Exclude<
      PlanetPointId,
      'sun' | 'moon'
    >,
    (days: number) => OrbitalElements
  > = {
    mercury: days => ({
      N:
        48.3313 +
        3.24587e-5 * days,
      i:
        7.0047 +
        5.0e-8 * days,
      w:
        29.1241 +
        1.01444e-5 * days,
      a:
        0.387098,
      e:
        0.205635 +
        5.59e-10 * days,
      M:
        168.6562 +
        4.0923344368 * days,
    }),

    venus: days => ({
      N:
        76.6799 +
        2.46590e-5 * days,
      i:
        3.3946 +
        2.75e-8 * days,
      w:
        54.8910 +
        1.38374e-5 * days,
      a:
        0.723330,
      e:
        0.006773 -
        1.302e-9 * days,
      M:
        48.0052 +
        1.6021302244 * days,
    }),

    mars: days => ({
      N:
        49.5574 +
        2.11081e-5 * days,
      i:
        1.8497 -
        1.78e-8 * days,
      w:
        286.5016 +
        2.92961e-5 * days,
      a:
        1.523688,
      e:
        0.093405 +
        2.516e-9 * days,
      M:
        18.6021 +
        0.5240207766 * days,
    }),

    jupiter: days => ({
      N:
        100.4542 +
        2.76854e-5 * days,
      i:
        1.3030 -
        1.557e-7 * days,
      w:
        273.8777 +
        1.64505e-5 * days,
      a:
        5.20256,
      e:
        0.048498 +
        4.469e-9 * days,
      M:
        19.8950 +
        0.0830853001 * days,
    }),

    saturn: days => ({
      N:
        113.6634 +
        2.38980e-5 * days,
      i:
        2.4886 -
        1.081e-7 * days,
      w:
        339.3939 +
        2.97661e-5 * days,
      a:
        9.55475,
      e:
        0.055546 -
        9.499e-9 * days,
      M:
        316.9670 +
        0.0334442282 * days,
    }),

    uranus: days => ({
      N:
        74.0005 +
        1.3978e-5 * days,
      i:
        0.7733 +
        1.9e-8 * days,
      w:
        96.6612 +
        3.0565e-5 * days,
      a:
        19.18171 -
        1.55e-8 * days,
      e:
        0.047318 +
        7.45e-9 * days,
      M:
        142.5905 +
        0.011725806 * days,
    }),

    neptune: days => ({
      N:
        131.7806 +
        3.0173e-5 * days,
      i:
        1.7700 -
        2.55e-7 * days,
      w:
        272.8461 -
        6.027e-6 * days,
      a:
        30.05826 +
        3.313e-8 * days,
      e:
        0.008606 +
        2.15e-9 * days,
      M:
        260.2471 +
        0.005995147 * days,
    }),

    pluto: days => ({
      N:
        110.30347,
      i:
        17.14175,
      w:
        113.76329,
      a:
        39.48168677,
      e:
        0.24880766,
      M:
        14.53 +
        0.003975709 * days,
    }),
  };

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.max(
    min,
    Math.min(max, value),
  );
}

function normalizeDegrees(
  value: number,
): number {
  return (
    (
      value % 360
    ) +
    360
  ) % 360;
}

function degToRad(
  degrees: number,
): number {
  return (
    degrees * Math.PI
  ) / 180;
}

function radToDeg(
  radians: number,
): number {
  return (
    radians * 180
  ) / Math.PI;
}

function sinDeg(
  degrees: number,
): number {
  return Math.sin(
    degToRad(degrees),
  );
}

function cosDeg(
  degrees: number,
): number {
  return Math.cos(
    degToRad(degrees),
  );
}

function tanDeg(
  degrees: number,
): number {
  return Math.tan(
    degToRad(degrees),
  );
}

function atan2Deg(
  y: number,
  x: number,
): number {
  return radToDeg(
    Math.atan2(y, x),
  );
}

function toJulianDay(
  input: BirthChartInput,
): number {
  const utcMs =
    Date.UTC(
      input.year,
      input.month - 1,
      input.day,
      input.hour,
      input.minute,
      0,
    ) -
    input.timezoneOffset *
      60 *
      60 *
      1000;

  return (
    utcMs / 86400000 +
    2440587.5
  );
}

function getSunLongitude(
  julianDay: number,
): number {
  const t =
    (
      julianDay -
      2451545.0
    ) /
    36525;

  const l0 =
    normalizeDegrees(
      280.46646 +
        36000.76983 * t +
        0.0003032 * t * t,
    );

  const m =
    normalizeDegrees(
      357.52911 +
        35999.05029 * t -
        0.0001537 * t * t,
    );

  const c =
    (
      1.914602 -
      0.004817 * t -
      0.000014 * t * t
    ) *
      sinDeg(m) +
    (
      0.019993 -
      0.000101 * t
    ) *
      sinDeg(2 * m) +
    0.000289 * sinDeg(3 * m);

  return normalizeDegrees(
    l0 + c,
  );
}

function getMoonLongitude(
  julianDay: number,
): number {
  const days =
    julianDay -
    2451545.0;

  const l =
    normalizeDegrees(
      218.316 +
        13.176396 * days,
    );

  const moonAnomaly =
    normalizeDegrees(
      134.963 +
        13.064993 * days,
    );

  const sunAnomaly =
    normalizeDegrees(
      357.529 +
        0.98560028 * days,
    );

  const elongation =
    normalizeDegrees(
      297.850 +
        12.190749 * days,
    );

  const longitude =
    l +
    6.289 *
      sinDeg(moonAnomaly) +
    1.274 *
      sinDeg(
        2 * elongation -
          moonAnomaly,
      ) +
    0.658 *
      sinDeg(2 * elongation) +
    0.214 *
      sinDeg(2 * moonAnomaly) -
    0.186 *
      sinDeg(sunAnomaly);

  return normalizeDegrees(longitude);
}

function getEarthHeliocentricPosition(
  days: number,
): HeliocentricPosition {
  const w =
    282.9404 +
    4.70935e-5 * days;

  const e =
    0.016709 -
    1.151e-9 * days;

  const M =
    normalizeDegrees(
      356.0470 +
        0.9856002585 * days,
    );

  const E =
    M +
    radToDeg(e * sinDeg(M)) *
      (
        1 +
        e * cosDeg(M)
      );

  const xv =
    cosDeg(E) -
    e;

  const yv =
    Math.sqrt(
      1 - e * e,
    ) * sinDeg(E);

  const v =
    atan2Deg(yv, xv);

  const r =
    Math.sqrt(
      xv * xv +
        yv * yv,
    );

  const lonecl =
    normalizeDegrees(v + w);

  return {
    x:
      r * cosDeg(lonecl),
    y:
      r * sinDeg(lonecl),
    z:
      0,
  };
}

function solveKepler(
  M: number,
  e: number,
): number {
  let E =
    M +
    radToDeg(e * sinDeg(M)) *
      (
        1 +
        e * cosDeg(M)
      );

  for (
    let index = 0;
    index < 5;
    index += 1
  ) {
    E =
      E -
      (
        E -
        radToDeg(e * sinDeg(E)) -
        M
      ) /
        (
          1 -
          e * cosDeg(E)
        );
  }

  return E;
}

function heliocentricPosition(
  elements: OrbitalElements,
): HeliocentricPosition {
  const N =
    elements.N;

  const i =
    elements.i;

  const w =
    elements.w;

  const a =
    elements.a;

  const e =
    elements.e;

  const M =
    normalizeDegrees(elements.M);

  const E =
    solveKepler(M, e);

  const xv =
    a *
    (
      cosDeg(E) -
      e
    );

  const yv =
    a *
    Math.sqrt(
      1 - e * e,
    ) *
    sinDeg(E);

  const v =
    atan2Deg(yv, xv);

  const r =
    Math.sqrt(
      xv * xv +
        yv * yv,
    );

  const xh =
    r *
    (
      cosDeg(N) *
        cosDeg(v + w) -
      sinDeg(N) *
        sinDeg(v + w) *
        cosDeg(i)
    );

  const yh =
    r *
    (
      sinDeg(N) *
        cosDeg(v + w) +
      cosDeg(N) *
        sinDeg(v + w) *
        cosDeg(i)
    );

  const zh =
    r *
    (
      sinDeg(v + w) *
      sinDeg(i)
    );

  return {
    x: xh,
    y: yh,
    z: zh,
  };
}

function getPlanetLongitude(
  planet: Exclude<
    PlanetPointId,
    'sun' | 'moon'
  >,
  julianDay: number,
): number {
  const days =
    julianDay -
    2451545.0;

  const planetPosition =
    heliocentricPosition(
      PLANET_ELEMENTS[planet](days),
    );

  const earthPosition =
    getEarthHeliocentricPosition(days);

  const xg =
    planetPosition.x -
    earthPosition.x;

  const yg =
    planetPosition.y -
    earthPosition.y;

  return normalizeDegrees(
    atan2Deg(yg, xg),
  );
}

function getMeanSiderealTimeDegrees(
  julianDay: number,
  longitude: number,
): number {
  const t =
    (
      julianDay -
      2451545.0
    ) /
    36525;

  const theta =
    280.46061837 +
    360.98564736629 *
      (
        julianDay -
        2451545.0
      ) +
    0.000387933 * t * t -
    (
      t *
      t *
      t
    ) /
      38710000;

  return normalizeDegrees(
    theta + longitude,
  );
}

function getObliquity(
  julianDay: number,
): number {
  const t =
    (
      julianDay -
      2451545.0
    ) /
    36525;

  return (
    23.439291 -
    0.0130042 * t
  );
}

function getAscendantLongitude(
  julianDay: number,
  latitude: number,
  longitude: number,
): number {
  const lst =
    getMeanSiderealTimeDegrees(
      julianDay,
      longitude,
    );

  const eps =
    getObliquity(julianDay);

  const numerator =
    -cosDeg(lst);

  const denominator =
    sinDeg(lst) *
      cosDeg(eps) +
    tanDeg(latitude) *
      sinDeg(eps);

  return normalizeDegrees(
    radToDeg(
      Math.atan2(
        numerator,
        denominator,
      ),
    ),
  );
}

function getMidheavenLongitude(
  julianDay: number,
  longitude: number,
): number {
  const lst =
    getMeanSiderealTimeDegrees(
      julianDay,
      longitude,
    );

  const eps =
    getObliquity(julianDay);

  return normalizeDegrees(
    radToDeg(
      Math.atan2(
        sinDeg(lst) *
          cosDeg(eps),
        cosDeg(lst),
      ),
    ),
  );
}

function signFromLongitude(
  longitude: number,
): ZodiacSignId {
  const index =
    Math.floor(
      normalizeDegrees(longitude) /
        30,
    );

  return SIGN_ORDER[index] ??
    'aries';
}

function degreeText(
  degreeInSign: number,
): string {
  const degree =
    Math.floor(degreeInSign);

  const minutes =
    Math.round(
      (
        degreeInSign -
        degree
      ) *
        60,
    );

  return `${degree}° ${minutes
    .toString()
    .padStart(2, '0')}′`;
}

function getHouseForLongitude(
  longitude: number,
  ascendantLongitude: number,
): number {
  const relative =
    normalizeDegrees(
      longitude -
        ascendantLongitude,
    );

  return (
    Math.floor(relative / 30) +
    1
  );
}

function createPoint(
  id: ChartPointId,
  longitude: number,
  ascendantLongitude: number,
): ChartPoint {
  const normalized =
    normalizeDegrees(longitude);

  const sign =
    signFromLongitude(normalized);

  const degreeInSign =
    normalized % 30;

  return {
    id,
    longitude:
      normalized,
    sign,
    degreeInSign,
    degreeText:
      degreeText(degreeInSign),
    house:
      getHouseForLongitude(
        normalized,
        ascendantLongitude,
      ),
  };
}

function createHouses(
  ascendantLongitude: number,
): HouseCusp[] {
  return Array.from(
    {
      length: 12,
    },
    (_, index) => {
      const longitude =
        normalizeDegrees(
          ascendantLongitude +
            index * 30,
        );

      const sign =
        signFromLongitude(longitude);

      const degreeInSign =
        longitude % 30;

      return {
        house:
          index + 1,
        longitude,
        sign,
        degreeInSign,
        degreeText:
          degreeText(degreeInSign),
      };
    },
  );
}

function angularDistance(
  first: number,
  second: number,
): number {
  const diff =
    Math.abs(
      normalizeDegrees(first) -
        normalizeDegrees(second),
    );

  return Math.min(
    diff,
    360 - diff,
  );
}

function createAspects(
  points: Record<
    ChartPointId,
    ChartPoint
  >,
): ChartAspect[] {
  const entries =
    Object.values(points);

  const aspects:
    ChartAspect[] = [];

  for (
    let i = 0;
    i < entries.length;
    i += 1
  ) {
    for (
      let j = i + 1;
      j < entries.length;
      j += 1
    ) {
      const first =
        entries[i];

      const second =
        entries[j];

      const distance =
        angularDistance(
          first.longitude,
          second.longitude,
        );

      for (const aspect of ASPECTS) {
        const orb =
          Math.abs(
            distance -
              aspect.angle,
          );

        if (orb <= aspect.orb) {
          aspects.push({
            first:
              first.id,
            second:
              second.id,
            type:
              aspect.type,
            orb:
              Math.round(orb * 10) /
              10,
          });

          break;
        }
      }
    }
  }

  return aspects.sort(
    (a, b) => a.orb - b.orb,
  );
}

function createElementBalance(
  points: Record<
    ChartPointId,
    ChartPoint
  >,
): ElementBalance {
  const balance: ElementBalance = {
    fire: 0,
    earth: 0,
    air: 0,
    water: 0,
  };

  POINT_ORDER.forEach(pointId => {
    const point =
      points[pointId];

    const element =
      ZODIAC_SIGNS[point.sign].element;

    balance[element] +=
      pointId === 'sun' ||
      pointId === 'moon' ||
      pointId === 'ascendant'
        ? 2
        : 1;
  });

  return balance;
}

function createModalityBalance(
  points: Record<
    ChartPointId,
    ChartPoint
  >,
): ModalityBalance {
  const balance: ModalityBalance = {
    cardinal: 0,
    fixed: 0,
    mutable: 0,
  };

  POINT_ORDER.forEach(pointId => {
    const point =
      points[pointId];

    const modality =
      ZODIAC_SIGNS[point.sign].modality;

    balance[modality] +=
      pointId === 'sun' ||
      pointId === 'moon' ||
      pointId === 'ascendant'
        ? 2
        : 1;
  });

  return balance;
}

function getDominantKey<
  T extends Record<string, number>,
>(
  balance: T,
): keyof T {
  return Object.entries(balance)
    .sort(
      (
        [, first],
        [, second],
      ) => second - first,
    )[0][0] as keyof T;
}

export function buildBirthChart(
  rawInput: BirthChartInput,
): BirthChartResult {
  const input:
    BirthChartInput = {
      year:
        clamp(
          Math.trunc(rawInput.year) ||
            1995,
          1800,
          2200,
        ),
      month:
        clamp(
          Math.trunc(rawInput.month) ||
            1,
          1,
          12,
        ),
      day:
        clamp(
          Math.trunc(rawInput.day) ||
            1,
          1,
          31,
        ),
      hour:
        clamp(
          Math.trunc(rawInput.hour) ||
            0,
          0,
          23,
        ),
      minute:
        clamp(
          Math.trunc(rawInput.minute) ||
            0,
          0,
          59,
        ),
      timezoneOffset:
        clamp(
          Number(
            rawInput.timezoneOffset,
          ) || 0,
          -12,
          14,
        ),
      latitude:
        clamp(
          Number(rawInput.latitude) ||
            0,
          -66,
          66,
        ),
      longitude:
        clamp(
          Number(rawInput.longitude) ||
            0,
          -180,
          180,
        ),
    };

  const julianDay =
    toJulianDay(input);

  const ascendantLongitude =
    getAscendantLongitude(
      julianDay,
      input.latitude,
      input.longitude,
    );

  const midheavenLongitude =
    getMidheavenLongitude(
      julianDay,
      input.longitude,
    );

  const points = {
    sun:
      createPoint(
        'sun',
        getSunLongitude(julianDay),
        ascendantLongitude,
      ),
    moon:
      createPoint(
        'moon',
        getMoonLongitude(julianDay),
        ascendantLongitude,
      ),
    mercury:
      createPoint(
        'mercury',
        getPlanetLongitude(
          'mercury',
          julianDay,
        ),
        ascendantLongitude,
      ),
    venus:
      createPoint(
        'venus',
        getPlanetLongitude(
          'venus',
          julianDay,
        ),
        ascendantLongitude,
      ),
    mars:
      createPoint(
        'mars',
        getPlanetLongitude(
          'mars',
          julianDay,
        ),
        ascendantLongitude,
      ),
    jupiter:
      createPoint(
        'jupiter',
        getPlanetLongitude(
          'jupiter',
          julianDay,
        ),
        ascendantLongitude,
      ),
    saturn:
      createPoint(
        'saturn',
        getPlanetLongitude(
          'saturn',
          julianDay,
        ),
        ascendantLongitude,
      ),
    uranus:
      createPoint(
        'uranus',
        getPlanetLongitude(
          'uranus',
          julianDay,
        ),
        ascendantLongitude,
      ),
    neptune:
      createPoint(
        'neptune',
        getPlanetLongitude(
          'neptune',
          julianDay,
        ),
        ascendantLongitude,
      ),
    pluto:
      createPoint(
        'pluto',
        getPlanetLongitude(
          'pluto',
          julianDay,
        ),
        ascendantLongitude,
      ),
    ascendant:
      createPoint(
        'ascendant',
        ascendantLongitude,
        ascendantLongitude,
      ),
    midheaven:
      createPoint(
        'midheaven',
        midheavenLongitude,
        ascendantLongitude,
      ),
  };

  const elementBalance =
    createElementBalance(points);

  const modalityBalance =
    createModalityBalance(points);

  return {
    input,
    julianDay,
    points,
    houses:
      createHouses(
        ascendantLongitude,
      ),
    aspects:
      createAspects(points),
    elementBalance,
    modalityBalance,
    dominantElement:
      getDominantKey(elementBalance),
    dominantModality:
      getDominantKey(modalityBalance),
  };
}

export function getChartPointLabel(
  pointId: ChartPointId,
): string {
  switch (pointId) {
    case 'sun':
      return 'Sun';

    case 'moon':
      return 'Moon';

    case 'mercury':
      return 'Mercury';

    case 'venus':
      return 'Venus';

    case 'mars':
      return 'Mars';

    case 'jupiter':
      return 'Jupiter';

    case 'saturn':
      return 'Saturn';

    case 'uranus':
      return 'Uranus';

    case 'neptune':
      return 'Neptune';

    case 'pluto':
      return 'Pluto';

    case 'ascendant':
      return 'Rising';

    case 'midheaven':
      return 'Midheaven';

    default:
      return pointId;
  }
}

export function getZodiacSymbol(
  sign: ZodiacSignId,
): string {
  return ZODIAC_SIGNS[sign].symbol;
}

export const CHART_POINT_ORDER =
  POINT_ORDER;
