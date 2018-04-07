import { plainToClassFromExist } from 'class-transformer';
import { IPaginationMeta } from '../interfaces/pagination-meta';

export class PaginationMeta implements IPaginationMeta {

    totalResults?: number;
    curPage?: number;
    totalPages?: number;
    perPage: number;

    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
