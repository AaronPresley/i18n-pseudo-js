import { parseStringPromise, Builder } from 'xml2js';
import { AndroidSingleStringObject } from './types';
import BaseConverter, { ConvertException } from './base-converter';

const EXPECTED_XML_TAGS = ['_', '$', 'item'];

class AndroidConverter extends BaseConverter {

  /**
   * Processes the value found in the stringContent property and converts it
   * to an object. Then it converts it back into an XML object with pseudo
   * applied. Finally, it returns a baked XML string with pseudo in place.
   * 
   * @returns string
   */
  public generatePseudo = async ():Promise<string> => {
    // Stop here if we don't have content to process
    if (!this.stringContent) {
      throw new ConvertException(`No string content has been set`);
    }

    // Ensuring we have enough string content to process
    let resources;
    try {
      ({ resources } = await parseStringPromise(this.stringContent));
    } catch (err) {
      throw new ConvertException(`There was a problem processing the string content. ${err}`);
    }
    
    // Ensure we have strings to process
    const { string:strings, 'string-array': stringArray } = resources;
    if (!resources || (!strings && !stringArray)) {
      throw new ConvertException(`No strings could be found in your string content. Maybe it's malformed?`);
    }

    // An object that will hold our pseudo XML object
    const js2xml:Record<string, any> = { resources: {} };

    // Convert each string tag
    js2xml.resources.string = strings
      // Process each string
      .map(this.processString)
      // Remove any empty strings that couldn't get process
      .filter((s:any) => !!s);

    // Convert each string-array tag
    js2xml.resources['string-array'] = stringArray
      // Process each string
      .map(this.processString)
      // Remove any empty strings that couldn't get process
      .filter((s:any) => !!s);

    // Generate XML from the built ob ject
    const builder = new Builder();
    // Return the XML string
    return builder.buildObject(js2xml);
  }

  /**
   * Processes a single string or string-array object by converting
   * the relevant parts to pseudo
   * @param thisString The current string or string-array to process
   * @returns 
   */
  private processString = (thisString:AndroidSingleStringObject):AndroidSingleStringObject | undefined => {
    // Some vars we'll need
    const key:string = thisString.$?.name || '<unknown name>';
    const value:string = thisString._ || null;
    const items:string[] = thisString.item || [];
    
    // Determine if this string has a value
    if (!items.length && (!value || !value.trim())) {
      this.issueWarning(`Skipping key ${key} because it doesn't have a value`);
      return;
    }
    
    // Determine if this string has unexpected tags
    const unexpectedTags = Object.keys(thisString).filter(tag => !EXPECTED_XML_TAGS.includes(tag));
    if (unexpectedTags.length) {
      this.issueWarning(`Skipping key ${key} because it has unexpected tags. This is likely caused by including unescaped HTML in the string's value. For help, see https://www.tutorialspoint.com/xml/xml_cdata_sections.htm`);
      return;
    }
    
    // Build this string object, applying pseudo to the relevant parts
    return {
      $: { ...thisString.$ || [] },
      ...(value ? { _: this.genPseudo.format(value) } : null),
      ...(items.length ? { item: items.map(this.genPseudo.format) } : null)
    } as AndroidSingleStringObject;
  }
}

export default AndroidConverter;