import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SERVER_URL } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<User>(`${SERVER_URL}/auth/login`, {
      username,
      password,
    });
  }
  logout(): void {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}
class User {
  token!: string;
  username!: string;
  password!: string;
}
