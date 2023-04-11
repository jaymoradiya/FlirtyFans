import { Component, OnInit } from '@angular/core';
import { MemberListItemType } from 'src/app/models/enum/member-list-item.enum';
import { Member } from 'src/app/models/member.model';
import { Pagination } from 'src/app/models/pagination.model';
import { Thread } from 'src/app/models/thread.model';
import { UserParams } from 'src/app/models/userparams.model';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  mayLikeMembers: Member[] = [];
  messageThreads: Thread[] = [];
  predicate = 'likedBy';
  memberListType = MemberListItemType;
  showFilter = false;

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

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.userParams = this.userService.getUserParams();
  }

  ngOnInit(): void {
    // this.loadMembers();
    this.loadLikes();
    this.loadMessageThreads();
  }

  // loadMembers(pageChange = false) {
  //   if (this.userParams) {
  //     if (!pageChange) this.userParams.pageNumber = 1;
  //     this.userService.getUsers(this.userParams).subscribe({
  //       next: (res) => {
  //         if (!res) return;
  //         this.members = res.data;
  //         this.chatRequests = [...res.data];
  //
  //         this.pagination = res.pagination;
  //       },
  //     });
  //   }
  // }

  loadLikes() {
    this.userService.getLikes(this.predicate, 1, 3).subscribe({
      next: (res) => {
        this.mayLikeMembers = res.data;
      },
    });
  }

  loadMessageThreads() {
    this.messageService.getThreads().subscribe({
      next: (res) => {
        this.messageThreads = res.data;
      },
    });
  }

  // resetFilters() {
  //   this.userParams = this.userService.resetUserParams();
  // }

  // onPageChange(event: any) {
  //   if (this.userParams && this.userParams.pageNumber !== event.page) {
  //     this.userParams.pageNumber = event.page;
  //     this.userService.setUserParams(this.userParams);
  //     this.loadMembers(true);
  //   }
  // }
}
