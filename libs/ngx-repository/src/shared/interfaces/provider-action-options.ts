import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';

export interface IProviderActionOptions {
    globalEventIsActive?: boolean;
    useFakeHttpClient?: boolean;
    classTransformOptions?: ClassTransformOptions;
    classValidatorOptions?: ValidatorOptions;
}
