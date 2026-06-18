export async function requestNotificationPermission(): Promise<boolean> {
  console.info('Chức năng xin quyền thông báo chưa được cài đặt.');
  return false;
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number,
): Promise<void> {
  console.info(
    `Chưa cài thông báo hằng ngày lúc ${hour}:${minute}.`,
  );
}

export async function cancelDailyReminder(): Promise<void> {
  console.info('Chưa cài chức năng hủy thông báo.');
}