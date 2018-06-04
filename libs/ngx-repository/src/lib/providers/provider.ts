import { Injector } from '@angular/core';
import { ClassTransformOptions, classToClass, classToPlainFromExist, plainToClassFromExist } from 'class-transformer';
import { List } from 'immutable';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IFactoryModel } from '../interfaces/factory-model';
import { IModel } from '../interfaces/model';
import { IPaginationMeta } from '../interfaces/pagination-meta';
import { IProvider } from '../interfaces/provider';
import { IProviderActionActionModel } from '../interfaces/provider-action-action-model';
import { IProviderActionOptions } from '../interfaces/provider-action-options';
import { IProviderOptions } from '../interfaces/provider-options';
import { PaginationMeta } from '../models/pagination-meta';
export class Provider<TModel extends IModel = any> implements IProvider<TModel> {

    filter?: any;
    autoload?: boolean;
    delay = 0;
    name: string;

    items$ = new BehaviorSubject<List<TModel>>(List([]));

    action$ = new Subject<IProviderActionActionModel>();
    create$ = new Subject<TModel>();
    append$ = new Subject<TModel>();
    update$ = new Subject<TModel>();
    patch$ = new Subject<TModel>();
    delete$ = new Subject<TModel>();
    load$ = new Subject<TModel>();
    loadAll$ = new Subject<TModel[]>();

    actionIsActive$ = new BehaviorSubject<boolean>(false);
    createIsActive$ = new BehaviorSubject<boolean>(false);
    updateIsActive$ = new BehaviorSubject<boolean>(false);
    deleteIsActive$ = new BehaviorSubject<boolean>(false);
    loadIsActive$ = new BehaviorSubject<boolean>(false);
    loadAllIsActive$ = new BehaviorSubject<boolean>(false);

    paginationMeta$ = new BehaviorSubject<IPaginationMeta>(new PaginationMeta());

    protected prevOptions?: IProviderActionOptions;
    protected destroy$: Subject<boolean> = new Subject();

