import { Injector } from '@angular/core';
import { Provider } from './provider';
import { HttpClient } from '@angular/common/http';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IProviderOptions } from '../interfaces/provider-options';
import { IRestProviderOptions } from '../interfaces/rest-provider-options';
import { validate, validateSync } from 'class-validator';
import { ValidatorError } from '../exceptions/validator.error';
import { List } from 'immutable';
import { IModel } from '../interfaces/model';
import { IRestProviderActionOptions } from '../interfaces/rest-provider-action-options';
import { map, first } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { IHttpClient } from '../interfaces/http-client';
import { IRestProviderActionHandlers } from '../interfaces/rest-provider-action-handlers';
import { RestProviderActionHandlers } from './rest-provider-action-handlers';
import { FakeHttpClient } from '../utils/fake-http-client';
import { IFactoryModel } from '../interfaces/factory-model';
import { ProviderError } from '../exceptions/provider.error';
import { _throw } from 'rxjs/observable/throw';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
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
        options = { ...this.options, ...options };
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
            this.loadAll(this.filter, this.loadAllOptions).pipe(first()).subscribe();
        }
    }
    action<TProviderActionOptions extends IRestProviderActionOptions>(
        key: string,
        data?: any,
        options?: TProviderActionOptions
    ): ErrorObservable | Observable<TModel> {
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        this.actionIsActive$.next(true);
        const errors = validateSync(data,
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
                if (options === undefined || options.globalEventIsActive !== false) {
                    this.action$.next({
                        actionKey: key,
                        requestData: data,
                        responseData: actionData
                    });
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
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        model = this.plainToClass(
            model,
            ProviderActionEnum.Create,
            options && options.classTransformOptions ?
                options.classTransformOptions :
                undefined
        );
        this.createIsActive$.next(true);
        const errors = validateSync(model,
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
                if (options === undefined || options.globalEventIsActive !== false) {
                    (isCreate ? this.create$ : this.append$).next(createdModel);
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
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        model = this.plainToClass(
            model,
            ProviderActionEnum.Update,
            options && options.classTransformOptions ?
                options.classTransformOptions :
                undefined
        );
        this.updateIsActive$.next(true);
        const errors = validateSync(model,
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
                if (options === undefined || options.globalEventIsActive !== false) {
                    (isUpdate ? this.update$ : this.patch$).next(updatedModel);
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
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
        this.loadIsActive$.next(true);
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
                if (options === undefined || options.globalEventIsActive !== false) {
                    this.load$.next(loadedModel);
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
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
        this.deleteIsActive$.next(true);
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
                if (options === undefined || options.globalEventIsActive !== false) {
                    this.delete$.next(deletedModel);
                }
                this.deleteIsActive$.next(false);
                return deletedModel;
            })
        );
    }
    reloadAll() {
        this.loadAll(this.filter, this.loadAllOptions).pipe(first()).subscribe();
    }
    loadAll<TProviderActionOptions extends IRestProviderActionOptions>(
        filter?: any,
        options?: TProviderActionOptions
    ) {
        const useDefault = (options && options.useFakeHttpClient === true) || this.httpClient instanceof FakeHttpClient;

        this.filter = filter;
        this.loadAllOptions = options;
        const optionsList = [{ actionOptions: options }, this.options as IRestProviderOptions<TModel>];
        this.loadAllIsActive$.next(true);
        let requestUrl = this.providerActionHandlers.getRequestUrl(
            undefined,
            filter,
            optionsList,
            ProviderActionEnum.LoadAll,
            useDefault
        );
        requestUrl = requestUrl + this.providerActionHandlers.getRequestLoadAllSearchQuery(
            requestUrl,
            filter,
            optionsList,
            ProviderActionEnum.LoadAll,
            useDefault
        );
        requestUrl = requestUrl + this.providerActionHandlers.getRequestLoadAllPaginationQuery(
            requestUrl,
            this.paginationMeta$.getValue(),
            optionsList,
            ProviderActionEnum.LoadAll,
            useDefault
        );
        const requestOptions = this.providerActionHandlers.getRequestOptions(
            undefined,
            filter,
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
                const responseLoadAllTotalCount = this.providerActionHandlers.getResponseLoadAllTotalCount(
                    responseData,
                    optionsList,
                    ProviderActionEnum.LoadAll,
                    useDefault
                );
                this.calcPaginationMeta({
                    totalResults: isNaN(responseLoadAllTotalCount) ? 10000 : responseLoadAllTotalCount
                });
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
                if (options === undefined || options.globalEventIsActive !== false) {
                    this.loadAll$.next(loadedModels);
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
