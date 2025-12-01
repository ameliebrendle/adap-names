import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

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
            this.delimiter != null && this.delimiter.length === 1,
            "invalid delimiter"
        );

        InvalidStateException.assert(
            this.getNoComponents() >= 0,
            "negative component count"
        );

        for (let i = 0; i < this.getNoComponents(); i++) {
            const comp = this.getComponent(i);
            InvalidStateException.assert(
                comp !== null && comp !== undefined,
                "component is null/undefined"
            );
        }
    }

    public clone(): Name {
        const copy = this.createEmptySameType();
        for (let i = 0; i < this.getNoComponents(); i++) {
            copy.append(this.getComponent(i));
        }
        this.checkInvariant();
        return copy;
    }

    protected abstract createEmptySameType(): AbstractName;

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            delimiter != null && delimiter.length === 1,
            "invalid delimiter"
        );

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
            const raw = this.getComponent(i)
                .replace(/\\/g, "\\\\")
                .replace(new RegExp(`\\${DEFAULT_DELIMITER}`, "g"), `\\${DEFAULT_DELIMITER}`);
            result.push(raw);
        }
        return result.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other != null, "other is null");

        if (this.getNoComponents() !== other.getNoComponents())
            return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i))
                return false;
        }

        this.checkInvariant();
        return true;
    }

    public getHashCode(): number {
        const str = this.asDataString();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        this.checkInvariant();
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
        IllegalArgumentException.assert(other != null, "concat(): other is null");
        const before = this.getNoComponents();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        MethodFailedException.assert(
            this.getNoComponents() === before + other.getNoComponents(),
            "concat(): wrong resulting size"
        );

        this.checkInvariant();
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