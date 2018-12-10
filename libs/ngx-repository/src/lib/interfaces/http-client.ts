import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface IHttpClient {
  get<T = any>(
    url: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<any>;

  post<T = any>(
    url: string,
    body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<any>;

  put<T = any>(
    url: string,
    body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<any>;

  delete<T = any>(
    url: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<any>;

  patch<T = any>(
    url: string,
    body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<any>;
}
