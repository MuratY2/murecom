import { Injectable } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  updateProfile
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { app } from '../firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(app);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update the user's display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}