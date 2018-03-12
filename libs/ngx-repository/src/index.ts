import { NgxRepositoryModule } from './ngx-repository.module';
export { NgxRepositoryModule } from './ngx-repository.module';
import { ProviderActionEnum } from './shared/enums/provider-action.enum';
export { ProviderActionEnum } from './shared/enums/provider-action.enum';
import { ProviderError } from './shared/exceptions/provider.error';
export { ProviderError } from './shared/exceptions/provider.error';
import { ValidatorError } from './shared/exceptions/validator.error';
export { ValidatorError } from './shared/exceptions/validator.error';
import { IFactoryModel } from './shared/interfaces/factory-model';
export { IFactoryModel } from './shared/interfaces/factory-model';
import { IHttpClient } from './shared/interfaces/http-client';
export { IHttpClient } from './shared/interfaces/http-client';
import { IMockProviderOptions } from './shared/interfaces/mock-provider-options';
export { IMockProviderOptions } from './shared/interfaces/mock-provider-options';
import { IModel } from './shared/interfaces/model';
export { IModel } from './shared/interfaces/model';
import { IPaginationMeta } from './shared/interfaces/pagination-meta';
export { IPaginationMeta } from './shared/interfaces/pagination-meta';
import { IProviderActionActionModel } from './shared/interfaces/provider-action-action-model';
export { IProviderActionActionModel } from './shared/interfaces/provider-action-action-model';
import { IProviderActionOptions } from './shared/interfaces/provider-action-options';
export { IProviderActionOptions } from './shared/interfaces/provider-action-options';
import { IProviderOptions } from './shared/interfaces/provider-options';
export { IProviderOptions } from './shared/interfaces/provider-options';
import { IProvider } from './shared/interfaces/provider';
export { IProvider } from './shared/interfaces/provider';
import { IRestProviderActionHandlers } from './shared/interfaces/rest-provider-action-handlers';
export { IRestProviderActionHandlers } from './shared/interfaces/rest-provider-action-handlers';
import { IRestProviderActionOptions } from './shared/interfaces/rest-provider-action-options';
export { IRestProviderActionOptions } from './shared/interfaces/rest-provider-action-options';
import { IRestProviderOptions } from './shared/interfaces/rest-provider-options';
export { IRestProviderOptions } from './shared/interfaces/rest-provider-options';
import { Model } from './shared/models/model';
export { Model } from './shared/models/model';
import { PaginationMeta } from './shared/models/pagination-meta';
export { PaginationMeta } from './shared/models/pagination-meta';
import { MockProviderActionHandlers } from './shared/providers/mock-provider-action-handlers';
export { MockProviderActionHandlers } from './shared/providers/mock-provider-action-handlers';
import { MockProvider } from './shared/providers/mock.provider';
export { MockProvider } from './shared/providers/mock.provider';
import { Provider } from './shared/providers/provider';
export { Provider } from './shared/providers/provider';
import { RestProviderActionHandlers } from './shared/providers/rest-provider-action-handlers';
export { RestProviderActionHandlers } from './shared/providers/rest-provider-action-handlers';
import { RestProvider } from './shared/providers/rest.provider';
export { RestProvider } from './shared/providers/rest.provider';
import { DynamicRepository } from './shared/services/dynamic.repository';
export { DynamicRepository } from './shared/services/dynamic.repository';
import { Repository } from './shared/services/repository';
export { Repository } from './shared/services/repository';
import { FakeHttpClient } from './shared/utils/fake-http-client';
export { FakeHttpClient } from './shared/utils/fake-http-client';
import { forceOneRun } from './shared/utils/force-one-run';
export { forceOneRun } from './shared/utils/force-one-run';
export const NgxRepositoryModules: any[] = [NgxRepositoryModule.forRoot()];
export const NgxRepositoryShareds: any[] = [ProviderActionEnum, ProviderError, ValidatorError, Model, PaginationMeta, MockProviderActionHandlers, MockProvider, Provider, RestProviderActionHandlers, RestProvider, DynamicRepository, Repository, FakeHttpClient, forceOneRun];
