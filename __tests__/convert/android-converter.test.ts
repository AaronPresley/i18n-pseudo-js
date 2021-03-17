import fs from 'fs';
import AndroidConverter from '../../src/convert/android-converter';

jest.mock('fs');

describe('AndroidConverter', () => {
  beforeEach(() => {});
  afterEach(() => {});
  
  it('should generate a pseudo translated string file', async () => {
    const conv = new AndroidConverter({}, { doExpand: false });
    conv.setStringContent(`
      <?xml version="1.0" encoding="utf-8"?>
      <resources>
        <string name="some_key_1" description="Some Desc 1">Some Value 1</string>
        <string-array name="some_key_2">
          <item>Some Value 1</item>
          <item>Some Value 2</item>
        </string-array>
      </resources>
    `);

    const pseudo = await conv.generatePseudo();
    expect(pseudo).toMatchSnapshot();
  });

  it('should generate to a file', async () => {
    const conv = new AndroidConverter({}, { doExpand: false });
    conv.setStringContent(`
      <?xml version="1.0" encoding="utf-8"?>
      <resources>
        <string name="some_key_1" description="Some Desc 1">Some Value 1</string>
        <string-array name="some_key_2">
          <item>Some Value 1</item>
          <item>Some Value 2</item>
        </string-array>
      </resources>
    `);

    await conv.generatePseudoToFile('some/file.xml');

    // @ts-ignore
    const calls = fs.writeFileSync.mock.calls;
    expect(calls.length).toEqual(1);
    expect(calls[0][0]).toEqual('some/file.xml');
    expect(calls[0][1]).toMatchSnapshot();
    expect(calls[0][2]).toEqual({ encoding: 'utf-8' });
  });
});