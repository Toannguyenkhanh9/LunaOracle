import {
  getSavedBaziCharts,
} from './baziHistory';

import {
  getUserProfiles,
  saveUserProfile,
  type UserProfileGender,
} from './userProfiles';

function profileKey(input: {
  displayName: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  timeZone: string;
}): string {
  return [
    input.displayName
      .trim()
      .toLowerCase(),
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    input.timeZone
      .trim()
      .toLowerCase(),
  ].join('|');
}

export async function importProfilesFromSavedBaziCharts(): Promise<
  number
> {
  const [
    existingProfiles,
    savedCharts,
  ] = await Promise.all([
    getUserProfiles(),
    getSavedBaziCharts(),
  ]);

  const existingKeys =
    new Set(
      existingProfiles.map(profile =>
        profileKey({
          displayName:
            profile.displayName,
          year:
            profile.birthDate.year,
          month:
            profile.birthDate.month,
          day:
            profile.birthDate.day,
          hour:
            profile.birthTime.hour,
          minute:
            profile.birthTime.minute,
          timeZone:
            profile.location.timeZone,
        }),
      ),
    );

  let imported = 0;

  for (const record of savedCharts) {
    const input =
      record.input;

    const local =
      input.localDateTime;

    const displayName =
      input.displayName?.trim() ||
      record.title.trim() ||
      `BaZi ${local.day}/${local.month}/${local.year}`;

    const key =
      profileKey({
        displayName,
        year: local.year,
        month: local.month,
        day: local.day,
        hour: local.hour,
        minute: local.minute,
        timeZone:
          input.location.timeZone,
      });

    if (existingKeys.has(key)) {
      continue;
    }

    await saveUserProfile({
      displayName,
      relationship: 'other',
      gender:
        input.gender as UserProfileGender,

      day: String(local.day),
      month: String(local.month),
      year: String(local.year),

      hour: String(local.hour),
      minute: String(local.minute),
      birthTimeAccuracy: 'exact',

      placeName:
        input.location.placeName ??
        '',
      timeZone:
        input.location.timeZone,
      longitude:
        input.location.longitude ===
        undefined
          ? ''
          : String(
              input.location.longitude,
            ),
      latitude:
        input.location.latitude ===
        undefined
          ? ''
          : String(
              input.location.latitude,
            ),

      notes:
        record.notes ||
        record.title,
      isFavorite: false,
    });

    existingKeys.add(key);
    imported += 1;
  }

  return imported;
}
