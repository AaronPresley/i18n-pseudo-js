import { PseudoFormatOptions, ParseToken, ICUFunction, ICUPlural, ICUSelect, ICUSelectordinal, ICUCase } from "./types";
import { pseudoCharacterMap, ignoreCharacterMap, expansionCharacters } from './char-map';
const { parse } = require('messageformat-parser');

const DEFAULT_OPTIONS:PseudoFormatOptions = {
    appendChars: '你好',
    doExpand: true,
    expandChars: expansionCharacters,
    prependChars: '世界',
    pseudoChars: pseudoCharacterMap,
}

class PseudoFormat {
    options:PseudoFormatOptions;

    constructor(options:Partial<PseudoFormatOptions> = null) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    /**
     * Expands the given string based on its length
     * @param input The string to expand
     * @returns The expanded string
     */
    private expand = (input:string):string => {
        let output = input;

        const input_len = input.length;
        let target_expansion:number = .2;

        // Determine the percentage to expand this string based on the length
        if (input_len <= 5) target_expansion = 1.2;
        else if (input_len <= 10) target_expansion = 1;
        else if (input_len <= 25) target_expansion = .8;
        else if (input_len <= 50) target_expansion = .6;
        else if (input_len <= 75) target_expansion = .4;

        // Add the expanded chars to the final string
        const addlChars = Math.round(input_len * target_expansion);
        output = `${output}${this.generateRandomExpansion(addlChars)}`;

        return output;
    }

    /**
     * Returns a random string of characters based on the requested length
     * 
     * @param addlChars How many random characters to generate
     * @returns A random string of characters
     */
    private generateRandomExpansion = (addlChars:number = 0): string => {
        const { expandChars } = this.options;
        let output = '';

        const expCharLen = expandChars.length;
        for (let x = 0; x < addlChars; x += 1) {
            const thisIdx = Math.floor(Math.random() * expCharLen);
            output += expandChars[thisIdx];
        }
        
        return output;
    }

    /**
     * Takes the given string and applies pseudo translation. Ignores characters
     * as determined by the objects located in char-map.ts
     * 
     * @param input The string to apply pseudo to
     * @returns A pseudolocalized string
     */
    private makePseudo = (input:string):string => {
        const { pseudoChars } = this.options;
        let ignoreUntilChar:string = null;
        let output:string = '';

        for (let x = 0; x < input.length; x += 1) {
            const thisChar = input[x];

            // Is this one of our ignore characters?
            if (Object.keys(ignoreCharacterMap).includes(thisChar))
                ignoreUntilChar = ignoreCharacterMap[thisChar];

            // Should we stop ignoring characters?
            if (!!ignoreUntilChar && ignoreUntilChar === thisChar)
                ignoreUntilChar = null;
            
            // Append to our output
            output += !!ignoreUntilChar
                ? thisChar
                : pseudoChars[thisChar] || thisChar;
        }
        
        return output;
    }

    /**
     * A function that accepts a single token from the messageformat-parser and
     * converts the relevant pieces to pseudo. If a given token contains other
     * tokens, it calls this function recursively.
     * 
     * @param token The ICU token to process
     * @param applyPseudo Whether or not to apply pseudotranslation to this token
     * @returns A string representation of the given token
     */
    private normalizeParseToken = (token:ParseToken, applyPseudo:boolean = true):string => {
        // Don't do anything if this is a simple string
        if (typeof token === 'string')
            return applyPseudo ? this.makePseudo(token) : token;

        const { type } = token;
        let arg;
        switch(type) {
            case 'octothorpe':
                // This is a fancy word for the pound sign, so just return it
                // https://en.wiktionary.org/wiki/octothorpe
                return '#';

            case 'argument':
            case 'function':
                // Our relevant vars for this case
                const { key } = token as ICUFunction;
                // Extracting arg this way, because the arg var is needed
                // in the below case as well
                arg = (token as ICUFunction).arg;
                
                // Determine whether we have a key to add to the final string
                const keyStr = !!key ? `, ${key}` : '';
                // Determine whether we have nested tokens to process
                const tokens = (token as ICUFunction).param?.tokens || [];
                // Either normalize the tokens or output an empty string
                const tokenStr:string = !!tokens.length
                    ? `, ${tokens.map((t:string) => this.normalizeParseToken(t.trim(), false)).join(', ')}`
                    : '';
                // Return all of the pieces
                return `{ ${arg}${keyStr}${tokenStr} }`;
            
            case 'plural':
            case 'select':
            case 'selectordinal':
                type ThisCase = ICUPlural | ICUSelect | ICUSelectordinal;
                
                // Our relevant vars for this case
                const { cases, offset } = token as ThisCase;
                ({ arg } = token as ThisCase);

                // Loop each case, if any, and do some basic formatting
                const caseStr = cases.map(({ key, tokens }) => 
                    `${key} {${tokens.map(t => this.normalizeParseToken(t)).join('')}}`)
                    .join('\n\t');
                // Return the baked string
                return `{ ${arg}, ${type},${!!offset ? ` offset:${offset}` : ''}\n\t${caseStr}\n}`;

            default:
                // Throw an error if we've come across an unknown token type
                throw new Error(`Sorry, I can't understand token type of "${type}"`);

        }
    }

    /**
     * Accepts an incoming string and parses it to pseudo translation. If the
     * input contains an ICU Message Formatted string, it will parse the pieces
     * and only apply pseudo to the relevant parts.
     * 
     * @param input The string to format
     * @returns The pseudo translated string
     */
    format = (input:string): string => {
        const { doExpand, appendChars, prependChars } = this.options;
        // Expand the text if we were instructed to
        const expandedText = doExpand
            ? this.expand(input)
            : input;
        
        const finalText = `${prependChars}${expandedText}${appendChars}`;
        
        let parsedOutput:ParseToken[];
        try {
            parsedOutput = parse(finalText);
        } catch (err) {
            throw new Error(`There was a problem parsing that string. Are you sure there's not an issue with the ICU Message Format? Here's the error I got:\n${err}`);
        }

        // Normalize each token and return as a joined string
        return parsedOutput.map(t => this.normalizeParseToken(t)).join('');
    }
}

export default PseudoFormat;