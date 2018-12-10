import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MessageBoxComponent } from './message-box.component';

@Injectable()
export class MessageBoxService {
  constructor(public dialog: MatDialog) {}

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
  error(error: string | any, title: string = 'Error', width: string = '300px') {
    return new Observable(observer => {
      this.showErrorInConsole(error);
      const message = error.message ? error.message : error.toString();
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
  private showErrorInConsole(error: any): void {
    if (console && console.group && console.error) {
      console.group('Error Log');
      console.error(error);
      if (error.message) {
        console.error(error.message);
      }
      if (error.stack) {
        console.error(error.stack);
      }
      console.groupEnd();
    }
  }
}
