namespace API.Helpers
{
    public class HubType
    {
        private HubType(string value) { Value = value; }

        public string Value { get; private set; }

        public static HubType UserIsOnline { get { return new HubType("UserIsOnline"); } }
        public static HubType UserIsOffline { get { return new HubType("UserIsOffline"); } }
        public static HubType GetOnlineUsers { get { return new HubType("GetOnlineUsers"); } }
        public static HubType ReceiveThreadMessages { get { return new HubType("ReceiveThreadMessages"); } }
        public static HubType NewMessage { get { return new HubType("NewMessage"); } }

        public static HubType ReceivedNewMessage { get { return new HubType("ReceivedNewMessage"); } }

        public override string ToString()
        {
            return Value;
        }
    }
}