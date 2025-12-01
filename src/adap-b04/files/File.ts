import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
             "open(): file is deleted"
        );
        IllegalArgumentException.assert(
            this.state === FileState.CLOSED,
            "open(): file is not closed"
        );
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        // read something
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "read(): file is not open"
        );
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
            "read(): file is deleted"
        );

        IllegalArgumentException.assert(noBytes >= 0, 
            "read(): noBytes must be non-negative"
        );
        return new Int8Array();
    }

    public close(): void {
        // do something
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "close(): file is not open"
        );
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
            "close(): file is deleted"
        );
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }
}