import { ProviderActionEnum } from '../enums/provider-action.enum';
import { Observable } from 'rxjs/Observable';
import { IPaginationMeta } from './pagination-meta';
import { IRestProviderOptions } from './rest-provider-options';
import { HttpHeaders, HttpParams } from '@angular/common/http';

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
        action: ProviderActionEnum
    ): Observable<any>;
    getResponseData(
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ): any;
    getRequestUrl(
        key: number | string,
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ): string;
    getRequestOptions(
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    );
    getResponseLoadAllTotalCount(
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ): number;
    getRequestLoadAllPaginationQuery(
        currentUrl: string,
        paginationMeta: IPaginationMeta,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ): string;
    getRequestLoadAllSearchQuery(
        currentUrl: string,
        filter: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ): string;
    getRequestCreateType(
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ): 'create' | 'append';
}
