const lunaCompatibility = {
  lunaCompatibility: {
    summary: "此占星指南用于反思、娱乐与自我觉察 {{firstSymbol}} {{firstSign}} {{secondSymbol}} {{secondSign}}。",
    elementFlow: {
      same: "此占星指南用于反思、娱乐与自我觉察 {{firstElement}} {{secondElement}}。",
      friendly: "此占星指南用于反思、娱乐与自我觉察 {{firstElement}} {{secondElement}}。",
      different: "此占星指南用于反思、娱乐与自我觉察 {{firstElement}} {{secondElement}}。",
    },
    modalityFlow: {
      same: "此占星指南用于反思、娱乐与自我觉察 {{firstModality}} {{secondModality}}。",
      different: "此占星指南用于反思、娱乐与自我觉察 {{firstModality}} {{secondModality}}。",
    },
    sections: {
      loveRhythm: {
        title: "爱情节奏",
        text: "此占星指南用于反思、娱乐与自我觉察 {{firstLoveStyle}} {{secondLoveStyle}}。",
      },
      communication: {
        title: "沟通",
        sameElement: "此占星指南用于反思、娱乐与自我觉察。",
        differentElement: "此占星指南用于反思、娱乐与自我觉察。",
      },
      growthLesson: {
        title: "成长课题",
        text: "此占星指南用于反思、娱乐与自我觉察。",
      },
    },
  },
} as const;

export default lunaCompatibility;
