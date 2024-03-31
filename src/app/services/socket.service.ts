import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SOCKET_URL } from 'environment/environment';
import { Socket, io } from 'socket.io-client';
import { AuthState } from '../store/reducers/auth.reducer';
import { selectUser } from '../store/selectors/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private user = { id: '', name: '' };

  constructor(private store: Store<AuthState>) {
    this.socket = io(SOCKET_URL);
    this.store.select(selectUser).subscribe((user) => {
      this.user.id = user._id;
      this.user.name = user.username;
    });
  }

  userConnected(user: any, documentId: any) {
    this.socket.emit('addUser', { user, documentId });
  }

  userLeftDocument(user: any, documentId: any) {
    this.socket.emit('removeUser', { user, documentId });
  }

  onUserConnected(callback: (users: any) => void): void {
    this.socket.on('getUsers', callback);
  }

  sendDocumentUpdate(update: any): void {
    this.socket.emit('document-update', {
      update,
      user: this.user.name,
    });
  }

  onDocumentUpdate(callback: (update: any, user: any) => void): void {
    this.socket.on('document-update', callback);
  }
}
