'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  Wind, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { fetchApi } from '@/lib/api';

export default function AnalyticsPage() {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [airQualityReadings, setAirQualityReadings] = useState<any[]>([]);
  const [speciateProfiles, setSpeciateProfiles] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [hist, aq, speciate] = await Promise.all([
          fetchApi<any[]>('/environmental/historical?limit=30').catch(() => []),
          fetchApi<any[]>('/environmental/air-quality').catch(() => []),
          fetchApi<any>('/environmental/speciate-profiles').catch(() => null),
        ]);
        setHistoricalData(hist);
        setAirQualityReadings(aq);
        setSpeciateProfiles(speciate);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  // Format data for speciation radar chart
  const speciationRadarData = [
    { subject: 'VOCs', WasteBurning: 85, Biomass: 55, Vehicular: 90, Industry: 70 },
    { subject: 'PAHs', WasteBurning: 80, Biomass: 45, Vehicular: 75, Industry: 85 },
    { subject: 'Heavy Metals', WasteBurning: 65, Biomass: 20, Vehicular: 40, Industry: 95 },
    { subject: 'Black Carbon', WasteBurning: 90, Biomass: 60, Vehicular: 98, Industry: 75 },
    { subject: 'Levoglucosan', WasteBurning: 92, Biomass: 99, Vehicular: 10, Industry: 15 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Scientific Apportionment & Trends</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Environmental Intelligence & Analytics
        </h1>
        <p className="text-sm text-slate-600">
          Real-time sensor anomalies, historical ambient fluctuations, and chemical fingerprint comparisons from CPCB and EPA SPECIATE reference libraries.
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <span>Loading environmental intelligence datasets...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Chart 1: Historical Daily PM2.5 & PM10 Fluctuations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Historical Daily Ambient Air Quality Data (30 Days)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking daily particulate matter levels, temperature inversion peaks, and recurring episodes.
                </p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-mono">
                CPCB Baseline
              </span>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="pm25" stroke="#ef4444" name="PM2.5 (µg/m³)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="pm10" stroke="#f59e0b" name="PM10 (µg/m³)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="no2" stroke="#0284c7" name="NO2 (µg/m³)" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Active Monitoring Station Readings & Isolation Forest Anomalies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  <span>Station PM2.5 & Anomaly Intensity</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Unsupervised Isolation Forest detection identifying localized plume spikes.
                </p>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={airQualityReadings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="station_id" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="pm25" fill="#ef4444" name="PM2.5 (µg/m³)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="anomaly_score" fill="#ea580c" name="Anomaly Intensity (0-100)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart: EPA SPECIATE Source Profile Comparison */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span>EPA SPECIATE Chemical Fingerprint Signatures</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Receptor chemical profile comparison (Open Waste Burning vs Biomass vs Vehicles).
                </p>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={speciationRadarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Waste Burning (Plastics/Refuse)" dataKey="WasteBurning" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} />
                    <Radar name="Vehicular Exhaust" dataKey="Vehicular" stroke="#0284c7" fill="#0284c7" fillOpacity={0.2} />
                    <Radar name="Biomass Combustion" dataKey="Biomass" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Model Operational Status Summary */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Model & Dataset Integration Registry</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Air Quality Ingestion</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="font-bold text-white text-sm">CPCB Real-Time AQI</div>
                <p className="text-slate-400 text-[11px]">Isolation Forest anomaly scoring active with baseline contamination factor 0.1.</p>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Plume Trajectory</span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <div className="font-bold text-white text-sm">NOAA HYSPLIT Interface</div>
                <p className="text-slate-400 text-[11px]">Lagrangian backward plume transport vector modeling with simulated Coriolis dispersion fallback.</p>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Chemical Speciation</span>
                  <span className="text-amber-400 font-bold">SIMULATED</span>
                </div>
                <div className="font-bold text-white text-sm">EPA SPECIATE v5.4 / CMB 8.2</div>
                <p className="text-slate-400 text-[11px]">Receptor profile mass-balance comparison operating on illustrative demonstration speciation.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

