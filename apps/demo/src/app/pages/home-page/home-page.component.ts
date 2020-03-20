import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  readme = require('!!raw-loader!../../../../../../README.md').default.replace(
    '<h1 id="ngx-repository">ngx-repository</h1>',
    ''
  );

  source = {
    html: require('!!raw-loader!./home-page.component.html.txt').default,
    ts: require('!!raw-loader!./home-page.component.ts.txt').default
  };

  otherFiles: { name: string; language: string; content: string }[] = [
    {
      name: 'safe-html.pipe.ts',
      language: 'javascript',
      content: require('!!raw-loader!../../shared/pipes/safe-html.pipe.ts').default
    },
    {
      name: 'README.md',
      language: 'markdown',
      content: require('!!raw-loader!../../../../../../README.md').default
    }
  ];
}
