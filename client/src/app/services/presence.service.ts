import { INJECTOR, Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { HubType } from '../models/enum/hub-type.enum';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.api.hubUrl;
  private hubConnection?: HubConnection;

  constructor(private toastr: ToastrService, private router: Router) {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(console.log);

    this.hubConnection.on(HubType.userIsOnline, (userId) => {
      this.toastr.info(userId + ' has connected');
    });

    this.hubConnection.on(HubType.userIsOffline, (userId) => {
      this.toastr.info(userId + ' has disconnected');
    });
    this.hubConnection.on(HubType.receivedNewMessage, ({ userId, knownAs }) => {
      this.toastr
        .info(knownAs + ' has send you a new message, click here to see!')
        .onTap.pipe(take(1))
        .subscribe({
          next: (_) => {
            this.router.navigateByUrl('/member/' + userId + '?tab=messages');
          },
        });
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(console.log);
  }
}
