import { IProviderActionOptions } from './provider-action-options';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IRestProviderOptions } from './rest-provider-options';
import { ProviderActionEnum } from '../enums/provider-action.enum';

export interface IRestProviderActionOptions extends IProviderActionOptions {
    request?: Observable<any>;
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
    requestLoadAllPaginationQuery?: (currentUrl: string, action: ProviderActionEnum) => string;
    requestLoadAllSearchQuery?: (currentUrl: string, filter: any, action: ProviderActionEnum) => string;
    requestCreateType?: (action: ProviderActionEnum) => 'create' | 'append';
    responseData?: (data: any, action: ProviderActionEnum) => any;
    responseLoadAllTotalCount?: (data: any, action: ProviderActionEnum) => number;
}
