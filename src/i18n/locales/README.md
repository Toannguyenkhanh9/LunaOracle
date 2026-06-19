# Luna Oracle i18n complete resources

Gói này bổ sung đầy đủ resource cho các màn bạn đang thấy còn tiếng Anh:

- Daily Horoscope
- Tarot Reading
- Zodiac Profile
- Zodiac Compatibility
- Moon Calendar
- Astro Glossary
- Tarot Journal
- Premium / Rewarded Ads

## Có đủ 18 ngôn ngữ

```text
en, vi, es, pt, fr, it, de, nl, hi, id, ms, fil, ar, zh, ja, ko, ru, th
```

## File được tạo

Mỗi ngôn ngữ có 3 file:

```text
<lang>.ts
westernFeatures.<lang>.ts
lunaFeatures.<lang>.ts
```

Ví dụ:

```text
en.ts
westernFeatures.en.ts
lunaFeatures.en.ts
```

## Cách dùng

Chép toàn bộ file trong:

```text
src/i18n/locales/
```

vào:

```text
src/i18n/locales/
```

File chính đã import sẵn:

```ts
import westernFeatures
  from './westernFeatures.en';
import lunaFeatures
  from './lunaFeatures.en';

export default {
  ...en,
  ...westernFeatures,
  ...lunaFeatures,
} as const;
```

## Lý do màn vẫn hiện tiếng Anh

Một số màn trước đó còn ghi chữ trực tiếp trong code như:

```tsx
<Text>Daily Horoscope</Text>
<Text>Reflective Reading</Text>
<Text>Moon Calendar</Text>
```

Resource này đã có đầy đủ key. Bước tiếp theo là thay các text trực tiếp đó bằng:

```tsx
t('western.daily.eyebrow')
t('western.tarot.title')
t('western.moon.title')
```

Mình có thể gửi tiếp gói màn hình đã i18n hóa nếu cần, nhưng phần resource trong gói này đã đầy đủ.
