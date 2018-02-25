import { IPaginationMeta } from './pagination-meta';
import { IProviderOptions } from './provider-options';
import { IRestProviderOptions } from './rest-provider-options';

export interface IMockProviderOptions<TModel> extends IRestProviderOptions<TModel> {
    items: TModel[];
}
