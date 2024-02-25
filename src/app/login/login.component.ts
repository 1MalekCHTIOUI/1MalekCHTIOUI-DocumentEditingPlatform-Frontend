import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../store/actions/auth.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router // Add the Router module
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      console.log('clock');

      const { username, password } = this.loginForm.value;
      this.store.dispatch(login({ username, password }));
      this.router.navigate(['/dashboard']);
    } else {
      console.log('ERROR');
    }
  }
}
