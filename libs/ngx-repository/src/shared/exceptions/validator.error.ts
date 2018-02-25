import { ValidationError } from 'class-validator';

export class ValidatorError extends Error {
    errors: ValidationError[] | string;
    constructor(errors: ValidationError[] | string) {
        super(Array.isArray(errors) ? 'ValidationErrors (' + errors.length + ')' : errors as any);
        this.errors = errors;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ValidatorError.prototype);
    }
}
