export interface PseudoTranslateOptions {
  appendCharacters?: string;
  expandText: boolean;
  prependCharacters?: string;
}

export interface ExpandTextOptions {
  expansionPercentage: 'auto' | number;
  possibleCharacters: string;
}
