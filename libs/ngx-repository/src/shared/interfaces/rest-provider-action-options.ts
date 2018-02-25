import { IProviderActionOptions } from './provider-action-options';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IRestProviderOptions } from './rest-provider-options';

export interface IRestProviderActionOptions extends IProviderActionOptions {
    request?: Observable<any>;
    requestUrl?: (key: number | string, data: any) => string;
    requestData?: (data: any) => any;
    requestOptions?: {
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
    requestLoadAllTotalCount?: (data: any) => number;
    requestLoadAllPaginationQuery?: (currentUrl: string) => string;
    requestLoadAllSearchQuery?: (currentUrl: string, filter: any) => string;
    requestCreateType?: 'create' | 'append';
}
