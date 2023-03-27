import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full',
  },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/:type', component: AuthComponent, canActivate: [AuthGuard] },
  // {path: "user", redirectTo: 'auth/login',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
