import { IProviderOptions } from './provider-options';
import { IRestProviderActionOptions } from './rest-provider-action-options';

export interface IRestProviderOptions<TModel> extends IProviderOptions<TModel> {
    pluralName?: string;
    name?: string;
    apiUrl?: string;
    filter?: string;
    actionOptions?: IRestProviderActionOptions;
}
