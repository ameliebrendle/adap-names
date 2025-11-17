import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;

        const delim = this.delimiter;

        const parts = source.split(delim).map(raw =>
            raw.replace(/\\/g, "\\\\")
               .replace(new RegExp(`\\${delimiter}`, "g"), `\\${delimiter}`)
        );
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public asString(delimiter: string = this.delimiter): string {
        const parts = this.splitMasked(this.name, this.delimiter);

        return parts.map(masked => {
            // unmask inline
            let res = "";
            let esc = false;
            for (const ch of masked) {
                if (!esc) {
                    if (ch === ESCAPE_CHARACTER) esc = true;
                    else res += ch;
                } else {
                    res += ch;
                    esc = false;
                }
            }
            return res;
        }).join(delimiter);
    }

    public asDataString(): string {
        const parts = this.splitMasked(this.name, this.delimiter);

        return parts.map(masked => {
            // unmask inline
            let unmasked = "";
            let esc = false;
            for (const ch of masked) {
                if (!esc) {
                    if (ch === ESCAPE_CHARACTER) esc = true;
                    else unmasked += ch;
                } else {
                    unmasked += ch;
                    esc = false;
                }
            }
       
        return unmasked
            .replace(/\\/g, "\\\\")
            .replace(new RegExp(`\\${DEFAULT_DELIMITER}`, "g"), `\\${DEFAULT_DELIMITER}`);
        }).join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const parts = this.splitMasked(this.name, this.delimiter);
        const masked = parts[x];

        // unmask inline
        let result = "";
        let esc = false;
        for (const ch of masked) {
            if (!esc) {
                if (ch === ESCAPE_CHARACTER) esc = true;
                else result += ch;
            } else {
                result += ch;
                esc = false;
            }
        }
        return result;
    }

    public setComponent(n: number, c: string): void {
        const parts = this.splitMasked(this.name, this.delimiter);
        parts[n] =
            c.replace(/\\/g, "\\\\")
             .replace(new RegExp(`\\${this.delimiter}`, "g"), `\\${this.delimiter}`);
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public insert(n: number, c: string): void {
        const parts = this.splitMasked(this.name, this.delimiter);
        parts.splice(
            n,
            0,
            c.replace(/\\/g, "\\\\")
             .replace(new RegExp(`\\${this.delimiter}`, "g"), `\\${this.delimiter}`)
        );
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public append(c: string): void {
        this.insert(this.noComponents, c);
    }

    public remove(n: number): void {
        const parts = this.splitMasked(this.name, this.delimiter);
        parts.splice(n, 1);
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    private splitMasked(s: string, delimiter: string): string[] {
        const result: string[] = [];
        let current = "";
        let escape = false;
        for (const ch of s) {
            if (!escape) {
                if (ch === ESCAPE_CHARACTER) {
                    escape = true;
                } else if (ch === delimiter) {
                    result.push(current);
                    current = "";
                } else {
                    current += ch;
                }
            } else {
                current += ch;
                escape = false;
            }
        }
        result.push(current);
        return result;
    }

}