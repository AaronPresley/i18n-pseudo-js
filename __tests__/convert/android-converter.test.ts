import AndroidConverter from '../../src/convert/android-converter';

describe('AndroidConverter', () => {
  it('should process a simple string', async () => {
    const convert = new AndroidConverter();
    convert.setStringContent(`
      <?xml version="1.0" encoding="utf-8"?>
      <resources>
        <string name="some_key_1" description="Some Desc 1">Some Value 1</string>
        <string name="some_key_2">Some Value 2</string>
      </resources>
    `);

    await convert.processStringContent();

    expect(convert.stringData).toEqual({
      'some_key_1': {
        description: "Some Desc 1",
        key: 'some_key_1',
        value: 'Some Value 1',
      },
      'some_key_2': {
        description: null,
        key: 'some_key_2',
        value: 'Some Value 2',
      },
    });
  });

  it('should warn when a string has unescaped HTML', async () => {
    const convert = new AndroidConverter();
    convert.issueWarning = jest.fn();
    convert.setStringContent(`
      <?xml version="1.0" encoding="utf-8"?>
      <resources>
        <string name="some_key" description="Some Desc">Some <strong>Value</strong> Here></string>
      </resources>
    `);

    await convert.processStringContent();

    expect(convert.issueWarning).toHaveBeenCalledWith(`Skipping string some_key because it has unexpected tags (["strong"]). This is likely caused by the string value containing unescaped HTML. For help, see https://www.tutorialspoint.com/xml/xml_cdata_sections.htm`);
  });

  it('should process escaped HTML', async () => {
    const convert = new AndroidConverter();
    convert.setStringContent(`
      <?xml version="1.0" encoding="utf-8"?>
      <resources>
        <string name="some_key" description="Some Desc"><![CDATA[Some <strong>Value</strong> Here]]></string>
      </resources>
    `);

    await convert.processStringContent();

    expect(convert.stringData).toEqual({
      'some_key': {
        description: 'Some Desc',
        key: 'some_key',
        value: 'Some <strong>Value</strong> Here',
      }
    })
  });

  it('should process a string-array', async () => {
    const convert = new AndroidConverter();
    convert.setStringContent(`
      <?xml version="1.0" encoding="utf-8"?>
      <resources>
        <string-array name="some_list" description="Some Description">
          <item>List Item 0</item>
          <item>List Item 1</item>
        </string-array>
      </resources>
    `);

    await convert.processStringContent();

    expect(convert.stringData).toEqual({
      some_list_item_0: {
        desciption: '',
        key: 'some_list_item_0',
        value: 'List Item 0',
      },
      some_list_item_1: {
        desciption: '',
        key: 'some_list_item_1',
        value: 'List Item 1',
      },
    })
  });
});