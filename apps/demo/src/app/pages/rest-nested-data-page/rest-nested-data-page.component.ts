import { Component } from '@angular/core';

@Component({
  selector: 'rest-nested-data-page',
  templateUrl: './rest-nested-data-page.component.html'
})
export class RestNestedDataPageComponent {

  source = {
    html: require('!!raw-loader?lang=html!./rest-nested-data-page.component.html.txt'),
    ts: require('!!raw-loader?lang=typescript!./rest-nested-data-page.component.ts.txt')
  };

  usersGridSource = {
    html: require('!!raw-loader?lang=html!../../grids/users-with-groups-grid/users-with-groups-grid.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/users-with-groups-grid/users-with-groups-grid.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/users-with-groups-grid/users-with-groups-grid.component.ts')
  };

  userModalSource = {
    html: require('!!raw-loader?lang=html!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-modal.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-modal.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-modal.component.ts')
  };

  groupsGridSource = {
    html: require('!!raw-loader?lang=html!../../grids/groups-grid/groups-grid.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/groups-grid/groups-grid.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/groups-grid/groups-grid.component.ts')
  };

  userGroupsGridSource = {
    html: require('!!raw-loader?lang=html!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component.ts')
  };

  groupModalSource = {
    html: require('!!raw-loader?lang=html!../../grids/groups-grid/group-modal/group-modal.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/groups-grid/group-modal/group-modal.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/groups-grid/group-modal/group-modal.component.ts')
  };
  groupsGridModalSource = {
    html: require('!!raw-loader?lang=html!../../grids/groups-grid/groups-grid-modal/groups-grid-modal.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/groups-grid/groups-grid-modal/groups-grid-modal.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/groups-grid/groups-grid-modal/groups-grid-modal.component.ts')
  };

  otherFiles: { name: string, language: string, content: string }[] = [
    {
      name: 'user-with-groups.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/user-with-groups.ts')
    },
    {
      name: 'group.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/group.ts')
    },
    {
      name: 'model.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../../../../../libs/ngx-repository/src/shared/interfaces/model.ts')
    },
    {
      name: 'custom-transforms.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/utils/custom-transforms.ts')
    },
    {
      name: 'users-with-groups.mock.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/mocks/users-with-groups.mock.ts')
    },
    {
      name: 'groups.mock.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/mocks/groups.mock.ts')
    }
  ];

}
