import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthType } from 'src/app/models/enum/auth-type.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserAuthModel } from 'src/app/models/user-auth.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmedValidator } from 'src/app/helpers/validators.helper';

type validator = { error: boolean | undefined; message: string };
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild('authForm')
  loginForm: NgForm | undefined;

  signupForm: FormGroup = new FormGroup({});

  @ViewChild('resetForm')
  resetForm: NgForm | undefined;

  authType: AuthType = AuthType.signup;
  AuthTypes = AuthType;
  validationError: string[] = [];
  responseOb: Observable<ApiResponse<User> | null> | undefined;
  responseSub: Subscription | undefined;

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
    private toaster: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const type = this.route.snapshot.params['type'];
    this.changeAuthType(type);
    this.route.params.subscribe((params) => {
      this.changeAuthType(params['type']);
    });
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        gender: ['', Validators.required],
        dob: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  ngOnDestroy(): void {
    this.responseSub?.unsubscribe();
  }

  onSubmit() {
    let user;

    if (this.authType === AuthType.login) {
      if (!this.loginForm?.valid) return;
      user = this.loginForm?.form.value;
    }
    if (this.authType === AuthType.signup) {
      if (!this.signupForm?.valid) return;
      user = this.signupForm.value;
      let dob = this.getDateOnly(user.dob);
      user = {
        ...user,
        dateOfBirth: dob,
      };
    }
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
        this.router.navigate(['members']);
      },
      (err) => {
        this.validationError = err;
        console.log('error occurred!!');
      },
      null
    );
  }

  emailValidate(): validator {
    return {
      error:
        !this.loginForm?.form.get('email')?.valid &&
        this.loginForm?.form.get('email')?.touched &&
        this.loginForm?.form.get('email')?.dirty,
      message: 'please enter valid email',
    };
  }
  passValidate(): validator {
    return {
      error:
        (!this.loginForm?.form.get('password')?.valid &&
          this.loginForm?.form.get('password')?.touched &&
          this.loginForm?.form.get('password')?.dirty) == true,
      message:
        'please enter valid password' +
        (this.loginForm?.form.get('password')?.value.length < 6
          ? ', must be greater than 6 char'
          : ''),
    };
  }
  cPassValidate(): validator {
    return {
      error:
        (this.loginForm?.form.get('cPassword')?.touched &&
          this.loginForm?.form.get('cPassword')?.dirty &&
          (!this.loginForm?.form.get('password')?.valid ||
            this.loginForm?.form.get('password')?.value !=
              this.loginForm?.form.get('cPassword')?.value)) == true,
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

  getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(
      theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }
}
