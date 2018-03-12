import { IPaginationMeta } from './pagination-meta';

export interface IProviderOptions<TModel> {
    autoload?: boolean;
    delay?: number;
    paginationMeta?: IPaginationMeta;
}
