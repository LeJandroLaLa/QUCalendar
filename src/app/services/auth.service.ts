import { Injectable, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  private readonly ADMIN_EMAIL = 'jandro44@gmail.com';

  constructor(private auth: Auth, private router: Router) {
    user(this.auth).subscribe(u => {
      this.currentUser.set(u);
    });
  }

  async signInWithGoogle(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    if (result.user.email === this.ADMIN_EMAIL) {
      this.currentUser.set(result.user);
      await this.router.navigate(['/admin']);
    } else {
      await signOut(this.auth);
      throw new Error('Unauthorized account. This admin panel is restricted.');
    }
  } catch (err) {
    throw err;
  }
}

  async signOutUser(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.email === this.ADMIN_EMAIL;
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}