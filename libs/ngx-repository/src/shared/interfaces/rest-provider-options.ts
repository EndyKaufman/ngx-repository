import { IProviderOptions } from './provider-options';
import { IPaginationMeta } from './pagination-meta';
import { Observable } from 'rxjs/Observable';
import { IRestProviderActionOptions } from './rest-provider-action-options';

export interface IRestProviderOptions<TModel> extends IProviderOptions<TModel> {
    pluralName?: string;
    name?: string;
    apiUrl?: string;
    filter?: string;
    actionOptions?: IRestProviderActionOptions;
}
