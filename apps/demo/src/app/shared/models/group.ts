import { plainToClass, Transform, Type, plainToClassFromExist } from 'class-transformer';
import { IsNotEmpty, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { transformStringToDate, transformDateToString } from '../utils/custom-transforms';
import { IModel } from 'ngx-repository';

export class Group implements IModel {
    static strings = {
        id: 'Id',
        name: 'Name',
        title: 'Title',
        createTitle: 'Add new group',
        updateTitle: 'Update group #{data.id}',
        deleteTitle: 'Delete group #{data.id}',
        deleteMessage: 'Do you really want to delete group?',
        appendToUserTitle: 'Select groups for append to user',
        deleteFromUserTitle: 'Delete group',
        deleteFromUserMessage: 'Do you really want to delete group "{data.title}" from user?'
    };
    static fields = ['id', 'name', 'title'];

    @IsOptional()
    id: number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    title: string;

    get asString() {
        return this.title;
    }

    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
