import { plainToClass, Transform, Type, plainToClassFromExist } from 'class-transformer';
import { IsNotEmpty, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { transformStringToDate, transformDateToString, serializeModel } from '../utils/custom-transforms';
import { IModel } from 'ngx-repository';
import { Group } from './group';

export class UserWithGroups implements IModel {
    static strings = {
        id: 'Id',
        username: 'Username',
        password: 'Password',
        rePassword: 'Repeat password',
        usernameOrEmail: 'Username/Email',
        isSuperuser: 'Administrator',
        isStaff: 'Staff',
        isActive: 'User',
        fullName: 'Full name',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        lastLogin: 'Last login',
        dateJoined: 'Date joined',
        dateOfBirth: 'Date of birth',
        roles: 'Roles',
        groups: 'Groups',
        createTitle: 'Add new user',
        updateTitle: 'Update user #{data.id}',
        deleteTitle: 'Delete user #{data.id}',
        deleteMessage: 'Do you really want to delete user?'
    };
    static fields = ['id', 'username', 'password', 'isSuperuser',
        'isStaff', 'isActive', 'firstName', 'lastName', 'email',
        'lastLogin', 'dateJoined', 'dateOfBirth', 'groups'];
    // need for deep update if local change in any place
    static nested = {
        groups: Group
    };

    @IsOptional()
    id: number;
    @IsNotEmpty()
    username: string;
    password: string;
    rePassword: string;
    firstName: string;
    lastName: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    isSuperuser: boolean;
    isStaff: boolean;
    isActive: boolean;
    @Transform(transformStringToDate, { toClassOnly: true })
    @Transform(transformDateToString, { toPlainOnly: true })
    lastLogin: string;
    @Transform(transformStringToDate, { toClassOnly: true })
    @Transform(transformDateToString, { toPlainOnly: true })
    dateJoined: string;
    @Transform(transformStringToDate, { toClassOnly: true })
    @Transform(transformDateToString, { toPlainOnly: true })
    dateOfBirth: string;
    @ValidateNested()
    @IsOptional()
    @Type(serializeModel(Group))
    groups: Group[] = [];

    rolesToString() {
        const roles: string[] = [];
        if (this.isSuperuser) {
            roles.push('Admin');
        }
        if (this.isStaff) {
            roles.push('Staff');
        }
        if (roles.length === 0 && this.isActive) {
            roles.push('User');
        }
        return roles.reverse().join(', ');
    }
    groupsToString() {
        return this.groups ? this.groups.map(group => group.toString()) : '';
    }
    toString() {
        const arr: string[] = [];
        if (this.firstName) {
            arr.push(this.firstName);
        }
        if (this.lastName) {
            arr.push(this.lastName);
        }
        if (arr.length === 0 && this.username) {
            arr.push(this.username);
        }
        return arr.join(' ');
    }

    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
