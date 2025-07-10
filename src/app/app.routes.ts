import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];