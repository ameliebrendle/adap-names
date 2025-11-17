import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;

        this.components = source.map(raw => {
            return raw
                .replace(/\\/g, "\\\\")
                .replace(new RegExp(`\\${this.delimiter}`, "g"), `\\${this.delimiter}`);
        });
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components
            .map(masked => {
                let result = "";
                let escape = false;
                for (const ch of masked) {
                    if (!escape) {
                        if (ch === ESCAPE_CHARACTER) escape = true;
                        else result += ch;
                    } else {
                        result += ch;
                        escape = false;
                    }
                }
                return result;
            })
            .join(delimiter);
    }

    public asDataString(): string {
        return this.components
            .map(masked => {
                let unmasked = "";
                let escape = false;
                for (const ch of masked) {
                    if (!escape) {
                        if (ch === ESCAPE_CHARACTER) escape = true;
                        else unmasked += ch;
                    } else {
                        unmasked += ch;
                        escape = false;
                    }
                }

                return unmasked
                    .replace(/\\/g, "\\\\")
                    .replace(new RegExp(`\\${DEFAULT_DELIMITER}`, "g"), `\\${DEFAULT_DELIMITER}`);
            })
            .join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        let masked = this.components[i];
        let result = "";
        let escape = false;

        for (const ch of masked) {
            if (!escape) {
                if (ch === ESCAPE_CHARACTER) escape = true;
                else result += ch;
            } else {
                result += ch;
                escape = false;
            }
        }
        return result;
    }

    public setComponent(i: number, c: string): void {
        this.components[i] =
            c.replace(/\\/g, "\\\\")
             .replace(new RegExp(`\\${this.delimiter}`, "g"), `\\${this.delimiter}`);
    }

    public insert(i: number, c: string): void {
        this.components.splice(
            i,
            0,
            c.replace(/\\/g, "\\\\")
             .replace(new RegExp(`\\${this.delimiter}`, "g"), `\\${this.delimiter}`)
        );
    }

    public append(c: string): void {
        this.insert(this.components.length, c);
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}