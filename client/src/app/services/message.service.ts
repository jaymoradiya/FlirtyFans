import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  getPaginationParams,
  getPaginationResult,
} from '../helpers/paginnation-helper';
import { Message } from '../models/message.model';
import { ApiResponse } from '../models/api-response.model';
import { Thread } from '../models/thread.model';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user.model';
import { HubType } from '../models/enum/hub-type.enum';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.api.baseUrl;
  hubUrl = environment.api.hubUrl;
  hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  createHubConnection(user: User, otherUserId: number) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?userId=' + otherUserId, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(console.log);

    this.hubConnection.on(
      HubType.receiveThreadMessages.toString(),
      (messages: Message[]) => {
        this.messageThreadSource.next(messages);
      }
    );

    this.hubConnection.on(HubType.newMessage, (newMessage: Message) => {
      this.messageThreadSource.next([
        ...this.messageThreadSource.getValue(),
        newMessage,
      ]);
    });
  }

  stopHubConnection() {
    if (this.hubConnection) this.hubConnection.stop().catch(console.log);
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationParams({ pageNumber, pageSize } as any);

    params = params.append('container', container);
    return getPaginationResult<Message[]>(
      this.baseUrl + 'messages',
      params,
      this.http
    );
  }

  getThreads() {
    return this.http.get<ApiResponse<Thread[]>>(
      this.baseUrl + 'messages/threads'
    );
  }

  async sendMessage(userId: number, content: string) {
    return await this.hubConnection
      ?.invoke('SendMessage', {
        recipientUserId: userId,
        content,
      })
      .catch(console.log);
  }

  getThreadMessages(otherUserId: number) {
    return this.http.get<ApiResponse<Message[]>>(
      this.baseUrl + 'messages/thread/' + otherUserId
    );
  }
}
