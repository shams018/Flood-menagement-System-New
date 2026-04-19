function ChatArea() {
  return (
    <div className="flex-1 flex flex-col justify-between p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold"># GENERAL-COMMS</h2>
        <p className="text-xs text-gray-400">
          LIVE FEED • 1,240 OPERATORS ONLINE
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 mt-6 space-y-4 overflow-y-auto">
        {/* Message 1 */}
        <div className="bg-gray-800 p-4 rounded-lg max-w-xl">
          <p className="text-sm">
            All personnel transition to{" "}
            <span className="text-yellow-400">Sector 7</span>. Aerial
            surveillance confirms rising water levels.
          </p>
        </div>

        {/* Message 2 */}
        <div className="bg-gray-800 p-4 rounded-lg max-w-xl">
          <p className="text-sm">
            Copy that Command. Units positioned at Sector 7 perimeter.
          </p>
        </div>

        {/* Message 3 (Highlighted) */}
        <div className="bg-blue-400 text-black p-4 rounded-lg max-w-xl ml-auto">
          <p className="text-sm">
            On-site at Sector 7 Bridge. Visibility is low due to fog.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <input
          className="flex-1 bg-gray-800 p-3 rounded-lg outline-none"
          placeholder="Type message..."
        />
        <button className="bg-blue-600 px-6 rounded-lg">SEND</button>
      </div>
    </div>
  );
}

export default ChatArea;
