import { BehaviorSubject, Observable } from 'rxjs';
import { IRestProviderActionOptions } from './rest-provider-action-options';

export interface IRepository<TModel> {
  items: TModel[];
  items$: Observable<TModel[]>;
  paginationMeta$: BehaviorSubject<any>;
  action<TProviderActionOptions extends IRestProviderActionOptions>(
    key: string,
    data?: any,
    options?: TProviderActionOptions
  ): Observable<any>;
  save<TProviderActionOptions extends IRestProviderActionOptions>(
    model: TModel,
    options?: TProviderActionOptions
  ): Observable<TModel>;
  create<TProviderActionOptions extends IRestProviderActionOptions>(
    model: TModel,
    options?: TProviderActionOptions
  ): Observable<TModel>;
  update<TProviderActionOptions extends IRestProviderActionOptions>(
    key: number | string,
    model: TModel,
    options?: TProviderActionOptions
  ): Observable<TModel>;
  patch<TProviderActionOptions extends IRestProviderActionOptions>(
    key: number | string,
    model: TModel,
    options?: TProviderActionOptions
  ): Observable<TModel>;
  load<TProviderActionOptions extends IRestProviderActionOptions>(
    key: number | string,
    options?: TProviderActionOptions
  ): Observable<TModel>;
  delete<TProviderActionOptions extends IRestProviderActionOptions>(
    key: number | string,
    options?: TProviderActionOptions
  ): Observable<TModel>;
  reloadAll(): void;
  loadAll<TProviderActionOptions extends IRestProviderActionOptions>(
    filter?: any,
    options?: TProviderActionOptions
  ): Observable<TModel[]>;
  clone(model: TModel): TModel;
}
