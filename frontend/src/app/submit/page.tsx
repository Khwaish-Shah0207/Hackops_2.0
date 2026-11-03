'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  Image as ImageIcon, 
  Send, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

// Dynamic import for Leaflet map to ensure client-only render
const InvestigationMap = dynamic(() => import('@/components/InvestigationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-sm">
      Loading interactive map...
    </div>
  ),
});

export default function SubmitComplaintPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State (Defaults around Chembur/Govandi demonstration area)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pollutionType, setPollutionType] = useState('waste_burning');
  const [latitude, setLatitude] = useState(19.0550);
  const [longitude, setLongitude] = useState(72.8980);
  const [address, setAddress] = useState('Chembur Colony Residential Area, Mumbai');
  const [observedAt, setObservedAt] = useState(new Date().toISOString().slice(0, 16));
  const [imageUrl, setImageUrl] = useState('');

  const handleLocationSelect = (lat: number, lon: number) => {
    setLatitude(parseFloat(lat.toFixed(5)));
    setLongitude(parseFloat(lon.toFixed(5)));
    setAddress(`Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)} (Selected via map)`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please enter both a title and description of the incident.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        title,
        description,
        pollution_type: pollutionType,
        latitude,
        longitude,
        address,
        observed_at: new Date(observedAt).toISOString(),
        image_url: imageUrl || null,
      };

      const result = await fetchApi<{ id: number; complaint_number: string }>('/complaints', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Redirect immediately to the incident investigation page
      router.push(`/incidents/${result.id}`);
    } catch (err: any) {
      console.error('Error submitting incident:', err);
      setErrorMsg(err.message || 'Failed to submit incident. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs tracking-wider uppercase">
          <ShieldAlert className="w-4 h-4" />
          <span>Public Reporting Channel</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Report Air Pollution or Waste Burning
        </h1>
        <p className="text-sm text-slate-600">
          Provide observation details and pin the incident on the map. Upon submission, our AI source apportionment engine immediately initiates backward wind trajectory modeling and sensor anomaly verification.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center space-x-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Incident Details
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Complaint Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dense black smoke and burning plastic smell near school"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pollution Type *
              </label>
              <select
                value={pollutionType}
                onChange={(e) => setPollutionType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="waste_burning">Waste Burning (Plastic, Refuse, Municipal Trash)</option>
                <option value="smoke">Dense Smoke / Smolder</option>
                <option value="dust">Fugitive Dust & Construction Plume</option>
                <option value="industrial_emissions">Industrial Chimney / Process Fumes</option>
                <option value="odor">Chemical / Pungent Odor</option>
                <option value="other">Other Environmental Hazard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date & Time Observed *
              </label>
              <input
                type="datetime-local"
                value={observedAt}
                onChange={(e) => setObservedAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Incident Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color of smoke (white/grey/black), smell, burning material, wind intensity, or any visible origins..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Location Picker Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                2. Incident Location & Map Pin
              </h2>
              <p className="text-xs text-slate-500">
                Click anywhere on the map to accurately place the incident coordinates.
              </p>
            </div>
            <div className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
              Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <InvestigationMap
              centerLat={latitude}
              centerLon={longitude}
              zoom={13}
              complaintLocation={{ lat: latitude, lon: longitude, title: 'Your Pin' }}
              selectable={true}
              onLocationSelect={handleLocationSelect}
              height="340px"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Approximate Street Address / Landmark
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Diamond Garden, Chembur Colony"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            3. Photographic Evidence (Optional)
          </h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Image URL / Photo Attachment
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or paste image link"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Helps inspection teams verify plume density and burning refuse characteristics.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            {submitting ? (
              <span>Running Source Analysis Engine...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit & Trigger Source Investigation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

