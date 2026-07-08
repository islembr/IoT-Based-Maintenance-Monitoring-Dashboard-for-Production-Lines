import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'maintenance-admin-authenticated';

  login(username: string, password: string): boolean {
    const authenticated = username === 'admin' && password === 'admin123';
    if (authenticated) sessionStorage.setItem(this.storageKey, 'true');
    return authenticated;
  }

  logout(): void { sessionStorage.removeItem(this.storageKey); }
  isAuthenticated(): boolean { return sessionStorage.getItem(this.storageKey) === 'true'; }
}
