import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {

  readme =
    require('html-loader!markdown-loader!../../../../../../README.md').
      replace('<h1 id="ngx-repository">ngx-repository</h1>', '');

  source = {
    html: require('!!raw-loader?lang=html!./home-page.component.html.txt'),
    ts: require('!!raw-loader?lang=typescript!./home-page.component.ts.txt')
  };

  otherFiles: { name: string, language: string, content: string }[] = [
    {
      name: 'safe-html.pipe.ts',
      language: 'javascript',
      content: require('!!raw-loader?lang=typescript!../../shared/pipes/safe-html.pipe.ts')
    },
    {
      name: 'README.md',
      language: 'markdown',
      content: require('!!raw-loader?lang=markdown!../../../../../../README.md')
    }
  ];
}
