import { Component, OnInit } from '@angular/core';
import { from, take } from 'rxjs';
import { MemberListItemType } from 'src/app/models/enum/member-list-item.enum';
import { Member } from 'src/app/models/member.model';
import { Pagination } from 'src/app/models/pagination.model';
import { User } from 'src/app/models/user.model';
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
  mayLikeMembers: Member[] = [];
  chatRequests: Member[] = [];
  memberListType = MemberListItemType;

  pagination?: Pagination;
  userParams: UserParams | undefined;
  genderList = [
    {
      value: 'male',
      display: 'Males',
    },
    {
      value: 'female',
      display: 'Females',
    },
  ];

  constructor(private userService: UserService) {
    this.userParams = this.userService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(pageChange = false) {
    if (this.userParams) {
      if (!pageChange) this.userParams.pageNumber = 1;
      this.userService.getUsers(this.userParams).subscribe({
        next: (res) => {
          if (!res) return;
          this.members = res.data;
          this.mayLikeMembers = [...res.data];
          this.chatRequests = [...res.data];

          this.pagination = res.pagination;
          console.log('pagination ', this.pagination);
        },
      });
    }
  }

  resetFilters() {
    this.userParams = this.userService.resetUserParams();
  }

  onPageChange(event: any) {
    if (this.userParams && this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.userService.setUserParams(this.userParams);
      this.loadMembers(true);
    }
  }
}
