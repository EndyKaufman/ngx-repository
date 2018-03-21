import { IProviderOptions } from './provider-options';
import { IRestProviderActionOptions } from './rest-provider-action-options';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IRestOptions } from './rest-options';

export interface IRestProviderOptions<TModel> extends IProviderOptions<TModel> {
    apiUrl?: string;
    actionOptions?: IRestProviderActionOptions;
    restOptions?: IRestOptions;
}
