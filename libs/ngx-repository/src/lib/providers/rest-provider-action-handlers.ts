import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IRestProviderActionHandlers } from '../interfaces/rest-provider-action-handlers';
import { IRestProviderOptions } from '../interfaces/rest-provider-options';
import { PaginationMeta } from '../models/pagination-meta';

@Injectable()
export class RestProviderActionHandlers implements IRestProviderActionHandlers {
  getRequest(
    requestUrl: string,
    data: any,
    requestOptions: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: string;
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: string;
      withCredentials?: boolean;
    },
    optionsList: IRestProviderOptions<any>[],
    action: ProviderActionEnum,
    useDefault?: boolean
  ) {
    let request;
    if (useDefault !== true) {
      optionsList.forEach(eachOptions => {
        if (
          eachOptions !== undefined &&
          eachOptions.actionOptions !== undefined &&
          eachOptions.actionOptions.request !== undefined
        ) {
          request = eachOptions.actionOptions.request;
          return request;
        }
      });
    }
    if (request !== undefined) {
      return request(requestUrl, data, requestOptions);
    }
    return undefined;
  }
  getResponseData(
    data: any,
    optionsList: IRestProviderOptions<any>[],
    action: ProviderActionEnum,
    useDefault?: boolean
  ) {
    let responseData;
    if (useDefault !== true) {
      optionsList.forEach(eachOptions => {
        if (
          eachOptions !== undefined &&
          eachOptions.actionOptions !== undefined &&
          eachOptions.actionOptions.responseData !== undefined
        ) {
          responseData = eachOptions.actionOptions.responseData(data, action);
          return responseData;
        }
      });
    }
    if (responseData !== undefined) {
      return responseData;
    }
    return data.body;
  }
  getResponsePaginationMeta(
    data: any,
    optionsList: IRestProviderOptions<any>[],
    action: ProviderActionEnum,
    useDefault?: boolean
  ) {
    let paginationMeta: PaginationMeta;
    if (useDefault !== true) {
      optionsList.forEach(eachOptions => {
        if (
          eachOptions !== undefined &&
          eachOptions.actionOptions !== undefined &&
          eachOptions.actionOptions.responsePaginationMeta !== undefined
        ) {
          paginationMeta = eachOptions.actionOptions.responsePaginationMeta(data, action);
          return paginationMeta;
        }
      });
    }
    if (paginationMeta !== undefined) {
      return paginationMeta;
    }
    paginationMeta = new PaginationMeta();
    let xTotalCount = NaN;
    const keys: string[] = data.headers ? (data.headers.keys ? data.headers.keys() : data.headers) : [];
    keys.forEach(key => {
      if (key.toLowerCase() === 'x-total-count') {
        xTotalCount = +data.headers.get(key);
      }
    });
    paginationMeta.totalResults = isNaN(xTotalCount) ? 10000 : xTotalCount;
    return paginationMeta;
  }
  getRequestQuery(
    currentUrl: string,
    filter: any,
    optionsList: IRestProviderOptions<any>[],
    action: ProviderActionEnum,
    useDefault?: boolean
  ) {
    let query;
    if (useDefault !== true) {
      optionsList.forEach(eachOptions => {
        if (
          eachOptions !== undefined &&
          eachOptions.actionOptions !== undefined &&
          eachOptions.actionOptions.requestQuery !== undefined
        ) {
          query = eachOptions.actionOptions.requestQuery(currentUrl, filter, action);
          return query;
        }
      });
    }
    if (query !== undefined) {
      return query;
    }
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];
        if (!currentUrl.includes(`?${key}=`) && !currentUrl.includes(`&${key}=`)) {
          currentUrl = currentUrl + ((currentUrl.indexOf('?') === -1 ? '?' : '&') + `${key}=${filter[key]}`);
        }
      }
    }
    return currentUrl;
  }
  getRequestUrl(
    key: number | string,
    data: any,
    optionsList: IRestProviderOptions<any>[],
    action: ProviderActionEnum,
    useDefault?: boolean
  ) {
    let requestUrl;
    if (useDefault === true) {
      optionsList.forEach(eachOptions => {
        if (
          eachOptions !== undefined &&
          eachOptions.actionOptions !== undefined &&
          eachOptions.actionOptions.requestUrl !== undefined
        ) {
          requestUrl = eachOptions.actionOptions.requestUrl(key, data, action);
          return requestUrl;
        }
      });
      if (requestUrl !== undefined) {
        return requestUrl;
      }
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
    key: number | string,
    data: any,
    optionsList: IRestProviderOptions<any>[],
    action: ProviderActionEnum,
    useDefault?: boolean
  ) {
    const requestOptions: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: string;
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: string;
      withCredentials?: boolean;
    } = {
      observe: 'response'
    };
    if (useDefault !== true) {
      optionsList.reverse().forEach(eachOptions => {
        if (
          eachOptions !== undefined &&
          eachOptions.actionOptions !== undefined &&
          eachOptions.actionOptions.requestOptions !== undefined
        ) {
          const actionOptionsRequestOptions = eachOptions.actionOptions.requestOptions(key, data, action);
          if (actionOptionsRequestOptions.headers !== undefined) {
            requestOptions.headers = actionOptionsRequestOptions.headers;
          }
          if (actionOptionsRequestOptions.observe !== undefined) {
            requestOptions.observe = actionOptionsRequestOptions.observe;
          }
          if (actionOptionsRequestOptions.params !== undefined) {
            requestOptions.params = actionOptionsRequestOptions.params;
          }
          if (actionOptionsRequestOptions.reportProgress !== undefined) {
            requestOptions.reportProgress = actionOptionsRequestOptions.reportProgress;
          }
          if (actionOptionsRequestOptions.responseType !== undefined) {
            requestOptions.responseType = actionOptionsRequestOptions.responseType;
          }
          if (actionOptionsRequestOptions.withCredentials !== undefined) {
            requestOptions.withCredentials = actionOptionsRequestOptions.withCredentials;
          }
        }
      });
    }
    return requestOptions as any;
  }
  getRequestCreateType(
    optionsList: IRestProviderOptions<any>[],
    action: ProviderActionEnum,
    useDefault?: boolean
  ): 'create' | 'append' {
    let requestCreateType;
    if (useDefault !== true) {
      optionsList.forEach(eachOptions => {
        if (
          eachOptions !== undefined &&
          eachOptions.actionOptions !== undefined &&
          eachOptions.actionOptions.requestCreateType !== undefined
        ) {
          requestCreateType = eachOptions.actionOptions.requestCreateType(action);
          return requestCreateType;
        }
      });
    }
    if (requestCreateType !== undefined) {
      return requestCreateType;
    }
    return 'create';
  }
}
