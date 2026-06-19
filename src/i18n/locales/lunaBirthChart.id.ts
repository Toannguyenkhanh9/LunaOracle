const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "Birth Chart",
    title: "Sun, Moon & Rising",
    subtitle: "Add birth time and location to estimate Moon Sign, Rising Sign, houses, and major aspects.",
    inputsTitle: "Birth details",
    year: "Year",
    month: "Month",
    day: "Day",
    hour: "Hour",
    minute: "Minute",
    timezone: "UTC",
    latitude: "Latitude",
    longitude: "Longitude",
    bigThree: "The Big Three",
    houses: "Equal Houses",
    house: "House {{number}}",
    aspects: "Major Aspects",
    noAspects: "No major aspects within the selected orb.",
    orb: "orb {{value}}°",
    approximateNotice: "This lightweight chart uses offline approximate calculations. For professional astrology, use a certified ephemeris and exact birthplace.",
    points: {
      sun: "Sun",
      moon: "Moon",
      ascendant: "Rising",
      midheaven: "Midheaven",
    },
    aspectNames: {
      conjunction: "conjunction",
      sextile: "sextile",
      square: "square",
      trine: "trine",
      opposition: "opposition",
    },
  },
} as const;

export default lunaBirthChart;
