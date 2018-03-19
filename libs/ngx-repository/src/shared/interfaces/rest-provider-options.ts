import { IProviderOptions } from './provider-options';
import { IRestProviderActionOptions } from './rest-provider-action-options';
import { ProviderActionEnum } from '../enums/provider-action.enum';

export interface IRestProviderOptions<TModel> extends IProviderOptions<TModel> {
    pluralName?: string;
    name?: string;
    apiUrl?: string;
    filter?: string;
    globalEventResolver?: (data: any, action: ProviderActionEnum) => boolean;
    actionOptions?: IRestProviderActionOptions;
}
