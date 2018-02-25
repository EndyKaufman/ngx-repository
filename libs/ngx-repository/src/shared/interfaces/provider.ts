import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPaginationMeta } from './pagination-meta';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IProviderOptions } from './provider-options';
import { Subject } from 'rxjs/Subject';
import { IModel } from './model';
import { List } from 'immutable';
import { IProviderActionOptions } from './provider-action-options';
import { IProviderActionActionModel } from './provider-action-action-model';

export interface IProvider<TModel> {
    name: string;
    items: List<TModel>;
    items$: Subject<TModel[]>;
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
    plainToClass(data: any, action: ProviderActionEnum);
    classToPlain(model: TModel, action: ProviderActionEnum);
    action<TProviderActionOptions= IProviderActionOptions>(
        key: string,
        data?: any,
        options?: TProviderActionOptions
    ): Promise<any>;
    save<TProviderActionOptions= IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Promise<TModel>;
    create<TProviderActionOptions= IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Promise<TModel>;
    append<TProviderActionOptions= IProviderActionOptions>(
        model: TModel,
        options?: TProviderActionOptions
    ): Promise<TModel>;
    patch<TProviderActionOptions= IProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ): Promise<TModel>;
    update<TProviderActionOptions= IProviderActionOptions>(
        key: number | string,
        model: TModel,
        options?: TProviderActionOptions
    ): Promise<TModel>;
    delete<TProviderActionOptions= IProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ): Promise<TModel>;
    load<TProviderActionOptions= IProviderActionOptions>(
        key: number | string,
        options?: TProviderActionOptions
    ): Promise<TModel>;
    loadAll<TProviderActionOptions= IProviderActionOptions>(
        filter?: any,
        options?: TProviderActionOptions
    ): Promise<TModel[]>;
    calcPaginationMetaByOptions(options: IProviderOptions<TModel>): IPaginationMeta;
    calcPaginationMeta(newPaginationMeta: IPaginationMeta): IPaginationMeta;
    setOptions(options: IProviderOptions<TModel>);
    reconfigItems();
}
