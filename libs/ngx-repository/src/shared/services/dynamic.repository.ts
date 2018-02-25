import { Injectable, Injector } from '@angular/core';
import { Repository } from './repository';
import { Model } from '../models/model';

@Injectable()
export class DynamicRepository extends Repository<Model> {
    constructor(
        protected injector: Injector
    ) {
        super(injector, Model);
    }
}
