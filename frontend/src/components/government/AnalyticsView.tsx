'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const MONTHLY_TREND_DATA = [
  { month: 'Jun', wasteBurning: 18, industrial: 12, vehicleOdor: 9, total: 39 },
  { month: 'Jul', wasteBurning: 14, industrial: 10, vehicleOdor: 7, total: 31 },
  { month: 'Aug', wasteBurning: 12, industrial: 11, vehicleOdor: 6, total: 29 },
  { month: 'Sep', wasteBurning: 21, industrial: 14, vehicleOdor: 11, total: 46 },
  { month: 'Oct', wasteBurning: 38, industrial: 19, vehicleOdor: 16, total: 73 },
  { month: 'Nov (Proj)', wasteBurning: 44, industrial: 22, vehicleOdor: 19, total: 85 },
];

const CATEGORY_DATA = [
  { name: 'Waste Burning', incidents: 42, resolved: 28, pending: 14 },
  { name: 'Industrial Flue', incidents: 24, resolved: 16, pending: 8 },
  { name: 'Smoke Emission', incidents: 19, resolved: 13, pending: 6 },
  { name: 'Unusual Odour', incidents: 15, resolved: 9, pending: 6 },
  { name: 'Other Refuse', incidents: 8, resolved: 6, pending: 2 },
];

const WARD_DISTRIBUTION_DATA = [
  { ward: 'Ward M/W (Chembur)', critical: 6, high: 14, medium: 9 },
  { ward: 'Ward M/E (Govandi)', critical: 9, high: 18, medium: 12 },
  { ward: 'Ward L (Kurla)', critical: 3, high: 8, medium: 7 },
  { ward: 'Ward N (Ghatkopar)', critical: 2, high: 5, medium: 6 },
];

