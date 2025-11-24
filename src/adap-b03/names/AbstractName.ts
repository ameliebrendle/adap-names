import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const copy = this.createEmptySameType();
        for (let i = 0; i < this.getNoComponents(); i++) {
            copy.append(this.getComponent(i));
        }
        return copy;
    }

    protected abstract createEmptySameType(): AbstractName;


    public asString(delimiter: string = this.delimiter): string {
        const list = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            list.push(this.getComponent(i));
        }
        return list.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const result: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            let raw = this.getComponent(i);

            raw = raw
                .replace(/\\/g, "\\\\")
                .replace(new RegExp(`\\${DEFAULT_DELIMITER}`, "g"), `\\${DEFAULT_DELIMITER}`);

            result.push(raw);
        }
        return result.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        const str = this.asDataString();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    // Utility functions

    protected maskComponent(raw: string): string {
        return raw
            .replace(/\\/g, "\\\\")
            .replace(new RegExp(`\\${this.delimiter}`, "g"), `\\${this.delimiter}`);
    }

    protected unmaskComponent(masked: string): string {
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

    protected splitMasked(s: string): string[] {
        const result: string[] = [];
        let current = "";
        let escape = false;

        for (const ch of s) {
            if (!escape) {
                if (ch === ESCAPE_CHARACTER) {
                    escape = true;
                } else if (ch === this.delimiter) {
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