    constructor(
        protected injector: Injector,
        protected factoryModel: IFactoryModel<TModel>
    ) {
    }
    instanceofFactoryModel(data: any) {
        return data instanceof this.factoryModel;
    }
    instanceofNestedFactoryModel(data: any) {
        return this.factoryModel &&
            this.factoryModel.nested &&
            Object.keys(this.factoryModel.nested).
                filter(key => data instanceof this.factoryModel.nested[key]).length > 0;
    }
    updateNestedFactoryModel(data: any) {
        Object.keys(this.factoryModel.nested).forEach(key =>
            this.items$.next(
                this.items$.getValue().map(item => {
                    if (item[key]) {
                        if (Array.isArray(item[key])) {
                            item[key].forEach((eachItem, index) => {
                                if (eachItem.id === data.id) {
                                    item[key][index] = data;
                                }
                            });
                        } else {
                            item[key] = data;
                        }
                        this.update(item.id, item, { globalEventIsActive: false });
                    }
                    return item;
                }).toList()
            )
        );
    }
    deleteNestedFactoryModel(data: any) {
        Object.keys(this.factoryModel.nested).forEach(key =>
            this.items$.next(
                this.items$.getValue().map(item => {
                    if (item[key]) {
                        if (Array.isArray(item[key])) {
                            item[key] = item[key].filter(eachItem => eachItem.id !== data.id);
                        } else {
                            item[key] = undefined;
                        }
                        this.update(item.id, item, { globalEventIsActive: false });
                    }
                    return item;
                }).toList()
            )
        );
    }
    // tslint
    plainToClass(data: any, action: ProviderActionEnum, classTransformOptions?: ClassTransformOptions) {
        let model: TModel;
        if (!(data instanceof this.factoryModel)) {
            model = plainToClassFromExist(new this.factoryModel(), data, classTransformOptions) as TModel;
        } else {
            model = data as TModel;
        }
        return model;
    }
    classToPlain(model: TModel, action: ProviderActionEnum, classTransformOptions?: ClassTransformOptions) {
        return classToPlainFromExist(model, {}, classTransformOptions);
    }
    classToClass(model: TModel, classTransformOptions?: ClassTransformOptions) {
        return classToClass(model, classTransformOptions);
    }
    action<TProviderActionOptions extends IProviderActionOptions>(
        key: string,
        data?: any,
        options?: TProviderActionOptions
    ): Observable<any> {
        return of(data).pipe(delay(this.delay));
    }
    save<TProviderActionOptions extends IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel> {
        if (model.id === undefined) {
            return this.create(model, options);
        }
        return this.update(model.id, model, options);
    }
    create<TProviderActionOptions extends IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel> {
        return of(model).pipe<TModel>(delay(this.delay));
    }
    append<TProviderActionOptions extends IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel> {
        return of(model).pipe<TModel>(delay(this.delay));
    }
    update<TProviderActionOptions extends IProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel> {
        return of(model).pipe<TModel>(delay(this.delay));
    }
    patch<TProviderActionOptions extends IProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel> {
        return of(model).pipe<TModel>(delay(this.delay));
    }
    delete<TProviderActionOptions extends IProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ): Observable<TModel> {
        const newModel = this.plainToClass(
            { id: key },
            ProviderActionEnum.Delete,
            options && options.classTransformOptions ?
                options.classTransformOptions :
                undefined
        );
        return of(newModel).pipe<TModel>(delay(this.delay));
    }
    load<TProviderActionOptions extends IProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ): Observable<TModel> {
        const newModel = this.plainToClass(
            { id: key },
            ProviderActionEnum.Delete,
            options && options.classTransformOptions ?
                options.classTransformOptions :
                undefined
        );
        return of(newModel).pipe<TModel>(delay(this.delay));
    }
    loadAll<TProviderActionOptions extends IProviderActionOptions>(
        filter?: any,
        options?: TProviderActionOptions
    ): Observable<TModel[]> {
        const newModels = [this.plainToClass(
            {},
            ProviderActionEnum.Delete,
            options && options.classTransformOptions ?
                options.classTransformOptions :
                undefined
        )];
        return of(newModels).pipe<TModel[]>(delay(this.delay));
    }
    calcPaginationMetaByOptions(options: IProviderOptions<TModel>): IPaginationMeta {
        const paginationMeta = this.paginationMeta$.getValue();
        paginationMeta.totalResults =
            (
                options === undefined ||
                options.paginationMeta === undefined ||
                options.paginationMeta.totalResults === undefined
            ) ? paginationMeta.totalResults : options.paginationMeta.totalResults;
        paginationMeta.perPage =
            (
                options === undefined ||
                options.paginationMeta === undefined ||
                options.paginationMeta.perPage === undefined
            ) ? paginationMeta.perPage : options.paginationMeta.perPage;
        paginationMeta.curPage =
            (
                options === undefined ||
                options.paginationMeta === undefined ||
                options.paginationMeta.curPage === undefined
            ) ? paginationMeta.curPage : options.paginationMeta.curPage;
        paginationMeta.perPage = paginationMeta.perPage === undefined ? 10 : paginationMeta.perPage;
        paginationMeta.curPage = paginationMeta.curPage === undefined ? 1 : paginationMeta.curPage;
        return this.calcPaginationMeta(paginationMeta);
    }
    calcPaginationMeta(newPaginationMeta: IPaginationMeta): IPaginationMeta {
        const paginationMeta = this.paginationMeta$.getValue();
        if (newPaginationMeta.perPage !== undefined) {
            paginationMeta.perPage = newPaginationMeta.perPage;
        }
        if (newPaginationMeta.totalResults !== undefined) {
            paginationMeta.totalResults = newPaginationMeta.totalResults;
            paginationMeta.totalPages = Math.ceil(newPaginationMeta.totalResults / paginationMeta.perPage);
        } else {
            if (newPaginationMeta.totalPages !== undefined) {
                paginationMeta.totalResults = undefined;
                paginationMeta.totalPages = newPaginationMeta.totalPages;
            }
        }
        if (newPaginationMeta.curPage !== undefined) {
            paginationMeta.curPage = newPaginationMeta.curPage;
        }
        if (paginationMeta.totalPages < paginationMeta.curPage) {
            paginationMeta.curPage = paginationMeta.totalPages;
        }
        if (paginationMeta.curPage === 0) {
            paginationMeta.curPage = 1;
        }
        this.paginationMeta$.next(paginationMeta);
        return this.paginationMeta$.getValue();
    }
    reloadAll() { }
    checkFilterAndOptions() { }
    setOptions(options: IProviderOptions<TModel>) { }
    getOptions(): IProviderOptions<TModel> {
        return {};
    }
    reconfigItems() { }
}
