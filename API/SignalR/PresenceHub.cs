using API.Extensions;
using API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {

        private readonly PresenceTracker _tracker;

        public PresenceHub(PresenceTracker presenceTracker)
        {
            _tracker = presenceTracker;

        }
        public override async Task OnConnectedAsync()
        {
            bool isOnline = await _tracker.UserConnected(Context.User.GetUserId().ToString(), Context.ConnectionId);
            if (isOnline)
                await Clients.Others.SendAsync(HubType.UserIsOnline.Value, Context.User.GetUserId());

            var onlineUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync(HubType.GetOnlineUsers.Value, onlineUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            bool isOffline = await _tracker.UserDisconnect(Context.User.GetUserId().ToString(), Context.ConnectionId);
            if (isOffline)
                await Clients.Others.SendAsync(HubType.UserIsOffline.Value, Context.User.GetUserId());

            await base.OnDisconnectedAsync(exception);
        }
    }
}