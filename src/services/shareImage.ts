import Share
  from 'react-native-share';

export type ShareImageFileParams = {
  uri: string;
  title?: string;
  message?: string;
};

function normalizeFileUri(
  uri: string,
): string {
  if (
    uri.startsWith('file://') ||
    uri.startsWith('content://')
  ) {
    return uri;
  }

  return `file://${uri}`;
}

export async function shareImageFile({
  uri,
  title,
  message,
}: ShareImageFileParams): Promise<void> {
  const url =
    normalizeFileUri(uri);

  await Share.open({
    title:
      title ?? 'Luna Oracle',
    message:
      message ?? '',
    url,
    type: 'image/png',
    failOnCancel: false,
  });
}
