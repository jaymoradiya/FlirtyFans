import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { Thread } from 'src/app/models/thread.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  @Input()
  recipientUser: any;
  messages: Message[] | undefined;
  messageSubscription: Subscription | undefined;
  @Input()
  showNav = false;

  user?: User;
  content: string = '';
  container = 'Unread';
  pageNumber = 1;
  pageSize = 40;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    if (this.messageSubscription) this.messageSubscription?.unsubscribe();
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.messageSubscription = this.messageService.messageThread$.subscribe({
      next: (messages) => {
        this.messages = messages;
      },
    });
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
    this.loadMessages();
  }

  isMyMessage(message: Message) {
    return message.senderId != this.recipientUser?.id;
  }

  loadMessages() {
    if (this.user && this.recipientUser) {
      this.messageService.createHubConnection(this.user, this.recipientUser.id);
    }
  }

  sendMessage() {
    if (this.recipientUser && this.content != '')
      this.messageService
        .sendMessage(this.recipientUser.id, this.content)
        .then((val) => {
          this.content = '';
        });
  }

  onPageChange(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
    }
  }
}