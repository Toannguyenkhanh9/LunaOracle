const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "Carta natal",
    title: "Sol, Luna y Ascendente",
    subtitle: "Añade hora y lugar de nacimiento para estimar signo lunar, ascendente, casas y aspectos principales.",
    inputsTitle: "Datos de nacimiento",
    year: "Año",
    month: "Mes",
    day: "Día",
    hour: "Hora",
    minute: "Minuto",
    timezone: "UTC",
    latitude: "Latitud",
    longitude: "Longitud",
    bigThree: "Los tres principales",
    houses: "Casas iguales",
    house: "Casa {{number}}",
    aspects: "Aspectos principales",
    noAspects: "No hay aspectos principales dentro del orbe seleccionado.",
    orb: "orbe {{value}}°",
    approximateNotice: "Esta carta usa cálculos aproximados sin conexión. Para astrología profesional, usa una efeméride certificada y el lugar exacto de nacimiento.",
    points: {
      sun: "Sol",
      moon: "Luna",
      ascendant: "Ascendente",
      midheaven: "Medio Cielo",
    },
    aspectNames: {
      conjunction: "conjunción",
      sextile: "sextil",
      square: "cuadratura",
      trine: "trígono",
      opposition: "oposición",
    },
  },
} as const;

export default lunaBirthChart;
