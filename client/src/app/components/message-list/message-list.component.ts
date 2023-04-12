import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
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
export class MessageListComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  recipientUser: any;
  @Input()
  showNav = false;
  messages: Message[] | undefined;
  @ViewChild('message-view')
  messageView: HTMLElement | undefined;
  messageSubscription: Subscription | undefined;

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
    this.stopHubConnection();
  }

  ngOnInit(): void {
    this.messageSubscription = this.messageService.messageThread$.subscribe({
      next: (messages) => {
        this.messages = messages;
        if (this.messageView)
          this.messageView.scrollTop = this.messageView.scrollHeight;
      },
    });
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
    this.loadMessages();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (
        propName == 'recipientUser' &&
        !changes['recipientUser'].firstChange
      ) {
        if (
          changes['recipientUser'].currentValue['id'] !=
          changes['recipientUser'].previousValue['id']
        ) {
          this.stopHubConnection();
          this.loadMessages();
        }
      }
    }
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
          if (this.messageView)
            this.messageView.scrollTop = this.messageView.scrollHeight;
        });
  }

  onPageChange(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
    }
  }

  private stopHubConnection() {
    this.messageService.stopHubConnection();
    this.messages = [];
  }
}
