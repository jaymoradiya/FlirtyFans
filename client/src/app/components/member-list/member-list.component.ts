import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styles: [],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.members = res.data;
      },
    });
  }
}
