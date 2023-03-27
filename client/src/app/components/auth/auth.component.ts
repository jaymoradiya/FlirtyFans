import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AuthType } from 'src/app/models/enum/auth-type.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserAuthModel } from 'src/app/models/user-auth.model';
import { ToastrService } from 'ngx-toastr';

type validator = { error: boolean | undefined; message: string };
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild('authForm')
  authForm: NgForm | undefined;

  @ViewChild('signupForm')
  signupForm: NgForm | undefined;

  @ViewChild('resetForm')
  resetForm: NgForm | undefined;

  authType: AuthType = AuthType.signup;
  AuthTypes = AuthType;
  response: ApiResponse<User> | null | undefined;
  responseOb: Observable<ApiResponse<User> | null> | undefined;
  responseSub: Subscription | undefined;

  isLoading = false;

  pageInfo: {
    title: string;
    subtitle_prefix: string;
    linkText: string;
    subtitle_suffix: string;
  } = {
    title: '',
    subtitle_prefix: '',
    subtitle_suffix: '',
    linkText: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    const type = this.route.snapshot.params['type'];
    this.changeAuthType(type);
    this.route.params.subscribe((params) => {
      this.changeAuthType(params['type']);
    });
  }

  ngOnDestroy(): void {
    this.responseSub?.unsubscribe();
  }

  onSubmit() {
    if (!this.authForm?.valid) return;
    this.isLoading = true;
    const user: UserAuthModel = this.authForm?.form.value;
    switch (this.authType) {
      case AuthType.login:
        this.responseOb = this.authService.login(user);
        break;
      case AuthType.signup:
        this.responseOb = this.authService.register(user);
        break;
      case AuthType.resetPass:
        // this.responseOb = this.authService.resetPass(user);
        break;
    }

    this.responseSub = this.responseOb?.subscribe(
      (res) => {
        this.response = res;
        this.isLoading = false;
        this.router.navigate(['profile']);
        this.showMessage();
      },
      (err) => {
        console.log('error occurred!!');
        this.isLoading = false;
        this.response = err;
        this.showMessage();
      },
      null
    );
  }

  emailValidate(): validator {
    return {
      error:
        (!this.authForm?.form.get('email')?.valid &&
          this.authForm?.form.get('email')?.touched &&
          this.authForm?.form.get('email')?.dirty) == true,
      message: 'please enter valid email',
    };
  }
  passValidate(): validator {
    return {
      error:
        (!this.authForm?.form.get('password')?.valid &&
          this.authForm?.form.get('password')?.touched &&
          this.authForm?.form.get('password')?.dirty) == true,
      message:
        'please enter valid password' +
        (this.authForm?.form.get('password')?.value.length < 6
          ? ', must be greater than 6 char'
          : ''),
    };
  }
  cPassValidate(): validator {
    return {
      error:
        (this.authForm?.form.get('cPassword')?.touched &&
          this.authForm?.form.get('cPassword')?.dirty &&
          (!this.authForm?.form.get('password')?.valid ||
            this.authForm?.form.get('password')?.value !=
              this.authForm?.form.get('cPassword')?.value)) == true,
      message: "password doesn't match",
    };
  }

  changeAuthType(type: string) {
    switch (type) {
      case AuthType.login:
        this.authType = AuthType.login;
        break;
      case AuthType.signup:
        this.authType = AuthType.signup;
        break;
      case AuthType.resetPass:
        this.authType = AuthType.resetPass;
        break;
    }
    this.updatePageInfo();
  }

  changeAuthAndNavigate(type: string) {
    if (type != this.authType.toString()) {
      this.changeAuthType(type);
      this.navigateToNewPage();
    }
  }

  navigateToNewPage() {
    this.router.navigate([`/auth/${this.authType}`], {});
  }

  updatePageInfo() {
    switch (this.authType) {
      case AuthType.login:
        this.pageInfo.title = 'Login with your Account';
        this.pageInfo.subtitle_prefix = 'or create ';
        this.pageInfo.subtitle_suffix = 'for free';
        this.pageInfo.linkText = 'new account';
        break;
      case AuthType.signup:
        this.pageInfo.title = 'Create a new Account';
        this.pageInfo.subtitle_prefix = 'or login with ';
        this.pageInfo.subtitle_suffix = '';
        this.pageInfo.linkText = 'existing account';
        break;
      case AuthType.resetPass:
        this.pageInfo.title = 'Forgot password?';
        this.pageInfo.subtitle_prefix = 'remember pass? ';
        this.pageInfo.subtitle_suffix = 'with your account';
        this.pageInfo.linkText = 'login ';
        break;
      default:
        break;
    }
  }

  showMessage() {
    this.toaster.clear();
    if (this.response?.status === true)
      this.toaster.success(this.response?.message, undefined);
    else this.toaster.error(this.response?.message, 'Error!');
  }
}
