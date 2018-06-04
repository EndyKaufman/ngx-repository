import { IModel } from './model';

export interface IFactoryModel<TModel extends IModel> {
    new(data?: any): TModel;
    strings?: {
        [key: string]: string
    };
    fields?: string[];
    nested?: {
        [key: string]: Function
    };
}
