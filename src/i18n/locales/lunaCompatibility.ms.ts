const lunaCompatibility = {
  lunaCompatibility: {
    summary: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}.",
    elementFlow: {
      same: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri {{firstElement}} {{secondElement}}.",
      friendly: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri {{firstElement}} {{secondElement}}.",
      different: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri {{firstElement}} {{secondElement}}.",
    },
    modalityFlow: {
      same: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri {{firstModality}} {{secondModality}}.",
      different: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri {{firstModality}} {{secondModality}}.",
    },
    sections: {
      loveRhythm: {
        title: "Rentak cinta",
        text: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri {{firstLoveStyle}} {{secondLoveStyle}}.",
      },
      communication: {
        title: "Komunikasi",
        sameElement: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri.",
        differentElement: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri.",
      },
      growthLesson: {
        title: "Pelajaran perkembangan",
        text: "Panduan astrologi ini untuk refleksi, hiburan dan kesedaran diri.",
      },
    },
  },
} as const;

export default lunaCompatibility;
