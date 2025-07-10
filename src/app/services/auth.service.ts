import { Injectable } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { app } from '../firebase';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
  lastLoginAt: any;
  loginMethod: 'email' | 'google';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(app);
  private firestore = getFirestore(app);
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

        // Store user data in Firestore
        await this.createUserDocument(userCredential.user, displayName, 'email');
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Update last login time
      if (userCredential.user) {
        await this.updateLastLogin(userCredential.user.uid);
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      
      if (userCredential.user) {
        // Check if user document exists, if not create it
        const userDoc = await getDoc(doc(this.firestore, 'users', userCredential.user.uid));
        
        if (!userDoc.exists()) {
          // First time Google login - create user document
          await this.createUserDocument(
            userCredential.user, 
            userCredential.user.displayName || 'Google User',
            'google'
          );
        } else {
          // Update last login time
          await this.updateLastLogin(userCredential.user.uid);
        }
      }
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

  private async createUserDocument(user: User, displayName: string, loginMethod: 'email' | 'google'): Promise<void> {
    const userData: UserData = {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName,
      photoURL: user.photoURL || '',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      loginMethod: loginMethod
    };

    await setDoc(doc(this.firestore, 'users', user.uid), userData);
  }

  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await setDoc(
        doc(this.firestore, 'users', uid), 
        { lastLoginAt: serverTimestamp() }, 
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating last login:', error);
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
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}