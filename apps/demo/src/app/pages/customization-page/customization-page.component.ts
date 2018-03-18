import { Component } from '@angular/core';
import { ProviderActionEnum, PaginationMeta } from 'ngx-repository';
import { plainToClass } from 'class-transformer';
import { Group } from '../../shared/models/group';

@Component({
  selector: 'customization-page',
  templateUrl: './customization-page.component.html'
})
export class CustomizationPageComponent {

  customization =
    require('html-loader!markdown-loader!../../../../../../CUSTOMIZATION.md').
      replace('<h1 id="customization">customization</h1>', '');

  source = {
    html: require('!!raw-loader?lang=html!./customization-page.component.html.txt'),
    ts: require('!!raw-loader?lang=typescript!./customization-page.component.ts.txt')
  };

  gridSource = {
    html: require('!!raw-loader?lang=html!../../grids/groups-grid/groups-grid.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/groups-grid/groups-grid.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/groups-grid/groups-grid.component.ts')
  };

  customOptions = {
    pluralName: 'custom-groups',
    autoload: true,
    actionOptions: {
      requestOptions: (key: number | string, data: any, action: ProviderActionEnum) => {
        const headers = {
          'Content-Type': 'application/json',
          'access_token': 'JWT fake-access-token'
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
      responseLoadAllTotalCount: (data: any, action: ProviderActionEnum) => {
        return data && data.body.meta && data.body.meta.totalResults;
      },
      requestLoadAllPaginationQuery: (currentUrl: string, paginationMeta: PaginationMeta, action: ProviderActionEnum) =>
        (currentUrl.indexOf('?') === -1 ? '?' : '&') + `cur_page=${paginationMeta.curPage}&per_page=${paginationMeta.perPage}`,
      requestLoadAllSearchQuery: (currentUrl: string, filter: any, action: ProviderActionEnum) =>
        (filter && filter.searchText) ?
          ((currentUrl.indexOf('?') === -1 ? '?' : '&') + `q=${filter.searchText}`) : ''
    }
  };
}