export function AnalyticsView() {
  const [timeframe, setTimeframe] = useState<'6m' | '3m' | '1m'>('6m');
  const [filterWard, setFilterWard] = useState<string>('All');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C77B43]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43]">
              Regional Air Quality Intelligence &amp; Trajectory Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8DF]">
            Environmental Analytics &amp; Compliance Trends
          </h1>
          <p className="text-xs font-mono text-[#A8B5A5] mt-0.5">
            Spatial distribution, seasonal burning spikes, and enforcement resolution rate metrics across Eastern Suburbs.
          </p>
        </div>

        {/* Timeframe & Ward Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex border border-[#A8B5A5]/30 bg-[#252C28]">
            <button
              type="button"
              onClick={() => setTimeframe('1m')}
              className={`px-3 py-1 transition-colors ${timeframe === '1m' ? 'bg-[#C77B43] text-[#14251F] font-bold' : 'text-[#A8B5A5]'}`}
            >
              30D
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('3m')}
              className={`px-3 py-1 transition-colors ${timeframe === '3m' ? 'bg-[#C77B43] text-[#14251F] font-bold' : 'text-[#A8B5A5]'}`}
            >
              90D
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('6m')}
              className={`px-3 py-1 transition-colors ${timeframe === '6m' ? 'bg-[#C77B43] text-[#14251F] font-bold' : 'text-[#A8B5A5]'}`}
            >
              6M
            </button>
          </div>

          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="bg-[#252C28] border border-[#A8B5A5]/30 p-1.5 text-xs text-[#EAE8DF] focus:outline-none"
          >
            <option value="All">All Eastern Suburbs</option>
            <option value="Ward M/W">Ward M/W (Chembur)</option>
            <option value="Ward M/E">Ward M/E (Govandi)</option>
            <option value="Ward L">Ward L (Kurla)</option>
          </select>
        </div>
      </div>

      {/* Top Level Diagnostic KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20">
          <span className="text-[10px] uppercase text-[#A8B5A5] block">Post-Monsoon Surge</span>
          <div className="text-2xl font-bold text-[#C77B43] mt-1">+114%</div>
          <span className="text-[10px] text-[#A8B5A5]/70">Open burning filings (Oct-Nov)</span>
        </div>

        <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20">
          <span className="text-[10px] uppercase text-[#A8B5A5] block">Mean Resolution Latency</span>
          <div className="text-2xl font-bold text-[#667B70] mt-1">4.2 Hours</div>
          <span className="text-[10px] text-[#A8B5A5]/70">Rapid response squad dispatch</span>
        </div>

        <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20">
          <span className="text-[10px] uppercase text-[#A8B5A5] block">Attribution Accuracy</span>
          <div className="text-2xl font-bold text-[#EAE8DF] mt-1">87.4%</div>
          <span className="text-[10px] text-[#A8B5A5]/70">CMB 8.2 chemical mass match</span>
        </div>

        <div className="p-4 bg-[#252C28] border border-[#A8B5A5]/20">
          <span className="text-[10px] uppercase text-[#A8B5A5] block">Statutory Compliance Rate</span>
          <div className="text-2xl font-bold text-[#EAE8DF] mt-1">79.2%</div>
          <span className="text-[10px] text-[#A8B5A5]/70">Section 31A directives cleared</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Chart 1: Monthly Trend Line Chart */}
        <section aria-labelledby="trend-chart-heading" className="bg-[#14251F] border border-[#A8B5A5]/25 p-5 md:p-6 space-y-4">
          <div className="pb-3 border-b border-[#A8B5A5]/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block">
                Temporal Analysis
              </span>
              <h2 id="trend-chart-heading" className="text-base font-serif font-bold text-[#EAE8DF]">
                Monthly Incident Ingestion Volume Trends
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#A8B5A5]">2026 Surveillance Log</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252C28" />
                <XAxis dataKey="month" stroke="#A8B5A5" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#A8B5A5" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14251F',
                    borderColor: '#C77B43',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#EAE8DF',
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="wasteBurning" name="Waste Burning" stroke="#C77B43" strokeWidth={2} dot={{ fill: '#C77B43', r: 3 }} />
                <Line type="monotone" dataKey="industrial" name="Industrial Stack" stroke="#A8B5A5" strokeWidth={1.5} dot={{ fill: '#A8B5A5', r: 3 }} />
                <Line type="monotone" dataKey="vehicleOdor" name="Vehicle / Odor" stroke="#667B70" strokeWidth={1.5} dot={{ fill: '#667B70', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Chart 2: Category Breakdown Bar Chart */}
        <section aria-labelledby="category-chart-heading" className="bg-[#14251F] border border-[#A8B5A5]/25 p-5 md:p-6 space-y-4">
          <div className="pb-3 border-b border-[#A8B5A5]/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#667B70] block">
                Category Breakdown
              </span>
              <h2 id="category-chart-heading" className="text-base font-serif font-bold text-[#EAE8DF]">
                Incidents by Pollution Category &amp; Resolution
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#A8B5A5]">Cumulative YTD</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252C28" />
                <XAxis dataKey="name" stroke="#A8B5A5" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#A8B5A5" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14251F',
                    borderColor: '#A8B5A5',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#EAE8DF',
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="resolved" name="Resolved / Abated" fill="#667B70" stackId="a" />
                <Bar dataKey="pending" name="Under Action / Pending" fill="#C77B43" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Chart 3: Ward Severity Distribution */}
        <section aria-labelledby="ward-chart-heading" className="lg:col-span-2 bg-[#14251F] border border-[#A8B5A5]/25 p-5 md:p-6 space-y-4">
          <div className="pb-3 border-b border-[#A8B5A5]/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block">
                Spatial Density &amp; Priority
              </span>
              <h2 id="ward-chart-heading" className="text-base font-serif font-bold text-[#EAE8DF]">
                Ward Severity &amp; Priority Tier Distribution
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#A8B5A5]">Municipal Ward Data</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WARD_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252C28" />
                <XAxis dataKey="ward" stroke="#A8B5A5" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#A8B5A5" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14251F',
                    borderColor: '#B65348',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#EAE8DF',
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="critical" name="Critical Priority" fill="#B65348" />
                <Bar dataKey="high" name="High Priority" fill="#C77B43" />
                <Bar dataKey="medium" name="Medium Priority" fill="#A8B5A5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="p-3 bg-[#1B201D] border border-[#A8B5A5]/15 text-[11px] font-mono text-[#A8B5A5]">
        * All environmental trends, baseline concentrations, and priority distributions are illustrative demonstration models calibrated for the Mumbai Eastern Suburbs geographical domain.
      </div>
    </div>
  );
}

