import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { plainToClassFromExist, classToPlainFromExist } from 'class-transformer';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IProviderOptions } from '../interfaces/provider-options';
import { IModel } from '../interfaces/model';
import { IPaginationMeta } from '../interfaces/pagination-meta';
import { PaginationMeta } from '../models/pagination-meta';
import { IProvider } from '../interfaces/provider';
import { List } from 'immutable';
import { IProviderActionOptions } from '../interfaces/provider-action-options';
import { IProviderActionActionModel } from '../interfaces/provider-action-action-model';
import { IFactoryModel } from '../interfaces/factory-model';
import { map } from 'rxjs/operators';

export class Provider<TModel extends IModel = any> implements IProvider<TModel> {

    filter?: any;
    autoload?: boolean;
    delay = 0;
    name: string;

    items$ = new Subject<TModel[]>();

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

    items: List<TModel> = List([]);

    protected loadAllOptions?: IProviderActionOptions;
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
        Object.keys(this.factoryModel.nested).forEach(key => {
            this.items.map(item => {
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
            });
        });
    }
    deleteNestedFactoryModel(data: any) {
        Object.keys(this.factoryModel.nested).forEach(key => {
            this.items.map(item => {
                if (item[key]) {
                    if (Array.isArray(item[key])) {
                        item[key] = item[key].filter((eachItem, index) => eachItem.id !== data.id);
                    } else {
                        item[key] = undefined;
                    }
                    this.update(item.id, item, { globalEventIsActive: false });
                }
            });
        });
    }
    plainToClass(data: any, action: ProviderActionEnum) {
        let model: TModel;
        if (!(data instanceof this.factoryModel)) {
            model = plainToClassFromExist(new this.factoryModel(), data) as TModel;
        } else {
            model = data as TModel;
        }
        return model;
    }
    classToPlain(model: TModel, action: ProviderActionEnum) {
        return classToPlainFromExist(model, {});
    }
    action<TProviderActionOptions extends IProviderActionOptions>(
        key: string,
        data?: any,
        options?: TProviderActionOptions
    ) {
        return new Promise<any>((resolve, reject) =>
            setTimeout(() => resolve(data), this.delay)
        );
    }
    save<TProviderActionOptions extends IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ) {
        if (model.id === undefined) {
            return this.create(model, options);
        }
        return this.update(model.id, model, options);
    }
    create<TProviderActionOptions extends IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ) {
        return new Promise<any>((resolve, reject) =>
            setTimeout(() => resolve(model), this.delay)
        );
    }
    append<TProviderActionOptions extends IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ) {
        return new Promise<any>((resolve, reject) =>
            setTimeout(() => resolve(model), this.delay)
        );
    }
    update<TProviderActionOptions extends IProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ) {
        return new Promise<any>((resolve, reject) =>
            setTimeout(() => resolve(model), this.delay)
        );
    }
    patch<TProviderActionOptions extends IProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ) {
        return new Promise<any>((resolve, reject) =>
            setTimeout(() => resolve(model), this.delay)
        );
    }
    delete<TProviderActionOptions extends IProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ) {
        return new Promise<any>((resolve, reject) => {
            const newModel = this.plainToClass({ id: key }, ProviderActionEnum.Delete);
            setTimeout(() => resolve(newModel), this.delay);
        });
    }
    load<TProviderActionOptions extends IProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ) {
        return new Promise<any>((resolve, reject) => {
            const newModel = this.plainToClass({ id: key }, ProviderActionEnum.Delete);
            setTimeout(() => resolve(newModel), this.delay);
        });
    }
    loadAll<TProviderActionOptions extends IProviderActionOptions>(
        filter?: any,
        options?: TProviderActionOptions
    ) {
        return new Promise<any>((resolve, reject) => {
            const newModels = [this.plainToClass({}, ProviderActionEnum.Delete)];
            setTimeout(() => resolve(newModels), this.delay);
        });
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
        this.calcPaginationMeta(paginationMeta);
        return this.paginationMeta$.getValue();
    }
    calcPaginationMeta(newPaginationMeta: IPaginationMeta): IPaginationMeta {
        const paginationMeta = this.paginationMeta$.getValue();
        if (newPaginationMeta.perPage !== undefined) {
            paginationMeta.perPage = newPaginationMeta.perPage;
        }
        if (newPaginationMeta.totalResults !== undefined) {
            paginationMeta.totalResults = newPaginationMeta.totalResults;
            paginationMeta.totalPages = Math.ceil(newPaginationMeta.totalResults / paginationMeta.perPage);
        }
        if (newPaginationMeta.curPage !== undefined) {
            paginationMeta.curPage = newPaginationMeta.curPage;
        }
        if (newPaginationMeta.totalPages !== undefined) {
            paginationMeta.totalResults = undefined;
            paginationMeta.totalPages = newPaginationMeta.totalPages;
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
    checkFilterAndOptions() {

    }
    setOptions(options: IProviderOptions<TModel>) { }
    reconfigItems() { }
}