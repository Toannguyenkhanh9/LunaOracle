const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "Thème natal",
    title: "Soleil, Lune et Ascendant",
    subtitle: "Ajoutez l’heure et le lieu de naissance pour estimer signe lunaire, ascendant, maisons et aspects majeurs.",
    inputsTitle: "Détails de naissance",
    year: "Année",
    month: "Mois",
    day: "Jour",
    hour: "Heure",
    minute: "Minute",
    timezone: "UTC",
    latitude: "Latitude",
    longitude: "Longitude",
    bigThree: "Les trois grands",
    houses: "Maisons égales",
    house: "Maison {{number}}",
    aspects: "Aspects majeurs",
    noAspects: "Aucun aspect majeur dans l’orbe sélectionné.",
    orb: "orbe {{value}}°",
    approximateNotice: "Ce thème utilise des calculs approximatifs hors ligne. Pour une astrologie professionnelle, utilisez une éphéméride certifiée et un lieu exact.",
    points: {
      sun: "Soleil",
      moon: "Lune",
      ascendant: "Ascendant",
      midheaven: "Milieu du Ciel",
    },
    aspectNames: {
      conjunction: "conjonction",
      sextile: "sextile",
      square: "carré",
      trine: "trigone",
      opposition: "opposition",
    },
  },
} as const;

export default lunaBirthChart;
