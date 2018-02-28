import { Injectable, Injector } from '@angular/core';
import { Provider } from './provider';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IProviderOptions } from '../interfaces/provider-options';
import { IRestProviderOptions } from '../interfaces/rest-provider-options';
import { validate } from 'class-validator';
import { ValidatorError } from '../exceptions/validator.error';
import { List } from 'immutable';
import { IModel } from '../interfaces/model';
import { IRestProviderActionOptions } from '../interfaces/rest-provider-action-options';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { IHttpClient } from '../interfaces/http-client';
import { IRestProviderActionHandlers } from '../interfaces/rest-provider-action-handlers';
import { IProviderActionOptions } from '../interfaces/provider-action-options';
import { RestProviderActionHandlers } from './rest-provider-action-handlers';
import { FakeHttpClient } from '../utils/fake-http-client';
import { IFactoryModel } from '../interfaces/factory-model';
import { ProviderError } from '../exceptions/provider.error';
export class RestProvider<TModel extends IModel> extends Provider<TModel> {

    public pluralName: string;
    public name: string;
    public apiUrl: string;
    public httpClient: IHttpClient;
    public fakeHttpClient = new FakeHttpClient();
    public providerActionHandlers: IRestProviderActionHandlers;

    constructor(
        protected injector: Injector,
        protected factoryModel: IFactoryModel<TModel>,
        protected options: IProviderOptions<TModel>
    ) {
        super(injector, factoryModel);
        this.init();
    }
    init() {
        this.httpClient = this.injector.get(HttpClient);
        this.providerActionHandlers = this.injector.get(RestProviderActionHandlers);
        this.setOptions(this.options as IRestProviderOptions<TModel>);
    }
    setOptions(options?: IRestProviderOptions<TModel>) {
        const autoload = options === undefined ? undefined : options.autoload;
        const pluralName = options === undefined ? undefined : options.pluralName;
        const name = options === undefined ? undefined : options.name;
        const apiUrl = options === undefined ? undefined : options.apiUrl;
        const filter = options === undefined ? undefined : options.filter;
        if (autoload !== undefined) {
            this.autoload = autoload;
        }
        if (pluralName !== undefined) {
            this.pluralName = pluralName;
        }
        if (name !== undefined) {
            this.name = name;
        }
        if (apiUrl !== undefined) {
            this.apiUrl = apiUrl;
        }
        if (filter !== undefined) {
            this.filter = filter;
        }

        options.autoload = this.autoload;
        options.pluralName = this.pluralName;
        options.name = this.name;
        options.apiUrl = this.apiUrl;
        options.filter = this.filter;

        this.options = options;

        this.calcPaginationMetaByOptions(options);

        if (this.autoload !== false) {
            this.loadAll(this.filter, this.loadAllOptions);
        }
    }
    action<TProviderActionOptions extends IRestProviderActionOptions>(
        key: string,
        data?: any,
        options?: TProviderActionOptions
    ) {
        return new Promise<TModel>((resolve, reject) => {
            this.actionIsActive$.next(true);
            validate(data, { validationError: { target: false } }).then(errors => {
                if (errors.length > 0 && options.globalEventIsActive !== false) {
                    throw new ValidatorError(errors);
                }
                const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
                const requestUrl = this.providerActionHandlers.getRequestUrl(
                    key, data,
                    optionsList,
                    ProviderActionEnum.Action
                );
                const requestOptions = this.providerActionHandlers.getRequestOptions(
                    optionsList,
                    ProviderActionEnum.Action
                );
                let request = this.providerActionHandlers.getRequest(
                    requestUrl,
                    data,
                    requestOptions,
                    optionsList,
                    ProviderActionEnum.Action
                );
                if (!request) {
                    request = this.httpClient.post<any>(
                        requestUrl,
                        data,
                        requestOptions
                    );
                }
                request.pipe(map(responseData =>
                    this.providerActionHandlers.getResponseData(
                        responseData,
                        optionsList,
                        ProviderActionEnum.Action
                    )
                )).subscribe((actionData: any) => {
                    if (options === undefined || options.globalEventIsActive !== false) {
                        this.action$.next({
                            actionKey: key,
                            requestData: data,
                            responseData: actionData
                        });
                    }
                    this.actionIsActive$.next(false);
                    resolve(actionData);
                },
                    (error: any) => {
                        throw error;
                    }
                );
            });
        });
    }
    create<TProviderActionOptions extends IRestProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ) {
        return new Promise<TModel>((resolve, reject) => {
            model = this.plainToClass(model, ProviderActionEnum.Create);
            this.createIsActive$.next(true);
            validate(model, { validationError: { target: false } }).then(errors => {
                if (errors.length > 0 && options.globalEventIsActive !== false) {
                    throw new ValidatorError(errors);
                }
                const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
                const isCreate = this.providerActionHandlers.getRequestCreateType(
                    optionsList,
                    ProviderActionEnum.Create
                ) === 'create';
                let object;

                if (isCreate === true) {
                    object = this.classToPlain(model, ProviderActionEnum.Create);
                } else {
                    object = this.classToPlain(model, ProviderActionEnum.Append);
                }
                const requestUrl = this.providerActionHandlers.getRequestUrl(
                    undefined,
                    object,
                    optionsList,
                    isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append
                );
                const requestOptions = this.providerActionHandlers.getRequestOptions(
                    optionsList,
                    isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append
                );
                let request = this.providerActionHandlers.getRequest(
                    requestUrl,
                    object,
                    requestOptions,
                    optionsList,
                    isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append
                );
                if (!request) {
                    request = (options === undefined || options.globalEventIsActive === true ? this.httpClient : this.fakeHttpClient).
                        post<any>(
                            requestUrl,
                            object,
                            requestOptions
                        );
                }
                request.pipe(map(responseData =>
                    this.providerActionHandlers.getResponseData(
                        responseData,
                        optionsList,
                        isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append
                    )
                )).subscribe(
                    (createdItem: any) => {
                        let createdModel;
                        if (isCreate === true) {
                            createdModel = this.plainToClass(createdItem, ProviderActionEnum.Create);
                            this.items = this.items.unshift(createdModel);
                        } else {
                            createdModel = this.plainToClass(createdItem, ProviderActionEnum.Append);
                            this.items = this.items.push(createdModel);
                        }
                        const paginationMeta = this.paginationMeta$.getValue();
                        this.calcPaginationMeta({ totalResults: paginationMeta.totalResults + 1 });
                        this.reconfigItems();
                        if (options === undefined || options.globalEventIsActive !== false) {
                            (isCreate ? this.create$ : this.append$).next(createdModel);
                        }
                        this.createIsActive$.next(false);
                        resolve(createdModel);
                    },
                    (error: any) => {
                        throw error;
                    }
                );
            });
        });
    }
    private _update<TProviderActionOptions extends IRestProviderActionOptions>(
        key: number | string,
        model: TModel,
        isUpdate: boolean,
        options?: TProviderActionOptions
    ) {
        return new Promise<TModel>((resolve, reject) => {
            model = this.plainToClass(model, ProviderActionEnum.Update);
            this.updateIsActive$.next(true);
            validate(model, { validationError: { target: false } }).then(errors => {
                if (errors.length > 0 && options.globalEventIsActive !== false) {
                    throw new ValidatorError(errors);
                }
                let object;
                const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];

                let request;
                if (isUpdate === true) {
                    object = this.classToPlain(model, ProviderActionEnum.Update);
                    const requestUrl = this.providerActionHandlers.getRequestUrl(
                        key,
                        object,
                        optionsList,
                        ProviderActionEnum.Update
                    );
                    const requestOptions = this.providerActionHandlers.getRequestOptions(
                        optionsList,
                        ProviderActionEnum.Update
                    );
                    request = this.providerActionHandlers.getRequest(
                        requestUrl,
                        object,
                        requestOptions,
                        optionsList,
                        ProviderActionEnum.Update
                    );
                    if (!request) {
                        request = (options === undefined || options.globalEventIsActive === true ? this.httpClient : this.fakeHttpClient).
                            put<any>(
                                requestUrl,
                                object,
                                requestOptions
                            );
                    }
                } else {
                    object = this.classToPlain(model, ProviderActionEnum.Patch);
                    const requestUrl = this.providerActionHandlers.getRequestUrl(
                        key,
                        object,
                        optionsList,
                        ProviderActionEnum.Patch
                    );
                    const requestOptions = this.providerActionHandlers.getRequestOptions(
                        optionsList,
                        ProviderActionEnum.Patch
                    );
                    request = this.providerActionHandlers.getRequest(
                        requestUrl,
                        object,
                        requestOptions,
                        optionsList,
                        ProviderActionEnum.Patch
                    );
                    if (!request) {
                        request = this.httpClient.patch<any>(
                            requestUrl,
                            object,
                            requestOptions
                        );
                    }
                }
                request.pipe(map(responseData =>
                    this.providerActionHandlers.getResponseData(
                        responseData,
                        optionsList,
                        isUpdate ? ProviderActionEnum.Update : ProviderActionEnum.Patch
                    )
                )).subscribe(
                    (updatedItem: any) => {
                        const updatedModel = this.plainToClass(
                            updatedItem,
                            isUpdate ? ProviderActionEnum.Update : ProviderActionEnum.Patch
                        );
                        const index = this.items.findIndex(eachModel => eachModel.id === key);
                        if (index !== -1) {
                            this.items = this.items.set(index, updatedModel);
                            this.reconfigItems();
                        }
                        if (options === undefined || options.globalEventIsActive !== false) {
                            (isUpdate ? this.update$ : this.patch$).next(updatedModel);
                        }
                        this.updateIsActive$.next(false);
                        resolve(updatedModel);
                    },
                    (error: any) => {
                        throw error;
                    }
                );
            });
        });
    }
    update<TProviderActionOptions extends IRestProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ) {
        return this._update(key, model, true, options);
    }
    patch<TProviderActionOptions extends IRestProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ) {
        return this._update(key, model, false, options);
    }
    load<TProviderActionOptions extends IRestProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ) {
        return new Promise<TModel>((resolve, reject) => {
            const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
            this.loadIsActive$.next(true);
            const requestUrl = this.providerActionHandlers.getRequestUrl(
                key,
                undefined,
                optionsList,
                ProviderActionEnum.Load
            );
            const requestOptions = this.providerActionHandlers.getRequestOptions(
                optionsList,
                ProviderActionEnum.Load
            );
            let request = this.providerActionHandlers.getRequest(
                requestUrl,
                undefined,
                requestOptions,
                optionsList,
                ProviderActionEnum.Load
            );
            if (!request) {
                request = (options === undefined || options.globalEventIsActive === true ? this.httpClient : this.fakeHttpClient).
                    get<any>(
                        requestUrl,
                        requestOptions
                    );
            }
            request.pipe(map(responseData =>
                this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    ProviderActionEnum.Load
                )
            )).subscribe(
                (loadedItem: any) => {
                    const loadedModel = this.plainToClass(loadedItem, ProviderActionEnum.Load);
                    const index = this.items.findIndex(eachModel => eachModel.id === key);
                    if (index !== -1) {
                        this.items = this.items.set(index, loadedModel);
                    }
                    if (options === undefined || options.globalEventIsActive !== false) {
                        this.load$.next(loadedModel);
                    }
                    this.loadIsActive$.next(false);
                    resolve(loadedModel);
                },
                (error: any) => {
                    throw error;
                }
            );
        });
    }
    delete<TProviderActionOptions extends IRestProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ) {
        return new Promise<TModel>((resolve, reject) => {
            const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
            this.deleteIsActive$.next(true);
            const requestUrl = this.providerActionHandlers.getRequestUrl(
                key,
                undefined,
                optionsList,
                ProviderActionEnum.Delete
            );
            const requestOptions = this.providerActionHandlers.getRequestOptions(
                optionsList,
                ProviderActionEnum.Delete
            );
            let request = this.providerActionHandlers.getRequest(
                requestUrl,
                undefined,
                requestOptions,
                optionsList,
                ProviderActionEnum.Delete
            );
            if (!request) {
                request = (options === undefined || options.globalEventIsActive === true ? this.httpClient : this.fakeHttpClient).
                    delete<any>(
                        requestUrl,
                        requestOptions
                    );
            }
            request.pipe(map(responseData =>
                this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    ProviderActionEnum.Delete
                )
            )).subscribe(
                (deleted: any) => {
                    const index = this.items.findIndex(eachModel => eachModel.id === key);
                    const deletedModel = this.items.get(index);
                    if (index !== -1) {
                        this.items = this.items.delete(index);
                        const paginationMeta = this.paginationMeta$.getValue();
                        const newPaginationMeta = this.calcPaginationMeta({
                            totalResults: paginationMeta.totalResults === 0 ? 0 : paginationMeta.totalResults - 1
                        });
                        this.reconfigItems();
                        if (this.items.size === 0 || paginationMeta.totalPages !== newPaginationMeta.totalPages) {
                            this.reloadAll();
                        }
                    }
                    if (options === undefined || options.globalEventIsActive !== false) {
                        this.delete$.next(deletedModel);
                    }
                    this.deleteIsActive$.next(false);
                    resolve(deletedModel);
                },
                (error: any) => {
                    throw error;
                }
            );
        });
    }
    reloadAll() {
        this.loadAll(this.filter, this.loadAllOptions);
    }
    loadAll<TProviderActionOptions extends IRestProviderActionOptions>(
        filter?: any,
        options?: TProviderActionOptions
    ) {
        this.filter = filter;
        this.loadAllOptions = options;
        return new Promise<TModel[]>((resolve, reject) => {
            const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
            this.loadAllIsActive$.next(true);
            let requestUrl = this.providerActionHandlers.getRequestUrl(
                undefined,
                filter,
                optionsList,
                ProviderActionEnum.LoadAll
            );
            requestUrl = requestUrl + this.providerActionHandlers.getRequestLoadAllSearchQuery(
                requestUrl,
                filter,
                optionsList,
                ProviderActionEnum.LoadAll
            );
            requestUrl = requestUrl + this.providerActionHandlers.getRequestLoadAllPaginationQuery(
                requestUrl,
                this.paginationMeta$.getValue(),
                optionsList,
                ProviderActionEnum.LoadAll
            );
            const requestOptions = this.providerActionHandlers.getRequestOptions(
                optionsList,
                ProviderActionEnum.LoadAll
            );
            let request = this.providerActionHandlers.getRequest(
                requestUrl,
                undefined,
                requestOptions,
                optionsList,
                ProviderActionEnum.LoadAll
            );
            if (!request) {
                request = (options === undefined || options.globalEventIsActive === true ? this.httpClient : this.fakeHttpClient).
                    get<any>(
                        requestUrl,
                        requestOptions
                    );
            }
            request.pipe(map(responseData => {
                const responseLoadAllTotalCount = this.providerActionHandlers.getResponseLoadAllTotalCount(
                    responseData,
                    optionsList,
                    ProviderActionEnum.LoadAll
                );
                this.calcPaginationMeta({
                    totalResults: isNaN(responseLoadAllTotalCount) ? 10000 : responseLoadAllTotalCount
                });
                return this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    ProviderActionEnum.LoadAll
                );
            })).subscribe(
                (loadedItems: any[]) => {
                    const loadedModels = loadedItems === undefined ? [] : loadedItems.map(loadedItem =>
                        this.plainToClass(loadedItem, ProviderActionEnum.LoadAll)
                    );
                    this.items = List(loadedModels);
                    this.reconfigItems();
                    if (options === undefined || options.globalEventIsActive !== false) {
                        this.loadAll$.next(loadedModels);
                    }
                    this.loadAllIsActive$.next(false);
                    resolve(loadedModels);
                },
                (error: any) => {
                    throw error;
                }
            );
        });
    }
    reconfigItems() {
        const paginationMeta = this.paginationMeta$.getValue();

        if (paginationMeta.perPage === undefined) {
            throw new ProviderError('Not set perPage count');
        }
        this.items = List(this.items.take(paginationMeta.perPage).toArray());
        this.items$.next(this.items.toArray());
    }
}
