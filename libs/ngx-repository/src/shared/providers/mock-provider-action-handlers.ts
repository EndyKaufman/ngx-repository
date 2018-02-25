import { Injectable, Injector } from '@angular/core';
import { IRestProviderActionOptions } from '../interfaces/rest-provider-action-options';
import { ProviderActionEnum } from '../enums/provider-action.enum';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PaginationMeta } from '../models/pagination-meta';
import { IPaginationMeta } from '../interfaces/pagination-meta';
import { RestProviderActionHandlers } from './rest-provider-action-handlers';

@Injectable()
export class MockProviderActionHandlers extends RestProviderActionHandlers {

}
