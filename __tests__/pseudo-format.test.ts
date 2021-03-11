import PseudoFormat from '../src/pseudo-format';
import { PseudoFormatOptions } from '../src/types';

const pfOpts:Partial<PseudoFormatOptions> = {
    appendChars: '',
    prependChars: '',
};

describe('PseudoFormat', () => {
    it('should pseudo basic text', () => {
        const value = `Hello, World!`;
        const genPseudo = new PseudoFormat({
            doExpand: false,
        });
        const output = genPseudo.format(value);
        
        expect(output).toEqual(`世界Ĥệḻḻỗ, 𝕎ỗřḻḋ!你好`);
        
    });
    it('should pseudo translate with an argment', () => {
        const value = `Hi, { name }!`;
        const genPseudo = new PseudoFormat(pfOpts);
        const output = genPseudo.format(value);

        expect(output.startsWith(`Ĥí, { name }!`)).toBeTruthy();
        expect(output.length).toBeGreaterThan(value.length);
    });

    it('should pseudo translate with HTML', () => {
        const value = `Hi, <strong>Eliza</strong>!`;
        const genPseudo = new PseudoFormat(pfOpts);
        const output = genPseudo.format(value);

        expect(output.startsWith(`Ĥí, <strong>Ëḻíẓà</strong>!`)).toBeTruthy();
        expect(output.length).toBeGreaterThan(value.length);
    });

    it('should pseudo translate with a function with params', () => {
        const value = `Your last login was { theDate, date, short }`;
        const genPseudo = new PseudoFormat(pfOpts);
        const output = genPseudo.format(value);

        // console.warn(output);
        expect(output.startsWith(`Ỹỗűř ḻàṧẗ ḻỗĝíņ 𝚠àṧ { theDate, date, short }`)).toBeTruthy();
        expect(output.length).toBeGreaterThan(value.length);
    });

    it('should pseudo translate with a function without params', () => {
        const value = `The number I want to show is { theNumber, number }`;
        const genPseudo = new PseudoFormat(pfOpts);
        const output = genPseudo.format(value);

        expect(output.startsWith(`Ťȟệ ņűṃḃệř Ĩ 𝚠àņẗ ẗỗ ṧȟỗ𝚠 íṧ { theNumber, number }`)).toBeTruthy();
        expect(output.length).toBeGreaterThan(value.length);
    });

    it('should pseudo translate with a select', () => {
        const value = `{ theGender, select, 
            female { She uses }
            male { He uses }
            other { They use }
        } this cool app to scan receipts`;

        const genPseudo = new PseudoFormat(pfOpts);
        const output = genPseudo.format(value);

        expect(output.includes(`{ theGender, select`)).toBeTruthy();
        expect(output.includes(`female { Śȟệ űṧệṧ }`)).toBeTruthy();
        expect(output.includes(`male { Ĥệ űṧệṧ }`)).toBeTruthy();
        expect(output.includes(`other { Ťȟệẙ űṧệ }`)).toBeTruthy();
    });

    it('should pseudo translate with plurals', () => {
        const value = `There { total, plural, offset:2
            =0 { are no items }
            =1 { is 1 item }
            other { are # items }
        } in your cart`;

        const genPseudo = new PseudoFormat(pfOpts);
        const output = genPseudo.format(value);

        expect(output.includes(`{ total, plural, offset:2`)).toBeTruthy();
        expect(output.includes(`0 { àřệ ņỗ íẗệṃṧ }`)).toBeTruthy();
        expect(output.includes(`1 { íṧ 1 íẗệṃ }`)).toBeTruthy();
        expect(output.includes(`other { àřệ # íẗệṃṧ }`)).toBeTruthy();
    });

    it('should pseudo translate with selectordinals', () => {
        const value = `You are { num, selectordinal, offset:1
            one { #st }
            two { #nd }
            few { #rd }
            other { #th }
        } in line`;

        const genPseudo = new PseudoFormat(pfOpts);
        const output = genPseudo.format(value);

        expect(output.includes(`{ num, selectordinal, offset:1`)).toBeTruthy();
        expect(output.includes(`one { #ṧẗ`)).toBeTruthy();
        expect(output.includes(`two { #ņḋ }`)).toBeTruthy();
        expect(output.includes(`few { #řḋ }`)).toBeTruthy();
        expect(output.includes(`other { #ẗȟ }`)).toBeTruthy();
    });

    it('should throw an error when it encounters an improperly formatted string', () => {
        const genPseudo = new PseudoFormat(pfOpts);
        expect(() => {
            genPseudo.format('This is a { bad string');
        }).toThrow(`There was a problem parsing that string. Are you sure there's not an issue with the ICU Message Format? Here's the error I got:\nSyntaxError: Expected "," or "}" but "s" found.`);
    });
});