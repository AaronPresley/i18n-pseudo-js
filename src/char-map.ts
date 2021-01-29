/**
 * This is a hash map of ASCII characters and the character
 * that each should be replaced with
 */
export const pseudoCharacterMap:Record<string, string> = {
  'a': 'å',
  'b': 'ḅ',
  'c': 'ç',
  'd': 'ḋ',
  'e': 'ệ',
  'f': 'ⓕ',
  'g': 'ĝ',
  'h': '𝖍',
  'i': 'ℹ',
  'j': 'ǰ',
  'k': '🅺',
  'l': 'ḻ',
  'm': 'ṃ',
  'n': 'ņ',
  'o': 'ỗ',
  'p': '𝙥',
  'q': '𝖖',
  'r': '𝖗',
  's': 'ṧ',
  't': 'ẗ',
  'u': 'ű',
  'v': 'ṿ',
  'w': '𝚠',
  'x': 'ẍ',
  'y': 'ẙ',
  'z': 'ẓ',
  'A': 'Ã',
  'B': 'Ḇ',
  'C': 'Ĉ',
  'D': 'Ď',
  'E': 'Ë',
  'F': '𝗙',
  'G': 'Ǵ',
  'H': 'Ĥ',
  'I': 'Ĩ',
  'J': '𝐉',
  'K': 'Ķ',
  'L': 'Ļ',
  'M': 'Ṃ',
  'N': 'Ṋ',
  'O': 'Ớ',
  'P': 'Ṕ',
  'Q': 'ℚ',
  'R': 'Ȑ',
  'S': 'Ś',
  'T': '𝑻',
  'U': 'Ṻ',
  'V': 'Ṽ',
  'W': '𝕎',
  'X': '🆇',
  'Y': 'Ỹ',
  'Z': 'Ž',
};

/**
 * A hash map of placeholder indicators that will NOT have their
 * characters within pseudo translated.
 */
export const ignoreCharacterMap:Record<string, string> = {
  '{': '}',
  '<': '>',
};

/**
 * The characters to use when expanding the length of a string
 */
export const expansionCharacters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
