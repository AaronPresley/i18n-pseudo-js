import { parseStringPromise } from 'xml2js';
import BaseConverter, { ConvertException } from './base-converter';
import { IncomingAndroidString, TranslatableString } from './types';

const EXPECTED_XML_TAGS = ['_', '$', 'item'];
const REQUIRED_ATTRS = ['name'];

class AndroidConverter extends BaseConverter {

  private processString = async (incomingString:IncomingAndroidString):Promise<TranslatableString[]> => {
    const { _: value, $: attrs, item: items } = incomingString;
    const processedStrings:TranslatableString[] = [];
  
    // Attempt to get our string's key for the purpose of informitive error messages
    const key = attrs.name || '<unknown string name>';
    const description = attrs.description || null;
  
    // Some useful vars we will use
    const stringTags = Object.keys(incomingString);
    const stringAttrKeys = Object.keys(attrs);
    
    // Ensure this string has our needed attributes
    const missingAttrs = REQUIRED_ATTRS.filter(reqAttr => !stringAttrKeys.includes(reqAttr));
    if (missingAttrs.length) {
      this.issueError(`Skipping key named "${key}" because it's missing the following required attributes: ${missingAttrs.join(', ')}`)
      return;
    }
    
    // Ensure that we have a value
    if (!items && (!value || !value.trim())) {
      this.issueError(`Skipping key named "${key}" because it's missing a value`);
      return;
    }
  
    // Determine whether we think this string contained unescaped HTML attributes
    const unexpectedTags = stringTags.filter(thisTag => !EXPECTED_XML_TAGS.includes(thisTag));
    if (unexpectedTags.length) {
      this.issueWarning(`Skipping string ${key} because it has unexpected tags (${JSON.stringify(unexpectedTags)}). This is likely caused by the string value containing unescaped HTML. For help, see https://www.tutorialspoint.com/xml/xml_cdata_sections.htm`);
      return;
    }

    if (items) {
    }
    else {
      processedStrings.push({ key, value, description });
    }
  
    return processedStrings;
  }

  public processStringContent = async (): Promise<void> => {
    if (!this.stringContent) {
      throw new ConvertException(`The stringContent property is empty. Must call setStringContent() first.`);
    }
    
    // Process the data
    const { resources } = await parseStringPromise(this.stringContent) as Record<string, any>;

    // Ensure we have something to process
    if (!resources) {
      throw new Error(`The Android string file doesn't have a <resources> element. Maybe the content is malformed?`);
    }

    const {
      string: incomingStrings,
      'string-array': incomingStringArrays,
    } = resources;

    // Create an array of promises for all of our strings
    const stringCalls = [
      ...incomingStrings || [],
      ...incomingStringArrays || [],
    ].map(this.processString);

    let cleanedStrings:TranslatableString[] = [];
    const resolvedCalls = await Promise.all(stringCalls);

    for (let foundStrs of resolvedCalls) {
      // Skip if this was a string we couldn't process
      if (!foundStrs) continue;
      cleanedStrings = cleanedStrings.concat([ ...foundStrs ]);
    }
    
    for (let thisString of cleanedStrings) {
      const { key, value, description } = thisString;
      if (this.stringData[key]) {
        this.issueWarning(`Found duplicate string name of ${key}. I'm going to keep the data I came across first.`);
        continue;
      }

      this.stringData[key] = { key, value, description };
    }
  }
}

export default AndroidConverter;