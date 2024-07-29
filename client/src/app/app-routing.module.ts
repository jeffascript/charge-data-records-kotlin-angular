import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChargeDataTableComponent } from './components/charge-data-table/charge-data-table.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'charge-data',
    component: ChargeDataTableComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/charge-data', pathMatch: 'full' },
  { path: '**', redirectTo: '/charge-data' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
