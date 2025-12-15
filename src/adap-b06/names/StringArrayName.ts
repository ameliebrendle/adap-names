import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected readonly components: readonly string[];

    constructor(components: string[], delimiter?: string) {
        super(delimiter);

        IllegalArgumentException.assert(components != null, "components null");

        this.components = components.map(c => {
            IllegalArgumentException.assert(c != null, "null component");
            return this.maskComponent(c);
        });
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of range"
        );
        return this.unmaskComponent(this.components[i]);
    }

    public withComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of range"
        );
        IllegalArgumentException.assert(c != null, "null component");

        const next = [...this.components];
        next[i] = this.maskComponent(c);
        return new StringArrayName(next, this.delimiter);
    }

    public withInserted(i: number, c: string): Name {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.components.length,
            "index out of range"
        );
        IllegalArgumentException.assert(c != null, "null component");

        const next = [...this.components];
        next.splice(i, 0, this.maskComponent(c));
        return new StringArrayName(next, this.delimiter);
    }

    public withAppended(c: string): Name {
        IllegalArgumentException.assert(c != null, "null component");

        return new StringArrayName(
            [...this.components, this.maskComponent(c)],
            this.delimiter
        );
    }

    public without(i: number): Name {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "index out of range"
        );

        const next = [...this.components];
        next.splice(i, 1);
        return new StringArrayName(next, this.delimiter);
    }
}
