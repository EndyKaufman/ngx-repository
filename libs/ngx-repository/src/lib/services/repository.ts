import { Injector, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IFactoryModel } from '../interfaces/factory-model';
import { IMockProviderOptions } from '../interfaces/mock-provider-options';
import { IModel } from '../interfaces/model';
import { IProvider } from '../interfaces/provider';
import { IProviderOptions } from '../interfaces/provider-options';
import { IRepository } from '../interfaces/repository';
import { IRestProviderActionOptions } from '../interfaces/rest-provider-action-options';
import { IRestProviderOptions } from '../interfaces/rest-provider-options';
import { MockProvider } from '../providers/mock.provider';
import { Provider } from '../providers/provider';
import { RestProvider } from '../providers/rest.provider';

export class Repository<TModel extends IModel = any> implements IRepository<TModel>, OnDestroy {
  mockProvider?: IProvider<TModel>;
  restProvider?: IProvider<TModel>;

  protected root: Repository<IModel>;
  protected mockProviders: IProvider<TModel>[] = [];
  protected restProviders: IProvider<TModel>[] = [];

  get provider(): IProvider<TModel> {
    if (this._mockProviderIsActive && this.mockProvider !== undefined) {
      return this.mockProvider;
    }
    if (this._restProviderIsActive && this.restProvider !== undefined) {
      return this.restProvider;
    }
    return new Provider<TModel>(this.injector, this.factoryModel);
  }
  get paginationMeta$(): BehaviorSubject<any> {
    return this.provider.paginationMeta$;
  }
  get providers() {
    return [this.restProvider, ...this.restProviders, this.mockProvider, ...this.mockProviders];
  }
  get items() {
    return this.provider.items$.getValue().toArray();
  }
  get items$() {
    return this.provider.items$.pipe(map(items => items.toArray()));
  }
  private _mockProviderIsActive = false;
  private _restProviderIsActive = false;

  private destroyed$: Subject<boolean>;

