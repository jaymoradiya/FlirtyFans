import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './components/nav/nav.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthComponent } from './components/auth/auth.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { ThemeBtnComponent } from './shared/components/theme-btn/theme-btn.component';
import { LogInterceptor } from './shared/interceptor/log.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { MemberDetailsComponent } from './components/member-details/member-details.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/modules/shared.module';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AuthComponent,
    LoaderComponent,
    ThemeBtnComponent,
    ProfileComponent,
    HomeComponent,
    MemberListComponent,
    MemberDetailsComponent,
    ListsComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
