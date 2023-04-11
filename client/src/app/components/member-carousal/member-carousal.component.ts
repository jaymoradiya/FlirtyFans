import { Component, Input } from '@angular/core';
import { Member } from 'src/app/models/member.model';
import { Pagination } from 'src/app/models/pagination.model';
import { UserParams } from 'src/app/models/userparams.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-carousal',
  templateUrl: './member-carousal.component.html',
  styleUrls: ['./member-carousal.component.css'],
})
export class MemberCarousalComponent {
  members: Member[] = [];
  dummyMember = {} as Member;
  pagination?: Pagination;

  userParams: UserParams | undefined;

  get carousalMembers() {
    return Array.from(
      {
        length: 4,
      },
      (_, idx) => ++idx
    );
  }

  constructor(private userService: UserService) {
    this.userParams = this.userService.getUserParams();
  }

  ngOnInit(): void {
    console.log(this.userParams);
    this.loadMembers();
  }

  loadMembers(pageChange = false) {
    if (this.userParams) {
      if (!pageChange) this.userParams.pageNumber = 1;
      this.userService.getUsers(this.userParams).subscribe({
        next: (res) => {
          if (!res) return;
          this.members = [...new Set([...this.members, ...res.data])];
          this.pagination = res.pagination;
        },
      });
    }
  }

  onPageChange(pageNumber: number) {
    if (this.userParams && this.userParams.pageNumber !== pageNumber) {
      this.userParams.pageNumber = pageNumber;
      this.userService.setUserParams(this.userParams);
      this.loadMembers(true);
    }
  }
}
