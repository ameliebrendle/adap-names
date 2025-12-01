import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        
        IllegalArgumentException.assert(
            source != null,
            "StringName(): source null"
        );

        const rawParts = source.split(this.delimiter);
        const maskedParts = rawParts.map(raw => this.maskComponent(raw));

        this.name = maskedParts.join(this.delimiter);
        this.noComponents = maskedParts.length;

        this.checkInvariant();
    }

    protected createEmptySameType(): StringName {
        return new StringName("", this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "getComponent(): index out of range"
        );

        const parts = this.splitMasked(this.name);
        const result = this.unmaskComponent(parts[i]);

        MethodFailedException.assert(
            result != null,
            "getComponent(): null component"
        );

        this.checkInvariant();
        return result;
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "setComponent(): index out of range"
        );
        IllegalArgumentException.assert(
            c != null,
            "setComponent(): null component"
        );

        const parts = this.splitMasked(this.name);
        parts[i] = this.maskComponent(c);

        this.name = parts.join(this.delimiter);

        MethodFailedException.assert(
            parts.length === this.noComponents,
            "setComponent(): size changed"
        );

        this.checkInvariant();
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.noComponents,
            "insert(): index out of range"
        );
        IllegalArgumentException.assert(c != null, "insert(): null component");

        const before = this.noComponents;
        const parts = this.splitMasked(this.name);

        parts.splice(i, 0, this.maskComponent(c));

        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;

        MethodFailedException.assert(
            this.noComponents === before + 1,
            "insert(): size not increased"
        );

        this.checkInvariant();
    }

    public append(c: string) {
        IllegalArgumentException.assert(c != null, "append(): null component");

        const before = this.noComponents;
        const parts = this.splitMasked(this.name);

        parts.push(this.maskComponent(c));

        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;

        MethodFailedException.assert(
            this.noComponents === before + 1,
            "append(): size not increased"
        );

        this.checkInvariant();
    }

    public remove(i: number) {
        IllegalArgumentException.assert(
            i >= 0 && i < this.noComponents,
            "remove(): index out of range"
        );

        const before = this.noComponents;
        const parts = this.splitMasked(this.name);

        parts.splice(i, 1);

        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;

        MethodFailedException.assert(
            this.noComponents === before - 1,
            "remove(): size not decreased"
        );

        this.checkInvariant();
    }
}
   

// component tests

   (function testStringName() {
    console.log("Running StringName tests...");

    // Helper
    const ok = (msg: string) => console.log(" ✓", msg);
    const fail = (msg: string, err: any) => console.error(" ✗", msg, "→", err);

    // --- getComponent ---
    try {
        const n = new StringName("a.b.c");
        try { n.getComponent(-1); fail("getComponent(-1) should throw", ""); } catch {}
        try { n.getComponent(3); fail("getComponent(3) should throw", ""); } catch {}
        ok("getComponent preconditions");
    } catch (e) { fail("getComponent preconditions", e); }

    // --- setComponent ---
    try {
        const n = new StringName("a.b.c");
        n.setComponent(1, "X");
        if (n.getComponent(1) !== "X") throw "component mismatch";
        if (n.getNoComponents() !== 3) throw "size changed";
        ok("setComponent works");
    } catch (e) { fail("setComponent", e); }

    // --- insert ---
    try {
        const n = new StringName("a.b");
        n.insert(1, "X");
        if (n.getComponent(1) !== "X") throw "wrong component";
        if (n.getNoComponents() !== 3) throw "wrong size";

        try { n.insert(4, "Y"); fail("insert(4) should throw", ""); } catch {}

        ok("insert works");
    } catch (e) { fail("insert", e); }

    // --- append ---
    try {
        const n = new StringName("a.b");
        const before = n.getNoComponents();
        n.append("Z");

        if (n.getComponent(before) !== "Z") throw "append failed";
        if (n.getNoComponents() !== before + 1) throw "wrong new size";

        ok("append works");
    } catch (e) { fail("append", e); }

    // --- remove ---
    try {
        const n = new StringName("a.b.c");
        n.remove(1);

        if (n.getComponent(1) !== "c") throw "component not removed";
        if (n.getNoComponents() !== 2) throw "wrong new size";

        try { n.remove(5); fail("remove(5) should throw", ""); } catch {}

        ok("remove works");
    } catch (e) { fail("remove", e); }

    // --- concat ---
    try {
        const n1 = new StringName("a.b");
        const n2 = new StringName("c.d");

        n1.concat(n2);

        if (n1.asString() !== "a.b.c.d") throw "wrong concat result";
        if (n1.getNoComponents() !== 4) throw "wrong size";

        ok("concat works");
    } catch (e) { fail("concat", e); }

})();
