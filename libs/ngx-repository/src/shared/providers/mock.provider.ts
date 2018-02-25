import { Injectable, Injector } from '@angular/core';
import { Provider } from './provider';
import { ProviderError } from '../exceptions/provider.error';
import { List } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { validate } from 'class-validator';
import { ValidatorError } from '../exceptions/validator.error';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { IProviderOptions } from '../interfaces/provider-options';
import { IMockProviderOptions } from '../interfaces/mock-provider-options';
import { PaginationMeta } from '../models/pagination-meta';
import { IModel } from '../interfaces/model';
import { IProviderActionOptions } from '../interfaces/provider-action-options';
import { RestProvider } from './rest.provider';
import { HttpClient } from '@angular/common/http';
import { RestProviderActionHandlers } from './rest-provider-action-handlers';
import { FakeHttpClient } from '../utils/fake-http-client';
import { MockProviderActionHandlers } from './mock-provider-action-handlers';
import { IFactoryModel } from '../interfaces/factory-model';

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
        if (options && options.items) {
            (this.httpClient as FakeHttpClient).setItems(options.items);
        }
        if (this.apiUrl === undefined) {
            this.apiUrl = 'http://fake/api';
        }
        if (this.pluralName === undefined) {
            this.pluralName = 'entities';
        }
        if (this.name === undefined) {
            this.name = 'entity';
        }
        super.setOptions(options);
    }
}
