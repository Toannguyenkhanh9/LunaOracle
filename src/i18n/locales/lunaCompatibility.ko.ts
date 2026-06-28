const lunaCompatibility = {
  lunaCompatibility: {
    summary: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다 {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}.",
    elementFlow: {
      same: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다 {{firstElement}} {{secondElement}}.",
      friendly: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다 {{firstElement}} {{secondElement}}.",
      different: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다 {{firstElement}} {{secondElement}}.",
    },
    modalityFlow: {
      same: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다 {{firstModality}} {{secondModality}}.",
      different: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다 {{firstModality}} {{secondModality}}.",
    },
    sections: {
      loveRhythm: {
        title: "사랑의 리듬",
        text: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다 {{firstLoveStyle}} {{secondLoveStyle}}.",
      },
      communication: {
        title: "소통",
        sameElement: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다.",
        differentElement: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다.",
      },
      growthLesson: {
        title: "성장의 교훈",
        text: "이 점성술 안내는 성찰, 오락, 자기 이해를 위한 것입니다.",
      },
    },
  },
} as const;

export default lunaCompatibility;
