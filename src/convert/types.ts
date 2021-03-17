export interface BaseConverterOptions {}

export interface AndroidSingleStringObject {
  _: string;
  $: Record<string, string>;
  item?: string[];
}

export interface AndroidStringFileObject {
  resources: {
    string: AndroidSingleStringObject[];
    'string-array': AndroidSingleStringObject[];
  }
}