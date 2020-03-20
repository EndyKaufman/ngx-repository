import { Component, ChangeDetectionStrategy } from '@angular/core';
import { USERS_MOCKS } from '../../shared/mocks/users.mock';

@Component({
  selector: 'mock-data-page',
  templateUrl: './mock-data-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MockDataPageComponent {
  mockedItems = USERS_MOCKS;

  source = {
    html: require('!!raw-loader!./mock-data-page.component.html.txt').default,
    ts: require('!!raw-loader!./mock-data-page.component.ts.txt').default
  };

  usersGridSource = {
    html: require('!!raw-loader!../../grids/users-grid/users-grid.component.html').default,
    css: require('!!raw-loader!../../grids/users-grid/users-grid.component.scss').default,
    ts: require('!!raw-loader!../../grids/users-grid/users-grid.component.ts').default
  };

  userModalSource = {
    html: require('!!raw-loader!../../grids/users-grid/user-modal/user-modal.component.html').default,
    css: require('!!raw-loader!../../grids/users-grid/user-modal/user-modal.component.scss').default,
    ts: require('!!raw-loader!../../grids/users-grid/user-modal/user-modal.component.ts').default
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'user.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/models/user.ts').default
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
      name: 'users.mock.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/mocks/users.mock.ts').default
    }
  ];
}
