import { OnDestroy } from '@angular/core';
import { MockProvider } from '../providers/mock.provider';
import { RestProvider } from '../providers/rest.provider';
import { Provider } from '../providers/provider';
import { Injector } from '@angular/core';
import { IModel } from '../interfaces/model';
import { IMockProviderOptions } from '../interfaces/mock-provider-options';
import { IRestProviderOptions } from '../interfaces/rest-provider-options';
import { IProviderOptions } from '../interfaces/provider-options';
import { IProvider } from '../interfaces/provider';
import { Subject } from 'rxjs/Subject';
import { takeUntil, first } from 'rxjs/operators';
import { IFactoryModel } from '../interfaces/factory-model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Repository<TModel extends IModel = any> implements OnDestroy {

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
    private _mockProviderIsActive = false;
    private _restProviderIsActive = false;

    private destroyed$: Subject<boolean>;

    constructor(
        protected injector: Injector,
        protected factoryModel?: IFactoryModel<TModel>,
        protected factoryMockProvider?: {
            new(
                injector: Injector,
                factoryModel: IFactoryModel<TModel>,
                options: IMockProviderOptions<IModel>
            ): IProvider<IModel>;
        },
        protected factoryRestProvider?: {
            new(
                injector: Injector,
                factoryModel: IFactoryModel<TModel>,
                options: IRestProviderOptions<IModel>
            ): IProvider<IModel>;
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
            new(
                injector: Injector,
                factoryModel: IFactoryModel<TNewModel>,
                options: IMockProviderOptions<IModel>
            ): IProvider<IModel>;
        },
        newFactoryRestProvider?: {
            new(
                injector: Injector,
                factoryModel: IFactoryModel<TNewModel>,
                options: IRestProviderOptions<IModel>
            ): IProvider<IModel>;
        }
    ) {
        if (this.root !== undefined) {
            return this.root.fork<TNewModel>(
                newFactoryModel,
                newFactoryMockProvider,
                newFactoryRestProvider
            );
        }
        const newInstance = new Repository<TNewModel>(
            this.injector,
            newFactoryModel ? newFactoryModel : this.factoryModel as any,
            newFactoryMockProvider ? newFactoryMockProvider : this.factoryMockProvider as any,
            newFactoryRestProvider ? newFactoryRestProvider : this.factoryRestProvider as any
        );
        newInstance.root = this as Repository<IModel>;
        return newInstance;
    }
    useMock<TMockProviderOptions extends IMockProviderOptions<IModel>>(options?: TMockProviderOptions) {
        this._restProviderIsActive = false;
        this._mockProviderIsActive = true;
        if (this.mockProvider === undefined && options !== undefined) {
            this.mockProvider = (this.factoryMockProvider ? new this.factoryMockProvider(
                this.injector,
                this.factoryModel,
                options
            ) : new MockProvider(
                this.injector,
                this.factoryModel,
                options
            )) as IProvider<TModel>;
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
    useRest<TMockProviderOptions extends IRestProviderOptions<IModel>>(options?: IRestProviderOptions<TModel>) {  // tslint:disable-line
        this._restProviderIsActive = true;
        this._mockProviderIsActive = false;
        if (this.restProvider === undefined && options !== undefined) {
            this.restProvider = (this.factoryRestProvider ? new this.factoryRestProvider(
                this.injector,
                this.factoryModel,
                options
            ) : new RestProvider(
                this.injector,
                this.factoryModel,
                options
            )) as IProvider<TModel>;
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
                if (
                    eachProvider !== undefined &&
                    eachProvider.name !== provider.name &&
                    eachProvider.instanceofFactoryModel(item)
                ) {
                    eachProvider.create(item,
                        { useFakeHttpClient: true, globalEventIsActive: false }
                    ).pipe(first()).subscribe();
                }
            });
        });
        provider.append$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
            this.providers.forEach(eachProvider => {
                if (
                    eachProvider !== undefined &&
                    eachProvider.name !== provider.name &&
                    eachProvider.instanceofFactoryModel(item)
                ) {
                    eachProvider.append(item,
                        { useFakeHttpClient: true, globalEventIsActive: false }
                    ).pipe(first()).subscribe();
                }
            });
        });
        provider.update$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
            this.providers.forEach(eachProvider => {
                if (
                    eachProvider !== undefined &&
                    eachProvider.name !== provider.name
                ) {
                    if (eachProvider.instanceofFactoryModel(item)) {
                        eachProvider.update(item.id, item,
                            { useFakeHttpClient: true, globalEventIsActive: false }
                        ).pipe(first()).subscribe();
                    }
                    if (eachProvider.instanceofNestedFactoryModel(item)) {
                        eachProvider.updateNestedFactoryModel(item);
                    }
                }
            });
        });
        provider.patch$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
            this.providers.forEach(eachProvider => {
                if (
                    eachProvider !== undefined &&
                    eachProvider.name !== provider.name
                ) {
                    if (eachProvider.instanceofFactoryModel(item)) {
                        eachProvider.patch(item.id, item,
                            { useFakeHttpClient: true, globalEventIsActive: false }
                        ).pipe(first()).subscribe();
                    }
                }
            });
        });
        provider.delete$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
            this.providers.forEach(eachProvider => {
                if (
                    eachProvider !== undefined &&
                    eachProvider.name !== provider.name
                ) {
                    if (eachProvider.instanceofFactoryModel(item)) {
                        eachProvider.delete(item.id,
                            { useFakeHttpClient: true, globalEventIsActive: false }
                        ).pipe(first()).subscribe();
                    }
                    if (eachProvider.instanceofNestedFactoryModel(item)) {
                        eachProvider.deleteNestedFactoryModel(item);
                    }
                }
            });
        });
        provider.load$.pipe(takeUntil(this.destroyed$)).subscribe(item => {
            this.providers.forEach(eachProvider => {
                if (
                    eachProvider !== undefined &&
                    eachProvider.name !== provider.name &&
                    eachProvider.instanceofFactoryModel(item)
                ) {
                    eachProvider.update(item.id, item,
                        { useFakeHttpClient: true, globalEventIsActive: false }
                    ).pipe(first()).subscribe();
                }
            });
        });
        provider.loadAll$.pipe(takeUntil(this.destroyed$)).subscribe(items => {
            items.forEach(item =>
                this.providers.forEach(eachProvider => {
                    if (
                        eachProvider !== undefined &&
                        eachProvider.name !== provider.name &&
                        eachProvider.instanceofFactoryModel(item)
                    ) {
                        eachProvider.update(item.id, item,
                            { useFakeHttpClient: true, globalEventIsActive: false }
                        ).pipe(first()).subscribe();
                    }
                })
            );
        });
    }
    setOptions(options: IProviderOptions<TModel>) {
        this.provider.setOptions(options);
    }
}
