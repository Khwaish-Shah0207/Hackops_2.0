'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  CartesianGrid,
  Legend,
} from 'recharts';
import { fetchApi } from '@/lib/api';
import { getStoredUser, isRegionalManager, clearAuth } from '@/lib/auth';
import EditorialFooter from '@/components/shared/EditorialFooter';

const PALETTE = {
  forest: '#14251F',
  graphite: '#252C28',
  ivory: '#EAE8DF',
  sage: '#A8B5A5',
  orange: '#C77B43',
  red: '#B65348',
  green: '#667B70',
  amber: '#B8863A',
};

const CHART_COLORS = [PALETTE.orange, PALETTE.green, PALETTE.amber, PALETTE.red, PALETTE.sage];

const SEVERITY_COLORS: Record<string, string> = {
  Critical: PALETTE.red,
  High: PALETTE.orange,
  Medium: PALETTE.amber,
  Low: PALETTE.green,
};

export default function RegionalManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'incidents' | 'reports' | 'daily' | 'weekly'>('overview');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.replace('/login');
  };

  // Initial Data Load
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [overview, incList, reports] = await Promise.all([
        fetchApi<any>('/regional/overview').catch(() => null),
        fetchApi<any[]>('/regional/incidents').catch(() => []),
        fetchApi<any[]>('/regional/reports').catch(() => []),
      ]);
      setOverviewData(overview);
      setIncidents(incList);
      setSavedReports(reports);
      if (incList.length > 0) {
        setSelectedIncident(incList[0]);
      }
    } catch (err) {
      console.error('Failed to load regional data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Sync activeTab with URL parameter '?tab=...'
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as 'overview' | 'incidents' | 'reports' | 'daily' | 'weekly' | null;
      if (tab && ['overview', 'incidents', 'reports', 'daily', 'weekly'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  // Fetch Daily Briefing
  const fetchDailyBriefing = async (dateStr: string) => {
    try {
      setLoadingDaily(true);
      const res = await fetchApi<any>(`/regional/briefing/daily?date=${dateStr}&date_str=${dateStr}`);
      setDailyData(res);
    } catch (err) {
      console.error('Failed to fetch daily briefing:', err);
    } finally {
      setLoadingDaily(false);
    }
  };

  // Fetch Weekly Briefing
  const fetchWeeklyBriefing = async (startDateStr: string) => {
    try {
      setLoadingWeekly(true);
      const res = await fetchApi<any>(`/regional/briefing/weekly?start_date=${startDateStr}&start_date_str=${startDateStr}`);
      setWeeklyData(res);
    } catch (err) {
      console.error('Failed to fetch weekly briefing:', err);
    } finally {
      setLoadingWeekly(false);
    }
  };

  const handleTabChange = (tab: 'overview' | 'incidents' | 'reports' | 'daily' | 'weekly') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url.toString());
    }
    if (tab === 'daily' && !dailyData) {
      fetchDailyBriefing(dailyDate);
    }
    if (tab === 'weekly' && !weeklyData) {
      fetchWeeklyBriefing(weekStartDate);
    }
  };

  const handleToggleSelectIncident = (id: number) => {
    setSelectedIncidentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

  const handleSaveReport = async () => {
    if (!generatedReport) return;
    try {
      setSavingReport(true);
      await fetchApi<any>('/regional/reports/save', {
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
      alert(`Report ${generatedReport.report_number} saved to registry!`);
      const updatedReports = await fetchApi<any[]>('/regional/reports');
      setSavedReports(updatedReports);
    } catch (err: any) {
      alert(err.message || 'Failed to save report.');
    } finally {
      setSavingReport(false);
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterCategory !== 'all' && inc.pollution_type !== filterCategory) return false;
    if (filterSeverity !== 'all' && inc.severity.toLowerCase() !== filterSeverity.toLowerCase()) return false;
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = inc.complaint_number.toLowerCase().includes(q);
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchAddr = (inc.address || '').toLowerCase().includes(q);
      if (!matchNum && !matchTitle && !matchAddr) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-forest-charcoal text-ivory-warm selection:bg-accent-orange selection:text-ivory-warm flex flex-col justify-between">
      {/* Top Directorate Navigation Header */}
      <header className="border-b border-graphite-border bg-forest-dark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 bg-accent-red" />
              <div className="flex flex-col">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-ivory-warm">
                  Regional Manager Directorate
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-sage-muted">
                  Eastern Suburbs Air Quality Division
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            {currentUser && (
              <div className="hidden sm:flex items-center space-x-2 text-sage-muted border-r border-graphite-border pr-3">
                <span>Director:</span>
                <strong className="text-ivory-warm">{currentUser.full_name}</strong>
              </div>
            )}
            <button
              type="button"
              onClick={loadInitialData}
              className="px-3 py-1.5 bg-forest-charcoal border border-graphite-border hover:border-sage-muted text-sage-muted hover:text-ivory-warm transition-colors"
            >
              Refresh Data
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-graphite-deep border border-graphite-border hover:border-accent-red text-accent-red transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto space-x-1 border-t border-graphite-border/60">
          {[
            { id: 'overview', label: '01 // Regional Overview' },
            { id: 'incidents', label: '02 // Multi-Incident Registry' },
            { id: 'daily', label: '03 // Daily Briefing' },
            { id: 'weekly', label: '04 // Weekly Briefing' },
            { id: 'reports', label: '05 // Audit Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-accent-orange text-ivory-warm bg-forest-charcoal'
                  : 'border-transparent text-sage-muted hover:text-ivory-warm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Directorate Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        {loading ? (
          <div className="p-16 text-center text-sage-muted font-mono text-xs">
            Connecting to Regional Intelligence Registry...
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* TAB 1: REGIONAL OVERVIEW */}
            {/* ========================================================================= */}
            {activeTab === 'overview' && overviewData && (
              <div className="space-y-6">
                {/* 5 KPI Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="bg-forest-dark border border-graphite-border p-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-sage-muted block">Total Incidents</span>
                    <div className="text-2xl font-mono font-bold text-ivory-warm">{overviewData.total_incidents}</div>
                    <span className="text-[10px] font-mono text-sage-muted">Regional Corpus</span>
                  </div>
                  <div className="bg-forest-dark border border-graphite-border p-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-accent-red block">Critical Severity</span>
                    <div className="text-2xl font-mono font-bold text-accent-red">{overviewData.critical_incidents}</div>
                    <span className="text-[10px] font-mono text-sage-muted">Immediate Action</span>
                  </div>
                  <div className="bg-forest-dark border border-graphite-border p-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-accent-orange block">Under Analysis</span>
                    <div className="text-2xl font-mono font-bold text-accent-orange">{overviewData.new_incidents}</div>
                    <span className="text-[10px] font-mono text-sage-muted">Plume Ingestion</span>
                  </div>
                  <div className="bg-forest-dark border border-graphite-border p-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-sage-muted block">Enforcement Active</span>
                    <div className="text-2xl font-mono font-bold text-ivory-warm">{overviewData.ongoing_incidents}</div>
                    <span className="text-[10px] font-mono text-sage-muted">Squads Deployed</span>
                  </div>
                  <div className="bg-forest-dark border border-graphite-border p-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-accent-green block">Resolved Cases</span>
                    <div className="text-2xl font-mono font-bold text-accent-green">{overviewData.resolved_incidents}</div>
                    <span className="text-[10px] font-mono text-sage-muted">Statutory Verified</span>
                  </div>
                </div>

                {/* Analytical Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Category Distribution Bar Chart */}
                  <div className="lg:col-span-7 bg-forest-dark border border-graphite-border p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-graphite-border">
                      <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                        Pollution Category Apportionment
                      </span>
                      <span className="text-[10px] font-mono text-sage-muted">All Time</span>
                    </div>

                    <div className="h-64 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Object.entries(overviewData.category_distribution || overviewData.categories || {}).map(([cat, count]) => ({
                            name: cat.replace('_', ' ').toUpperCase(),
                            count,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#252C28" />
                          <XAxis dataKey="name" stroke="#A8B5A5" tick={{ fontSize: 10 }} />
                          <YAxis stroke="#A8B5A5" tick={{ fontSize: 10 }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: PALETTE.graphite,
                              borderColor: PALETTE.sage,
                              color: PALETTE.ivory,
                              fontSize: '11px',
                              fontFamily: 'monospace',
                            }}
                          />
                          <Bar dataKey="count" fill={PALETTE.orange} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Severity Distribution Pie Chart */}
                  <div className="lg:col-span-5 bg-forest-dark border border-graphite-border p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-graphite-border">
                      <span className="font-mono text-xs text-accent-red font-bold uppercase tracking-wider">
                        Regional Severity Breakdown
                      </span>
                      <span className="text-[10px] font-mono text-sage-muted">Intelligent Scoring</span>
                    </div>

                    <div className="h-64 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(overviewData.severity_distribution || overviewData.severities || {}).map(([sev, count]) => ({
                              name: sev,
                              value: count,
                            }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {Object.entries(overviewData.severity_distribution || overviewData.severities || {}).map(([sev], index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={SEVERITY_COLORS[sev] || CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: PALETTE.graphite,
                              borderColor: PALETTE.sage,
                              color: PALETTE.ivory,
                              fontSize: '11px',
                              fontFamily: 'monospace',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Status History Audit Trail */}
                <div className="bg-forest-dark border border-graphite-border p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-graphite-border">
                    <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                      Recent Regional Audit Activity &amp; Status Transitions
                    </span>
                    <span className="text-[10px] font-mono text-sage-muted">Live Stream</span>
                  </div>

                  <div className="divide-y divide-graphite-border/60 text-xs font-mono">
                    {(overviewData.recent_activity || []).slice(0, 5).map((act: any, idx: number) => (
                      <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-bold text-ivory-warm">{act.complaint_number || 'Incident'}</span>
                          <span className="text-sage-muted"> &bull; Transitioned from </span>
                          <span className="text-sage-muted">{act.previous_status}</span>
                          <span className="text-accent-orange font-bold"> &rarr; {act.new_status}</span>
                          <p className="text-[11px] text-sage-muted/80">{act.change_notes}</p>
                        </div>
                        <div className="text-right text-[10px] text-sage-muted whitespace-nowrap">
                          <div>{act.changed_by_user}</div>
                          <div>{new Date(act.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: MULTI-INCIDENT REGISTRY */}
            {/* ========================================================================= */}
            {activeTab === 'incidents' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="bg-forest-dark border border-graphite-border p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <input
                      type="text"
                      placeholder="Search by ID, title, or locality..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-1.5 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
                    />
                    <select
                      value={filterSeverity}
                      onChange={(e) => setFilterSeverity(e.target.value)}
                      className="px-3 py-1.5 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-1.5 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Reported">Reported</option>
                      <option value="Source Identified / Investigation Required">Source Identified</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Action Taken">Action Taken</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="text-xs font-mono text-sage-muted">
                    Showing <strong>{filteredIncidents.length}</strong> of <strong>{incidents.length}</strong> registered incidents
                  </div>
                </div>

                {/* Table */}
                <div className="border border-graphite-border bg-forest-dark overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-forest-charcoal border-b border-graphite-border text-sage-muted uppercase text-[10px]">
                      <tr>
                        <th className="p-3 w-10">Select</th>
                        <th className="p-3">Reference ID</th>
                        <th className="p-3">Incident Summary</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Severity</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-graphite-border/60">
                      {filteredIncidents.map((inc) => {
                        const isSelected = selectedIncidentIds.includes(inc.id);
                        return (
                          <tr key={inc.id} className="hover:bg-graphite-deep/50 transition-colors">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectIncident(inc.id)}
                                className="accent-[#C77B43]"
                              />
                            </td>
                            <td className="p-3 font-bold text-accent-orange">{inc.complaint_number}</td>
                            <td className="p-3 max-w-xs truncate text-ivory-warm" title={inc.title}>
                              {inc.title}
                            </td>
                            <td className="p-3 text-sage-muted uppercase text-[10px]">{inc.pollution_type}</td>
                            <td className="p-3">
                              <span
                                className="px-2 py-0.5 text-[10px] font-bold border"
                                style={{
                                  borderColor: SEVERITY_COLORS[inc.severity] || PALETTE.sage,
                                  color: SEVERITY_COLORS[inc.severity] || PALETTE.ivory,
                                }}
                              >
                                {inc.severity}
                              </span>
                            </td>
                            <td className="p-3 text-sage-muted text-[11px]">{inc.status}</td>
                            <td className="p-3 text-right">
                              <Link
                                href={`/incidents/${inc.id}`}
                                className="text-accent-orange hover:underline font-bold"
                              >
                                View Dossier &rarr;
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {selectedIncidentIds.length > 0 && (
                  <div className="bg-graphite-deep border border-accent-orange/40 p-4 flex items-center justify-between text-xs font-mono">
                    <span>
                      <strong>{selectedIncidentIds.length}</strong> incident(s) selected for consolidated audit reporting.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTabChange('reports')}
                      className="px-4 py-2 bg-accent-orange text-forest-dark font-bold uppercase tracking-wider hover:bg-accent-orange/90 transition-colors"
                    >
                      Open Report Generator &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: DAILY BRIEFING */}
            {/* ========================================================================= */}
            {activeTab === 'daily' && (
              <div className="space-y-6">
                <div className="bg-forest-dark border border-graphite-border p-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-3">
                    <span className="text-sage-muted uppercase">Briefing Target Date:</span>
                    <input
                      type="date"
                      value={dailyDate}
                      onChange={(e) => {
                        setDailyDate(e.target.value);
                        fetchDailyBriefing(e.target.value);
                      }}
                      className="px-3 py-1.5 bg-forest-charcoal border border-graphite-border text-ivory-warm focus:outline-none focus:border-accent-orange"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-forest-charcoal border border-graphite-border text-sage-muted hover:text-ivory-warm"
                  >
                    Print Briefing
                  </button>
                </div>

                {loadingDaily ? (
                  <div className="p-12 text-center text-sage-muted font-mono text-xs">
                    Synthesizing daily intelligence briefing...
                  </div>
                ) : dailyData ? (
                  <div className="border border-graphite-border bg-forest-dark p-6 sm:p-10 space-y-6">
                    <div className="border-b border-graphite-border pb-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-widest">
                          Official Daily Air Compliance Intelligence Briefing
                        </span>
                        <span className="font-mono text-xs text-sage-muted">
                          {dailyData.date_formatted || dailyData.briefing_date || dailyData.date}
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl text-ivory-warm">
                        Eastern Suburbs Plume Corridor Daily Summary
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="bg-forest-charcoal border border-graphite-border p-3">
                        <span className="text-sage-muted block text-[10px] uppercase">Active Incidents</span>
                        <span className="text-xl font-bold text-ivory-warm">
                          {dailyData.metrics?.new_count ?? dailyData.total_active_incidents ?? 0}
                        </span>
                      </div>
                      <div className="bg-forest-charcoal border border-graphite-border p-3">
                        <span className="text-accent-red block text-[10px] uppercase">Critical Events</span>
                        <span className="text-xl font-bold text-accent-red">
                          {dailyData.metrics?.critical_count ?? dailyData.critical_count ?? 0}
                        </span>
                      </div>
                      <div className="bg-forest-charcoal border border-graphite-border p-3">
                        <span className="text-accent-orange block text-[10px] uppercase">Pending Actions</span>
                        <span className="text-xl font-bold text-accent-orange">
                          {dailyData.metrics?.pending_count ?? dailyData.high_priority_count ?? 0}
                        </span>
                      </div>
                      <div className="bg-forest-charcoal border border-graphite-border p-3">
                        <span className="text-sage-muted block text-[10px] uppercase">Dominant Classification</span>
                        <span className="text-sm font-bold text-ivory-warm uppercase">
                          {dailyData.dominant_pollution_type || 'Waste Combustion'}
                        </span>
                      </div>
                    </div>

                    {/* Key Observations */}
                    <div className="space-y-2">
                      <span className="font-mono text-xs text-accent-orange uppercase tracking-wider block font-bold">
                        Key Regional Observations &amp; Evidence
                      </span>
                      <ul className="list-disc list-inside text-xs font-mono text-ivory-warm/90 space-y-1.5 bg-forest-charcoal p-4 border border-graphite-border">
                        {(dailyData.key_observations && dailyData.key_observations.length > 0
                          ? dailyData.key_observations
                          : (dailyData.priority_incidents || []).map(
                              (p: any) =>
                                `${p.complaint_number} (${p.title}): ${p.severity} severity at ${p.address}. Suspected Source: ${p.suspected_source}. Status: ${p.status}.`
                            )
                        ).map((obs: string, idx: number) => (
                          <li key={idx}>{obs}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Actions */}
                    <div className="space-y-2">
                      <span className="font-mono text-xs text-accent-green uppercase tracking-wider block font-bold">
                        Directorate Enforcement Actions &amp; Directives
                      </span>
                      <ul className="list-disc list-inside text-xs font-mono text-ivory-warm/90 space-y-1.5 bg-forest-charcoal p-4 border border-graphite-border">
                        {(dailyData.recommended_actions && dailyData.recommended_actions.length > 0
                          ? dailyData.recommended_actions
                          : (dailyData.pending_actions || [
                              'Issue statutory notice under Section 31A of Air Act 1981 to municipal landfill contractor.',
                              'Deploy rapid night-patrol enforcement squads with forward infrared thermal optical cameras.',
                              'Coordinate with BMC Solid Waste Directorate for mandatory dampening of scrap processing boundaries.'
                            ])
                        ).map((act: string, idx: number) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: WEEKLY BRIEFING */}
            {/* ========================================================================= */}
            {activeTab === 'weekly' && (
              <div className="space-y-6">
                <div className="bg-forest-dark border border-graphite-border p-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-3">
                    <span className="text-sage-muted uppercase">Week Beginning:</span>
                    <input
                      type="date"
                      value={weekStartDate}
                      onChange={(e) => {
                        setWeekStartDate(e.target.value);
                        fetchWeeklyBriefing(e.target.value);
                      }}
                      className="px-3 py-1.5 bg-forest-charcoal border border-graphite-border text-ivory-warm focus:outline-none focus:border-accent-orange"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-forest-charcoal border border-graphite-border text-sage-muted hover:text-ivory-warm"
                  >
                    Print Weekly Report
                  </button>
                </div>

                {loadingWeekly ? (
                  <div className="p-12 text-center text-sage-muted font-mono text-xs">
                    Compiling strategic weekly briefing...
                  </div>
                ) : weeklyData ? (
                  <div className="border border-graphite-border bg-forest-dark p-6 sm:p-10 space-y-6">
                    <div className="border-b border-graphite-border pb-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-accent-red font-bold uppercase tracking-widest">
                          Weekly Environmental Compliance Strategic Briefing
                        </span>
                        <span className="font-mono text-xs text-sage-muted">
                          {weeklyData.week_label || weeklyData.briefing_period || 'Current Week'}
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl text-ivory-warm">
                        Multi-Station Dispersion &amp; Enforcement Trends
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="bg-forest-charcoal border border-graphite-border p-3">
                        <span className="text-sage-muted block text-[10px] uppercase">Incidents Logged</span>
                        <span className="text-xl font-bold text-ivory-warm">
                          {weeklyData.total_incidents ?? weeklyData.total_incidents_this_week ?? 0}
                        </span>
                      </div>
                      <div className="bg-forest-charcoal border border-graphite-border p-3">
                        <span className="text-accent-green block text-[10px] uppercase">Resolved This Week</span>
                        <span className="text-xl font-bold text-accent-green">
                          {weeklyData.resolved_count ?? weeklyData.resolved_this_week ?? 0}
                        </span>
                      </div>
                      <div className="bg-forest-charcoal border border-graphite-border p-3">
                        <span className="text-accent-orange block text-[10px] uppercase">Active Cases</span>
                        <span className="text-xl font-bold text-accent-orange">
                          {weeklyData.ongoing_count ?? (weeklyData.total_incidents ? weeklyData.total_incidents - (weeklyData.resolved_count || 0) : 0)}
                        </span>
                      </div>
                      <div className="bg-forest-charcoal border border-graphite-border p-3">
                        <span className="text-sage-muted block text-[10px] uppercase">Status</span>
                        <span className="text-sm font-bold text-ivory-warm uppercase">
                          {weeklyData.trend_direction || 'Active Enforcement'}
                        </span>
                      </div>
                    </div>

                    {/* Regional Insights */}
                    <div className="space-y-2">
                      <span className="font-mono text-xs text-accent-orange uppercase tracking-wider block font-bold">
                        Weekly Strategic Insights &amp; Cluster Telemetry
                      </span>
                      <ul className="list-disc list-inside text-xs font-mono text-ivory-warm/90 space-y-1.5 bg-forest-charcoal p-4 border border-graphite-border">
                        {(weeklyData.regional_insights && weeklyData.regional_insights.length > 0
                          ? weeklyData.regional_insights
                          : (weeklyData.recurring_hotspots || []).map(
                              (h: any) =>
                                `Identified recurring hotspot in ${h.zone || h.location || 'Cluster Zone'}: ${h.pattern || h.observation || 'Concentrated emission dispersion downwind toward residential colonies.'}`
                            )
                        ).map((ins: string, idx: number) => (
                          <li key={idx}>{ins}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Top Hotspots */}
                    <div className="space-y-2">
                      <span className="font-mono text-xs text-accent-red uppercase tracking-wider block font-bold">
                        Priority Hotspot Emission Clusters
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        {(weeklyData.top_violators && weeklyData.top_violators.length > 0
                          ? weeklyData.top_violators
                          : (weeklyData.location_distribution || [
                              { location: 'Deonar Dumping Ground Perimeter', count: 3 },
                              { location: 'Mankhurd Scrap Market Link Rd', count: 1 },
                              { location: 'Govandi Shivaji Nagar Sector 4', count: 1 },
                            ]).map((l: any) => ({
                              source_name: l.location || l.name,
                              incidents_attributed: l.count || 1,
                              compliance_status: 'Active Statutory Inspection',
                            }))
                        ).map((v: any, idx: number) => (
                          <div key={idx} className="bg-forest-charcoal border border-graphite-border p-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-ivory-warm">{v.source_name}</span>
                              <span className="text-accent-red font-bold">{v.incidents_attributed} Cases</span>
                            </div>
                            <p className="text-[11px] text-sage-muted">{v.compliance_status}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: AUDIT REPORTS GENERATOR */}
            {/* ========================================================================= */}
            {activeTab === 'reports' && (
              <div className="space-y-8">
                {/* Generator Section */}
                <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
                  <div className="border-b border-graphite-border pb-3">
                    <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                      Multi-Incident Consolidated Compliance Report Generator
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-sage-muted block">
                        Official Report Title
                      </label>
                      <input
                        type="text"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        placeholder="e.g. Eastern Suburbs Multi-Incident Air Compliance & Landfill Smolder Audit"
                        className="w-full px-3 py-2 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-sage-muted block">
                        Directorate Compliance Observations &amp; Statutory Directives
                      </label>
                      <textarea
                        rows={3}
                        value={complianceObservations}
                        onChange={(e) => setComplianceObservations(e.target.value)}
                        placeholder="Add high-level regulatory directives, Section 31A warnings, or recommended continuous thermal surveillance..."
                        className="w-full px-3 py-2 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-mono text-sage-muted">
                        Selected Incidents:{' '}
                        <strong className="text-accent-orange">{selectedIncidentIds.length}</strong>{' '}
                        (select rows in Tab 02)
                      </span>

                      <button
                        type="button"
                        onClick={handleGenerateReport}
                        disabled={generatingReport || selectedIncidentIds.length === 0}
                        className="px-5 py-2.5 bg-accent-orange hover:bg-accent-orange/90 text-forest-dark text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        {generatingReport ? 'Synthesizing...' : 'Generate Consolidated Audit'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Generated Preview */}
                {generatedReport && (
                  <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-graphite-border">
                      <div>
                        <span className="font-mono text-[10px] text-accent-green uppercase tracking-widest font-bold">
                          Audit Report Preview Formulation
                        </span>
                        <h3 className="font-serif text-xl text-ivory-warm mt-0.5">{generatedReport.title}</h3>
                        <span className="text-xs font-mono text-accent-orange">{generatedReport.report_number}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveReport}
                        disabled={savingReport}
                        className="px-4 py-2 bg-accent-green text-forest-dark text-xs font-mono font-bold uppercase tracking-wider hover:bg-accent-green/90 transition-colors disabled:opacity-50"
                      >
                        {savingReport ? 'Saving...' : 'Save to Official Registry'}
                      </button>
                    </div>

                    <div className="text-xs font-mono text-ivory-warm/80 bg-forest-charcoal p-4 border border-graphite-border leading-relaxed">
                      {generatedReport.summary}
                    </div>

                    <div className="space-y-3">
                      <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider block">
                        Included Incident Evidence Records ({generatedReport.incidents?.length || 0})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        {(generatedReport.incidents || []).map((inc: any) => (
                          <div key={inc.id} className="bg-forest-charcoal border border-graphite-border p-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-ivory-warm">{inc.complaint_number}</span>
                              <span className="text-accent-red font-bold">{inc.severity}</span>
                            </div>
                            <p className="text-sage-muted text-[11px] truncate">{inc.title}</p>
                            <div className="text-[10px] text-sage-muted">
                              Suspected Origin: <strong className="text-ivory-warm">{inc.suspected_source}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Saved Reports Registry */}
                <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-4">
                  <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider block pb-2 border-b border-graphite-border">
                    Permanent Regional Audit Reports Registry ({savedReports.length})
                  </span>

                  <div className="divide-y divide-graphite-border/60 text-xs font-mono">
                    {savedReports.map((rep) => (
                      <div key={rep.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-accent-orange">{rep.report_number}</span>
                            <span className="text-ivory-warm">{rep.title}</span>
                          </div>
                          <p className="text-sage-muted text-[11px] max-w-xl truncate mt-0.5">{rep.summary}</p>
                        </div>
                        <div className="text-right text-[10px] text-sage-muted">
                          <div>{rep.generated_by}</div>
                          <div>{new Date(rep.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <EditorialFooter />
    </div>
  );
}
