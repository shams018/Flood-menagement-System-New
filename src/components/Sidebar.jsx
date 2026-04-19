function Sidebar() {
  return (
    <div className="w-64 bg-slate-800/50 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-sm font-bold tracking-wide text-blue-400">
          PROTOCOL ALPHA
        </h1>
        <p className="text-xs text-gray-500 mb-6">Flood Monitoring</p>

        <div className="space-y-3">
          <div className="bg-gray-700 px-3 py-2 rounded-lg">General</div>
          <div className="flex justify-between">
            <span>Help Requests</span>
            <span className="bg-red-500 text-xs px-2 rounded-full">12</span>
          </div>
          <div>Rescue</div>
          <div>NGO Coordination</div>
        </div>
      </div>

      <button className="bg-gray-700 py-2 rounded-lg mt-6">
        REPORT INCIDENT
      </button>
    </div>
  );
}

export default Sidebar;
