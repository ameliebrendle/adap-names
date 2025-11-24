import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        
        const rawParts = source.split(this.delimiter);
        const maskedParts = rawParts.map(raw => this.maskComponent(raw));

        this.name = maskedParts.join(this.delimiter);
        this.noComponents = maskedParts.length;
    }

    protected createEmptySameType(): StringName {
        return new StringName("", this.delimiter);
    }


    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const parts = this.splitMasked(this.name);
        return this.unmaskComponent(parts[i]);
    }

    public setComponent(i: number, c: string) {
        const parts = this.splitMasked(this.name);
        parts[i] = this.maskComponent(c);

        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public insert(i: number, c: string) {
        const parts = this.splitMasked(this.name);
        parts.splice(i, 0, this.maskComponent(c));

        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public append(c: string) {
        const parts = this.splitMasked(this.name);
        parts.push(this.maskComponent(c));

        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public remove(i: number) {
        const parts = this.splitMasked(this.name);
        parts.splice(i, 1);

        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }
    
}