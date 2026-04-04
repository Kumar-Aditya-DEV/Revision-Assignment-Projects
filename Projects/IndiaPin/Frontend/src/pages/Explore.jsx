import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Loader2, MapPin, Grid, Layers, Activity } from 'lucide-react';
import api from '../utils/api';

const Explore = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Filters
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    fetchStates();
    fetchData();
  }, []);

  const fetchStates = async () => {
    const res = await api.get('/states');
    setStates(res.data);
  };

  const fetchData = async (resetPage = false) => {
    setLoading(true);
    const p = resetPage ? 1 : page;
    if (resetPage) setPage(1);
    try {
      const res = await api.get('/pincodes', {
        params: {
          state: selectedState,
          district: selectedDistrict,
          taluk: selectedTaluk,
          page: p,
          limit
        }
      });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleStateChange = async (s) => {
    setSelectedState(s);
    setSelectedDistrict('');
    setSelectedTaluk('');
    setDistricts([]);
    setTaluks([]);
    if (s) {
      const res = await api.get(`/states/${s}/districts`);
      setDistricts(res.data);
    }
  };

  const handleDistrictChange = async (d) => {
    setSelectedDistrict(d);
    setSelectedTaluk('');
    setTaluks([]);
    if (d) {
      const res = await api.get(`/states/${selectedState}/districts/${d}/taluks`);
      setTaluks(res.data);
    }
  };

  const handleApplyFilters = () => {
    fetchData(true);
  };

  // Debounced Search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    debounceTimeout.current = setTimeout(async () => {
      const res = await api.get(`/search?q=${searchQuery}`);
      setSuggestions(res.data);
    }, 500);
  }, [searchQuery]);

  const handleExport = () => {
    const exportUrl = `${api.defaults.baseURL}/export?state=${selectedState}`;
    window.open(exportUrl, '_blank');
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 pt-10 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[11px] uppercase">
             <Layers className="w-4 h-4" />
             QUERY AGENT STATUS: ONLINE
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Directory Explorer</h2>
          <p className="text-text-muted text-lg font-medium opacity-70">Query deep indexed postal protocols.</p>
        </div>
        <div className="relative w-full max-w-lg group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary text-text-muted transition-colors duration-300">
            <Search className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <input
            type="text"
            className="input-field pl-14 py-5 text-lg font-bold placeholder:opacity-30 group-focus-within:shadow-[0_0_20px_rgba(0,229,255,0.1)] group-focus-within:bg-surface"
            placeholder="Search Office / PIN / District..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="absolute top-full left-0 w-full mt-4 bg-surface border border-primary/20 rounded-2xl overflow-hidden z-[60] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              >
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-8 py-5 border-b border-white/5 hover:bg-primary/5 cursor-pointer flex items-center gap-6 transition-all duration-200"
                    onClick={() => {
                        navigate(`/pincode/${item.pincode}`);
                    }}
                  >
                    <div className="bg-primary/10 p-3 rounded-xl"><MapPin className="w-5 h-5 text-primary stroke-[2.5px]" /></div>
                    <div className="flex-1">
                        <p className="text-white font-black text-sm uppercase tracking-wide">{item.officeName}</p>
                        <p className="text-text-muted text-[11px] font-bold uppercase">{item.districtName}, {item.stateName}</p>
                    </div>
                    <span className="text-primary font-black text-lg tabular-nums">#{item.pincode}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Filters Panel */}
        <aside className="lg:col-span-1">
          <div className="glass-card space-y-10 sticky top-28 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Filter className="w-5 h-5" /></div>
              <h3 className="text-lg font-black text-white italic uppercase tracking-wider">Protocol Filters</h3>
            </div>

            <div className="space-y-8">
              <FilterGroup label="Region Domain">
                <select
                  className="input-field appearance-none cursor-pointer"
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                >
                  <option value="">ALL DOMAINS (STATES)</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterGroup>

              <FilterGroup label="Sector Focus">
                <select
                  className="input-field appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!selectedState}
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  <option value="">ALL SECTORS (DISTRICTS)</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </FilterGroup>

              <FilterGroup label="Sub-Node Filter">
                <select
                  className="input-field appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!selectedDistrict}
                  value={selectedTaluk}
                  onChange={(e) => setSelectedTaluk(e.target.value)}
                >
                  <option value="">ALL NODES (TALUKS)</option>
                  {taluks.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FilterGroup>

              <div className="flex flex-col gap-4 pt-4">
                <button
                    className="btn-primary w-full group relative overflow-hidden"
                    onClick={handleApplyFilters}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                        Execute Query <Activity className="w-4 h-4" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </button>

                <button
                    className="btn-secondary w-full group flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    onClick={handleExport}
                >
                    <Download className="w-4 h-4 group-hover:animate-bounce" />
                    Download Protocol (CSV)
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Data Table */}
        <div className="lg:col-span-3 space-y-12 mb-20">
          <div className="glass-card p-0 overflow-hidden border-white/5 relative min-h-[600px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
             {loading && (
                 <div className="absolute inset-0 bg-background/60 backdrop-blur-md z-40 flex items-center justify-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                 </div>
             )}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1F2937]/50 uppercase text-[10px] font-black tracking-widest text-text-muted border-b border-white/5">
                  <tr>
                    <th className="px-10 py-6">Node Definition (Office)</th>
                    <th className="px-10 py-6">Signature (PIN)</th>
                    <th className="px-10 py-6">Sector (District)</th>
                    <th className="px-10 py-6">Protocol Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {data.map((item, idx) => (
                    <tr
                      key={idx}
                      className="group table-row-hover relative"
                      onClick={() => navigate(`/pincode/${item.pincode}`)}
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,229,255,0.6)] group-hover:scale-150 transition-transform duration-300" />
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                          <span className="font-black text-white text-sm uppercase tracking-wide group-hover:text-primary transition-colors">{item.officeName}</span>
                        </div>
                      </td>
                      <td className="px-10 py-7 font-black text-primary tabular-nums tracking-widest">#{item.pincode}</td>
                      <td className="px-10 py-7 text-text-muted text-xs font-bold uppercase">{item.districtName}</td>
                      <td className="px-10 py-7">
                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          item.deliveryStatus === 'Delivery' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-text-muted border border-white/5'
                        }`}>
                          {item.deliveryStatus} ENABLED
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && !loading && (
                      <tr>
                          <td colSpan="4" className="px-10 py-32 text-center text-text-muted font-black italic uppercase tracking-widest opacity-20">No protocol data matching query parameters.</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="text-text-muted text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Showing <span className="text-white">{data.length}</span> / <span className="text-white">{total.toLocaleString()}</span> indexed nodes</span>
              <div className="flex items-center gap-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-4 bg-surface border border-white/5 rounded-2xl text-text-muted hover:text-primary hover:border-primary/20 disabled:opacity-10 transition-all active:scale-95"
                  >
                      <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const p = i + 1;
                          return (
                              <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-12 h-12 rounded-2xl text-xs font-black transition-all ${
                                    page === p ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'bg-surface text-text-muted hover:text-white border border-white/5'
                                }`}
                              >
                                  {p}
                              </button>
                          );
                      })}
                      {totalPages > 5 && <span className="text-text-muted/30 px-2 font-black">...</span>}
                  </div>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-4 bg-surface border border-white/5 rounded-2xl text-text-muted hover:text-primary hover:border-primary/20 disabled:opacity-10 transition-all active:scale-95"
                  >
                      <ChevronRight className="w-5 h-5" />
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterGroup = ({ label, children }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] pl-1">{label}</label>
    {children}
  </div>
);

export default Explore;
