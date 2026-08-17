export interface HebrewLetter {
  char: string
  name: string
  transliteration: string
  acceptedHebrew: string[]
  acceptedLatin: string[]
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[֑-ׇ]/g, '') // niqqud / cantillation marks
    .replace(/[̀-ͯ]/g, '') // latin diacritics
    .trim()

const letter = (
  char: string,
  name: string,
  transliteration: string,
  acceptedHebrew: string[],
  acceptedLatin: string[],
): HebrewLetter => ({
  char,
  name,
  transliteration,
  acceptedHebrew: acceptedHebrew.map(normalize),
  acceptedLatin: acceptedLatin.map(normalize),
})

export const hebrewLetters: HebrewLetter[] = [
  letter('א', 'אלף', 'Álef', ['אלף'], ['alef', 'aleph']),
  letter('ב', 'בית', 'Bet', ['בית', 'בת'], ['bet', 'beth', 'vet']),
  letter('ג', 'גימל', 'Guímel', ['גימל'], ['gimel', 'guimel']),
  letter('ד', 'דלת', 'Dálet', ['דלת'], ['dalet', 'daled']),
  letter('ה', 'הא', 'He', ['הא'], ['he', 'hei', 'hey']),
  letter('ו', 'וו', 'Vav', ['וו', 'ואו'], ['vav', 'waw']),
  letter('ז', 'זין', 'Záyin', ['זין'], ['zayin', 'zain']),
  letter('ח', 'חית', 'Jet', ['חית'], ['jet', 'chet', 'het']),
  letter('ט', 'טית', 'Tet', ['טית'], ['tet', 'teth']),
  letter('י', 'יוד', 'Yod', ['יוד', 'יוד'], ['yod', 'yud']),
  letter('כ', 'כף', 'Kaf', ['כף'], ['kaf', 'khaf', 'chaf']),
  letter('ל', 'למד', 'Lámed', ['למד'], ['lamed']),
  letter('מ', 'מם', 'Mem', ['מם'], ['mem']),
  letter('נ', 'נון', 'Nun', ['נון'], ['nun']),
  letter('ס', 'סמך', 'Sámej', ['סמך'], ['samej', 'samech']),
  letter('ע', 'עין', 'Áin', ['עין'], ['ain', 'ayin']),
  letter('פ', 'פא', 'Pe', ['פא'], ['pe', 'fe']),
  letter('צ', 'צדי', 'Tsadi', ['צדי'], ['tsadi', 'tzadi']),
  letter('ק', 'קוף', 'Kuf', ['קוף'], ['kuf', 'qof', 'kof']),
  letter('ר', 'ריש', 'Resh', ['ריש'], ['resh']),
  letter('ש', 'שין', 'Shin', ['שין'], ['shin']),
  letter('ת', 'תו', 'Tav', ['תו'], ['tav', 'taw']),
]

export const normalizeAnswer = normalize
