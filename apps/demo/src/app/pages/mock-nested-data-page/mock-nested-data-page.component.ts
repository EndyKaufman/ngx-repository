import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GROUPS_MOCKS } from '../../shared/mocks/groups.mock';
import { USERS_WITH_GROUPS_MOCKS } from '../../shared/mocks/users-with-groups.mock';

@Component({
  selector: 'mock-nested-data-page',
  templateUrl: './mock-nested-data-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MockNestedDataPageComponent {

  mockedItems = USERS_WITH_GROUPS_MOCKS;
  // todo: used only as sample, you must remove it on you project
  exampleGroupMockedItems = GROUPS_MOCKS;

  source = {
    html: require('!!raw-loader?lang=html!./mock-nested-data-page.component.html.txt'),
    ts: require('!!raw-loader?lang=typescript!./mock-nested-data-page.component.ts.txt')
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
      content: require('!!raw-loader?lang=typescript!../../../../../../libs/ngx-repository/src/lib/interfaces/model.ts')
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
