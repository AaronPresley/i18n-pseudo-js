import { pseudoTranslate, expandText } from '../src/pseudo-translate';

describe('Expand Text', () => {
  it('should expand by default', () => {
    const output = expandText('Some Awesome Value');
    expect(output).toEqual('Some Awesome Value abcdefghijklmn');
  });

  it('should accept overwrite via the options arg', () => {
    const output = expandText('Some String Here', {
      expansionPercentage: 20,
      possibleCharacters: '234234234232',
    });
    expect(output).toEqual('Some String Here 234');
  });

  it('should throw an error if it needs to expand with more characters than given', () => {
    expect(() => {
      expandText('Cool Text', {
        expansionPercentage: 200,
        possibleCharacters: '1234',
      });
    }).toThrow(`I'm supposed to expand this string by 18 characters but the possibleCharacters option only has 4 characters available`);
  })
})

describe('Pseudo Translate', () => {
  it('should convert ASCII text to pseudo', () => {
    const output = pseudoTranslate('Some Awesome Value');
    expect(output).toEqual('你好Śỗṃệ Ã𝚠ệṧỗṃệ Ṽåḻűệ åḅçḋệⓕĝ𝖍ℹǰ🅺ḻṃņ世界');
  });

  it('should ignore characters within handlebars', () => {
    const output = pseudoTranslate('Hi, {name}! Welcome to my cool script.');
    expect(output).toEqual('你好Ĥℹ, {name}! 𝕎ệḻçỗṃệ ẗỗ ṃẙ çỗỗḻ ṧç𝖗ℹ𝙥ẗ. åḅçḋệⓕĝ𝖍ℹǰ🅺ḻṃņỗ𝙥𝖖𝖗ṧẗűṿ𝚠世界');
  });

  it('should ignore characters within HTML', () => {
    const output = pseudoTranslate('You should <blink>really</blink> be thinking Globally');
    expect(output).toEqual('你好Ỹỗű ṧ𝖍ỗűḻḋ <blink>𝖗ệåḻḻẙ</blink> ḅệ ẗ𝖍ℹņ🅺ℹņĝ Ǵḻỗḅåḻḻẙ åḅçḋệⓕĝ𝖍ℹǰ🅺ḻṃņỗ𝙥𝖖𝖗ṧẗű世界');
  });
});
