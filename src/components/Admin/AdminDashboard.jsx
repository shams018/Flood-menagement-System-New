import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AlertTriangle, Users, Home, Shield, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import SideBar from './SideBar';
import Header from './Header';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Mock Data ---
const statCards = [
  { title: 'TOTAL VICTIMS', value: '1,248', trend: '+12% from yesterday', icon: <Users size={20} />, color: 'text-white' },
  { title: 'ACTIVE ALERTS', value: '12', trend: '3 High Severity', icon: <AlertTriangle size={20} />, color: 'text-orange-400' },
  { title: 'SHELTERS ACTIVE', value: '82', trend: '85% Capacity Used', icon: <Home size={20} />, color: 'text-blue-400' },
  { title: 'RESCUE TEAMS', value: '45', trend: 'Deployed in Zone A/B', icon: <Shield size={20} />, color: 'text-yellow-200' },
];

const barData = {
  labels: ['', '', '', '', '', '', ''],
  datasets: [{
    data: [30, 50, 80, 65, 40, 35, 20],
    backgroundColor: (context) => context.dataIndex === 2 ? '#a78bfa' : '#64748b',
    borderRadius: 4,
  }],
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { display: false }, y: { display: false } },
};

// --- Components ---

const StatCard = ({ item }) => (
  <motion.div
    className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 flex flex-col justify-between relative overflow-hidden cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
  >
    <div>
      <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">{item.title}</p>
      <h2 className={`text-4xl font-semibold mt-2 ${item.color}`}>{item.value}</h2>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
      {item.trend.includes('+') ? <span className="text-orange-500">↗</span> : null}
      {item.trend}
    </div>
    <div className="absolute -bottom-2.5 -right-2.5 opacity-10 text-white">
      {item.icon}
    </div>
  </motion.div>
);

function AdminDashboard() {
  return (
    <section className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      {/* SideBar */}
      <aside className="w-64 h-full bg-[#1e1e1e] border-r border-gray-800 hidden md:flex flex-col">
        <SideBar />
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar pl-9">
        <Header />
        <div className="p-4 lg:p-2 scroll-auto">
          <div className="min-h-screen bg-[#121212] text-gray-200 p-4 lg:p-8 font-sans ">

            {/* 1. Top Stats Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {statCards.map((card, i) => <StatCard key={i} item={card} />)}
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >

              {/* 2. Main Chart Section */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 h-100 flex flex-col"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-xl font-semibold">Flood Alerts Over Time</h3>
                      <p className="text-gray-500 text-xs uppercase">7-Day Incident Frequency</p>
                    </div>
                    <button className="bg-gray-800 text-[10px] px-3 py-1 rounded text-gray-400 font-bold uppercase tracking-tighter hover:bg-gray-700 transition">Live Feed</button>
                  </div>
                  <div className="grow">
                    <Bar data={barData} options={barOptions} />
                  </div>
                </motion.div>

                {/* 3. Recent Submissions Table */}
                <motion.div
                  className="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="p-6 flex justify-between items-center border-b border-gray-800">
                    <h3 className="text-xl font-semibold">Recent Submissions</h3>
                    <div className="flex gap-4 text-gray-500">
                      <Filter size={18} className="cursor-pointer hover:text-white transition" />
                      <Download size={18} className="cursor-pointer hover:text-white transition" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#1a1a1a] text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-medium">Reporter</th>
                          <th className="px-6 py-4 font-medium">Location</th>
                          <th className="px-6 py-4 font-medium">Priority</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {[
                          { name: 'John Doe', loc: 'Region 7 - North Bank', prio: 'CRITICAL', status: 'Pending Review', init: 'JD' },
                          { name: 'Alice Smith', loc: 'Region 4 - West Gate', prio: 'HIGH', status: 'Pending Review', init: 'AS' }
                        ].map((row, i) => (
                          <motion.tr
                            key={i}
                            className="hover:bg-[#252525] transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                          >
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">{row.init}</div>
                              <div>
                                <p className="font-bold text-sm">{row.name}</p>
                                <p className="text-[10px] text-gray-500">2 mins ago</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">{row.loc}</td>
                            <td className="px-6 py-4 text-[10px]">
                              <span className={`px-2 py-1 rounded-full font-bold ${row.prio === 'CRITICAL' ? 'bg-red-900 text-red-200' : 'bg-yellow-900 text-yellow-200'}`}>
                                {row.prio}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-gray-600"></div> {row.status}
                            </td>
                            <td className="px-6 py-4"></td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>

              {/* 4. Sidebar AI & Resources Section */}
              <div className="space-y-6">
                {/* AI Report Preview */}
                <motion.div
                  className="bg-[#1e1e1e] p-6 rounded-xl border-l-4 border-blue-500"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-center gap-2 mb-4 text-blue-400">
                    <span className="text-xl">✨</span>
                    <h3 className="font-semibold uppercase text-xs tracking-widest text-white">AI Report Preview</h3>
                  </div>
                  <div className="text-gray-400 text-sm space-y-4 leading-relaxed">
                    <p>Predictive models indicate a <span className="text-yellow-500 font-bold">24% increase</span> in water levels at the Northern Basin within 4 hours.</p>
                    <p>Current displacement trends suggest prioritizing <span className="text-blue-400 font-bold">Zone Delta</span> for additional shelter logistics.</p>
                    <p>Communication patterns show high congestion in mobile networks...</p>
                  </div>
                  <div className="mt-8 flex justify-between items-center">
                    <p className="text-[10px] text-gray-600 font-bold uppercase">Confidence Score: 94%</p>
                    <button className="text-blue-400 text-xs font-bold hover:text-blue-300 transition">Full Analysis</button>
                  </div>
                </motion.div>

                {/* Resource Allocation */}
                <motion.div
                  className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-lg font-semibold mb-6">Resource Allocation</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Food & Medical', val: 45, color: 'bg-blue-400' },
                      { label: 'Search & Rescue', val: 30, color: 'bg-yellow-400' },
                      { label: 'Infrastructure', val: 25, color: 'bg-red-400' }
                    ].map((res, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}
                      >
                        <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-2">
                          <span>{res.label}</span>
                          <span>{res.val}%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full">
                          <motion.div
                            className={`${res.color} h-1.5 rounded-full`}
                            style={{ width: `${res.val}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${res.val}%` }}
                            transition={{ duration: 1, delay: 1.6 + i * 0.1 }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Victims by Region (Mini Bar Chart) */}
                <motion.div
                  className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-lg font-semibold mb-6">Victims by Region</h3>
                  <div className="flex justify-between items-end h-32 gap-2">
                    {[80, 30, 60, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex flex-col items-center flex-1 gap-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.6 + i * 0.1 }}
                      >
                        <span className="text-[10px] text-gray-600 font-bold">R{i + 1}</span>
                        <div className="w-full bg-gray-800 rounded-t-md overflow-hidden" style={{ height: '100px' }}>
                          <motion.div
                            className="bg-blue-400/50 w-full rounded-t-md"
                            style={{ height: `${h}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 1.8 + i * 0.1 }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

            </motion.div>
          </div>
        </div>
      </main>
    </section>
  );
}
export default AdminDashboard;