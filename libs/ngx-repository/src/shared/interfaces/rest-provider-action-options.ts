import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { PaginationMeta } from '../models/pagination-meta';
import { IProviderActionOptions } from './provider-action-options';

export interface IRestProviderActionOptions extends IProviderActionOptions {
    request?: (url: string, body: any) => Observable<any>;
    requestQuery?: (url: string, filter: any, action: ProviderActionEnum) => string;
    requestUrl?: (key: number | string, data: any, action: ProviderActionEnum) => string;
    requestOptions?: (key: number | string, data: any, action: ProviderActionEnum) => {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    };
    requestCreateType?: (action: ProviderActionEnum) => 'create' | 'append';
    responseData?: (data: any, action: ProviderActionEnum) => any;
    responsePaginationMeta?: (data: any, action: ProviderActionEnum) => PaginationMeta;
}
