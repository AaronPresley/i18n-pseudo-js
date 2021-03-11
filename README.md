# i18n-pseudo

[Pseudotranslation](https://en.wikipedia.org/wiki/Pseudotranslation) is an incredibly useful tool for localizing your apps. This module makes it easy to apply pseudo to any given string.

If the provided string is an ICU Message formatted string, it will parse and generate the ICU Message with proper pseudo.

# Installation

```shell
$ npm i i18n-pseudo
```

or for you `yarn` fans

```shell
$ yarn add i18n-pseudo
```

or using `npx`:
```
$ npx i18n-pseudo "Hello, World"
你好Ĥệḻḻỗ, 𝕎ỗřḻḋ àḃċḋệḟĝȟíǰ世界
```

# CLI

## Example

```shell
$ pseudo Awesome Text Here
你好Ã𝚠ệṧỗṃệ Ťệẍẗ Ĥệřệ àḃċḋệḟĝȟíǰǩḻṃņ世界
```

And if you don't want to expand the tet

```shell
$ pseudo Awesome Text Here -ne
世界Ã𝚠ệṧỗṃệ Ťệẍẗ Ĥệřệ你好
```

## Options

| Argument            | Default | Description |
| ------------------- | ------- | ----------- |
| `--noExpand`, `-ne` | `false` | When provided, the script will _not_ expand the incoming text |

# Code

## Example

Basic usage

```javascript
import { PseudoFormat } from 'i18n-pseudo';
const genPseudo = new PseudoFormat();
console.log(genPseudo.format("Awesome Text Here"));
// 你好Ã𝚠ệṧỗṃệ Ťệẍẗ Ĥệřệ àḃċḋệḟĝȟíǰǩḻṃņ世界
```

It can apply pseudo to ICU Messages as well:

```javascript
import { PseudoFormat, PseudoFormatOptions } from 'i18n-pseudo';

const text = `You have {count, plural,
    zero { nothing }
    one { # item }
    few { # items }
    many { # items }
} in your cart`;

const opts:Partial<PseudoFormatOptions> = { doExpand: false };
const genPseudo = new PseudoFormat(opts);
console.log(genPseudo.format(text));

/*
世界Ỹỗű ȟàṿệ { count, plural,
  zero { ņỗẗȟíņĝ }
  one { # íẗệṃ }
  few { # íẗệṃṧ }
  many { # íẗệṃṧ }
} íņ ẙỗűř ċàřẗȟṔṃỗŚqņṼřṿǰẗÃÃȐṿṃÃȐḋŚǰqḃ你好
*/
```

## Options

### `PseudoFormatOptions`

| Property      | Default | Description |
| ------------- | ------- | ----------- |
| `appendChars` | `"你好"` | When provided, these characters will be appended to the output. This is helpful when you have certain characters that always seem to give your system trouble
| `doExpand`    | `true`  | When `false`, will _not_ expand the input. Expanding characters is useful to ensure your codebase accounts for move verbose languages
| `expandChars`    | ASCII upper and lower chars  | A string of characters that will be randomly selected to create an expansion of the input string.
| `prependChars` | `"世界"` | When provided, these characters will be prepended to the output. This is helpful when you have certain characters that always seem to give your system trouble