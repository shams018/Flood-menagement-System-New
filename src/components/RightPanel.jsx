function RightPanel() {
  return (
    <div className="w-72 bg-slate-800/50 p-4">
      <h3 className="text-sm text-gray-400 mb-3">ADMINS</h3>

      <div className="bg-gray-800 p-3 rounded-lg mb-4">COMMAND_CENTRAL</div>

      <h3 className="text-sm text-gray-400 mb-3">NGO RESPONDERS</h3>

      <div className="space-y-2">
        <div className="bg-gray-800 p-2 rounded">RESCUE_RED_CROSS</div>
        <div className="bg-gray-800 p-2 rounded">UN_RELIEF_OPS</div>
      </div>

      <div className="mt-6">
        <p className="text-xs text-gray-400">SYSTEM HEALTH</p>
        <div className="h-2 bg-gray-700 rounded mt-2">
          <div className="h-2 bg-blue-500 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default RightPanel;
