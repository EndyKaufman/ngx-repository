import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'rest-data-page',
  templateUrl: './rest-data-page.component.html'
})
export class RestDataPageComponent {

  source = {
    html: require('!!raw-loader?lang=html!./rest-data-page.component.html.txt'),
    ts: require('!!raw-loader?lang=typescript!./rest-data-page.component.ts.txt')
  };

  usersGridSource = {
    html: require('!!raw-loader?lang=html!../../grids/users-grid/users-grid.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/users-grid/users-grid.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/users-grid/users-grid.component.ts')
  };

  userModalSource = {
    html: require('!!raw-loader?lang=html!../../grids/users-grid/user-modal/user-modal.component.html'),
    css: require('!!raw-loader?lang=scss!../../grids/users-grid/user-modal/user-modal.component.scss'),
    ts: require('!!raw-loader?lang=typescript!../../grids/users-grid/user-modal/user-modal.component.ts')
  };

  otherFiles: { name: string, language: string, content: string }[] = [
    {
      name: 'user.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/models/user.ts')
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
      name: 'environment.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../../environments/environment.ts')
    }
  ];

}
