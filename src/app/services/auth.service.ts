import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    console.log(SERVER_URL);
    console.log('SERVER_URL');

    return this.http.post<User>(`${SERVER_URL}/auth/login`, {
      username,
      password,
    });
  }
}
class User {
  token!: string;
  username!: string;
  password!: string;
}
