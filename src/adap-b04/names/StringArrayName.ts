import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        
        IllegalArgumentException.assert(
            source != null,
            "StringArrayName(): source null"
        );

        this.components = source.map(raw => {
            IllegalArgumentException.assert(raw != null, "null component");
            return this.maskComponent(raw);
        });

        this.checkInvariant();
    }

    protected createEmptySameType(): StringArrayName {
        return new StringArrayName([], this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "getComponent(): index out of range"
        );

        const result = this.unmaskComponent(this.components[i]);

        MethodFailedException.assert(
            result != null,
            "getComponent(): null after unmask"
        );

        this.checkInvariant();
        return result;
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "setComponent(): index out of range"
        );
        IllegalArgumentException.assert(
            c != null,
            "setComponent(): null component"
        );

        const before = this.components.length;

        this.components[i] = this.maskComponent(c);

        MethodFailedException.assert(
            before === this.components.length,
            "setComponent(): size changed"
        );

        this.checkInvariant();
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.components.length,
            "insert(): index out of range"
        );
        IllegalArgumentException.assert(
            c != null,
            "insert(): null component"
        );

        const before = this.components.length;

        this.components.splice(i, 0, this.maskComponent(c));

        MethodFailedException.assert(
            this.components.length === before + 1,
            "insert(): size incorrect"
        );

        this.checkInvariant();
    }

    public append(c: string) {
        IllegalArgumentException.assert(c != null, "append(): null component");

        const before = this.components.length;

        this.components.push(this.maskComponent(c));

        MethodFailedException.assert(
            this.components.length === before + 1,
            "append(): size incorrect"
        );

        this.checkInvariant();
    }

    public remove(i: number) {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            "remove(): index out of range"
        );

        const before = this.components.length;

        this.components.splice(i, 1);

        MethodFailedException.assert(
            this.components.length === before - 1,
            "remove(): size incorrect"
        );

        this.checkInvariant();
    }

}

// component tests

(function testStringArrayName() {
    console.log("Running StringArrayName tests...");

    const ok = (msg: string) => console.log(" ✓", msg);
    const fail = (msg: string, err: any) => console.error(" ✗", msg, "→", err);

    // --- insert ---
    try {
        const n = new StringArrayName(["a", "b"]);
        try { n.insert(3, "X"); fail("insert(3) should throw", ""); } catch {}
        ok("insert precondition");
    } catch (e) { fail("insert precondition", e); }

    // --- setComponent ---
    try {
        const n = new StringArrayName(["a", "b"]);
        n.setComponent(1, "Z");
        if (n.getComponent(1) !== "Z") throw "wrong component";
        if (n.getNoComponents() !== 2) throw "size changed";
        ok("setComponent works");
    } catch (e) { fail("setComponent", e); }

    // --- remove ---
    try {
        const n = new StringArrayName(["a", "b", "c"]);
        n.remove(1);
        if (n.getComponent(1) !== "c") throw "wrong element";
        if (n.getNoComponents() !== 2) throw "wrong new size";
        ok("remove works");
    } catch (e) { fail("remove", e); }

    // --- append ---
    try {
        const n = new StringArrayName(["a"]);
        const before = n.getNoComponents();
        n.append("X");

        if (n.getComponent(before) !== "X") throw "append failed";
        if (n.getNoComponents() !== before + 1) throw "wrong new size";

        ok("append works");
    } catch (e) { fail("append", e); }

    // --- getComponent ---
    try {
        const n = new StringArrayName(["a", "b"]);
        try { n.getComponent(-1); fail("getComponent(-1) should throw", ""); } catch {}
        try { n.getComponent(2); fail("getComponent(2) should throw", ""); } catch {}
        ok("getComponent preconditions");
    } catch (e) { fail("getComponent", e); }

})();