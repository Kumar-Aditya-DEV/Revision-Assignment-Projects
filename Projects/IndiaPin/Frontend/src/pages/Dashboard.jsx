import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, MapPin, Building, Activity, GraduationCap, Loader2, TrendingUp, Grid, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [stateDist, setStateDist] = useState([]);
  const [deliveryDist, setDeliveryDist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, stateDistRes, deliveryDistRes] = await Promise.all([
        api.get('/stats'),
        api.get('/stats/state-distribution'),
        api.get('/stats/delivery-distribution'),
      ]);
      setStats(statsRes.data);
      setStateDist(stateDistRes.data);
      setDeliveryDist(deliveryDistRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const barChartData = {
    labels: stateDist.map(d => d.state),
    datasets: [{
      label: 'PIN Codes per State',
      data: stateDist.map(d => d.count),
      backgroundColor: 'rgba(0, 229, 255, 0.5)',
      hoverBackgroundColor: 'rgba(0, 229, 255, 0.8)',
      borderColor: '#00E5FF',
      borderWidth: 2,
      borderRadius: 12,
    }],
  };

  const pieChartData = deliveryDist && {
    labels: ['Delivery Authorized', 'Non-Delivery Support'],
    datasets: [{
      data: [deliveryDist.delivery, deliveryDist.nonDelivery],
      backgroundColor: ['rgba(0, 229, 255, 0.7)', 'rgba(156, 163, 175, 0.2)'],
      borderColor: ['#00E5FF', 'rgba(156, 163, 175, 0.3)'],
      borderWidth: 2,
    }],
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 pt-10 max-w-7xl mx-auto space-y-12"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[11px] uppercase">
             <Activity className="w-4 h-4" />
             NETWORK STATUS: OPTIMAL
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Dashboard Analytics</h2>
          <p className="text-text-muted text-lg font-medium opacity-70">Infrastructure metrics across the Indian postal domain.</p>
        </div>
        <div className="px-6 py-4 glass-card p-4 hover:border-primary/40 group flex items-center gap-4 cursor-pointer transition-all">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><TrendingUp className="w-6 h-6" /></div>
            <div className="pr-4">
                <p className="text-[10px] font-bold text-text-muted uppercase">Global Reach</p>
                <p className="text-white font-black text-xl">100.0%</p>
            </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registrations" value={stats?.totalPincodes} icon={Grid} desc="PIN code entries" />
        <StatCard title="Domain Reach" value={stats?.totalStates} icon={MapPin} desc="States & UTs Covered" />
        <StatCard title="Delivery Nodes" value={stats?.deliveryOffices} icon={ShieldCheck} desc="Active Delivery Points" />
        <StatCard title="Support Nodes" value={stats?.nonDeliveryOffices} icon={GraduationCap} desc="Secondary Service Hubs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-card space-y-8 glass-card-hover group">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white italic uppercase">Statewise Density</h3>
            <p className="text-xs text-text-muted font-bold tracking-widest">INFRASTRUCTURE LOAD: TOP 10 REGIONS</p>
          </div>
          <div className="h-[450px]">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { 
                      backgroundColor: '#1F2937', 
                      titleColor: '#00E5FF', 
                      bodyColor: '#E5E7EB',
                      padding: 12,
                      cornerRadius: 8,
                      borderColor: 'rgba(0, 229, 255, 0.2)',
                      borderWidth: 1
                  }
                },
                scales: {
                  y: { 
                      grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, 
                      ticks: { color: '#9CA3AF', font: { weight: 'bold', size: 10 } } 
                  },
                  x: { 
                      grid: { display: false }, 
                      ticks: { color: '#F3F4F6', font: { weight: 'bold', size: 11 } } 
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card space-y-8 glass-card-hover group">
          <h3 className="text-xl font-black text-white italic uppercase">Protocol Integrity</h3>
          <p className="text-xs text-text-muted font-bold tracking-widest uppercase">Delivery Authentication Ratio</p>
          <div className="h-[380px] flex items-center justify-center p-4">
            {pieChartData && <Pie 
                data={pieChartData} 
                options={{ 
                    maintainAspectRatio: false, 
                    plugins: { 
                        legend: { 
                            position: 'bottom', 
                            labels: { 
                                color: '#9CA3AF', 
                                font: { weight: 'bold', size: 12 },
                                padding: 25,
                                usePointStyle: true
                            } 
                        } 
                    } 
                }} 
            />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon: Icon, desc }) => {
  return (
    <div className="glass-card glass-card-hover group cursor-default">
      <div className="flex items-start justify-between mb-4">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{title}</p>
          <div className="p-3 rounded-xl bg-background border border-white/5 text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-inner">
             <Icon className="w-5 h-5 stroke-[2.5px]" />
          </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-black text-white tabular-nums tracking-tighter">
            {value?.toLocaleString()}
        </p>
        <p className="text-[11px] font-bold text-primary italic opacity-70 uppercase tracking-wider">{desc}</p>
      </div>
    </div>
  );
};

export default Dashboard;
