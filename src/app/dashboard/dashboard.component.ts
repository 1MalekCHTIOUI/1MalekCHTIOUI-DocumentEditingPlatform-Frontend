import { Component } from '@angular/core';
import { selectUser } from '../store/selectors/auth.selector';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../store/reducers/auth.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  user$ = this.store.select(selectUser);
  userData: any;
  constructor(private store: Store<AuthState>) {}

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      // Do something with the user data, e.g., display in the template
      this.userData = user;
    });
  }
  test() {
    console.log(this.userData);
  }
}
