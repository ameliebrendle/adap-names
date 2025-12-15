import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "delimiter must be a single character"
        );
        this.delimiter = delimiter;
        this.checkInvariant();
    }

    protected checkInvariant(): void {
        InvalidStateException.assert(
            this.getNoComponents() >= 0,
            "negative component count"
        );
    }

    // -------- Printable --------

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "invalid delimiter"
        );

        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asString();
    }

    public asDataString(): string {
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const raw = this.getComponent(i)
                .replace(/\\/g, "\\\\")
                .replace(new RegExp(`\\${this.delimiter}`, "g"), `\\${this.delimiter}`);
            parts.push(raw);
        }
        return parts.join(this.delimiter);
    }


    // -------- Equality --------

    public isEqual(other: Name): boolean {
        if (this === other) return true;
        if (other == null) return false;

        if (this.getNoComponents() !== other.getNoComponents())
            return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i))
                return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        for (let i = 0; i < this.getNoComponents(); i++) {
            const c = this.getComponent(i);
            for (let j = 0; j < c.length; j++) {
                hash = (hash * 31 + c.charCodeAt(j)) | 0;
            }
        }
        return hash;
    }

    // -------- Name --------

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public concatenated(other: Name): Name {
        IllegalArgumentException.assert(other != null, "other is null");

        let result: Name = this;
        for (let i = 0; i < other.getNoComponents(); i++) {
            result = result.withAppended(other.getComponent(i));
        }
        return result;
    }

    // -------- Masking Utilities --------

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
                if (ch === ESCAPE_CHARACTER) escape = true;
                else if (ch === this.delimiter) {
                    result.push(current);
                    current = "";
                } else current += ch;
            } else {
                current += ch;
                escape = false;
            }
        }
        result.push(current);
        return result;
    }

    // -------- Abstract --------

    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;

    abstract withComponent(i: number, c: string): Name;
    abstract withInserted(i: number, c: string): Name;
    abstract withAppended(c: string): Name;
    abstract without(i: number): Name;
}
