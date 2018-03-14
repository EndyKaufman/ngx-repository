import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPaginationMeta } from './pagination-meta';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IProviderOptions } from './provider-options';
import { Subject } from 'rxjs/Subject';
import { List } from 'immutable';
import { IProviderActionOptions } from './provider-action-options';
import { IProviderActionActionModel } from './provider-action-action-model';
import { Observable } from 'rxjs/Observable';
import { ClassTransformOptions } from 'class-transformer';

export interface IProvider<TModel> {
    name: string;
    items$: BehaviorSubject<List<TModel>>;
    action$: Subject<IProviderActionActionModel>;
    create$: Subject<TModel>;
    append$: Subject<TModel>;
    update$: Subject<TModel>;
    patch$: Subject<TModel>;
    delete$: Subject<TModel>;
    load$: Subject<TModel>;
    loadAll$: Subject<TModel[]>;
    actionIsActive$: BehaviorSubject<boolean>;
    createIsActive$: BehaviorSubject<boolean>;
    updateIsActive$: BehaviorSubject<boolean>;
    deleteIsActive$: BehaviorSubject<boolean>;
    loadIsActive$: BehaviorSubject<boolean>;
    loadAllIsActive$: BehaviorSubject<boolean>;
    paginationMeta$: BehaviorSubject<IPaginationMeta>;
    instanceofFactoryModel(data: any): boolean;
    instanceofNestedFactoryModel(data: any): boolean;
    updateNestedFactoryModel(data: any): void;
    deleteNestedFactoryModel(data: any): void;
    classToClass(model: TModel, classTransformOptions?: ClassTransformOptions);
    plainToClass(data: any, action: ProviderActionEnum, classTransformOptions?: ClassTransformOptions);
    classToPlain(model: TModel, action: ProviderActionEnum, classTransformOptions?: ClassTransformOptions);
    action<TProviderActionOptions= IProviderActionOptions>(
        key: string,
        data?: any,
        options?: TProviderActionOptions
    ): Observable<any>;
    save<TProviderActionOptions= IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel>;
    create<TProviderActionOptions= IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel>;
    append<TProviderActionOptions= IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel>;
    patch<TProviderActionOptions= IProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel>;
    update<TProviderActionOptions= IProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ): Observable<TModel>;
    delete<TProviderActionOptions= IProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ): Observable<TModel>;
    load<TProviderActionOptions= IProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ): Observable<TModel>;
    loadAll<TProviderActionOptions= IProviderActionOptions>(
        filter?: any,
        options?: TProviderActionOptions
    ): Observable<TModel[]>;
    reloadAll();
    calcPaginationMetaByOptions(options: IProviderOptions<TModel>): IPaginationMeta;
    calcPaginationMeta(newPaginationMeta: IPaginationMeta): IPaginationMeta;
    setOptions(options: IProviderOptions<TModel>);
    reconfigItems();
}
