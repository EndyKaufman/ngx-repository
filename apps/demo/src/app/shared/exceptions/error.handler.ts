import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { MessageBoxService } from '../../others/message-box/message-box.service';
@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private _injector: Injector, private _ngZone: NgZone) {}
  handleError(error) {
    console.error(error);
    this._ngZone.run(() => {
      const messageBoxService = this._injector.get(MessageBoxService);
      messageBoxService.error(String(error.message || error)).then();
    });
  }
}
