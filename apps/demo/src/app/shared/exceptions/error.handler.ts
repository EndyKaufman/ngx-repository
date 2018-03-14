import { ErrorHandler, Injector, Injectable, NgZone } from '@angular/core';
import { MessageBoxService } from '../../others/message-box/message-box.service';
@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor(
        private _injector: Injector,
        private _ngZone: NgZone
    ) {
    }
    handleError(error) {
        this._ngZone.run(() => {
            this.showErrorInConsole(error);
            const message = error.message ? error.message : error.toString();
            const messageBoxService = this._injector.get(MessageBoxService);
            messageBoxService.error(message).subscribe();
        });
    }
    private showErrorInConsole(error: any): void {
        if (console && console.group && console.error) {
            console.group('Error Log');
            console.error(error);
            console.error(error.message);
            console.error(error.stack);
            console.groupEnd();
        }
    }
}
