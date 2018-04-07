import { Injectable, Injector } from '@angular/core';
import { Model } from '../models/model';
import { Repository } from './repository';

@Injectable()
export class DynamicRepository extends Repository<Model> {
    constructor(
        protected injector: Injector
    ) {
        super(injector, Model);
    }
}
