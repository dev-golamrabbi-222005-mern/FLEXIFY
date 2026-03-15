

"use client";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, ArrowUpRight, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const monthlyEarnings = [
  { month: "Sep", amount: 32000 },
  { month: "Oct", amount: 35000 },
  { month: "Nov", amount: 38000 },
  { month: "Dec", amount: 36000 },
  { month: "Jan", amount: 42000 },
  { month: "Feb", amount: 45000 },
];

const recentPayments = [
  { client: "Arif Hossain", amount: "৳5,000", date: "Mar 1, 2025", status: "Paid", plan: "Premium" },
  { client: "Nadia Akter", amount: "৳3,500", date: "Mar 1, 2025", status: "Paid", plan: "Standard" },
  { client: "Kamal Uddin", amount: "৳5,000", date: "Feb 28, 2025", status: "Paid", plan: "Premium" },
  { client: "Rashed Khan", amount: "৳3,500", date: "Feb 28, 2025", status: "Pending", plan: "Standard" },
  { client: "Sabrina Islam", amount: "৳2,500", date: "Feb 25, 2025", status: "Paid", plan: "Basic" },
];

export default function CoachEarnings() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Earnings</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Overview of your financial performance and client subscriptions.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
            <CreditCard className="w-4 h-4" /> Withdraw Funds
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "This Month", value: "৳45,000", change: "+7%", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
            { label: "Total Clients", value: "24", change: "+3 new", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
            { label: "Growth Rate", value: "12%", change: "Last 30 days", icon: TrendingUp, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
          ].map((s, i) => (
            <motion.div 
              key={s.label} 
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {s.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Chart Section */}
          <motion.div 
            className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-800 dark:text-white">Revenue Analytics</h3>
               <select className="text-xs border-none bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-lg p-2 focus:ring-0 cursor-pointer">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
               </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12} 
                    tick={{fill: '#94a3b8'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12} 
                    tick={{fill: '#94a3b8'}} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderRadius: '12px', 
                        border: 'none', 
                        color: '#fff',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' 
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={35}>
                    {monthlyEarnings.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === monthlyEarnings.length - 1 ? '#6366f1' : '#94a3b8'} 
                          fillOpacity={index === monthlyEarnings.length - 1 ? 1 : 0.2}
                        />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Payments Section */}
          <motion.div 
            className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Recent Transactions</h3>
            <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {recentPayments.map((p, i) => (
                <div key={i} className="flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                      {p.client.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.client}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.plan} Plan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{p.amount}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${p.status === 'Paid' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                      {p.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-auto pt-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors border-t border-slate-100 dark:border-slate-800">
              View All Transactions
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
