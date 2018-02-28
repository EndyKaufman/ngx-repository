import { Injectable, Injector } from '@angular/core';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PaginationMeta } from '../models/pagination-meta';
import { IPaginationMeta } from '../interfaces/pagination-meta';
import { IRestProviderActionHandlers } from '../interfaces/rest-provider-action-handlers';
import { IRestProviderOptions } from '../interfaces/rest-provider-options';

@Injectable()
export class RestProviderActionHandlers implements IRestProviderActionHandlers {

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
    ) {
        let request;
        optionsList.forEach(eachOptions => {
            if (eachOptions !== undefined &&
                eachOptions.actionOptions !== undefined &&
                eachOptions.actionOptions.request !== undefined) {
                request = eachOptions.actionOptions.request;
                return request;
            }
        });
        if (request !== undefined) {
            return request(
                requestUrl,
                data,
                requestOptions
            );
        }
        return undefined;
    }
    getResponseData(
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ) {
        let responseData;
        optionsList.forEach(eachOptions => {
            if (eachOptions !== undefined && eachOptions.actionOptions !== undefined &&
                eachOptions.actionOptions.responseData !== undefined) {
                responseData = eachOptions.actionOptions.responseData(data, action);
                return responseData;
            }
        });
        if (responseData !== undefined) {
            return responseData;
        }
        return data.body;
    }
    getResponseLoadAllTotalCount(
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ) {
        let responseLoadAllTotalCount;
        optionsList.forEach(eachOptions => {
            if (eachOptions !== undefined &&
                eachOptions.actionOptions !== undefined && eachOptions.actionOptions.responseLoadAllTotalCount !== undefined) {
                responseLoadAllTotalCount = eachOptions.actionOptions.responseLoadAllTotalCount(data, action);
                return responseLoadAllTotalCount;
            }
        });
        if (responseLoadAllTotalCount !== undefined) {
            return responseLoadAllTotalCount;
        }
        responseLoadAllTotalCount = NaN;
        const keys: string[] = data.headers.keys();
        keys.forEach(key => {
            if (key.toLowerCase() === 'x-total-count') {
                responseLoadAllTotalCount = +data.headers.get(key);
            }
        });
        return responseLoadAllTotalCount;
    }
    getRequestLoadAllPaginationQuery(
        currentUrl: string,
        paginationMeta: IPaginationMeta,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ) {
        let loadAllPaginationQuery;
        optionsList.forEach(eachOptions => {
            if (eachOptions !== undefined && eachOptions.actionOptions !== undefined &&
                eachOptions.actionOptions.requestLoadAllPaginationQuery !== undefined) {
                loadAllPaginationQuery = eachOptions.actionOptions.requestLoadAllPaginationQuery(currentUrl, action);
                return loadAllPaginationQuery;
            }
        });
        if (loadAllPaginationQuery !== undefined) {
            return loadAllPaginationQuery;
        }
        return (currentUrl.indexOf('?') === -1 ? '?' : '&') +
            `page=${paginationMeta.curPage}&limit=${paginationMeta.perPage}`;
    }
    getRequestLoadAllSearchQuery(
        currentUrl: string,
        filter: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ) {
        let loadAllSearchQuery;
        optionsList.forEach(eachOptions => {
            if (eachOptions !== undefined && eachOptions.actionOptions !== undefined &&
                eachOptions.actionOptions.requestLoadAllSearchQuery !== undefined) {
                loadAllSearchQuery = eachOptions.actionOptions.requestLoadAllSearchQuery(currentUrl, filter, action);
                return loadAllSearchQuery;
            }
        });
        if (loadAllSearchQuery !== undefined) {
            return loadAllSearchQuery;
        }
        return (filter && filter.searchText) ?
            ((currentUrl.indexOf('?') === -1 ? '?' : '&') + `search=${filter.searchText}`) :
            '';
    }
    getRequestUrl(
        key: number | string,
        data: any,
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ) {
        let requestUrl;
        optionsList.forEach(eachOptions => {
            if (eachOptions !== undefined && eachOptions.actionOptions !== undefined &&
                eachOptions.actionOptions.requestUrl !== undefined) {
                requestUrl = eachOptions.actionOptions.requestUrl(key, data, action);
                return requestUrl;
            }
        });
        if (requestUrl !== undefined) {
            return requestUrl;
        }
        let apiUrl = '';
        let pluralName = '';
        optionsList.forEach(eachOptions => {
            if (eachOptions !== undefined && eachOptions.apiUrl !== undefined) {
                apiUrl = eachOptions.apiUrl;
            }
            if (eachOptions !== undefined && eachOptions.pluralName !== undefined) {
                pluralName = eachOptions.pluralName;
            }
        });
        if (action === ProviderActionEnum.Action) {
            return apiUrl + '/' + pluralName + '/' + key;
        }
        if (action === ProviderActionEnum.Create) {
            return apiUrl + '/' + pluralName;
        }
        if (action === ProviderActionEnum.Update) {
            return apiUrl + '/' + pluralName + '/' + key;
        }
        if (action === ProviderActionEnum.Patch) {
            return apiUrl + '/' + pluralName + '/' + key;
        }
        if (action === ProviderActionEnum.Load) {
            return apiUrl + '/' + pluralName + '/' + key;
        }
        if (action === ProviderActionEnum.Delete) {
            return apiUrl + '/' + pluralName + '/' + key;
        }
        if (action === ProviderActionEnum.LoadAll) {
            return apiUrl + '/' + pluralName;
        }
    }
    getRequestOptions(
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ) {
        const requestOptions: {
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
        } = {
                observe: 'response'
            };
        optionsList.reverse().forEach(eachOptions => {
            if (eachOptions !== undefined && eachOptions.actionOptions !== undefined &&
                eachOptions.actionOptions.requestOptions !== undefined) {
                if (eachOptions.actionOptions.requestOptions.headers !== undefined) {
                    requestOptions.headers = eachOptions.actionOptions.requestOptions.headers;
                }
                if (eachOptions.actionOptions.requestOptions.observe !== undefined) {
                    requestOptions.observe = eachOptions.actionOptions.requestOptions.observe;
                }
                if (eachOptions.actionOptions.requestOptions.params !== undefined) {
                    requestOptions.params = eachOptions.actionOptions.requestOptions.params;
                }
                if (eachOptions.actionOptions.requestOptions.reportProgress !== undefined) {
                    requestOptions.reportProgress = eachOptions.actionOptions.requestOptions.reportProgress;
                }
                if (eachOptions.actionOptions.requestOptions.responseType !== undefined) {
                    requestOptions.responseType = eachOptions.actionOptions.requestOptions.responseType;
                }
                if (eachOptions.actionOptions.requestOptions.withCredentials !== undefined) {
                    requestOptions.withCredentials = eachOptions.actionOptions.requestOptions.withCredentials;
                }
            }
        });
        return requestOptions as any;
    }
    getRequestCreateType(
        optionsList: IRestProviderOptions<any>[],
        action: ProviderActionEnum
    ): 'create' | 'append' {
        let requestCreateType;
        optionsList.forEach(eachOptions => {
            if (eachOptions !== undefined && eachOptions.actionOptions !== undefined &&
                eachOptions.actionOptions.requestCreateType !== undefined) {
                    requestCreateType = eachOptions.actionOptions.requestCreateType(action);
                return requestCreateType;
            }
        });
        if (requestCreateType !== undefined) {
            return requestCreateType;
        }
        return 'create';
    }
}
