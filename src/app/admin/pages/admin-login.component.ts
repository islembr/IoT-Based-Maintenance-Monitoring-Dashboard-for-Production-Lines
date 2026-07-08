import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login', standalone: true, imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `<main class="login-page"><section class="login-card"><div class="mark">AM</div><p class="eyebrow">ADMIN ACCESS</p><h1>Sign in</h1><p class="intro">Use the prototype administrator credentials to access local data management.</p><form [formGroup]="form" (ngSubmit)="submit()"><label>Username<input formControlName="username" autocomplete="username"></label><label>Password<input type="password" formControlName="password" autocomplete="current-password"></label><p class="error" *ngIf="error">{{error}}</p><button [disabled]="form.invalid">Sign in</button></form><a routerLink="/dashboard">← Return to public dashboard</a></section></main>`,
  styles: [`
    :host{display:block;min-height:100vh;background:#eef2f8}.login-page{min-height:100vh;display:grid;place-items:center;padding:1rem}.login-card{width:min(410px,100%);padding:2rem;background:#fff;border:1px solid #dfe5ee;border-radius:16px;box-shadow:0 20px 55px #17203318}.mark{display:grid;place-items:center;width:48px;height:48px;border-radius:12px;background:#4f7cff;color:#fff;font-weight:900}.eyebrow{margin:1.5rem 0 .3rem;color:#4f6fd5;font-size:.65rem;font-weight:900;letter-spacing:.12em}h1{margin:0;color:#172033;font-size:1.8rem}.intro{color:#6d7788;font-size:.8rem;line-height:1.5}form{display:grid;gap:1rem;margin:1.4rem 0}label{display:grid;gap:.35rem;color:#445066;font-size:.7rem;font-weight:800}input{border:1px solid #cbd4e1;border-radius:8px;padding:.72rem;font:inherit}input:focus{outline:2px solid #b8c7f8;border-color:#6e8be8}button{border:0;border-radius:8px;padding:.75rem;background:#355fd6;color:#fff;font-weight:800;cursor:pointer}button:disabled{opacity:.5}.error{margin:0;padding:.65rem;border-radius:7px;background:#fef2f2;color:#b91c1c;font-size:.72rem}.login-card>a{color:#4c66b7;text-decoration:none;font-size:.72rem}
  `]
})
export class AdminLoginComponent {
  private readonly auth = inject(AuthService); private readonly router = inject(Router); private readonly route = inject(ActivatedRoute); private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({ username: ['', Validators.required], password: ['', Validators.required] });
  error = '';
  submit(): void {
    const { username, password } = this.form.getRawValue();
    if (!this.auth.login(username, password)) { this.error = 'Invalid username or password.'; return; }
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    void this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? returnUrl : '/admin');
  }
}
