import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { UserWithGroupsGroupsGridComponent } from '../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component';

@Component({
  selector: 'rest-nested-data-page',
  templateUrl: './rest-nested-data-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestNestedDataPageComponent {
  @ViewChild('groupsGrid2')
  groupsGrid2: UserWithGroupsGroupsGridComponent;

  source = {
    html: require('!!raw-loader!./rest-nested-data-page.component.html.txt').default,
    ts: require('!!raw-loader!./rest-nested-data-page.component.ts.txt').default
  };

  usersGridSource = {
    html: require('!!raw-loader!../../grids/users-with-groups-grid/users-with-groups-grid.component.html').default,
    css: require('!!raw-loader!../../grids/users-with-groups-grid/users-with-groups-grid.component.scss').default,
    ts: require('!!raw-loader!../../grids/users-with-groups-grid/users-with-groups-grid.component.ts').default
  };

  userModalSource = {
    html: require('!!raw-loader!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-modal.component.html')
      .default,
    css: require('!!raw-loader!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-modal.component.scss')
      .default,
    ts: require('!!raw-loader!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-modal.component.ts')
      .default
  };

  groupsGridSource = {
    html: require('!!raw-loader!../../grids/groups-grid/groups-grid.component.html').default,
    css: require('!!raw-loader!../../grids/groups-grid/groups-grid.component.scss').default,
    ts: require('!!raw-loader!../../grids/groups-grid/groups-grid.component.ts').default
  };

  userGroupsGridSource = {
    html: require('!!raw-loader!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component.html')
      .default,
    css: require('!!raw-loader!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component.scss')
      .default,
    ts: require('!!raw-loader!../../grids/users-with-groups-grid/user-with-groups-modal/user-with-groups-groups-grid/user-with-groups-groups-grid.component.ts')
      .default
  };

  groupModalSource = {
    html: require('!!raw-loader!../../grids/groups-grid/group-modal/group-modal.component.html').default,
    css: require('!!raw-loader!../../grids/groups-grid/group-modal/group-modal.component.scss').default,
    ts: require('!!raw-loader!../../grids/groups-grid/group-modal/group-modal.component.ts').default
  };
  groupsGridModalSource = {
    html: require('!!raw-loader!../../grids/groups-grid/groups-grid-modal/groups-grid-modal.component.html').default,
    css: require('!!raw-loader!../../grids/groups-grid/groups-grid-modal/groups-grid-modal.component.scss').default,
    ts: require('!!raw-loader!../../grids/groups-grid/groups-grid-modal/groups-grid-modal.component.ts').default
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'user-with-groups.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/user-with-groups.ts').default
    },
    {
      name: 'group.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/group.ts').default
    },
    {
      name: 'model.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../../../../../libs/ngx-repository/src/lib/interfaces/model.ts').default
    },
    {
      name: 'custom-transforms.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/utils/custom-transforms.ts').default
    },
    {
      name: 'users-with-groups.mock.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/mocks/users-with-groups.mock.ts').default
    },
    {
      name: 'groups.mock.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/mocks/groups.mock.ts').default
    }
  ];
}
