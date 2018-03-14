import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageBoxComponent } from './message-box.component';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

@Injectable()
export class MessageBoxService {

    constructor(
        public dialog: MatDialog
    ) { }

    info(message: string, title: string = 'Info', width: string = '300px') {
        return new Observable(observer => {
            const dialogRef = this.dialog.open(MessageBoxComponent, {
                width: width,
                data: null
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.message = message;
            dialogRef.componentInstance.isInfo = true;
            dialogRef.componentInstance.yes.subscribe((modal: MessageBoxComponent) => {
                dialogRef.close();
                observer.next(true);
            });
            dialogRef.componentInstance.no.subscribe((modal: MessageBoxComponent) => {
                dialogRef.close();
                observer.next(false);
            });
        }).pipe(first());
    }
    error(message: string, title: string = 'Error', width: string = '300px') {
        return new Observable(observer => {
            const dialogRef = this.dialog.open(MessageBoxComponent, {
                width: width,
                data: null
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.message = message;
            dialogRef.componentInstance.isError = true;
            dialogRef.componentInstance.yes.subscribe((modal: MessageBoxComponent) => {
                dialogRef.close();
                observer.next(true);
            });
            dialogRef.componentInstance.no.subscribe((modal: MessageBoxComponent) => {
                dialogRef.close();
                observer.next(false);
            });
        }).pipe(first());
    }
}
