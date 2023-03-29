import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  member: Member | null = null;
  user: User | null = null;

  @ViewChild('editForm')
  editForm: NgForm | undefined;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (res) => {
        this.user = res;
        console.log('res', res);
        this.loadUser();
      },
    });
  }
  ngOnInit(): void {}

  loadUser() {
    this.userService.getMember(this.user!.id).subscribe({
      next: (res) => (this.member = res.data),
    });
  }

  saveChanges() {
    if (!this.editForm?.valid) return;

    this.userService.updateUser(this.member!).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(res.message);
        }
        this.editForm?.reset(this.member);
      },
    });
  }
}
