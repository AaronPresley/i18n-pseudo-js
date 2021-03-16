import { BaseConverterOptions, TranslatableString } from './types';
import fs from 'fs';

const DEFAULT_OPTIONS:BaseConverterOptions = {};

class BaseConverter {
  public stringContent: string;
  public stringData: Record<string, TranslatableString> = {};
  public options:BaseConverterOptions;

  constructor(options:Partial<BaseConverterOptions> = null) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
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
   * This class is not responsible for processing strings, as that depends
   * on the type of conversion we're doing
   */
  public processStringContent = async (): Promise<void> => {
    throw new ConvertException(`The processStringContent() method must be overridden by the child class`);
  }

  public issueWarning = (message:string) => console.warn(message);
  public issueError = (message:string) => console.error(message);
  
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