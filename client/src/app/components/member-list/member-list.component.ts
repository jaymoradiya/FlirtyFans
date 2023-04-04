import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { MemberListItemType } from 'src/app/models/enum/member-list-item.enum';
import { Member } from 'src/app/models/member.model';
import { Pagination } from 'src/app/models/pagination.model';
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
  pageNumber = 1;
  pageSize = 4;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.userService.getUsers(this.pageNumber, this.pageSize).subscribe({
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

  onPageChange(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
