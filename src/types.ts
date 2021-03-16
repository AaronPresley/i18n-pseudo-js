export interface PseudoFormatOptions {
  appendChars: string;
  doExpand: boolean;
  expandChars: string;
  prependChars: string;
  pseudoChars: Record<string, string>;
}

// The below is pulled from
// https://www.npmjs.com/package/messageformat-parser#structure
export type ParseToken = string | ICUArgument | ICUFunction
  | ICUOctothorpe | ICUPlural | ICUSelect | ICUSelectordinal;

export interface ICUArgument {
  type: 'argument';
  arg: string;
}

export interface ICUCase {
  key: string;
  tokens: ParseToken[];
}

export interface ICUFunction {
  type: 'function';
  arg: string;
  key: string;
  param: null | {
    tokens: ParseToken[]
  };
}

export interface ICUOctothorpe {
  type: 'octothorpe';
};

export interface ICUPlural {
  type: 'plural';
  arg: string;
  offset?: number;
  cases: ICUCase[]
}

export interface ICUSelect {
  type: 'select';
  arg: string;
  offset?: number;
  cases: ICUCase[]
}

export interface ICUSelectordinal {
  type: 'selectordinal';
  arg: string;
  offset?: number;
  cases: ICUCase[]
}