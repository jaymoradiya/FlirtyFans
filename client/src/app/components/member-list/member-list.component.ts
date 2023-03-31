import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { MemberListItemType } from 'src/app/models/enum/member-list-item.enum';
import { Member } from 'src/app/models/member.model';
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

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.members = res.data;
        this.mayLikeMembers = [...res.data].splice(4, 3);
        this.chatRequests = [...res.data].splice(1, 3);
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
