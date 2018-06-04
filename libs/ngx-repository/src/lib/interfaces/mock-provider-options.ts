import { IRestProviderOptions } from './rest-provider-options';

export interface IMockProviderOptions<TModel> extends IRestProviderOptions<TModel> {
    items: TModel[];
}
