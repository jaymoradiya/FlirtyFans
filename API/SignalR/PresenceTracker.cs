using System.Runtime.CompilerServices;

namespace API.SignalR
{
    public class PresenceTracker
    {
        private readonly static Dictionary<string, List<string>> OnlineUsers = new();


        public Task<bool> UserConnected(string id, string connectionId)
        {
            bool isOnline = false;
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(id))
                {
                    OnlineUsers[id].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(id, new List<string> { connectionId });
                    isOnline = true;
                }
                return Task.FromResult(isOnline);
            }
        }

        public Task<bool> UserDisconnect(string id, string connectionId)
        {
            bool isOffline = false;
            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(id)) return Task.FromResult(isOffline);

                OnlineUsers[id].Remove(connectionId);

                if (OnlineUsers[id].Count == 0)
                {
                    OnlineUsers.Remove(id);
                    isOffline = true;
                }

                return Task.FromResult(isOffline);
            }
        }

        public Task<int[]> GetOnlineUsers()
        {
            int[] users;
            lock (OnlineUsers)
            {
                users = OnlineUsers.OrderBy(u => u.Key).Select(u => int.Parse(u.Key)).ToArray();
            }
            return Task.FromResult(users);
        }

        public static Task<List<string>> GetConnections(int userId)
        {
            List<string> connections;
            lock (OnlineUsers)
            {
                connections = OnlineUsers.GetValueOrDefault(userId.ToString());
            }
            return Task.FromResult(connections);
        }

    }
}