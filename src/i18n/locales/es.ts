import westernFeatures
  from './westernFeatures.es';
import lunaFeatures
  from './lunaFeatures.es';
import lunaDynamic
  from './lunaDynamic.es';
  import lunaCompatibility
  from './lunaCompatibility.es';
  import lunaBirthChart
  from './lunaBirthChart.es';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.es';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.es';
  import lunaBirthProfiles
  from './lunaBirthProfiles.es';
    import lunaDailyInsight
  from './lunaDailyInsight.es';
const es = {
  common: {
    cancel: "Cancelar",
    delete: "Eliminar",
    reset: "Restablecer",
    loading: "Cargando...",
    more: "Más",
    save: "Guardar",
    close: "Cerrar",
  },
  tabs: {
    home: "Inicio",
    horoscope: "Horóscopo",
    tarot: "Tarot",
    profile: "Perfil",
    more: "Más",
  },
  settings: {
    title: "Ajustes",
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "Idioma",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "Elegir idioma",
    privacy: "Privacidad",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "Información",
    version: "Luna Oracle versión 1.0.0",
  },
} as const;

export default {
  ...es,
  ...westernFeatures,
  ...lunaFeatures,
    ...lunaDynamic,
      ...lunaCompatibility,
        ...lunaBirthChart,
         ...lunaBirthChartStage3,
           ...lunaBirthChartStage4,
...lunaBirthProfiles,
  ...lunaDailyInsight,
} as const;
