/** Each photograph has one featured home; the gallery keeps the complete collection. */
export const photoLabels = ['F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18'] as const;
export type PhotoLabel = typeof photoLabels[number];

export const photoStory = {
  cover: 'F02',
  dedication: 'F05',
  medallion: 'F03',
  firstMeeting: 'F07',
  firstKiss: 'F08',
  collage: ['F11', 'F12', 'F15'],
  booth: ['F04', 'F06', 'F18'],
  dictionary: 'F09',
  musicBox: 'F17',
  puzzle: 'F01',
  instant: 'F13',
  postcards: [
    { label: 'F10', title: 'Uma noite na Central' },
    { label: 'F14', title: 'Entre risadas, na roça' },
    { label: 'F16', title: 'Um instante ao ar livre' },
  ],
} as const;

/** Only confirmed dates are presented as exact dates. Page indices are zero based. */
export const photoTimeline = [
  { label: photoStory.firstMeeting, date: '28 ago', title: 'O primeiro encontro', page: 8 },
  { label: photoStory.firstKiss, date: '19 set', title: 'Uma lembrança do primeiro beijo', page: 9 },
  { label: 'F10', date: '19 set', title: 'Uma noite na Central', page: 24 },
  { label: 'F11', date: '', title: 'Os pequenos cuidados', page: 10 },
  { label: 'F12', date: '', title: 'Um presente: Bibble', page: 10 },
  { label: 'F13', date: '10 out', title: 'A primeira máscara juntos', page: 23 },
  { label: 'F15', date: '14 out', title: 'Um bolo e a nossa companhia', page: 10 },
  { label: 'F01', date: '16 out', title: 'A luz do fim de tarde', page: 19 },
] as const;

export const photoCaptions: Record<PhotoLabel, string> = {
  F01: 'Nós, na luz dourada',
  F02: 'Jemima e João',
  F03: 'Do nosso jeito',
  F04: 'Um filtro, duas caretas',
  F05: 'Um retrato juntinhos',
  F06: 'Nem toda foto precisa de pose',
  F07: 'Nosso primeiro encontro · 28 de agosto',
  F08: 'Uma lembrança do primeiro beijo · 19 de setembro',
  F09: 'Nós dois na igreja',
  F10: 'Uma noite na Central',
  F11: 'Carinho nos pequenos cuidados',
  F12: 'Mima e o Bibble',
  F13: 'O dia das máscaras · 10 de outubro',
  F14: 'Entre risadas, na roça',
  F15: 'Um bolo e a nossa companhia',
  F16: 'Um instante ao ar livre',
  F17: 'Mais um pedacinho de nós',
  F18: 'Careta também é lembrança',
};
