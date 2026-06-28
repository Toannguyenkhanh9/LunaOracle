const lunaCompatibility = {
  lunaCompatibility: {
    summary: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}.",
    elementFlow: {
      same: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri {{firstElement}} {{secondElement}}.",
      friendly: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri {{firstElement}} {{secondElement}}.",
      different: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri {{firstElement}} {{secondElement}}.",
    },
    modalityFlow: {
      same: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri {{firstModality}} {{secondModality}}.",
      different: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri {{firstModality}} {{secondModality}}.",
    },
    sections: {
      loveRhythm: {
        title: "Ritme cinta",
        text: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri {{firstLoveStyle}} {{secondLoveStyle}}.",
      },
      communication: {
        title: "Komunikasi",
        sameElement: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri.",
        differentElement: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri.",
      },
      growthLesson: {
        title: "Pelajaran pertumbuhan",
        text: "Panduan astrologi ini untuk refleksi, hiburan, dan kesadaran diri.",
      },
    },
  },
} as const;

export default lunaCompatibility;
