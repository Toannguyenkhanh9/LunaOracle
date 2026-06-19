const lunaFeatures = {
  luna: {
    tarotJournal: {
      eyebrow: "Tarot",
      title: "タロットジャーナル",
      subtitle: "Save meaningful card pulls and review your patterns over time.",
      empty: "保存されたリーディングはまだありません",
      emptyHint: "タロットを開き、カードを引いて保存します。",
      deleteTitle: "リーディングを削除？",
      deleteMessage: "This saved tarot reading will be removed from your journal.",
      delete: "削除",
    },
    premium: {
      tarotAdvancedTitle: "高度なタロットを解除",
      tarotAdvancedMessage: "Watch one rewarded ad to unlock this Tarot spread for 24 hours. Premium users can open it anytime.",
    },
  },
} as const;

export default lunaFeatures;
