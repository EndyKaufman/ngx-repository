import { IProviderOptions } from './provider-options';
import { IRestOptions } from './rest-options';
import { IRestProviderActionOptions } from './rest-provider-action-options';

export interface IRestProviderOptions<TModel> extends IProviderOptions<TModel> {
  apiUrl?: string;
  actionOptions?: IRestProviderActionOptions;
  restOptions?: IRestOptions;
}
