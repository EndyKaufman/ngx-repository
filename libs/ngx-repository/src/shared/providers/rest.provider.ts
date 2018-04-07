import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { validateSync } from 'class-validator';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { _throw } from 'rxjs/observable/throw';
import { first, map } from 'rxjs/operators';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { ProviderError } from '../exceptions/provider.error';
import { ValidatorError } from '../exceptions/validator.error';
import { IFactoryModel } from '../interfaces/factory-model';
import { IHttpClient } from '../interfaces/http-client';
import { IModel } from '../interfaces/model';
import { IProviderOptions } from '../interfaces/provider-options';
import { IRestOptions } from '../interfaces/rest-options';
import { IRestProviderActionHandlers } from '../interfaces/rest-provider-action-handlers';
import { IRestProviderActionOptions } from '../interfaces/rest-provider-action-options';
import { IRestProviderOptions } from '../interfaces/rest-provider-options';
import { FakeHttpClient } from '../utils/fake-http-client';
import { Provider } from './provider';
import { RestProviderActionHandlers } from './rest-provider-action-handlers';
export class RestProvider<TModel extends IModel> extends Provider<TModel> {

    public pluralName: string;
    public name: string;
    public apiUrl: string;
    public httpClient: IHttpClient;
    public fakeHttpClient: FakeHttpClient;
    public restOptions: IRestOptions;
    public providerActionHandlers: IRestProviderActionHandlers;

