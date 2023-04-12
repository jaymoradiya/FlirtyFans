import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/models/pagination.model';
import { Thread } from 'src/app/models/thread.model';
import { User } from 'src/app/models/user.model';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export default class MessagesComponent implements OnInit {
  selectedThreadUser:
    | {
        id: number;
        photoUrl: string;
        knownAs: string;
      }
    | undefined;
  paramsUserId?: number;
  threads?: Thread[];
  user?: User;
  content: string = '';
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 40;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.paramsUserId = this.route.snapshot.params['id'];
    if (this.paramsUserId) {
      this.selectUserThread(this.paramsUserId);
    }
    this.route.params.subscribe({
      next: (params) => {
        this.paramsUserId = params['id'];
        if (this.paramsUserId) {
          this.selectUserThread(this.paramsUserId);
        }
      },
    });
  }

  ngOnInit(): void {
    this.loadThreads();
  }

  loadThreads() {
    this.messageService.getThreads().subscribe({
      next: (res) => {
        this.threads = res.data;
        if (!this.selectedThreadUser && this.paramsUserId)
          this.selectUserThread(this.paramsUserId);
      },
    });
  }

  getOtherUserDetails(thread: Thread) {
    var users = [
      {
        id: thread.lastMessage.senderId,
        photoUrl: thread.lastMessage.senderUserPhotoUrl,
        knownAs: thread.lastMessage.senderKnownAs,
      },
      {
        id: thread.lastMessage.recipientId,
        photoUrl: thread.lastMessage.recipientUserPhotoUrl,
        knownAs: thread.lastMessage.recipientKnownAs,
      },
    ];
    return users.find((u) => u.id === thread.otherUserId)!;
  }

  selectUserThread(id: number) {
    if (this.threads) {
      let thread = this.threads.find((t) => t.otherUserId == id);
      if (thread) this.selectThread(thread);
      else {
        this.toastr.error(`No previous conversation found with user id: ${id}`);
      }
    }
  }

  selectThread(thread: Thread) {
    this.selectedThreadUser = this.getOtherUserDetails(thread);
    if (this.paramsUserId && this.paramsUserId != thread.otherUserId) {
      this.router.navigateByUrl(
        this.router.url.replace(
          this.paramsUserId.toString(),
          thread.otherUserId.toString()
        )
      );
    }
  }
}
