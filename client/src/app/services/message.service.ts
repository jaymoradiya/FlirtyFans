import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginationParams, getPaginationResult } from './paginnation-helper';
import { Message } from '../models/message.model';
import { ApiResponse } from '../models/api-response.model';
import { Thread } from '../models/thread.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.api.baseUrl;

  constructor(private http: HttpClient) {}

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

  getThreadMessages(otherUserId: number, pageNumber: number, pageSize: number) {
    return this.http.get<ApiResponse<Message[]>>(
      this.baseUrl + 'messages/thread/' + otherUserId
    );
  }
}
