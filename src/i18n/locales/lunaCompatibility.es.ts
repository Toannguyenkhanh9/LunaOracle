const lunaCompatibility = {
  lunaCompatibility: {
    summary: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}.",
    elementFlow: {
      same: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento {{firstElement}} {{secondElement}}.",
      friendly: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento {{firstElement}} {{secondElement}}.",
      different: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento {{firstElement}} {{secondElement}}.",
    },
    modalityFlow: {
      same: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento {{firstModality}} {{secondModality}}.",
      different: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento {{firstModality}} {{secondModality}}.",
    },
    sections: {
      loveRhythm: {
        title: "Ritmo amoroso",
        text: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento {{firstLoveStyle}} {{secondLoveStyle}}.",
      },
      communication: {
        title: "Comunicación",
        sameElement: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento.",
        differentElement: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento.",
      },
      growthLesson: {
        title: "Lección de crecimiento",
        text: "Esta guía astrológica es para reflexión, entretenimiento y autoconocimiento.",
      },
    },
  },
} as const;

export default lunaCompatibility;
