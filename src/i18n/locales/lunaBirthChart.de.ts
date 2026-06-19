const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "Geburtshoroskop",
    title: "Sonne, Mond & Aszendent",
    subtitle: "Füge Geburtszeit und -ort hinzu, um Mondzeichen, Aszendent, Häuser und Hauptaspekte zu schätzen.",
    inputsTitle: "Geburtsdaten",
    year: "Jahr",
    month: "Monat",
    day: "Tag",
    hour: "Stunde",
    minute: "Minute",
    timezone: "UTC",
    latitude: "Breite",
    longitude: "Länge",
    bigThree: "Die Big Three",
    houses: "Gleichhäuser",
    house: "Haus {{number}}",
    aspects: "Hauptaspekte",
    noAspects: "Keine Hauptaspekte im gewählten Orbis.",
    orb: "Orbis {{value}}°",
    approximateNotice: "Dieses Horoskop nutzt offline Näherungsberechnungen. Für professionelle Astrologie verwende geprüfte Ephemeriden und den exakten Geburtsort.",
    points: {
      sun: "Sonne",
      moon: "Mond",
      ascendant: "Aszendent",
      midheaven: "Medium Coeli",
    },
    aspectNames: {
      conjunction: "Konjunktion",
      sextile: "Sextil",
      square: "Quadrat",
      trine: "Trigon",
      opposition: "Opposition",
    },
  },
} as const;

export default lunaBirthChart;
