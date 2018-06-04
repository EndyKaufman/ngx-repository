import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IPaginationMeta } from './pagination-meta';
import { IProviderActionOptions } from './provider-action-options';

export interface IProviderOptions<TModel> {
    autoload?: boolean;
    delay?: number;
    pluralName?: string;
    name?: string;
    filter?: any;
    globalEventResolver?: (data: any, action: ProviderActionEnum) => boolean;
    paginationMeta?: IPaginationMeta;
    actionOptions?: IProviderActionOptions;
}
