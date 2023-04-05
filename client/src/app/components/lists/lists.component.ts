import { Component } from '@angular/core';
import { Member } from 'src/app/models/member.model';
import { UserService } from 'src/app/services/user.service';
import { Pagination } from '../../models/pagination.model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent {
  members: Member[] = [];
  pageNumber = 1;
  pageSize = 4;
  pagination: Pagination | undefined;

  predicate = 'liked';

  constructor(private userService: UserService) {
    this.loadLikes();
  }

  loadLikes() {
    this.userService
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe({
        next: (res) => {
          this.members = res.data;
          this.pagination = res.pagination;
        },
      });
  }

  onPageChange(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
