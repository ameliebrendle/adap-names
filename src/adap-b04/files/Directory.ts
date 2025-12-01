import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn != null, "addChildNode(): node is null");
        IllegalArgumentException.assert(cn.getParentNode() === this, "wrong parent");
        IllegalArgumentException.assert(!this.childNodes.has(cn), "duplicate child");

        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn != null, "removeChildNode(): node is null");
        IllegalArgumentException.assert(this.childNodes.has(cn), "node is not a child");
        
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}