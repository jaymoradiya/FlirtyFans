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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeBtnComponent } from './shared/components/theme-btn/theme-btn.component';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { MemberDetailsComponent } from './components/member-details/member-details.component';
import { ListsComponent } from './components/lists/lists.component';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/modules/shared.module';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { ErrorInterceptor } from './shared/interceptor/error.interceptor';
import { MemberCardComponent } from './shared/components/member-card/member-card.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { LoadingInterceptor } from './shared/interceptor/loading.interceptor';
import { PhotoEditComponent } from './components/photo-edit/photo-edit.component';
import { MemberListItemComponent } from './components/member-list-item/member-list-item.component';
import { MemberCarousalComponent } from './components/member-carousal/member-carousal.component';
import { InputFieldComponent } from './shared/components/input-field/input-field.component';
import { DatePickerComponent } from './shared/components/date-picker/date-picker.component';
import { TimeagoModule } from 'ngx-timeago';
import MessagesComponent from './components/messages/messages.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { ThreadItemComponent } from './components/thread-item/thread-item.component';
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
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    ProfileEditComponent,
    PhotoEditComponent,
    MemberListItemComponent,
    MemberCarousalComponent,
    InputFieldComponent,
    DatePickerComponent,
    MessageListComponent,
    ThreadItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TimeagoModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
