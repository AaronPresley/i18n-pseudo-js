import { BaseConverterOptions } from './types';
import fs from 'fs';
import { PseudoFormatOptions } from '../types';
import PseudoFormat from '../pseudo-format';

const DEFAULT_OPTIONS:BaseConverterOptions = {};

class BaseConverter {
  public stringContent: string;
  public options:BaseConverterOptions;
  public genPseudo:PseudoFormat;

  constructor(convertOptions:Partial<BaseConverterOptions> = null, pseudoOptions:Partial<PseudoFormatOptions> = null) {
    this.options = { ...DEFAULT_OPTIONS, ...convertOptions };
    this.genPseudo = new PseudoFormat(pseudoOptions);
  }

  /**
   * A function that sets the content we want to process
   * @param content The content to process
   */
  public setStringContent = (content:string) => {
    this.stringContent = content;
  }

  /**
   * A helper function to read content from a file and save it into our class
   * @param filePath The absolute path of the file to read into memory
   */
  public setStringContentFromFile = async (filePath:string) => {
    this.setStringContent(await this.getFileContents(filePath));
  }
  
  /**
   * Some helper functions to output errors and warnings. Doing it this way
   * to allow for easiest mocking in tests, and to make it easier to move to
   * a better logging approach later
   */
  public issueError = (message:string) => console.error(message);
  public issueWarning = (message:string) => console.warn(message);

  /**
   * This is the primary function used to process the stringContent. It must
   * be implemented by child classes that understand the stringContent structure
   */
  public generatePseudo = async ():Promise<string> =>
    Promise.reject(`You cannot call this method directly from BaseConverter`);
  
  public generatePseudoToFile = async (filePath:string, confirmOverwrite:boolean = false):Promise<void> => {
    if (fs.existsSync(filePath) && !confirmOverwrite) {
      throw new ConvertException(`The file ${filePath} already exists. Either remove the file or run with confirmOverwrite = true.`)
    }

    const content = await this.generatePseudo();
    return fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
  }
  
  /**
   * Splitting this file out to make it easy to mock within tests. This simple
   * reads the given file and returns the raw contents as a resolved promise
   * 
   * @param filePath The full path of the file to read
   * @returns The string content of the given file
   */
  private getFileContents = async (filePath:string): Promise<string> => {
    return new Promise<string>((res, rej) => {
      if (!fs.existsSync(filePath)) {
        rej(`The file ${filePath} couldn't be found`);
      }

      fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) rej(err);
        else res(data);
      });
    });
  }
}


export class ConvertException extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, ConvertException.prototype);
  }
}


export default BaseConverter;