import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
export function forceOneRun(observable: Observable<any>) {
    return observable.pipe(take(1));
}
