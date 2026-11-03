'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  Clock, 
  MapPin, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Star,
  RefreshCw
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface ComplaintItem {
  id: number;
  complaint_number: string;
  title: string;
  description: string;
  pollution_type: string;
  status: string;
  address?: string;
  observed_at: string;
  created_at: string;
  is_demo: boolean;
}

export default function CitizenDashboardPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await fetchApi<ComplaintItem[]>('/complaints');
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load citizen complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Reported':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">Reported</span>;
      case 'Under Analysis':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium">Under Analysis</span>;
      case 'Source Identified / Investigation Required':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">Source Identified</span>;
      case 'Assigned':
        return <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">Team Assigned</span>;
      case 'Action Taken':
        return <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full font-medium">Action Taken</span>;
      case 'Resolved':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">Resolved</span>;
      case 'Closed':
        return <span className="bg-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium">Closed</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  const filtered = complaints.filter((c) => {
    if (filterType === 'all') return true;
    if (filterType === 'active') return !['Resolved', 'Closed'].includes(c.status);
    if (filterType === 'resolved') return ['Resolved', 'Closed'].includes(c.status);
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Citizen Incident Portal</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track reported smoke events, inspect automated plume origins, and review municipal enforcement actions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadComplaints}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition"
            title="Refresh Incidents"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/submit"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File New Complaint</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Complaints ({complaints.length})
        </button>
        <button
          onClick={() => setFilterType('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterType === 'active' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          In Progress ({complaints.filter((c) => !['Resolved', 'Closed'].includes(c.status)).length})
        </button>
        <button
          onClick={() => setFilterType('resolved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filterType === 'resolved' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Resolved ({complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length})
        </button>
      </div>

      {/* Incident List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
          <span>Loading environmental incidents...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="font-semibold text-slate-800">No Complaints Found</h3>
          <p className="text-sm">No environmental complaints match the selected filter.</p>
          <Link
            href="/submit"
            className="inline-block mt-2 bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            Submit First Complaint
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.is_demo ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {item.complaint_number}
                  </span>
                  {getStatusBadge(item.status)}
                  <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full capitalize">
                    {item.pollution_type.replace('_', ' ')}
                  </span>
                  {item.is_demo && (
                    <span className="bg-amber-100 text-amber-800 text-[11px] px-2 py-0.5 rounded font-medium">
                      Demo Case
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>

                <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  {item.address && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.address}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reported {new Date(item.observed_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <Link
                  href={`/incidents/${item.id}`}
                  className="inline-flex items-center space-x-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition"
                >
                  <span>Investigation Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                {item.status === 'Resolved' && (
                  <Link
                    href={`/incidents/${item.id}#feedback`}
                    className="inline-flex items-center space-x-1 text-xs text-amber-700 hover:underline font-medium"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

