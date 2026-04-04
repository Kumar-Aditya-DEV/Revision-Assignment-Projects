import React from 'react';
import { motion } from 'framer-motion';
import { Info, Mail, Globe, MapPin, Layers, Crosshair, Zap, Activity } from 'lucide-react';

const About = () => {
  return (
    <div className="p-8 pt-12 max-w-5xl mx-auto space-y-24 mb-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 text-center"
      >
        <div className="p-8 bg-primary/10 rounded-[3rem] border border-primary/20 inline-block shadow-[0_0_100px_rgba(0,229,255,0.1)] group">
            <Info className="w-16 h-16 text-primary mx-auto group-hover:scale-110 transition-transform duration-700 stroke-[2.5px]" />
        </div>
        <div className="space-y-4">
            <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">The IndiaPin <span className="text-primary italic">Protocol</span></h2>
            <p className="text-xl text-text-muted font-bold tracking-widest uppercase opacity-60">Architecting Global Postal Intelligence</p>
        </div>
        <p className="text-xl text-text-main leading-relaxed font-bold max-w-3xl mx-auto opacity-90">
          IndiaPin is a next-generation geopolitical data engine. We simplify 150,000+ complex postal signatures into a singular, high-performance interface for architects, engineers, and digital explorers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        <FeatureCard
          title="DOMAIN REACH"
          desc="Access over 150,000+ node signatures across all 28 states and 8 union territories."
          icon={MapPin}
          color="primary"
        />
        <FeatureCard
          title="GEO-INDEXING"
          desc="Instant search discovery for offices, districts, and regions with zero latency protocol."
          icon={Crosshair}
          color="primary"
        />
        <FeatureCard
          title="DEEP INSIGHT"
          desc="Visualize infrastructure distribution patterns through predictive dashboard analytics."
          icon={Activity}
          color="primary"
        />
        <FeatureCard
          title="STREAMS & EXPORT"
          desc="Seamlessly capture datasets in CSV format for offline system integration."
          icon={Zap}
          color="primary"
        />
        <FeatureCard
          title="LAYERS & LOGS"
          desc="Multi-layered filtering through cascading protocol queries (State/Dist/Taluk)."
          icon={Layers}
          color="primary"
        />
        <FeatureCard
          title="GLOBAL SIGNALS"
          desc="Official verification against global synchronization marks of India Post."
          icon={Globe}
          color="primary"
        />
      </div>

      <div className="glass-card p-16 mt-24 space-y-12 text-center group bg-gradient-to-br from-primary/5 via-background to-background border-primary/10 hover:border-primary/20">
        <div className="space-y-2">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">Protocol Support Unit</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">SYSTEM OPERATIONS: STABLE</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-16">
            <a href="mailto:support@indiapin.io" className="flex items-center gap-4 text-text-main hover:text-primary transition-all text-xl font-black uppercase italic group-hover:scale-105 duration-500">
                <Mail className="w-6 h-6 stroke-[2.5px]" />
                support@indiapin.io
            </a>
            <a href="https://github.com/indiapin" className="flex items-center gap-4 text-text-main hover:text-primary transition-all text-xl font-black uppercase italic group-hover:scale-105 duration-500">
                <Globe className="w-6 h-6 stroke-[2.5px]" />
                github.com/indiapin
            </a>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon: Icon }) => (
    <div className="glass-card glass-card-hover p-12 rounded-[3rem] space-y-6 group bg-surface hover:bg-surface-hover">
        <div className="p-5 rounded-3xl bg-background border border-white/5 inline-block text-primary group-hover:bg-primary group-hover:text-black transition-all duration-700 shadow-inner">
            <Icon className="w-8 h-8 stroke-[2.5px]" />
        </div>
        <div className="space-y-4">
            <h4 className="text-lg font-black text-white uppercase italic tracking-widest group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-text-muted font-bold text-sm leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{desc}</p>
        </div>
    </div>
)

export default About;
