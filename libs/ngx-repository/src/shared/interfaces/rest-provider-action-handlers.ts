import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { PaginationMeta } from '../models/pagination-meta';
import { IRestProviderOptions } from './rest-provider-options';

export interface IRestProviderActionHandlers {

    getRequest(
        requestUrl: string,
        data: any,
        requestOptions: {
            headers?: HttpHeaders | {
                [header: string]: string | string[];
            },
            observe?: string,
            params?: HttpParams | {
                [param: string]: string | string[];
            },
            reportProgress?: boolean,
            responseType?: string,
            withCredentials?: boolean
        },
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum,
        useDefault?: boolean
    ): Observable<any>;
    getResponseData(
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum,
        useDefault?: boolean
    ): any;
    getRequestQuery(
        currentUrl: string,
        filter: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum,
        useDefault?: boolean
    ): string;
    getRequestUrl(
        key: number | string,
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum,
        useDefault?: boolean
    ): string;
    getRequestOptions(
        key: number | string,
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum,
        useDefault?: boolean
    );
    getResponsePaginationMeta(
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum,
        useDefault?: boolean
    ): PaginationMeta;
    getRequestCreateType(
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum,
        useDefault?: boolean
    ): 'create' | 'append';
}
