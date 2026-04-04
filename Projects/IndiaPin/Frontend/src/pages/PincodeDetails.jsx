import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building, GraduationCap, ArrowLeft, Loader2, Info, CheckCircle2, ShieldAlert, Cpu, Activity } from 'lucide-react';
import api from '../utils/api';

const PincodeDetails = () => {
  const { pincode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPincodeDetails();
  }, [pincode]);

  const fetchPincodeDetails = async () => {
    if (!pincode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/pincode/${pincode}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Protocol identification failure.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 pt-48 max-w-2xl mx-auto text-center space-y-10">
        <div className="bg-primary/5 p-12 rounded-[3rem] border border-primary/20 inline-block shadow-inner">
            <ShieldAlert className="w-24 h-24 text-primary mx-auto opacity-50" />
        </div>
        <div className="space-y-4">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter tracking-widest">Protocol Nullified</h2>
            <p className="text-text-muted text-lg font-bold">{error || 'The requested node signature was not found in the global index.'}</p>
        </div>
        <Link to="/explore" className="btn-primary inline-flex items-center gap-3 lowercase italic tracking-widest">
            <ArrowLeft className="w-5 h-5" />
            re-initialize system explore
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 pt-12 flex justify-center"
    >
      <div className="w-full max-w-4xl glass-card p-16 relative overflow-hidden group shadow-[0_0_100px_rgba(0,229,255,0.05)] border-white/10">
        {/* Futurist Grid Texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 border-b border-white/5 pb-12 relative z-10">
          <div className="space-y-4">
            <Link to="/explore" className="text-[10px] font-black text-primary uppercase flex items-center gap-2 hover:opacity-100 opacity-60 tracking-[0.3em] transition-all group-hover:opacity-100">
              <ArrowLeft className="w-4 h-4" />
              BACK TO EXPLORER
            </Link>
            <h2 className="text-6xl font-black text-white tracking-widest uppercase italic leading-none">
               {data.officeName}
            </h2>
            <div className="flex items-center gap-4">
              <span className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] ${
                data.deliveryStatus === 'Delivery' ? 'bg-primary text-black' : 'bg-surface hover:bg-surface-hover text-text-muted border border-white/10'
              }`}>
                {data.deliveryStatus} ENABLED
              </span>
              <span className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] bg-white/5 text-text-main border border-white/10 opacity-70">
                {data.officeType} CLASS
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary to-secondary p-12 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,229,255,0.4)] transition-transform group-hover:scale-105 duration-700">
            <div className="flex items-center gap-2 text-black/40 font-black uppercase text-[10px] tracking-widest mb-2">
                <Cpu className="w-4 h-4" /> NODE SIG
            </div>
            <p className="text-6xl font-black text-black tabular-nums tracking-tighter italic">{data.pincode}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16 relative z-10 px-4">
            <DetailItem label="Sector / District" value={data.districtName} icon={MapPin} color="primary" />
            <DetailItem label="Sub-Node / Taluk" value={data.taluk} icon={Building} color="primary" />
            <DetailItem label="Cluster Manager / Division" value={data.divisionName} icon={GraduationCap} color="primary" />
            <DetailItem label="Operational Hub / Region" value={data.regionName} icon={Activity} color="primary" />
            <DetailItem label="Control Unit / Circle" value={data.circleName} icon={CheckCircle2} color="primary" />
            <DetailItem label="Domain / State" value={data.stateName} icon={MapPin} color="primary" />
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">system verified protocol encryption: optimal</p>
            <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary/40" />
                <div className="w-2 h-2 rounded-full bg-primary/10" />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const DetailItem = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex items-center gap-8 group p-4 rounded-3xl transition-all duration-500 hover:bg-white/5">
        <div className={`p-5 rounded-3xl bg-background border border-white/5 shadow-inner text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500`}>
            <Icon className="w-8 h-8 stroke-[2.5px]" />
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">{label}</p>
            <p className="text-2xl font-black text-white italic uppercase group-hover:text-primary transition-colors">{value || 'N/A'}</p>
        </div>
    </div>
  );
};

export default PincodeDetails;
