export class ProviderError extends Error {
    error: Error | string;
    constructor(error: Error | string) {
        super(error instanceof Error ? error.message : error as any);
        this.error = error;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ProviderError.prototype);
    }
}
