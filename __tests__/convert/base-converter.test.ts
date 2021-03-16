import BaseConverter, { ConvertException } from '../../src/convert/base-converter';


describe('BaseConverter', () => {
  it('should accept content through setStringContent()', async () => {
    const convert = new BaseConverter();
    convert.setStringContent('some content here');

    // Ensure the data ends up in the expected property
    expect(convert.stringContent).toEqual('some content here');
  });

  it('should accept content through setStringContentFromFile()', async () => {
    const convert = new BaseConverter();

    // Mocking the function that reads file content
    // @ts-ignore
    convert.getFileContents = jest.fn().mockResolvedValue('some content here');

    // Run the actual func
    await convert.setStringContentFromFile('/some/path');

    // Ensure the data ends up in the expected property
    expect(convert.stringContent).toEqual('some content here');
  });

  it('should throw an error when processStringContent() is called', () => {
    // ...because that would be the responsibility of the child classes
    const convert = new BaseConverter();
    convert.setStringContent('some content here');

    expect(() => {
      convert.processStringContent();
    }).toThrow('The processStringContent() method must be overridden by the child class');
  })
});