import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';
import * as parseImported from 'url-parse'; const parse = parseImported;
import { IHttpClient } from '../interfaces/http-client';
@Injectable()
export class FakeHttpClient implements IHttpClient {


    public idField = 'id';
    public apiUrlPrefix = '/api/';
    public pageQueryParam = 'page';
    public limitQueryParam = 'limit';
    public searchTextQueryParam = 'search';

    private mockedItems: List<any> = List([]);

    constructor(items?: any[]) {
        if (items !== undefined) {
            this.setItems(items);
        }
    }

    setItems(items: any[]) {
        this.mockedItems = List(items);
    }

    genId(): number {
        let currentMax = 0;
        this.mockedItems.map(
            (mapItem: any) =>
                Math.abs(mapItem[this.idField]) > currentMax ?
                    currentMax = Math.abs(mapItem[this.idField]) :
                    null
        );
        return (currentMax + 1) * -1;
    }

    parseUrl(url: string, data?: string): {
        name: string,
        key: string | number,
        query: any,
        uri: any,
        page: string | number,
        limit: string | number,
        searchText: string
    } {
        const uri = parse(url, true);
        const arrWithoutApi = uri.pathname.split(this.apiUrlPrefix);
        const arr = arrWithoutApi[arrWithoutApi.length - 1].split('/');
        const entityName = arr.length === 2 ? arr[arr.length - 2] : arr[arr.length - 1];
        const entityKey = arr.length === 2 ? arr[arr.length - 1] : undefined;
        const page = uri.query[this.pageQueryParam];
        const limit = uri.query[this.limitQueryParam];
        const searchText = uri.query[this.searchTextQueryParam];
        return {
            name: entityName,
            key: entityKey,
            query: uri.query,
            uri: uri,
            page: page,
            limit: limit,
            searchText: searchText
        };
    }

    checkWordInData(data: any, word: string) {
        const result = Object.keys(data).filter(key => {
            if (data[key] instanceof Object) {
                return this.checkWordInData(data[key], word);
            }
            if (!isNaN(+data[key])) {
                return +data[key] === +word;
            }
            return data[key] ? (data[key] as string).toLowerCase().indexOf(word.toLowerCase()) !== -1 : false;
        });
        return result.length > 0;
    }
    get<T = any>(url: string, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'response';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<any> {
        return new Observable(observer => {
            const urlData = this.parseUrl(url);
            const data: any = {};
            let newBody: any;
            if (urlData.key) {
                const foundedIndex = this.mockedItems.findIndex((item: any) =>
                    +item[this.idField] === +urlData.key || item[this.idField] as string === urlData.key as string
                );
                if (foundedIndex !== -1) {
                    newBody = this.mockedItems.get(foundedIndex);
                }
            } else {
                let count = 0;
                let xTotalCount = 0;
                const startIndex = ((+urlData.page > 1 ? +urlData.page - 1 : 0) * +urlData.limit) + 1;
                const filtredItems = this.mockedItems.filter((item: any, index: number) => {
                    if (urlData.searchText && !this.checkWordInData(item, urlData.searchText)) {
                        return false;
                    } else {
                        xTotalCount++;
                    }
                    if (index >= startIndex - 1 && count < +urlData.limit) {
                        count++;
                        return true;
                    } else {
                        return false;
                    }
                });
                newBody = filtredItems.toArray();
                data.headers = new HttpHeaders({
                    'X-Total-Count': xTotalCount.toString()
                });
            }
            data.body = newBody;
            observer.next(data);
        });
    }

    post<T = any>(url: string, body: any, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'response';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<any> {
        return new Observable(observer => {
            if (!body[this.idField]) {
                body[this.idField] = this.genId();
            }
            this.mockedItems = this.mockedItems.unshift(body);
            const data = { headers: new HttpHeaders(), body: body };
            observer.next(data);
        });
    }

    put<T = any>(url: string, body: any, options?: {
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
    }): Observable<any> {
        return new Observable(observer => {
            const urlData = this.parseUrl(url);
            const foundedIndex = this.mockedItems.findIndex((item: any) =>
                +item[this.idField] === +urlData.key || item[this.idField] as string === urlData.key as string
            );
            if (foundedIndex !== -1) {
                this.mockedItems = this.mockedItems.set(foundedIndex, body);
            }
            const data = { headers: new HttpHeaders(), body: body };
            observer.next(data);
        });
    }

    delete<T = any>(url: string, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'response';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<any> {
        return new Observable(observer => {
            const urlData = this.parseUrl(url);
            const foundedIndex = this.mockedItems.findIndex((item: any) =>
                +item[this.idField] === +urlData.key || item[this.idField] as string === urlData.key as string
            );
            if (foundedIndex !== -1) {
                this.mockedItems = this.mockedItems.delete(foundedIndex);
            }
            const data = { headers: new HttpHeaders(), body: true };
            observer.next(data);
        });
    }

    patch<T = any>(url: string, body: any, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'response';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<any> {
        return new Observable(observer => {
            const urlData = this.parseUrl(url);
            const foundedIndex = this.mockedItems.findIndex((item: any) =>
                +item[this.idField] === +urlData.key || item[this.idField] as string === urlData.key as string
            );
            if (foundedIndex !== -1) {
                const newBody = this.mockedItems.get(foundedIndex);
                for (const objectKey in body) {
                    if (body[urlData.key] !== undefined) {
                        newBody[urlData.key] = body[urlData.key];
                    }
                }
                this.mockedItems = this.mockedItems.set(foundedIndex, newBody);
            }
            const data = { headers: new HttpHeaders(), body: body };
            observer.next(data);
        });
    }
}
