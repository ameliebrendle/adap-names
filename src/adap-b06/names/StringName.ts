import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected readonly name: string;
    protected readonly noComponents: number;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        IllegalArgumentException.assert(source != null, "source null");

        const parts = this.splitMasked(source);
        const masked = parts.map(p => this.maskComponent(p));

        this.name = masked.join(this.delimiter);
        this.noComponents = masked.length;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "index out of range"
        );

        const parts = this.splitMasked(this.name);
        return this.unmaskComponent(parts[i]);
    }

    public withComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "index out of range"
        );
        IllegalArgumentException.assert(c != null, "null component");

        const parts = this.splitMasked(this.name);
        parts[i] = this.maskComponent(c);

        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public withInserted(i: number, c: string): Name {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.noComponents,
            "index out of range"
        );
        IllegalArgumentException.assert(c != null, "null component");

        const parts = this.splitMasked(this.name);
        parts.splice(i, 0, this.maskComponent(c));

        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public withAppended(c: string): Name {
        IllegalArgumentException.assert(c != null, "null component");

        const parts = this.splitMasked(this.name);
        parts.push(this.maskComponent(c));

        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public without(i: number): Name {
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "index out of range"
        );

        const parts = this.splitMasked(this.name);
        parts.splice(i, 1);

        return new StringName(parts.join(this.delimiter), this.delimiter);
    }
}
