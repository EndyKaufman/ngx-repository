import { IPaginationMeta } from '../interfaces/pagination-meta';
import { plainToClassFromExist } from 'class-transformer';

export class PaginationMeta implements IPaginationMeta {

    totalResults?: number;
    curPage?: number;
    totalPages?: number;
    perPage: number;

    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
