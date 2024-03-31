import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { schema, toHTML } from 'ngx-editor';

import { Observable } from 'rxjs';
import { Document } from 'src/app/models/document.model';
import { DocumentService } from 'src/app/services/document.service';
import { logout } from 'src/app/store/actions/auth.action';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { selectUser } from 'src/app/store/selectors/auth.selector';
import { selectLoading } from 'src/app/store/selectors/dash.selector';
import { DashState } from 'src/app/store/state/dash.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  userData: any;
  userDocs!: Document[];
  selectedDocument: Document | null = null;
  activeUsersOnDoc: any = [];
  constructor(
    private authStore: Store<AuthState>,
    private dashStore: Store<DashState>,
    private docService: DocumentService,
    private route: ActivatedRoute
  ) {}

  user$ = this.authStore.select(selectUser);
  loading$ = this.dashStore.pipe(select(selectLoading));

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.userData = user;
    });
    this.getUserDocuments();
    this.route.params.subscribe((params) => {
      if (params['id']) this.getDocument(params['id']);
    });
  }

  getDocument(id: string): void {
    this.docService
      .getDocument(id)
      .subscribe((doc: Document) => (this.selectedDocument = doc));
  }
  getContributingUsers(data: any) {
    console.log('receiving new data');

    this.route.params.subscribe((params) => {
      if (data[params['id']]) {
        this.activeUsersOnDoc = data[params['id']].activeUsers;
      } else {
        console.log('No data for id:', params['id']);
      }
    });
  }

  getUserDocuments(): void {
    let tempId = '65d796fce2bc39129719c450';

    this.docService
      .getAllUserDocuments(tempId)
      .subscribe((docs: Document[]) => {
        this.userDocs = docs;
      });
  }

  addNewDocument(): void {}

  logout(): void {
    this.authStore.dispatch(logout());
  }
}
