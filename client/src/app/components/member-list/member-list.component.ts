import { Component, OnInit } from '@angular/core';
import { from, take } from 'rxjs';
import { MemberListItemType } from 'src/app/models/enum/member-list-item.enum';
import { Member } from 'src/app/models/member.model';
import { Pagination } from 'src/app/models/pagination.model';
import { UserParams } from 'src/app/models/userparams.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  carousalMembers: number[] = [];
  mayLikeMembers: Member[] = [];
  chatRequests: Member[] = [];
  memberListType = MemberListItemType;

  rotate = true;
  maxSize = 5;
  status = 'ON';
  pagination?: Pagination;
  userParams: UserParams | undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.userParams = new UserParams(user);
        }
      },
    });
  }
  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.userService.getUsers(this.userParams).subscribe({
        next: (res) => {
          if (!res) return;
          this.members = res.data;
          this.mayLikeMembers = [...res.data];
          this.chatRequests = [...res.data];

          this.pagination = res.pagination;
          this.carousalMembers = Array.from(
            {
              length: 3,
            },
            (_, idx) => ++idx
          );
        },
      });
    }
  }

  onPageChange(event: any) {
    if (this.userParams && this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
