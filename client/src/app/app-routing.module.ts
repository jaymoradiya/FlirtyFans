import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { MemberDetailsComponent } from './components/member-details/member-details.component';
import { ListsComponent } from './components/lists/lists.component';
import MessagesComponent from './components/messages/messages.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { PreventUnsavedGuard } from './guards/prevent-unsaved.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/:type', component: AuthComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PreventUnsavedGuard],
  },
  { path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
  {
    path: 'member/:id',
    component: MemberDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'lists', component: ListsComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },

  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
