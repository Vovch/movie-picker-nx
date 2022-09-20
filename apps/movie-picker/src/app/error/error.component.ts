import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../store.model';
import { removeErrorMessage } from './error.actions';

@Component({
  selector: 'movie-picker-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.less'],
})
export class ErrorComponent {
  errors$: Observable<string[]>;

  constructor(private store: Store<IAppState>) {
    this.errors$ = store.select(({ errors }) => errors.messages);
  }

  removeMessage(index: number) {
    this.store.dispatch(removeErrorMessage({ index }));
  }
}
