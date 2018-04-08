import { Injector } from '@angular/core';
import { IFactoryModel } from '../interfaces/factory-model';
import { IMockProviderOptions } from '../interfaces/mock-provider-options';
import { IModel } from '../interfaces/model';
import { IProviderOptions } from '../interfaces/provider-options';
import { FakeHttpClient } from '../utils/fake-http-client';
import { MockProviderActionHandlers } from './mock-provider-action-handlers';
import { RestProvider } from './rest.provider';

export class MockProvider<TModel extends IModel> extends RestProvider<TModel> {

    constructor(
        protected injector: Injector,
        protected factoryModel: IFactoryModel<TModel>,
        protected options: IProviderOptions<TModel>
    ) {
        super(injector, factoryModel, options);
    }
    init() {
        this.httpClient = this.fakeHttpClient;
        this.providerActionHandlers = this.injector.get(MockProviderActionHandlers);
        this.setOptions(this.options as IMockProviderOptions<TModel>);
    }
    setOptions(options?: IMockProviderOptions<TModel>) {
        if (this.apiUrl === undefined) {
            this.apiUrl = 'http://fake/api';
        }
        if (this.pluralName === undefined) {
            this.pluralName = 'entities';
        }
        if (this.name === undefined) {
            this.name = 'entity';
        }
        if (options && options.items) {
            (this.httpClient as FakeHttpClient).setItems(options.items);
        }
        super.setOptions(options);
    }
}
