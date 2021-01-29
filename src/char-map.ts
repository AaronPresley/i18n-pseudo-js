/**
 * This is a hash map of ASCII characters and the character
 * that each should be replaced with
 */
export const pseudoCharacterMap:Record<string, string> = {
  'a': 'à',
  'b': 'ḃ',
  'c': 'ċ',
  'd': 'ḋ',
  'e': 'ệ',
  'f': 'ḟ',
  'g': 'ĝ',
  'h': 'ȟ',
  'i': 'í',
  'j': 'ǰ',
  'k': 'ǩ',
  'l': 'ḻ',
  'm': 'ṃ',
  'n': 'ņ',
  'o': 'ỗ',
  'p': 'ṗ',
  'q': 'q',
  'r': 'ř',
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
  'T': 'Ť',
  'U': 'Ṻ',
  'V': 'Ṽ',
  'W': '𝕎',
  'X': 'Ẍ',
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
