import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { Pagination } from 'src/app/models/pagination.model';
import { Thread } from 'src/app/models/thread.model';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export default class MessagesComponent implements OnInit {
  messages?: Message[];
  threads?: Thread[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 40;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.loadThreads();
  }

  loadMessages() {
    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe({
        next: (res) => {
          (this.messages = res.data), (this.pagination = res.pagination);
        },
      });
  }

  loadThreads() {
    this.messageService.getThreads().subscribe({
      next: (res) => {
        this.threads = res.data;
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
    var otherUser = users.find((u) => u.id === thread.otherUserId);
    return {
      knownAs: otherUser?.knownAs,
      photoUrl: otherUser?.photoUrl,
      id: otherUser?.id,
    };
  }

  onPageChange(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
