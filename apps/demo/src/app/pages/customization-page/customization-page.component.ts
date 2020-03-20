import { Component, ChangeDetectionStrategy } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { IRestProviderOptions, ProviderActionEnum } from 'ngx-repository';
import { Group } from '../../shared/models/group';

@Component({
  selector: 'customization-page',
  templateUrl: './customization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomizationPageComponent {
  customization = require('!!raw-loader!../../../../../../CUSTOMIZATION.md').default.replace(
    '<h1 id="customization">customization</h1>',
    ''
  );

  source = {
    html: require('!!raw-loader!./customization-page.component.html.txt').default,
    ts: require('!!raw-loader!./customization-page.component.ts.txt').default
  };

  gridSource = {
    html: require('!!raw-loader!../../grids/groups-grid/groups-grid.component.html').default,
    css: require('!!raw-loader!../../grids/groups-grid/groups-grid.component.scss').default,
    ts: require('!!raw-loader!../../grids/groups-grid/groups-grid.component.ts').default
  };

  customOptions: IRestProviderOptions<Group> = {
    pluralName: 'custom-groups',
    autoload: true,
    actionOptions: {
      requestOptions: (key: number | string, data: any, action: ProviderActionEnum) => {
        const headers = {
          'Content-Type': 'application/json',
          access_token: 'JWT fake-access-token'
        };
        return {
          headers: headers,
          withCredentials: false
        };
      },
      responseData: (data: any, action: ProviderActionEnum) => {
        if (action === ProviderActionEnum.LoadAll) {
          return plainToClass(Group, data.body.groups);
        } else {
          return plainToClass(Group, data.body.group);
        }
      },
      responsePaginationMeta: (data: any, action: ProviderActionEnum) => {
        return { totalResults: data && data.body.meta && data.body.meta.totalResults, perPage: undefined };
      }
    },
    restOptions: {
      limitQueryParam: 'per_page',
      pageQueryParam: 'cur_page',
      searchTextQueryParam: 'q'
    }
  };
}