    constructor(
        protected injector: Injector,
        protected factoryModel: IFactoryModel<TModel>,
        protected options: IProviderOptions<TModel>
    ) {
        super(injector, factoryModel);
        this.initFakeHttpClient();
        this.init();
    }
    initFakeHttpClient() {
        const restOptions = this.options === undefined ? undefined : (this.options as IRestProviderOptions<TModel>).restOptions;
        if (restOptions) {
            this.restOptions = restOptions;
        }
        if (!this.restOptions) {
            this.restOptions = {};
            this.restOptions.idField = 'id';
            this.restOptions.pageQueryParam = 'page';
            this.restOptions.limitQueryParam = 'limit';
            this.restOptions.searchTextQueryParam = 'search';
        }
        this.fakeHttpClient = new FakeHttpClient([], this.restOptions);
    }
    init() {
        this.httpClient = this.injector.get(HttpClient);
        this.providerActionHandlers = this.injector.get(RestProviderActionHandlers);
        this.setOptions(this.options as IRestProviderOptions<TModel>);
    }
    getOptions(): IRestProviderOptions<TModel> {
        return this.options;
    }
    setOptions(options?: IRestProviderOptions<TModel>) {
        const filter = options === undefined ? undefined : options.filter;

        options = { ...this.options, ...options };

        const autoload = options === undefined ? undefined : options.autoload;
        const pluralName = options === undefined ? undefined : options.pluralName;
        const name = options === undefined ? undefined : options.name;
        const apiUrl = options === undefined ? undefined : options.apiUrl;
        const restOptions = options === undefined ? undefined : options.restOptions;
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
            this._loadAll(this.filter, this.prevOptions).pipe(first()).subscribe();
        }
    }
    action<TProviderActionOptions extends IRestProviderActionOptions>(
        key: string,
        data?: any,
        options?: TProviderActionOptions
    ): ErrorObservable | Observable<TModel> {
        this.actionIsActive$.next(true);
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        const errors: any = validateSync(data,
            options && options.classValidatorOptions ?
                options.classValidatorOptions :
                { validationError: { target: false } });
        if (errors.length > 0 && (!options || options.globalEventIsActive !== false)) {
            return _throw(new ValidatorError(errors));
        }
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
        const requestUrl = this.providerActionHandlers.getRequestUrl(
            key, data,
            optionsList,
            ProviderActionEnum.Action,
            useDefault
        );
        const requestOptions = this.providerActionHandlers.getRequestOptions(
            key, data,
            optionsList,
            ProviderActionEnum.Action,
            useDefault
        );
        let request = this.providerActionHandlers.getRequest(
            requestUrl,
            data,
            requestOptions,
            optionsList,
            ProviderActionEnum.Action,
            useDefault
        );
        if (!request) {
            request = this.httpClient.post<any>(
                requestUrl,
                data,
                requestOptions
            );
        }
        return request.pipe(
            map(responseData =>
                this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    ProviderActionEnum.Action,
                    useDefault
                )
            ),
            map(actionData => {
                if (options === undefined ||
                    options.globalEventIsActive !== false ||
                    options.globalEventIsActiveResolver !== undefined) {
                    if (options === undefined || options.globalEventIsActiveResolver === undefined ||
                        options.globalEventIsActiveResolver({
                            actionKey: key,
                            requestData: data,
                            responseData: actionData
                        }, ProviderActionEnum.Action)) {
                        this.action$.next({
                            actionKey: key,
                            requestData: data,
                            responseData: actionData
                        });
                    }
                }
                this.actionIsActive$.next(false);
                return actionData;
            })
        );
    }
    create<TProviderActionOptions extends IRestProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): ErrorObservable | Observable<TModel> {
        this.createIsActive$.next(true);
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        model = this.plainToClass(
            model,
            ProviderActionEnum.Create,
            options && options.classTransformOptions ?
                options.classTransformOptions :
                undefined
        );
        const errors: any = validateSync(model,
            options && options.classValidatorOptions ?
                options.classValidatorOptions :
                { validationError: { target: false } });
        if (errors.length > 0 && (!options || options.globalEventIsActive !== false)) {
            return _throw(new ValidatorError(errors));
        }
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
        const isCreate = this.providerActionHandlers.getRequestCreateType(
            optionsList,
            ProviderActionEnum.Create,
            useDefault
        ) === 'create';
        let object;

        if (isCreate === true) {
            object = this.classToPlain(
                model,
                ProviderActionEnum.Create,
                options && options.classTransformOptions ?
                    options.classTransformOptions :
                    undefined
            );
        } else {
            object = this.classToPlain(
                model,
                ProviderActionEnum.Append,
                options && options.classTransformOptions ?
                    options.classTransformOptions :
                    undefined
            );
        }
        const requestUrl = this.providerActionHandlers.getRequestUrl(
            undefined,
            object,
            optionsList,
            isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append,
            useDefault
        );
        const requestOptions = this.providerActionHandlers.getRequestOptions(
            undefined, object,
            optionsList,
            isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append,
            useDefault
        );
        let request = this.providerActionHandlers.getRequest(
            requestUrl,
            object,
            requestOptions,
            optionsList,
            isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append,
            useDefault
        );
        if (!request) {
            request = (options === undefined || options.useFakeHttpClient !== true ? this.httpClient : this.fakeHttpClient).
                post<any>(
                    requestUrl,
                    object,
                    requestOptions
                );
        }
        return request.pipe(
            map(responseData =>
                this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append,
                    useDefault
                )
            ),
            map(createdItem => {
                let createdModel: TModel;
                if (isCreate === true) {
                    createdModel = this.plainToClass(
                        createdItem,
                        ProviderActionEnum.Create,
                        options && options.classTransformOptions ?
                            options.classTransformOptions :
                            undefined
                    );
                    this.items$.next(this.items$.getValue().unshift(createdModel));
                } else {
                    createdModel = this.plainToClass(
                        createdItem,
                        ProviderActionEnum.Append,
                        options && options.classTransformOptions ?
                            options.classTransformOptions :
                            undefined
                    );
                    this.items$.next(this.items$.getValue().push(createdModel));
                }
                const paginationMeta = this.paginationMeta$.getValue();
                this.calcPaginationMeta({ totalResults: paginationMeta.totalResults + 1 });
                this.reconfigItems();
                if (options === undefined ||
                    options.globalEventIsActive !== false ||
                    options.globalEventIsActiveResolver !== undefined) {
                    if (options === undefined || options.globalEventIsActiveResolver === undefined ||
                        options.globalEventIsActiveResolver(createdModel,
                            isCreate ? ProviderActionEnum.Create : ProviderActionEnum.Append
                        )) {
                        (isCreate ? this.create$ : this.append$).next(createdModel);
                    }
                }
                this.createIsActive$.next(false);
                return createdModel;
            })
        );
    }
    private _update<TProviderActionOptions extends IRestProviderActionOptions>(
        key: number | string,
        model: TModel,
        isUpdate: boolean,
        options?: TProviderActionOptions
    ): ErrorObservable | Observable<TModel> {
        this.updateIsActive$.next(true);
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        model = this.plainToClass(
            model,
            ProviderActionEnum.Update,
            options && options.classTransformOptions ?
                options.classTransformOptions :
                undefined
        );
        const errors: any = validateSync(model,
            options && options.classValidatorOptions ?
                options.classValidatorOptions :
                { validationError: { target: false } });
        if (errors.length > 0 && (!options || options.globalEventIsActive !== false)) {
            return _throw(new ValidatorError(errors));
        }
        let object;
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];

        let request;
        if (isUpdate === true) {
            object = this.classToPlain(
                model,
                ProviderActionEnum.Update,
                options && options.classTransformOptions ?
                    options.classTransformOptions :
                    undefined
            );
            const requestUrl = this.providerActionHandlers.getRequestUrl(
                key,
                object,
                optionsList,
                ProviderActionEnum.Update,
                useDefault
            );
            const requestOptions = this.providerActionHandlers.getRequestOptions(
                key, object,
                optionsList,
                ProviderActionEnum.Update,
                useDefault
            );
            request = this.providerActionHandlers.getRequest(
                requestUrl,
                object,
                requestOptions,
                optionsList,
                ProviderActionEnum.Update,
                useDefault
            );
            if (!request) {
                request = (options === undefined || options.useFakeHttpClient !== true ? this.httpClient : this.fakeHttpClient).
                    put<any>(
                        requestUrl,
                        object,
                        requestOptions
                    );
            }
        } else {
            object = this.classToPlain(
                model,
                ProviderActionEnum.Patch,
                options && options.classTransformOptions ?
                    options.classTransformOptions :
                    undefined
            );
            const requestUrl = this.providerActionHandlers.getRequestUrl(
                key,
                object,
                optionsList,
                ProviderActionEnum.Patch,
                useDefault
            );
            const requestOptions = this.providerActionHandlers.getRequestOptions(
                key, object,
                optionsList,
                ProviderActionEnum.Patch,
                useDefault
            );
            request = this.providerActionHandlers.getRequest(
                requestUrl,
                object,
                requestOptions,
                optionsList,
                ProviderActionEnum.Patch,
                useDefault
            );
            if (!request) {
                request = this.httpClient.patch<any>(
                    requestUrl,
                    object,
                    requestOptions
                );
            }
        }
        return request.pipe(
            map(responseData =>
                this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    isUpdate ? ProviderActionEnum.Update : ProviderActionEnum.Patch,
                    useDefault
                )
            ),
            map(updatedItem => {
                const updatedModel = this.plainToClass(
                    updatedItem,
                    isUpdate ? ProviderActionEnum.Update : ProviderActionEnum.Patch
                );
                const index = this.items$.getValue().findIndex(eachModel => eachModel.id === key);
                if (index !== -1) {
                    this.items$.next(this.items$.getValue().set(index, updatedModel));
                    this.reconfigItems();
                }
                if (options === undefined ||
                    options.globalEventIsActive !== false ||
                    options.globalEventIsActiveResolver !== undefined) {
                    if (options === undefined || options.globalEventIsActiveResolver === undefined ||
                        options.globalEventIsActiveResolver(updatedModel,
                            isUpdate ? ProviderActionEnum.Update : ProviderActionEnum.Patch
                        )) {
                        (isUpdate ? this.update$ : this.patch$).next(updatedModel);
                    }
                }
                this.updateIsActive$.next(false);
                return updatedModel;
            })
        );
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
        this.loadIsActive$.next(true);
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
        const requestUrl = this.providerActionHandlers.getRequestUrl(
            key,
            undefined,
            optionsList,
            ProviderActionEnum.Load,
            useDefault
        );
        const requestOptions = this.providerActionHandlers.getRequestOptions(
            key, undefined,
            optionsList,
            ProviderActionEnum.Load,
            useDefault
        );
        let request = this.providerActionHandlers.getRequest(
            requestUrl,
            undefined,
            requestOptions,
            optionsList,
            ProviderActionEnum.Load,
            useDefault
        );
        if (!request) {
            request = (options === undefined || options.useFakeHttpClient !== true ? this.httpClient : this.fakeHttpClient).
                get<any>(
                    requestUrl,
                    requestOptions
                );
        }
        return request.pipe(
            map(responseData =>
                this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    ProviderActionEnum.Load,
                    useDefault
                )
            ),
            map(loadedItem => {
                const loadedModel = this.plainToClass(
                    loadedItem,
                    ProviderActionEnum.Load,
                    options && options.classTransformOptions ?
                        options.classTransformOptions :
                        undefined
                );
                const index = this.items$.getValue().findIndex(eachModel => eachModel.id === key);
                if (index !== -1) {
                    this.items$.next(this.items$.getValue().set(index, loadedModel));
                }
                if (options === undefined ||
                    options.globalEventIsActive !== false ||
                    options.globalEventIsActiveResolver !== undefined) {
                    if (options === undefined || options.globalEventIsActiveResolver === undefined ||
                        options.globalEventIsActiveResolver(loadedModel, ProviderActionEnum.Load)) {
                        this.load$.next(loadedModel);
                    }
                }
                this.loadIsActive$.next(false);
                return loadedModel;
            })
        );
    }
    delete<TProviderActionOptions extends IRestProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ) {
        this.deleteIsActive$.next(true);
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
        const requestUrl = this.providerActionHandlers.getRequestUrl(
            key,
            undefined,
            optionsList,
            ProviderActionEnum.Delete,
            useDefault
        );
        const requestOptions = this.providerActionHandlers.getRequestOptions(
            key, undefined,
            optionsList,
            ProviderActionEnum.Delete,
            useDefault
        );
        let request = this.providerActionHandlers.getRequest(
            requestUrl,
            undefined,
            requestOptions,
            optionsList,
            ProviderActionEnum.Delete,
            useDefault
        );
        if (!request) {
            request = (options === undefined || options.useFakeHttpClient !== true ? this.httpClient : this.fakeHttpClient).
                delete<any>(
                    requestUrl,
                    requestOptions
                );
        }
        return request.pipe(
            map(responseData =>
                this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    ProviderActionEnum.Delete,
                    useDefault
                )
            ),
            map(deleted => {
                const index = this.items$.getValue().findIndex(eachModel => eachModel.id === key);
                const deletedModel = this.items$.getValue().get(index);
                if (index !== -1) {
                    this.items$.next(this.items$.getValue().delete(index));
                    const paginationMeta = this.paginationMeta$.getValue();
                    const newPaginationMeta = this.calcPaginationMeta({
                        totalResults: paginationMeta.totalResults === 0 ? 0 : paginationMeta.totalResults - 1
                    });
                    this.reconfigItems();
                }
                if (options === undefined ||
                    options.globalEventIsActive !== false ||
                    options.globalEventIsActiveResolver !== undefined) {
                    if (options === undefined || options.globalEventIsActiveResolver === undefined ||
                        options.globalEventIsActiveResolver(deletedModel, ProviderActionEnum.Delete)) {
                        this.delete$.next(deletedModel);
                    }
                }
                this.deleteIsActive$.next(false);
                return deletedModel;
            })
        );
    }
    reloadAll() {
        this._loadAll(this.filter, this.prevOptions).pipe(first()).subscribe();
    }
    loadAll<TProviderActionOptions extends IRestProviderActionOptions>(
        filter?: any,
        options?: TProviderActionOptions,
    ) {
        const searchText = this.filter.searchText;
        delete this.filter.searchText;

        this.calcPaginationMeta({
            curPage: filter[this.restOptions.pageQueryParam] || filter.curPage,
            perPage: filter[this.restOptions.limitQueryParam] || filter.perPage
        });

        if (this.filter[this.restOptions.searchTextQueryParam] === undefined && searchText) {
            this.filter[this.restOptions.searchTextQueryParam] = searchText;
        }
        return this._loadAll(filter, options);
    }
    private _loadAll<TProviderActionOptions extends IRestProviderActionOptions>(
        filter?: any,
        options?: TProviderActionOptions,
    ) {
        this.loadAllIsActive$.next(true);
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
        const paginationMeta = this.paginationMeta$.getValue();
        this.filter = filter ? filter : {};
        this.prevOptions = options;
        let requestUrl = this.providerActionHandlers.getRequestUrl(
            undefined,
            this.filter,
            optionsList,
            ProviderActionEnum.LoadAll,
            useDefault
        );
        this.filter[this.restOptions.pageQueryParam] = paginationMeta.curPage;
        this.filter[this.restOptions.limitQueryParam] = paginationMeta.perPage;
        requestUrl = this.providerActionHandlers.getRequestQuery(
            requestUrl,
            this.filter,
            optionsList,
            ProviderActionEnum.LoadAll,
            useDefault
        );
        const requestOptions = this.providerActionHandlers.getRequestOptions(
            undefined,
            this.filter,
            optionsList,
            ProviderActionEnum.LoadAll,
            useDefault
        );
        let request = this.providerActionHandlers.getRequest(
            requestUrl,
            undefined,
            requestOptions,
            optionsList,
            ProviderActionEnum.LoadAll,
            useDefault
        );
        if (!request) {
            request = (options === undefined || options.useFakeHttpClient !== true ? this.httpClient : this.fakeHttpClient).
                get<any>(
                    requestUrl,
                    requestOptions
                );
        }
        return request.pipe(
            map(responseData => {
                const responsePaginationMeta = this.providerActionHandlers.getResponsePaginationMeta(
                    responseData,
                    optionsList,
                    ProviderActionEnum.LoadAll,
                    useDefault
                );
                if (responsePaginationMeta) {
                    this.calcPaginationMeta({
                        curPage: paginationMeta.curPage,
                        perPage: paginationMeta.perPage,
                        ...responsePaginationMeta
                    });
                } else {
                    this.calcPaginationMeta({
                        curPage: paginationMeta.curPage,
                        perPage: paginationMeta.perPage
                    });
                }
                return this.providerActionHandlers.getResponseData(
                    responseData,
                    optionsList,
                    ProviderActionEnum.LoadAll,
                    useDefault
                );
            }),
            map(loadedItems => {
                const loadedModels = loadedItems === undefined ? [] : loadedItems.map(loadedItem =>
                    this.plainToClass(
                        loadedItem,
                        ProviderActionEnum.LoadAll,
                        options && options.classTransformOptions ?
                            options.classTransformOptions :
                            undefined
                    )
                );
                this.items$.next(List(loadedModels));
                this.reconfigItems();
                if (options === undefined ||
                    options.globalEventIsActive !== false ||
                    options.globalEventIsActiveResolver !== undefined) {
                    if (options === undefined || options.globalEventIsActiveResolver === undefined ||
                        options.globalEventIsActiveResolver(loadedModels, ProviderActionEnum.LoadAll)) {
                        this.loadAll$.next(loadedModels);
                    }
                }
                this.loadAllIsActive$.next(false);
                return loadedModels;
            })
        );
    }
    reconfigItems() {
        const paginationMeta = this.paginationMeta$.getValue();

        if (paginationMeta.perPage === undefined) {
            throw new ProviderError('Not set perPage count');
        }
        this.items$.next(List(this.items$.getValue().take(paginationMeta.perPage)));
    }
}
