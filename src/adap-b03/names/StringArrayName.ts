import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        this.components = source.map(raw => this.maskComponent(raw));
    }

    protected createEmptySameType(): StringArrayName {
        return new StringArrayName([], this.delimiter);
    }


    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.unmaskComponent(this.components[i]);
    }

    public setComponent(i: number, c: string) {
        this.components[i] = this.maskComponent(c);
    }

    public insert(i: number, c: string) {
        this.components.splice(i, 0, this.maskComponent(c));
    }

    public append(c: string) {
        this.components.push(this.maskComponent(c));
    }

    public remove(i: number) {
        this.components.splice(i, 1);
    }
}