# ngx-repository

[![Greenkeeper badge](https://badges.greenkeeper.io/EndyKaufman/ngx-repository.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/EndyKaufman/ngx-repository.svg?branch=master)](https://travis-ci.org/EndyKaufman/ngx-repository)
[![npm version](https://badge.fury.io/js/ngx-repository.svg)](https://badge.fury.io/js/ngx-repository)


Custom repository service for Angular5+, for easy work with the REST backend, with replace of the REST backend to the MOCK backend with save and use all CRUD operations

## Installation

```bash
npm install --save ngx-repository class-validator class-transformer
```

## Links

[Demo](https://endykaufman.github.io/ngx-repository) - Demo application with ngx-repository.

[Stackblitz](https://stackblitz.com/edit/ngx-repository) - Simply sample of usage on https://stackblitz.com

## Usage

app.module.ts
```ts 
import { NgxRepositoryModules } from 'ngx-repository';
import { UsersGridComponent } from './users-grid.component';

@NgModule({
  imports: [
    ...
    NgxRepositoryModules,
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
```ts 
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
```ts
import { Component, OnInit } from '@angular/core';
import { DynamicRepository, Repository } from 'ngx-repository';
import { UserModel } from './user-model';

@Component({
  selector: 'users-grid',
  template: `
  <ul>
    <li *ngFor="let item of this.repository.provider.items$ | async">
        {{item.username}}
    </li>
  </ul>
  `
})
export class UsersGridComponent implements OnInit {
  public repository: Repository<UserModel>;
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
    public dynamicRepository: DynamicRepository
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