import {
  autoUploadIfEnabled,
} from './cloudSync';
import {
  refreshSmartNotifications,
  type SmartNotificationCopy,
} from './smartNotifications';
import {updateHomeWidget} from './widget';

export type SmartFeatureInitializationOptions = {
  notificationCopy: SmartNotificationCopy;
  widgetTitle: string;
  widgetSubtitle: string;
};

export async function initializeSmartFeatures(
  options: SmartFeatureInitializationOptions,
): Promise<void> {
  await Promise.allSettled([
    autoUploadIfEnabled(),
    refreshSmartNotifications(
      options.notificationCopy,
    ),
    updateHomeWidget(
      options.widgetTitle,
      options.widgetSubtitle,
    ),
  ]);
}
