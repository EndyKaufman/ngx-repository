import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { ProviderActionEnum } from '../enums/provider-action.enum';

export interface IProviderActionOptions {
    globalEventIsActive?: boolean;
    globalEventIsActiveResolver?: (data: any, action: ProviderActionEnum) => boolean;
    useFakeHttpClient?: boolean;
    classTransformOptions?: ClassTransformOptions;
    classValidatorOptions?: ValidatorOptions;
}
