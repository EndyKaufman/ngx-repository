# ngx-repository

[![Greenkeeper badge](https://badges.greenkeeper.io/EndyKaufman/ngx-repository.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/EndyKaufman/ngx-repository.svg?branch=master)](https://travis-ci.org/EndyKaufman/ngx-repository)
[![npm version](https://badge.fury.io/js/ngx-repository.svg)](https://badge.fury.io/js/ngx-repository)


Custom repository service for Angular9+, for easy work with the REST backend, with switch on fly from REST backend to the MOCK backend with save and use all CRUD operations

[![How it work](https://img.youtube.com/vi/lEFD8ey82ek/0.jpg)](https://www.youtube.com/watch?v=lEFD8ey82ek)

## Installation

```bash
npm i --save ngx-repository
```

## Links

[Demo](https://endykaufman.github.io/ngx-repository) - Demo application with ngx-repository.

[Stackblitz](https://stackblitz.com/edit/ngx-repository) - Simply sample of usage on https://stackblitz.com

## Usage

app.module.ts
```js 
import { NgxRepositoryModule } from 'ngx-repository';
import { UsersGridComponent } from './users-grid.component';

@NgModule({
  imports: [
    ...
    NgxRepositoryModule,
    ...
  ],
  declarations: [
    ...
    UsersGridComponent,
    ...
  ],
  ...
})
export class AppModule {}
```

user-model.ts
```js 
import { IModel } from 'ngx-repository';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { plainToClassFromExist } from 'class-transformer';

export class UserModel implements IModel {
    @IsOptional()
    id: number;
    @IsNotEmpty()
    username: string;
    password: string;
    constructor(data?: any) {
        plainToClassFromExist(this, data);
    }
}
```

users-grid.component.ts
```js
import { Component, OnInit } from '@angular/core';
import { DynamicRepository, Repository } from 'ngx-repository';
import { UserModel } from './user-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'users-grid',
  template: `
<button (click)="create()"> Create </button>
<ul>
  <li *ngFor="let item of items$ | async">
    <span *ngIf="editedUser?.id!==item?.id">
      {{item.username}}
      <button (click)="startEdit(item)"> Edit </button>
      <button (click)="delete(item) "> Delete </button>
    </span>
    <span *ngIf="editedUser?.id===item?.id">
      <input [(ngModel)]="editedUser.username" />
      <button (click)="save(editedUser)"> Save </button>
      <button (click)="cancel()"> Cancel </button>
    </span>
  </li>
</ul>
  `
})
export class UsersGridComponent implements OnInit {
  public editedUser: UserModel;
  public repository: Repository<UserModel>;
  public items$: Observable<UserModel[]>
  private mockedItems = [
    {
        'username': 'user1',
        'password': 'password1',
        'id': 1,
    }, {
        'username': 'user2',
        'password': 'password2',
        'id': 2,
    }, {
        'username': 'user3',
        'password': 'password3',
        'id': 3,
    }, {
        'username': 'user4',
        'password': 'password4',
        'id': 4,
    }
  ];
  constructor(
    private dynamicRepository: DynamicRepository
  ) {
    this.repository = this.dynamicRepository.fork<UserModel>(UserModel);
  }
  ngOnInit() {
    this.repository.useMock({
        items: this.mockedItems,
        paginationMeta: {
            perPage: 2
        }
    });
    /* For real backend
    this.repository.useRest({
      apiUrl: environment.apiUrl,
      paginationMeta: {
        perPage: 2
      }
    });*/
    this.items$ = this.repository.items$;
  }
  startEdit(user: UserModel) {
    this.editedUser = this.repository.clone(user);
  }
  cancel() {
    this.editedUser = undefined;
  }
  save(user: UserModel) {
    this.repository.save(user).subscribe();
    this.editedUser = undefined;
  }
  create() {
    this.repository.create(new UserModel({
      username: 'new user'
    })).subscribe();
  }
  delete(user: UserModel) {
    this.repository.delete(user.id).subscribe();
  }
}
```

app.component.ts
```html
...
<users-grid></users-grid>
...
```

## License

MIT