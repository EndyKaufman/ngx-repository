export class ComponentError extends Error {
    error: Error | string;
    constructor(error: Error | string) {
        super('ComponentError');
        this.error = error;
    }
}
