import { ExpandTextOptions, PseudoTranslateOptions } from "./types";
import { pseudoCharacterMap, ignoreCharacterMap, expansionCharacters } from './char-map';

const DEFAULT_EXPAND_OPTIONS:ExpandTextOptions = {
  expansionPercentage: 'auto',
  possibleCharacters: expansionCharacters,
};

const DEFAULT_PSEUDO_OPTIONS:PseudoTranslateOptions = {
  appendCharacters: '你好',
  expandText: true,
  prependCharacters: '世界',
};

/**
 * A function that expands the length of a given string
 * @param input The string to expand
 * @param options The options, has reasonable defaults
 */
export const expandText = (
  input:string,
  options: ExpandTextOptions = DEFAULT_EXPAND_OPTIONS,
):string => {
  const finalOpts = { ...DEFAULT_EXPAND_OPTIONS, ...options };
  const { expansionPercentage, possibleCharacters } = finalOpts;
  
  let output = `${input}`;
  let finalExpansionPercent = expansionPercentage;

  // Determine our expansion amount based on the length of the input string
  // but only if we're set to auto expand
  if (finalExpansionPercent === 'auto') {
    if (input.length <= 5) finalExpansionPercent = 120
    else if (input.length <= 10) finalExpansionPercent = 100
    else if (input.length <= 25) finalExpansionPercent = 80
    else if (input.length <= 50) finalExpansionPercent = 60
    else if (input.length <= 75) finalExpansionPercent = 40
    else finalExpansionPercent = 20
  }

  // Figure out how many characters
  // const addLength = Math.round(input.length * (finalExpansionPercent / 100)) - possibleCharacters.length;
  const addLength = Math.round(input.length * (finalExpansionPercent / 100));

  // Throw an error if we're supposed to add more characters than we were provided
  // Maybe eventually we should just choose random characters within possibleCharacters?
  if (addLength && addLength > possibleCharacters.length)
    throw new Error(`I'm supposed to expand this string by ${addLength} characters but the possibleCharacters option only has ${possibleCharacters.length} characters available`);
  
  // Append the characters and return
  return `${output} ${possibleCharacters.substr(0, addLength)}`;
};


/**
 * A function that translates a normal ASCII string to a pseduotranslated string
 * @param input The ASCII string to pseudotranslate
 * @param options The options, has reasonable defaults
 */
export const pseudoTranslate = (
  input:string,
  options: PseudoTranslateOptions = DEFAULT_PSEUDO_OPTIONS,
):string => {
  const finalOpts = { ...DEFAULT_PSEUDO_OPTIONS, ...options };
  const { appendCharacters, prependCharacters, expandText: doExpandText } = finalOpts;

  let finalInput = input;

  if (doExpandText) finalInput = expandText(finalInput);

  let ignoreUntilChar:string = null;
  let output:string = '';

  // Loop through each character of this string
  for (let x = 0; x < finalInput.length; x += 1) {
    const char = finalInput[x];

    // Does this character match one of our ignore characters?
    if (Object.keys(ignoreCharacterMap).includes(char))
      ignoreUntilChar = ignoreCharacterMap[char];

    // Stop ignoring characters
    if (!!ignoreUntilChar && char === ignoreUntilChar)
      ignoreUntilChar = null;

    
    output += !!ignoreUntilChar
      ? char // We're ignoring chars, so append as-is
      : (pseudoCharacterMap[char] || char); // Append the pseudo char with a fallback
  }
  
  return `${appendCharacters}${output}${prependCharacters}`;
};
