# i18n-pseudo

A simple module that will [pseudotranslate](https://en.wikipedia.org/wiki/Pseudotranslation) any given string. Better description TODO

## Installation

```shell
> $ npm i i18n-pseudo
```

or for you `yarn` fans

```shell
> $ yarn add i18n-pseudo
```

## Examples

### On the CLI

```shell
> $ pseudo Awesome Text Here
你好Ã𝚠ệṧỗṃệ 𝑻ệẍẗ Ĥệ𝖗ệ åḅçḋệⓕĝ𝖍ℹǰ🅺ḻṃņ世界
```

## In Code

```javascript
import pseudo from 'i18n-pseudo';
console.log(pseudo('Awesome Text Here'))
// 你好Ã𝚠ệṧỗṃệ 𝑻ệẍẗ Ĥệ𝖗ệ åḅçḋệⓕĝ𝖍ℹǰ🅺ḻṃņ世界
```

## `pseudo(input[, options])`

### Options

| Name | Description | Default |
| ----- | ----- | -- |
| `appendCharacters` | The characters to place before the translated text | `"你好"` |
| `prependCharacters` | The characters to place after the translated text | `"世界"` |
| `expandText` | Whether to expand the input text to reflect the length of some more verbose languages | `true` |
