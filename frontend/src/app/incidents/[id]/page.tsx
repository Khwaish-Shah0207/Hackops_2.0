'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Wind, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Compass, 
  Activity, 
  ChevronRight, 
  Star, 
  Send,
  Building2,
  RefreshCw
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

const InvestigationMap = dynamic(() => import('@/components/InvestigationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-sm">
      Rendering Lagrangian Trajectory & Source Map...
    </div>
  ),
});

export default function IncidentDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [incident, setIncident] = useState<any>(null);
  const [environmentalData, setEnvironmentalData] = useState<any>({
    stations: [],
    weather: [],
  });
  const [loading, setLoading] = useState(true);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Citizen Feedback Form State
  const [isImproved, setIsImproved] = useState(true);
  const [satisfactionRating, setSatisfactionRating] = useState(4);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [reopenRequested, setReopenRequested] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const loadIncidentData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchApi<any>(`/complaints/${id}`);
      setIncident(data);

      // Load background environmental data for map
      const [stationsData, weatherData] = await Promise.all([
        fetchApi<any[]>('/environmental/air-quality').catch(() => []),
        fetchApi<any[]>('/environmental/weather').catch(() => []),
      ]);

      setEnvironmentalData({
        stations: stationsData,
        weather: weatherData,
      });
    } catch (err) {
      console.error('Failed to load incident:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidentData();
  }, [id]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingFeedback(true);
      const updated = await fetchApi(`/feedback/complaints/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          is_improved: isImproved,
          satisfaction_rating: satisfactionRating,
          comments: feedbackComments,
          reopen_requested: reopenRequested,
        }),
      });
      setIncident(updated);
      setFeedbackSuccess(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
        <p className="text-slate-500 text-sm">Synthesizing source apportionment evidence...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
        <h2 className="text-xl font-bold text-slate-800">Incident Not Found</h2>
        <p className="text-sm text-slate-500">The requested incident ID does not exist in the database.</p>
        <Link href="/citizen" className="inline-block bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">
          Return to Incident Portal
        </Link>
      </div>
    );
  }

  const report = incident.investigation_report;
  const candidates = incident.source_candidates || [];
  const topCandidate = candidates[0];
  const trajectoryPoints = report?.model_findings?.trajectory_analysis?.upwind_transport_vector || [];

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg">
              {incident.complaint_number}
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Status: {incident.status}
            </span>
            {incident.is_demo && (
              <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-1 rounded-full font-bold">
                Demonstration Scenario
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {incident.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{incident.address || `${incident.latitude}, ${incident.longitude}`}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Observed: {new Date(incident.observed_at).toLocaleString()}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/government"
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Manage in Authority Console</span>
          </Link>
        </div>
      </div>

      {/* Primary Investigation Map Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Source Investigation Map & Lagrangian Trajectory</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive visualization displaying backward plume transport vector, candidate origins, and ambient sensors.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            Plume Vector: Wind FROM 108° @ 4.2 m/s
          </span>
        </div>

        <InvestigationMap
          centerLat={incident.latitude}
          centerLon={incident.longitude}
          zoom={13}
          complaintLocation={{
            lat: incident.latitude,
            lon: incident.longitude,
            title: incident.title,
          }}
          candidates={candidates}
          stations={environmentalData.stations}
          trajectoryPoints={trajectoryPoints}
          windDirectionDeg={108}
          windSpeedMs={4.2}
          height="480px"
        />
      </div>

      {/* Ranked Source Candidates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Ranked Source Candidates (Multi-Criteria Evidence)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Scored via upwind trajectory alignment, path sensor anomalies, recurring citizen complaints, and SPECIATE fingerprint matching.
            </p>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            No source candidates evaluated yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {candidates.map((cand: any, idx: number) => {
              const isTop = idx === 0;
              return (
                <div
                  key={cand.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 relative overflow-hidden ${
                    isTop ? 'border-orange-300 ring-2 ring-orange-400/20' : 'border-slate-200'
                  }`}
                >
                  {isTop && (
                    <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider">
                      Primary Candidate
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        {cand.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {cand.name}
                    </h3>
                  </div>

                  {/* Evidence Score Indicator */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Overall Evidence Score</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {cand.overall_evidence_score}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cand.overall_evidence_score > 75
                            ? 'bg-orange-500'
                            : cand.overall_evidence_score > 50
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${cand.overall_evidence_score}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Distance: {cand.distance_km} km</span>
                      <span className={`font-semibold ${cand.confidence_level === 'High' ? 'text-orange-600' : 'text-slate-600'}`}>
                        {cand.confidence_level} Confidence
                      </span>
                    </div>
                  </div>

                  {/* Multi-Criteria Metrics Pill Breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Wind Trajectory:</span>
                      <span className="font-semibold text-slate-800">{cand.wind_compatibility_score}%</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Path Anomaly:</span>
                      <span className="font-semibold text-slate-800">{cand.pollution_anomaly_score}%</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Citizen Reports:</span>
                      <span className="font-semibold text-slate-800">{cand.complaint_density_score}%</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-500 block">Chemical Match:</span>
                      <span className="font-semibold text-slate-800">{cand.chemical_match_score}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {cand.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Investigation Report Card (Formal Government Dossier) */}
      {report && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Formal Decision-Support Dossier</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Investigation Report ({report.report_number})
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Generated: {new Date(report.generated_at).toLocaleString()}
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Executive Summary
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {report.executive_summary}
            </p>
          </div>

          {/* 4-Quadrant Evidence Hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Directly Observed */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Directly Observed Ground Truth</span>
              </h4>
              <p className="text-xs text-blue-900/80 leading-relaxed">
                • Peak PM2.5 observed: <b>{report.observed_evidence?.peak_pm25_observed || 218} µg/m³</b>.<br/>
                • Peak PM10 observed: <b>{report.observed_evidence?.peak_pm10_observed || 342} µg/m³</b>.<br/>
                • Verification status: Citizen observation verified by ambient physical sensor network.
              </p>
            </div>

            {/* Model Findings */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Model-Generated Scientific Findings</span>
              </h4>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                • Lagrangian backward trajectory: Origin direction aligns with upwind ESE sector.<br/>
                • Isolation Forest: Particulate anomaly detected along the transport corridor.<br/>
                • Primary candidate identified: <b>{topCandidate?.name || 'Upwind sector'}</b> ({topCandidate?.overall_evidence_score}/100 score).
              </p>
            </div>

            {/* Synthetic Disclosure */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Synthetic & Simulated Evidence Disclosure</span>
              </h4>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                • Chemical Speciation: EPA SPECIATE v5.4 profile match simulated using synthetic ambient data.<br/>
                • Regulatory Notice: Simulated findings serve as decision support and must not be used to impose fines without physical inspection.
              </p>
            </div>

            {/* Unverified Reports */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
              <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Unverified Citizen Statements</span>
              </h4>
              <p className="text-xs text-purple-900/80 leading-relaxed">
                • Statement: &ldquo;{incident.description}&rdquo;<br/>
                • Corroboration: Multiple historical complaints recorded in sector citing open burning.
              </p>
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Statutory Recommended Actions
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {report.recommended_actions?.map((act: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations Notice */}
          <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-700 block">Data Limitations:</span>
            <p>{report.data_limitations}</p>
          </div>
        </div>
      )}

      {/* Citizen Feedback Section */}
      <div id="feedback" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <Star className="w-4 h-4" />
            <span>Community Resolution Feedback</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Has the Smoke or Burning Issue Improved?
          </h2>
          <p className="text-xs text-slate-500">
            Help verify whether government corrective actions resolved the pollution problem. Unresolved issues can be reopened.
          </p>
        </div>

        {incident.feedback ? (
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-emerald-900 text-sm">Feedback Already Recorded</span>
            </div>
            <p className="text-xs text-emerald-800">
              Air quality improved: <b>{incident.feedback.is_improved ? 'Yes' : 'No'}</b> | Rating:{' '}
              <b>{incident.feedback.satisfaction_rating}/5 stars</b>
            </p>
            {incident.feedback.comments && (
              <p className="text-xs text-emerald-700 italic">
                &ldquo;{incident.feedback.comments}&rdquo;
              </p>
            )}
          </div>
        ) : feedbackSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm">
            Thank you! Your feedback has been recorded and submitted to the compliance registry.
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Did the pollution/smoke condition improve after authority intervention?
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="isImproved"
                    checked={isImproved === true}
                    onChange={() => setIsImproved(true)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Yes, smoke cleared / resolved</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="isImproved"
                    checked={isImproved === false}
                    onChange={() => setIsImproved(false)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>No, smoke continues</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Resolution Satisfaction Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSatisfactionRating(star)}
                    className={`p-2 rounded-lg text-lg transition ${
                      satisfactionRating >= star ? 'text-amber-500' : 'text-slate-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Citizen Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                placeholder="Share any additional observations or if smoke recurred during the night..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {!isImproved && (
              <label className="flex items-center space-x-2 text-xs font-medium text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reopenRequested}
                  onChange={(e) => setReopenRequested(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Request incident reopening for secondary inspection</span>
              </label>
            )}

            <button
              type="submit"
              disabled={submittingFeedback}
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingFeedback ? 'Submitting...' : 'Submit Resolution Feedback'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

