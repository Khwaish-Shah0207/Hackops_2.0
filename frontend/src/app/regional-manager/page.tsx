'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Shield,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  Flame,
  ArrowRight,
  RefreshCw,
  Plus,
  Eye,
  Check,
  Building2,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { fetchApi } from '@/lib/api';
import { getStoredUser, isRegionalManager } from '@/lib/auth';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const SEVERITY_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#f59e0b',
  Low: '#10b981'
};

export default function RegionalManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'incidents' | 'reports' | 'daily' | 'weekly'>('overview');
  const [loading, setLoading] = useState(true);

  // --- Overview State ---
  const [overviewData, setOverviewData] = useState<any>(null);

  // --- Incidents State ---
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Reports State ---
  const [selectedIncidentIds, setSelectedIncidentIds] = useState<number[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [complianceObservations, setComplianceObservations] = useState('');
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [previewSavedReport, setPreviewSavedReport] = useState<any>(null);

  // --- Daily Briefing State ---
  const [dailyDate, setDailyDate] = useState<string>('2026-11-03');
  const [dailyData, setDailyData] = useState<any>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);

  // --- Weekly Briefing State ---
  const [weekStartDate, setWeekStartDate] = useState<string>('2026-10-28');
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [loadingWeekly, setLoadingWeekly] = useState(false);

  // Auth Guard
  useEffect(() => {
    const user = getStoredUser();
    if (!user || !isRegionalManager()) {
      router.replace('/login/regional-manager');
    }
  }, []);

  // Initial Data Load
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [overview, incList, reports] = await Promise.all([
        fetchApi<any>('/regional/overview'),
        fetchApi<any[]>('/regional/incidents'),
        fetchApi<any[]>('/regional/reports'),
      ]);
      setOverviewData(overview);
      setIncidents(incList);
      setSavedReports(reports);
      if (incList.length > 0) {
        setSelectedIncident(incList[0]);
      }
    } catch (err) {
      console.error('Failed to load regional manager initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Sync activeTab with URL parameter '?tab=...' from the single authoritative top navbar
  useEffect(() => {
    const syncTabFromUrl = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') as 'overview' | 'incidents' | 'reports' | 'daily' | 'weekly' | null;
        if (tab && ['overview', 'incidents', 'reports', 'daily', 'weekly'].includes(tab)) {
          setActiveTab(tab);
        }
      }
    };
    syncTabFromUrl();
    window.addEventListener('popstate', syncTabFromUrl);
    return () => window.removeEventListener('popstate', syncTabFromUrl);
  }, []);


  // Load Daily Briefing
  const loadDailyBriefing = async (dateStr: string) => {
    try {
      setLoadingDaily(true);
      const data = await fetchApi<any>(`/regional/briefing/daily?date=${dateStr}`);
      setDailyData(data);
    } catch (err) {
      console.error('Failed to load daily briefing:', err);
    } finally {
      setLoadingDaily(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'daily') {
      loadDailyBriefing(dailyDate);
    }
  }, [activeTab, dailyDate]);

  // Load Weekly Briefing
  const loadWeeklyBriefing = async (startStr: string) => {
    try {
      setLoadingWeekly(true);
      const data = await fetchApi<any>(`/regional/briefing/weekly?start_date=${startStr}`);
      setWeeklyData(data);
    } catch (err) {
      console.error('Failed to load weekly briefing:', err);
    } finally {
      setLoadingWeekly(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'weekly') {
      loadWeeklyBriefing(weekStartDate);
    }
  }, [activeTab, weekStartDate]);

  // Handle Weekly Navigation
  const handleWeekShift = (days: number) => {
    try {
      const current = new Date(weekStartDate);
      current.setDate(current.getDate() + days);
      const newStr = current.toISOString().slice(0, 10);
      setWeekStartDate(newStr);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle selection for report generation
  const toggleIncidentSelection = (id: number) => {
    setSelectedIncidentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate Report
  const handleGenerateReport = async () => {
    if (selectedIncidentIds.length === 0) {
      alert('Please select at least one incident from the list below.');
      return;
    }
    try {
      setGeneratingReport(true);
      const report = await fetchApi<any>('/regional/reports/generate', {
        method: 'POST',
        body: JSON.stringify({
          incident_ids: selectedIncidentIds,
          title: reportTitle.trim() || undefined,
          compliance_observations: complianceObservations.trim() || undefined,
        }),
      });
      setGeneratedReport(report);
    } catch (err: any) {
      alert(err.message || 'Failed to generate report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  // Save Report
  const handleSaveReport = async () => {
    if (!generatedReport) return;
    try {
      setSavingReport(true);
      const result = await fetchApi<any>('/regional/reports/save', {
        method: 'POST',
        body: JSON.stringify({
          report_number: generatedReport.report_number,
          title: generatedReport.title,
          incident_ids: generatedReport.incidents.map((i: any) => i.id),
          report_type: generatedReport.report_type,
          generated_by: generatedReport.generated_by,
          summary: generatedReport.summary,
          compliance_observations: generatedReport.compliance_observations,
          content: generatedReport,
        }),
      });
      alert(`Report ${generatedReport.report_number} saved successfully!`);
      const updatedReports = await fetchApi<any[]>('/regional/reports');
      setSavedReports(updatedReports);
    } catch (err: any) {
      alert(err.message || 'Failed to save report.');
    } finally {
      setSavingReport(false);
    }
  };

  // Filtered Incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (filterCategory !== 'all' && inc.pollution_type !== filterCategory) return false;
    if (filterSeverity !== 'all' && inc.severity.toLowerCase() !== filterSeverity.toLowerCase()) return false;
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        inc.title?.toLowerCase().includes(q) ||
        inc.complaint_number?.toLowerCase().includes(q) ||
        inc.address?.toLowerCase().includes(q) ||
        inc.description?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-300">Loading Regional Executive Intelligence Console…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs text-indigo-300 font-medium">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Regional Directorate — Eastern Suburbs Compliance Division</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Regional Environmental Oversight Console
          </h1>
          <p className="text-sm text-indigo-200/80 leading-relaxed">
            Multi-incident intelligence aggregation, Lagrangian plume dispersion audits, statutory compliance briefings, and executive report synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadInitialData}
            className="flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-indigo-700/40 text-indigo-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Report</span>
          </button>
        </div>
      </div>



      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && overviewData && (
        <div className="space-y-6">
          {/* 7 Key Statistic Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Incidents</span>
              <p className="text-2xl font-black text-white">{overviewData.total_incidents}</p>
              <span className="text-[10px] text-slate-400">All registered records</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-blue-800/50 bg-blue-950/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">New Incidents</span>
              <p className="text-2xl font-black text-blue-700">{overviewData.new_incidents}</p>
              <span className="text-[10px] text-blue-500">Reported / Under Analysis</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-amber-800/50 bg-amber-950/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Ongoing</span>
              <p className="text-2xl font-black text-amber-700">{overviewData.ongoing_incidents}</p>
              <span className="text-[10px] text-amber-500">Investigating / Action</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-800/50 bg-emerald-950/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Resolved</span>
              <p className="text-2xl font-black text-emerald-700">{overviewData.resolved_incidents}</p>
              <span className="text-[10px] text-emerald-500">Actions completed</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-red-800/50 bg-red-950/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">Critical</span>
              <p className="text-2xl font-black text-red-700">{overviewData.critical_incidents}</p>
              <span className="text-[10px] text-red-500">Severe air hazard / anomaly</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Reports Gen.</span>
              <p className="text-2xl font-black text-indigo-700">{overviewData.reports_generated}</p>
              <span className="text-[10px] text-indigo-500">AI + Regional Audits</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-purple-800/50 bg-purple-950/20 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">Needs Action</span>
              <p className="text-2xl font-black text-purple-700">{overviewData.incidents_requiring_attention}</p>
              <span className="text-[10px] text-purple-500">Pending allocation</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution Chart */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Pollution Category Distribution</h3>
                  <p className="text-xs text-slate-400">Breakdown of reported pollution categories</p>
                </div>
                <Flame className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(overviewData.category_distribution || {}).map(([k, v]) => ({
                      name: k.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                      count: v,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Severity Distribution Pie Chart */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Incident Severity Breakdown</h3>
                  <p className="text-xs text-slate-400">Hazard assessment and sensor anomaly correlation</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(overviewData.severity_distribution || {}).map(([k, v]) => ({
                        name: k,
                        value: v,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {Object.keys(overviewData.severity_distribution || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline & Priority Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity Timeline (1 col) */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Recent Workflow Activity</h3>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {(overviewData.recent_activity || []).map((act: any, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs border-l-2 border-indigo-500 pl-3 py-1">
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{act.changed_by}</span>
                        <span className="text-[10px] text-slate-400">
                          {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </span>
                      </div>
                      <p className="text-slate-300">
                        {act.previous_status} ➔ <b className="text-indigo-600">{act.new_status}</b>
                      </p>
                      {act.notes && <p className="text-slate-400 text-[11px] italic">{act.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Priority Incidents List (2 cols) */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Regional Incident Oversight</h3>
                  <p className="text-xs text-slate-400">Latest complaints received across monitored jurisdiction</p>
                </div>
                <button
                  onClick={() => setActiveTab('incidents')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase font-semibold">
                      <th className="py-2">Incident</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Severity</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(overviewData.recent_incidents || []).map((inc: any) => (
                      <tr key={inc.id} className="hover:bg-slate-800/60 transition">
                        <td className="py-2.5 font-medium text-white">
                          <Link href={`/incidents/${inc.id}`} className="hover:text-indigo-600 hover:underline">
                            {inc.complaint_number}
                          </Link>
                        </td>
                        <td className="py-2.5 text-slate-300">{inc.pollution_type.replace('_', ' ')}</td>
                        <td className="py-2.5">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                            style={{ backgroundColor: SEVERITY_COLORS[inc.severity] || '#64748b' }}
                          >
                            {inc.severity}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-300 font-medium">{inc.status}</td>
                        <td className="py-2.5 text-slate-400 max-w-xs truncate">{inc.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INCIDENT MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-400 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </span>

              {/* Category */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-800/60 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
              >
                <option value="all">All Categories</option>
                <option value="waste_burning">Waste Burning</option>
                <option value="smoke">Dense Smoke</option>
                <option value="dust">Fugitive Dust</option>
                <option value="industrial_emissions">Industrial Emissions</option>
                <option value="odor">Odor</option>
              </select>

              {/* Severity */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-800/60 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800/60 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
              >
                <option value="all">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="Source Identified / Investigation Required">Source Identified</option>
                <option value="Assigned">Assigned</option>
                <option value="Action Taken">Action Taken</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, address, ID…"
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
              </input>
            </div>
          </div>

          {/* Master-Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Incident Cards List (5 cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
              <div className="text-xs font-semibold text-slate-400 px-1 flex justify-between items-center">
                <span>Showing {filteredIncidents.length} incidents</span>
                {selectedIncidentIds.length > 0 && (
                  <span className="text-indigo-600 font-bold">
                    {selectedIncidentIds.length} selected for reporting
                  </span>
                )}
              </div>

              {filteredIncidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                const isChecked = selectedIncidentIds.includes(inc.id);
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleIncidentSelection(inc.id);
                          }}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-700 focus:ring-indigo-500"
                        />
                        <span className="font-mono text-xs font-bold text-white">{inc.complaint_number}</span>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: SEVERITY_COLORS[inc.severity] || '#64748b' }}
                      >
                        {inc.severity}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{inc.title}</h4>

                    <div className="flex items-center text-[11px] text-slate-400 space-x-1 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{inc.address || 'Location captured'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                      <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {inc.status}
                      </span>
                      <span className="text-slate-400">
                        {inc.observed_at ? new Date(inc.observed_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Incident Detail Pane (7 cols) */}
            <div className="lg:col-span-7">
              {selectedIncident ? (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 space-y-6">
                  {/* Detail Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-extrabold text-indigo-700">
                          {selectedIncident.complaint_number}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: SEVERITY_COLORS[selectedIncident.severity] || '#64748b' }}
                        >
                          {selectedIncident.severity} Severity
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white mt-1">{selectedIncident.title}</h2>
                    </div>

                    <Link
                      href={`/incidents/${selectedIncident.id}`}
                      className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Explore Plume Model</span>
                    </Link>
                  </div>

                  {/* Incident Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-800/60 p-3 rounded-xl space-y-0.5">
                      <span className="text-slate-400 uppercase font-bold text-[10px]">Category</span>
                      <p className="font-semibold text-slate-200">{selectedIncident.pollution_type.replace('_', ' ')}</p>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl space-y-0.5">
                      <span className="text-slate-400 uppercase font-bold text-[10px]">Current Status</span>
                      <p className="font-semibold text-indigo-700">{selectedIncident.status}</p>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl space-y-0.5">
                      <span className="text-slate-400 uppercase font-bold text-[10px]">Reported By</span>
                      <p className="font-semibold text-slate-200">{selectedIncident.citizen_name}</p>
                    </div>

                    <div className="bg-slate-800/60 p-3 rounded-xl space-y-0.5 col-span-2 sm:col-span-3">
                      <span className="text-slate-400 uppercase font-bold text-[10px]">Location Address</span>
                      <p className="font-semibold text-slate-200">{selectedIncident.address}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Coordinates: {selectedIncident.latitude.toFixed(4)}, {selectedIncident.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Report Description</h4>
                    <p className="text-sm text-slate-300 bg-slate-800/60 p-3.5 rounded-xl leading-relaxed">
                      {selectedIncident.description}
                    </p>
                  </div>

                  {/* AI Source Attribution */}
                  {selectedIncident.top_candidate && (
                    <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 border border-indigo-200/60 p-4 rounded-xl space-y-2">
                      <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Identified Upwind Emission Source</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-white">{selectedIncident.top_candidate.name}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          {selectedIncident.top_candidate.confidence} Confidence ({selectedIncident.top_candidate.overall_score.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Assignment Information */}
                  <div className="border border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Field Enforcement Assignment</h4>
                    {selectedIncident.assignment ? (
                      <div className="text-xs space-y-1 text-slate-300">
                        <p><b>Officer / Wing:</b> {selectedIncident.assignment.assigned_to_name} ({selectedIncident.assignment.department})</p>
                        <p><b>Priority Level:</b> <span className="font-bold text-indigo-600">{selectedIncident.assignment.priority}</span></p>
                        {selectedIncident.assignment.notes && <p><b>Instructions:</b> {selectedIncident.assignment.notes}</p>}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 italic">No field team assigned yet. Incident pending action.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400 text-sm">
                  Select an incident from the left to inspect complete records and evidence.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REPORT GENERATION */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">Executive Report Synthesis</h3>
              <p className="text-xs text-slate-400">
                Generate consolidated or individual regulatory audit reports backed by actual database records and plume models.
              </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Report Title (Optional)
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Eastern Suburbs Waste Burning & Refuse Smoldering Audit"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Compliance Observations / Statutory Recommendation
                </label>
                <input
                  type="text"
                  value={complianceObservations}
                  onChange={(e) => setComplianceObservations(e.target.value)}
                  placeholder="e.g. Mandate 24/7 drone surveillance along landfill boundary"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Incidents Selection Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Incidents to Include in Report ({selectedIncidentIds.length} selected)
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedIncidentIds(incidents.map((i) => i.id))}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => setSelectedIncidentIds([])}
                    className="text-xs text-slate-400 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                {incidents.map((inc) => {
                  const isChecked = selectedIncidentIds.includes(inc.id);
                  return (
                    <div
                      key={inc.id}
                      onClick={() => toggleIncidentSelection(inc.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-2 ${
                        isChecked ? 'bg-indigo-50 border-indigo-400 font-semibold' : 'bg-slate-800/60 border-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 text-indigo-600 rounded"
                      />
                      <div className="flex-1 truncate">
                        <p className="font-mono text-indigo-900">{inc.complaint_number}</p>
                        <p className="text-slate-300 truncate">{inc.title}</p>
                        <span className="text-[10px] text-slate-400">{inc.severity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateReport}
                disabled={generatingReport || selectedIncidentIds.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2"
              >
                {generatingReport ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling Report…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Compliance Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Report Preview Modal / Block */}
          {generatedReport && (
            <div className="bg-slate-900 p-8 rounded-2xl border-2 border-indigo-200 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-100 text-indigo-800 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {generatedReport.report_number}
                    </span>
                    <span className="text-xs text-slate-400 uppercase font-semibold">
                      {generatedReport.report_type} Report
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{generatedReport.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generated on {generatedReport.generation_date} by {generatedReport.generated_by}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSaveReport}
                    disabled={savingReport}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>{savingReport ? 'Saving…' : 'Save Report'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Executive Summary</h4>
                <p className="text-sm text-slate-300 bg-slate-800/60 p-4 rounded-xl leading-relaxed">
                  {generatedReport.summary}
                </p>
              </div>

              {/* Compliance Observations */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Regulatory Compliance Findings</h4>
                <p className="text-sm text-indigo-900 bg-indigo-50 border border-indigo-100 p-4 rounded-xl leading-relaxed font-medium">
                  {generatedReport.compliance_observations}
                </p>
              </div>

              {/* Incidents Table in Report */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Incident Evidence Records ({generatedReport.incidents.length})
                </h4>
                <div className="space-y-4">
                  {generatedReport.incidents.map((inc: any, idx: number) => (
                    <div key={idx} className="border border-slate-800 rounded-xl p-4.5 space-y-3 bg-slate-800/60/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-indigo-700">{inc.complaint_number}</span>
                          <span className="font-bold text-white text-sm">{inc.title}</span>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white self-start sm:self-auto"
                          style={{ backgroundColor: SEVERITY_COLORS[inc.severity] || '#64748b' }}
                        >
                          {inc.severity}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                        <p><b>Location:</b> {inc.location}</p>
                        <p><b>Category:</b> {inc.pollution_category}</p>
                        <p><b>Status:</b> <span className="font-bold text-indigo-600">{inc.current_status}</span></p>
                      </div>

                      <div className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                        <p className="font-bold text-slate-200">Source Identification & Model Analysis:</p>
                        <p className="text-slate-300 leading-relaxed">{inc.ai_analysis}</p>
                        <p className="text-emerald-700 font-semibold mt-1">Identified Origin: {inc.suspected_source}</p>
                      </div>

                      <div className="text-xs text-slate-400">
                        <b>Actions Logged:</b> {inc.actions_taken.join('; ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Saved Reports Archive */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Archived Regional Reports</h3>
            {savedReports.length === 0 ? (
              <p className="text-xs text-slate-400">No reports saved yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {savedReports.map((r) => (
                  <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-indigo-700">{r.report_number}</span>
                        <span className="font-bold text-slate-200 text-xs">{r.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{r.summary}</p>
                    </div>
                    <div className="flex items-center space-x-3 text-xs shrink-0">
                      <span className="text-slate-400">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}
                      </span>
                      <button
                        onClick={async () => {
                          const full = await fetchApi<any>(`/regional/reports/${r.id}`);
                          setGeneratedReport(full.content);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DAILY BRIEFING */}
      {/* ========================================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Date Selector Header */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Executive Daily Intelligence Briefing</h3>
              <p className="text-xs text-slate-400">Chronological snapshot of incident evolution and field interventions</p>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-300">Select Date:</label>
              <input
                type="date"
                value={dailyDate}
                onChange={(e) => setDailyDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loadingDaily ? (
            <div className="py-12 flex justify-center text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              <span>Fetching daily report for {dailyDate}…</span>
            </div>
          ) : dailyData ? (
            <div className="space-y-6">
              {/* Daily Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-blue-800/50 bg-blue-950/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">New Reported</span>
                  <p className="text-xl font-black text-blue-800">{dailyData.metrics.new_count}</p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-amber-800/50 bg-amber-950/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Incidents Updated</span>
                  <p className="text-xl font-black text-amber-800">{dailyData.metrics.updated_count}</p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-emerald-800/50 bg-emerald-950/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Resolved</span>
                  <p className="text-xl font-black text-emerald-800">{dailyData.metrics.resolved_count}</p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-red-800/50 bg-red-950/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-red-600 uppercase">Critical High</span>
                  <p className="text-xl font-black text-red-800">{dailyData.metrics.critical_count}</p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Reports Filed</span>
                  <p className="text-xl font-black text-indigo-800">{dailyData.metrics.reports_count}</p>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-purple-800/50 bg-purple-950/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Pending Actions</span>
                  <p className="text-xl font-black text-purple-800">{dailyData.metrics.pending_count}</p>
                </div>
              </div>

              {/* Priority Incidents Section */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white">Priority Regional Incidents Requiring Oversight</h4>
                  <span className="text-xs text-red-600 font-semibold">{dailyData.priority_incidents.length} High-Attention</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyData.priority_incidents.map((p: any) => (
                    <div key={p.id} className="border border-red-100 bg-red-950/20 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-red-700">{p.complaint_number}</span>
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {p.severity}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-white">{p.title}</h5>
                      <p className="text-[11px] text-slate-400">{p.address}</p>
                      <div className="text-[11px] pt-2 border-t border-red-100 flex justify-between text-slate-300">
                        <span><b>Source:</b> {p.suspected_source}</span>
                        <span className="text-indigo-600 font-semibold">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline & Pending Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timeline */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    Daily Status Evolution & Interventions
                  </h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {dailyData.activity_timeline.length === 0 ? (
                      <p className="text-xs text-slate-400">No status changes logged for this specific date.</p>
                    ) : (
                      dailyData.activity_timeline.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs border-l-2 border-indigo-500 pl-3 py-1 space-y-0.5">
                          <div className="flex justify-between text-slate-400 text-[10px]">
                            <span>{item.time}</span>
                            <span className="font-mono">{item.complaint_number}</span>
                          </div>
                          <p className="font-semibold text-slate-200">{item.event}</p>
                          <p className="text-slate-400">{item.notes}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pending Actions */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    Pending Field Interventions & Follow-ups
                  </h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {dailyData.pending_actions.map((pen: any) => (
                      <div key={pen.id} className="p-3 rounded-xl border border-slate-800 text-xs space-y-1 bg-slate-800/60/50">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-slate-200">{pen.complaint_number}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                            {pen.status}
                          </span>
                        </div>
                        <p className="font-medium text-slate-300">{pen.title}</p>
                        <p className="text-[11px] text-slate-400">Assigned To: <b>{pen.assigned_to}</b> ({pen.department})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: WEEKLY BRIEFING */}
      {/* ========================================================================= */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          {/* Week Navigation Header */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Executive Weekly Intelligence Briefing</h3>
              <p className="text-xs text-slate-400">7-day trends, hotspot identification, and regulatory compliance audit</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleWeekShift(-7)}
                className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800/60 text-slate-300 transition"
                title="Previous Week"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
                {weeklyData?.week_label || weekStartDate}
              </span>
              <button
                onClick={() => handleWeekShift(7)}
                className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800/60 text-slate-300 transition"
                title="Next Week"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loadingWeekly ? (
            <div className="py-12 flex justify-center text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              <span>Compiling 7-day regional briefing…</span>
            </div>
          ) : weeklyData ? (
            <div className="space-y-6">
              {/* Key Weekly KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Weekly Incidents</span>
                  <p className="text-2xl font-black text-white">{weeklyData.total_incidents}</p>
                  <span className="text-[10px] text-slate-400">Active or reported this week</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-amber-800/50 bg-amber-950/20 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Ongoing Incidents</span>
                  <p className="text-2xl font-black text-amber-700">{weeklyData.ongoing_count}</p>
                  <span className="text-[10px] text-amber-500">Under investigation / action</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-800/50 bg-emerald-950/20 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Resolved Incidents</span>
                  <p className="text-2xl font-black text-emerald-700">{weeklyData.resolved_count}</p>
                  <span className="text-[10px] text-emerald-500">Enforcement finalized</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Audits & Reports</span>
                  <p className="text-2xl font-black text-indigo-700">{weeklyData.reports_count}</p>
                  <span className="text-[10px] text-indigo-500">Cumulative reports</span>
                </div>
              </div>

              {/* Weekly Trend Line Chart */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Weekly Incident Progression Trend</h4>
                    <p className="text-xs text-slate-400">Daily reports, resolutions, and critical alerts over 7 days</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData.daily_trends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="reported" name="Reported" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3 Breakdown Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Severity Breakdown */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Severity Distribution</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData.severity_distribution}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Pollution Categories</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData.category_distribution}>
                        <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Location Breakdown */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Geographic Cluster Areas</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData.location_distribution}>
                        <XAxis dataKey="location" tick={{ fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recurring Hotspots Table */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">Recurring Environmental Hotspots</h4>
                    <p className="text-xs text-slate-400">Identified multi-complaint zones and high-anomaly receptor corridors</p>
                  </div>
                  <Flame className="w-5 h-5 text-red-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {weeklyData.recurring_hotspots.map((hot: any, idx: number) => (
                    <div key={idx} className="border border-slate-800 rounded-xl p-4 space-y-2 bg-slate-800/60/50">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-white">{hot.name}</span>
                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          {hot.risk_level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300"><b>Dominant Type:</b> {hot.dominant_type}</p>
                      <p className="text-[11px] text-indigo-700 bg-indigo-50 p-2 rounded">
                        <b>Sensor Signal:</b> {hot.anomaly_detected}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Major Updates of the Week */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                  Major Regulatory & Enforcement Milestones
                </h4>
                <div className="space-y-2.5">
                  {weeklyData.major_updates.map((upd: any, idx: number) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs border-l-2 border-emerald-500 pl-3 py-1">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-indigo-700">{upd.incident}</span>
                          <span className="font-bold text-slate-200">{upd.title}</span>
                          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{upd.status}</span>
                        </div>
                        <p className="text-slate-300">{upd.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
