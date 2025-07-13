import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { ProfileComponent } from './profile/profile';
import { UploadProductComponent } from './upload-product/upload-product';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { ProductManagementComponent } from './product-management/product-management';
import { CheckoutComponent } from './checkout/checkout';
import { BecomeSellerComponent } from './become-seller/become-seller';
import { SellerApprovalComponent } from './seller-approval/seller-approval';
import { ManageUsersComponent } from './manage-users/manage-users';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'upload-product', component: UploadProductComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin/products', component: ProductManagementComponent },
  { path: 'checkout', component: CheckoutComponent  },
  { path: 'become-seller', component: BecomeSellerComponent },
  { path: 'seller-approval', component: SellerApprovalComponent },
  { path: 'manage-users', component: ManageUsersComponent},
  { path: '**', redirectTo: '' }
];