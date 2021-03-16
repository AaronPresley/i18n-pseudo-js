export interface BaseConverterOptions {}

export interface IncomingAndroidString {
  _: string;
  $: Record<string, string>;
  item?: string[];
}

export interface TranslatableString {
  description?: string;
  key: string;
  value: string;
}