  constructor(
    protected injector: Injector,
    protected factoryModel?: IFactoryModel<TModel>,
    protected factoryMockProvider?: {
      new (injector: Injector, factoryModel: IFactoryModel<TModel>, options: IMockProviderOptions<IModel>): IProvider<
        IModel
      >;
    },
    protected factoryRestProvider?: {
      new (injector: Injector, factoryModel: IFactoryModel<TModel>, options: IRestProviderOptions<IModel>): IProvider<
        IModel
      >;
    }
  ) {
    this.destroyed$ = new Subject<boolean>();
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  fork<TNewModel extends IModel = TModel>(
    newFactoryModel?: IFactoryModel<TNewModel>,
    newFactoryMockProvider?: {
      new (
        injector: Injector,
        factoryModel: IFactoryModel<TNewModel>,
        options: IMockProviderOptions<IModel>
      ): IProvider<IModel>;
    },
    newFactoryRestProvider?: {
      new (
        injector: Injector,
        factoryModel: IFactoryModel<TNewModel>,
        options: IRestProviderOptions<IModel>
      ): IProvider<IModel>;
    }
  ) {
    if (this.root !== undefined) {
      return this.root.fork<TNewModel>(newFactoryModel, newFactoryMockProvider, newFactoryRestProvider);
    }
    const newInstance = new Repository<TNewModel>(
      this.injector,
      newFactoryModel ? newFactoryModel : (this.factoryModel as any),
      newFactoryMockProvider ? newFactoryMockProvider : (this.factoryMockProvider as any),
      newFactoryRestProvider ? newFactoryRestProvider : (this.factoryRestProvider as any)
    );
    newInstance.root = this as Repository<IModel>;
    return newInstance;
  }
  useMock<TMockProviderOptions extends IMockProviderOptions<IModel>>(options?: TMockProviderOptions) {
    this._restProviderIsActive = false;
    this._mockProviderIsActive = true;
    if (this.mockProvider === undefined && options !== undefined) {
      this.mockProvider = (this.factoryMockProvider
        ? new this.factoryMockProvider(this.injector, this.factoryModel, options)
        : new MockProvider(this.injector, this.factoryModel, options)) as IProvider<TModel>;
      this.mockProvider.name = 'Mock#' + this.root.mockProviders.length.toString();
      if (this.root !== undefined) {
        this.root.subscribeToProvider(this.mockProvider);
        this.root.mockProviders.push(this.mockProvider);
      }
    } else {
      this.mockProvider.name = 'Mock#root';
      this.mockProvider.setOptions(options);
      this.subscribeToProvider(this.mockProvider);
    }
  }
  useRest<TMockProviderOptions extends IRestProviderOptions<IModel>>(options?: IRestProviderOptions<TModel>) {
    // tslint:disable-line
    this._restProviderIsActive = true;
    this._mockProviderIsActive = false;
    if (this.restProvider === undefined && options !== undefined) {
      this.restProvider = (this.factoryRestProvider
        ? new this.factoryRestProvider(this.injector, this.factoryModel, options)
        : new RestProvider(this.injector, this.factoryModel, options)) as IProvider<TModel>;
      this.restProvider.name = 'Rest#' + this.root.restProviders.length.toString();
      if (this.root !== undefined) {
        this.root.subscribeToProvider(this.restProvider);
        this.root.restProviders.push(this.restProvider);
      }
    } else {
      this.restProvider.name = 'Rest#root';
      this.restProvider.setOptions(options);
      this.subscribeToProvider(this.restProvider);
    }
  }
  subscribeToProvider(provider: IProvider<TModel>) {
    provider.create$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
      this.providers.forEach(eachProvider => {
        const options: IRestProviderOptions<TModel> = eachProvider ? eachProvider.getOptions() : undefined;
        if (
          eachProvider !== undefined &&
          eachProvider.name !== provider.name &&
          eachProvider.instanceofFactoryModel(item) &&
          (options === undefined ||
            (options.globalEventResolver === undefined || options.globalEventResolver(item, ProviderActionEnum.Create)))
        ) {
          eachProvider
            .create(item, { useFakeHttpClient: true, globalEventIsActive: false })
            .pipe(first())
            .subscribe();
        }
      });
    });
    provider.append$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
      this.providers.forEach(eachProvider => {
        const options: IRestProviderOptions<TModel> = eachProvider ? eachProvider.getOptions() : undefined;
        if (
          eachProvider !== undefined &&
          eachProvider.name !== provider.name &&
          eachProvider.instanceofFactoryModel(item) &&
          (options === undefined ||
            (options.globalEventResolver === undefined || options.globalEventResolver(item, ProviderActionEnum.Create)))
        ) {
          eachProvider
            .append(item, { useFakeHttpClient: true, globalEventIsActive: false })
            .pipe(first())
            .subscribe();
        }
      });
    });
    provider.update$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
      this.providers.forEach(eachProvider => {
        const options: IRestProviderOptions<TModel> = eachProvider ? eachProvider.getOptions() : undefined;
        if (eachProvider !== undefined && eachProvider.name !== provider.name) {
          if (
            eachProvider.instanceofFactoryModel(item) &&
            (options === undefined ||
              (options.globalEventResolver === undefined ||
                options.globalEventResolver(item, ProviderActionEnum.Update)))
          ) {
            eachProvider
              .update(item.id, item, { useFakeHttpClient: true, globalEventIsActive: false })
              .pipe(first())
              .subscribe();
          }
          if (eachProvider.instanceofNestedFactoryModel(item)) {
            eachProvider.updateNestedFactoryModel(item);
          }
        }
      });
    });
    provider.patch$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
      this.providers.forEach(eachProvider => {
        const options: IRestProviderOptions<TModel> = eachProvider ? eachProvider.getOptions() : undefined;
        if (eachProvider !== undefined && eachProvider.name !== provider.name) {
          if (
            eachProvider.instanceofFactoryModel(item) &&
            (options === undefined ||
              (options.globalEventResolver === undefined ||
                options.globalEventResolver(item, ProviderActionEnum.Patch)))
          ) {
            eachProvider
              .patch(item.id, item, { useFakeHttpClient: true, globalEventIsActive: false })
              .pipe(first())
              .subscribe();
          }
        }
      });
    });
    provider.delete$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
      this.providers.forEach(eachProvider => {
        const options: IRestProviderOptions<TModel> = eachProvider ? eachProvider.getOptions() : undefined;
        if (eachProvider !== undefined && eachProvider.name !== provider.name) {
          if (
            eachProvider.instanceofFactoryModel(item) &&
            (options === undefined ||
              (options.globalEventResolver === undefined ||
                options.globalEventResolver(item, ProviderActionEnum.Delete)))
          ) {
            eachProvider
              .delete(item.id, { useFakeHttpClient: true, globalEventIsActive: false })
              .pipe(first())
              .subscribe();
          }
          if (eachProvider.instanceofNestedFactoryModel(item)) {
            eachProvider.deleteNestedFactoryModel(item);
          }
        }
      });
    });
    provider.load$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
      this.providers.forEach(eachProvider => {
        const options: IRestProviderOptions<TModel> = eachProvider ? eachProvider.getOptions() : undefined;
        if (
          eachProvider !== undefined &&
          eachProvider.name !== provider.name &&
          eachProvider.instanceofFactoryModel(item) &&
          (options === undefined ||
            (options.globalEventResolver === undefined || options.globalEventResolver(item, ProviderActionEnum.Update)))
        ) {
          eachProvider
            .update(item.id, item, { useFakeHttpClient: true, globalEventIsActive: false })
            .pipe(first())
            .subscribe();
        }
      });
    });
    provider.loadAll$.pipe(takeUntil(this.destroyed$)).subscribe(items => {
      items.forEach(item =>
        this.providers.forEach(eachProvider => {
          const options: IRestProviderOptions<TModel> = eachProvider ? eachProvider.getOptions() : undefined;
          if (
            eachProvider !== undefined &&
            eachProvider.name !== provider.name &&
            eachProvider.instanceofFactoryModel(item) &&
            (options === undefined ||
              (options.globalEventResolver === undefined ||
                options.globalEventResolver(item, ProviderActionEnum.Update)))
          ) {
            eachProvider
              .update(item.id, item, { useFakeHttpClient: true, globalEventIsActive: false })
              .pipe(first())
              .subscribe();
          }
        })
      );
    });
  }
  setOptions(options: IProviderOptions<TModel>) {
    this.provider.setOptions(options);
  }
  action<TProviderActionOptions extends IRestProviderActionOptions>(
    key: string,
    data?: any,
    options?: TProviderActionOptions
  ): Observable<any> {
    return this.provider.action<TProviderActionOptions>(key, data, options).pipe(first());
  }
  save<TProviderActionOptions extends IRestProviderActionOptions>(
    model: TModel,
    options?: TProviderActionOptions
  ): Observable<TModel> {
    return this.provider.save<TProviderActionOptions>(model, options).pipe(first());
  }
  create<TProviderActionOptions extends IRestProviderActionOptions>(
    model: TModel,
    options?: TProviderActionOptions
  ): Observable<TModel> {
    return this.provider.create<TProviderActionOptions>(model, options).pipe(first());
  }
  update<TProviderActionOptions extends IRestProviderActionOptions>(
    key: number | string,
    model: TModel,
    options?: TProviderActionOptions
  ): Observable<TModel> {
    return this.provider.update<TProviderActionOptions>(key, model, options).pipe(first());
  }
  patch<TProviderActionOptions extends IRestProviderActionOptions>(
    key: number | string,
    model: TModel,
    options?: TProviderActionOptions
  ): Observable<TModel> {
    return this.provider.patch<TProviderActionOptions>(key, model, options).pipe(first());
  }
  load<TProviderActionOptions extends IRestProviderActionOptions>(
    key: number | string,
    options?: TProviderActionOptions
  ): Observable<TModel> {
    return this.provider.load<TProviderActionOptions>(key, options).pipe(first());
  }
  delete<TProviderActionOptions extends IRestProviderActionOptions>(
    key: number | string,
    options?: TProviderActionOptions
  ): Observable<TModel> {
    return this.provider.delete<TProviderActionOptions>(key, options).pipe(first());
  }
  reloadAll() {
    this.provider.reloadAll();
  }
  loadAll<TProviderActionOptions extends IRestProviderActionOptions>(
    filter?: any,
    options?: TProviderActionOptions
  ): Observable<TModel[]> {
    return this.provider.loadAll<TProviderActionOptions>(filter, options);
  }
  clone(model: TModel) {
    return this.provider.classToClass(model);
  }
}
