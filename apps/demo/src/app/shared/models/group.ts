import { plainToClassFromExist } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
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

  toString() {
    return this.title;
  }

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}
