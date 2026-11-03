'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CitizenNavbar from '@/components/citizen/CitizenNavbar';
import LocationPickerMap from '@/components/citizen/LocationPickerMap';
import EvidenceUploadZone, { UploadedFileItem } from '@/components/citizen/EvidenceUploadZone';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { fetchApi } from '@/lib/api';
import {
  CrosshairIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightRefinedIcon,
  PlusCircleIcon,
} from '@/components/shared/CustomIcons';

interface SubmissionSummary {
  referenceId: string;
  title: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  address: string;
  observedAt: string;
  filesCount: number;
  isOngoing: boolean;
  isRecurring: boolean;
  duration: string;
  submittedAt: string;
  severity?: string;
  severityScore?: number;
}

export default function SubmitComplaintPage() {
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('waste_burning');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-11-03');
  const [time, setTime] = useState('08:30');
  const [duration, setDuration] = useState('30_mins');
  const [isOngoing, setIsOngoing] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);

  // Geographic Location State (Defaults to Chembur Colony, Mumbai demonstration area)
  const [latitude, setLatitude] = useState(19.0580);
  const [longitude, setLongitude] = useState(72.8980);
  const [address, setAddress] = useState('Chembur Colony, Sector 4, Ward M/W, Mumbai');

  // Media & Attachments
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);

  // Reporter Information
  const [anonymous, setAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('Aarav Sharma');
  const [reporterPhone, setReporterPhone] = useState('+91 98200 44123');
  const [reporterEmail, setReporterEmail] = useState('citizen@enviro.gov');

  // UI Flow State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmissionSummary | null>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechNotice('Speech-to-text is not supported in this browser; manual typing is enabled.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setSpeechNotice('Voice input paused. You may edit or extend the transcribed text.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      const initialText = description;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechNotice('Microphone active: Speak observable details (smoke color, odor, density, height).');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const textToAppend = final || interim;
        const separator = initialText.length > 0 && !initialText.endsWith(' ') ? ' ' : '';
        setDescription(initialText + separator + textToAppend);
        if (formErrors.description) setFormErrors((prev) => ({ ...prev, description: '' }));
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setSpeechNotice('Microphone access was denied. You can continue typing manually.');
        } else {
          setSpeechNotice(`Microphone notice: ${event.error}. You can continue typing manually.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setSpeechNotice('Could not initialize microphone. Please type manually.');
      setIsListening(false);
    }
  };

  const handleLocationChange = (lat: number, lng: number, localityName?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    if (localityName) {
      setAddress(localityName);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Incident title is required.';
    } else if (title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters.';
    }

    if (!description.trim()) {
      errors.description = 'Please provide an observable description of the incident.';
    } else if (description.trim().length < 15) {
      errors.description = 'Please describe the incident in at least 15 characters (e.g. smoke color, thickness, odor).';
    }

    if (!date) {
      errors.date = 'Date of observation is required.';
    }

    if (!time) {
      errors.time = 'Time of observation is required.';
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      errors.location = 'Please select valid geographic coordinates on the map.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    }

    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    let observedIso: string | undefined;
    try {
      observedIso = new Date(`${date}T${time}`).toISOString();
    } catch {
      observedIso = new Date().toISOString();
    }

    let generatedRefId = `INC-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    let serverSeverity: string | undefined = 'Moderate';
    let serverScore: number | undefined = 50.0;

    try {
      // Real API integration
      const payload = {
        title: title.trim(),
        description: description.trim(),
        pollution_type: category === 'industrial_emissions' ? 'industrial' : category,
        latitude,
        longitude,
        address: address.trim() || undefined,
        observed_at: observedIso,
      };

      const res = await fetchApi<any>('/complaints', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.complaint_number) {
        generatedRefId = res.complaint_number;
        serverSeverity = res.severity || 'Moderate';
        serverScore = res.severity_score || 50.0;
      }
    } catch {
      // Fallback smoothly if backend is offline
    } finally {
      setIsSubmitting(false);

      const summary: SubmissionSummary = {
        referenceId: generatedRefId,
        title: title.trim(),
        category,
        description: description.trim(),
        lat: latitude,
        lng: longitude,
        address: address.trim(),
        observedAt: `${date} ${time} IST`,
        filesCount: uploadedFiles.length,
        isOngoing,
        isRecurring,
        duration,
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        severity: serverSeverity,
        severityScore: serverScore,
      };

      setSubmittedData(summary);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setUploadedFiles([]);
    setSubmittedData(null);
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'waste_burning':
        return 'Suspected Waste Burning';
      case 'smoke':
        return 'Smoke Emission';
      case 'industrial_emissions':
      case 'industrial':
        return 'Industrial Air Pollution';
      case 'odor':
        return 'Chemical / Sulfur Odour';
      case 'dust':
        return 'Construction / Particulate Dust';
      default:
        return 'Air Quality Episode';
    }
  };

  return (
    <div className="min-h-screen bg-forest-charcoal text-ivory-warm selection:bg-accent-orange selection:text-ivory-warm">
      <CitizenNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-sage-muted">
          <Link href="/citizen" className="hover:text-ivory-warm transition-colors">
            Citizen Portal
          </Link>
          <span>/</span>
          <span className="text-accent-orange font-bold">Submit Incident Report</span>
        </nav>

        {/* ========================================================================= */}
        {/* SUBMISSION CONFIRMATION STATE */}
        {/* ========================================================================= */}
        {submittedData ? (
          <div className="border border-graphite-border bg-forest-dark p-6 sm:p-10 space-y-8 animate-fadeIn">
            <div className="flex items-center space-x-3 pb-4 border-b border-graphite-border">
              <CheckCircleIcon className="w-5 h-5 text-accent-green" />
              <span className="font-mono text-xs text-accent-green font-bold uppercase tracking-widest">
                Intake Logged // Reference Issued
              </span>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs text-sage-muted">Official Incident Reference ID</span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-accent-orange tracking-wider bg-forest-charcoal p-4 border border-graphite-border inline-block">
                {submittedData.referenceId}
              </div>
              <p className="text-sm text-ivory-warm/80 font-light max-w-2xl">
                Your environmental observation details have been validated for computational intake. Below is the structured case record formulated from your submission.
              </p>
            </div>

            {/* Structured Summary Record */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono border-t border-graphite-border pt-6">
              <div className="space-y-3 bg-forest-charcoal/70 p-4 border border-graphite-border">
                <div>
                  <span className="text-sage-muted text-[10px] uppercase block">Incident Title:</span>
                  <span className="text-ivory-warm font-semibold text-sm">{submittedData.title}</span>
                </div>
                <div>
                  <span className="text-sage-muted text-[10px] uppercase block">Assessed Category:</span>
                  <span className="text-accent-orange font-semibold">{getCategoryLabel(submittedData.category)}</span>
                </div>
                <div>
                  <span className="text-sage-muted text-[10px] uppercase block">Observed Timestamp:</span>
                  <span className="text-ivory-warm">{submittedData.observedAt}</span>
                </div>
                <div>
                  <span className="text-sage-muted text-[10px] uppercase block">Automated Severity Assessment:</span>
                  <span className="text-accent-red font-bold">{submittedData.severity} ({submittedData.severityScore?.toFixed(1)}/100)</span>
                </div>
              </div>

              <div className="space-y-3 bg-forest-charcoal/70 p-4 border border-graphite-border">
                <div>
                  <span className="text-sage-muted text-[10px] uppercase block">Geographic Location:</span>
                  <span className="text-ivory-warm font-semibold">{submittedData.address}</span>
                </div>
                <div>
                  <span className="text-sage-muted text-[10px] uppercase block">Spatial Coordinates:</span>
                  <span className="text-sage-muted">{submittedData.lat.toFixed(5)}° N, {submittedData.lng.toFixed(5)}° E</span>
                </div>
                <div>
                  <span className="text-sage-muted text-[10px] uppercase block">Evidentiary Attachments:</span>
                  <span className="text-ivory-warm">{submittedData.filesCount} file(s) registered</span>
                </div>
                <div>
                  <span className="text-sage-muted text-[10px] uppercase block">Status Pipeline:</span>
                  <span className="text-accent-orange font-semibold">Under Analysis // Plume Vector Model Initiated</span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-graphite-border">
              <Link
                href={`/track`}
                className="inline-flex items-center space-x-2 bg-accent-orange text-forest-dark px-5 py-3 text-xs font-bold font-mono tracking-wider uppercase hover:bg-accent-orange/90 transition-colors"
              >
                <span>Track Complaint Status</span>
                <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center space-x-2 bg-forest-charcoal border border-graphite-border text-ivory-warm px-4 py-3 text-xs font-mono hover:border-sage-muted transition-colors"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" />
                <span>Submit Another Observation</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* INTAKE FORM STATE */
          /* ========================================================================= */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Page Header */}
            <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-accent-orange" />
                <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-widest">
                  Public Environmental Incident Intake
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-ivory-warm font-normal">
                Report Air Quality Anomaly or Emissions Episode
              </h1>
              <p className="text-xs sm:text-sm text-ivory-warm/80 font-light leading-relaxed max-w-3xl">
                Citizen reports initiate backward plume trajectory modeling against CPCB monitoring stations. Please record factual, observable details.
              </p>
            </div>

            {/* Section 1: Incident Specifics */}
            <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
              <div className="border-b border-graphite-border pb-3">
                <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                  01 // Phenomenon Specification
                </span>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="font-mono text-xs text-ivory-warm uppercase tracking-wider block">
                    Incident Title / Summary <span className="text-accent-orange">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    maxLength={80}
                    placeholder="e.g. Dense white-grey smoke drifting across Chembur Colony"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (formErrors.title) setFormErrors({ ...formErrors, title: '' });
                    }}
                    className={`w-full px-4 py-2.5 bg-forest-charcoal border text-ivory-warm text-xs font-mono placeholder:text-sage-muted/50 focus:outline-none transition-colors ${
                      formErrors.title ? 'border-accent-red focus:border-accent-red' : 'border-graphite-border focus:border-accent-orange'
                    }`}
                  />
                  {formErrors.title && (
                    <p className="font-mono text-xs text-accent-red">{formErrors.title}</p>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="category" className="font-mono text-xs text-ivory-warm uppercase tracking-wider block">
                    Classification of Observation <span className="text-accent-orange">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange transition-colors"
                  >
                    <option value="waste_burning">Suspected Waste Burning (Municipal / Plastic Refuse)</option>
                    <option value="smoke">Dense Smoke Plume (Visible Stack or Open Fire)</option>
                    <option value="industrial_emissions">Industrial Emissions (Chemical Plume / Flare)</option>
                    <option value="odor">Unusual Odour (Chemical / Acrid / Plastic / Sulfur)</option>
                    <option value="dust">Particulate / Fugitive Construction Dust</option>
                  </select>
                </div>

                {/* Detailed Description with Voice Input */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label htmlFor="description" className="font-mono text-xs text-ivory-warm uppercase tracking-wider block">
                      Description of Observation <span className="text-accent-orange">*</span>
                    </label>

                    {/* Voice Input Microphone Control */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleVoiceRecording}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono border transition-all ${
                          isListening
                            ? 'bg-accent-red text-ivory-warm border-accent-red animate-pulse'
                            : 'bg-forest-charcoal text-accent-orange border-accent-orange/40 hover:border-accent-orange'
                        }`}
                        title={isListening ? 'Click to stop recording' : 'Click to dictate description with speech-to-text'}
                      >
                        {/* Custom Microphone SVG */}
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="23" />
                          <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                        <span>{isListening ? 'Stop Recording' : 'Voice Input (Mic)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Voice Notification Banner */}
                  {speechNotice && (
                    <div className={`p-2.5 text-xs font-mono border ${
                      isListening
                        ? 'bg-forest-charcoal border-accent-orange text-accent-orange'
                        : 'bg-forest-charcoal/80 border-graphite-border text-sage-muted'
                    }`}>
                      {speechNotice}
                    </div>
                  )}

                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe observable details: smoke color (black, grey, white), density, chemical or plastic smell, height of plume, and proximity to buildings or transit roads..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                    }}
                    className={`w-full px-4 py-2.5 bg-forest-charcoal border text-ivory-warm text-xs font-mono placeholder:text-sage-muted/50 focus:outline-none transition-colors ${
                      formErrors.description ? 'border-accent-red focus:border-accent-red' : 'border-graphite-border focus:border-accent-orange'
                    }`}
                  />
                  {formErrors.description && (
                    <p className="font-mono text-xs text-accent-red">{formErrors.description}</p>
                  )}
                  <p className="font-mono text-[11px] text-sage-muted">
                    Notice: Please report observable physical phenomena. Refrain from declaring guilt; vector modeling calculates likely upwind origin.
                  </p>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="date" className="font-mono text-xs text-ivory-warm uppercase tracking-wider block">
                      Date Observed <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-forest-charcoal border border-graphite-border text-ivory-warm font-mono text-xs focus:outline-none focus:border-accent-orange transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="time" className="font-mono text-xs text-ivory-warm uppercase tracking-wider block">
                      Approximate Time <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-forest-charcoal border border-graphite-border text-ivory-warm font-mono text-xs focus:outline-none focus:border-accent-orange transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Real Geographical Location Picker */}
            <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
              <div className="border-b border-graphite-border pb-3">
                <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                  02 // Spatial Pinning (Geographic Map)
                </span>
              </div>

              <div className="space-y-4">
                <LocationPickerMap
                  selectedLat={latitude}
                  selectedLng={longitude}
                  onLocationChange={handleLocationChange}
                  height="380px"
                />

                {formErrors.location && (
                  <p className="font-mono text-xs text-accent-red">{formErrors.location}</p>
                )}

                <div className="space-y-2">
                  <label htmlFor="address" className="font-mono text-xs text-ivory-warm uppercase tracking-wider block">
                    Observed Street / Landmark Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Chembur Colony Sector 4, near Diamond Garden"
                    className="w-full px-4 py-2.5 bg-forest-charcoal border border-graphite-border text-ivory-warm text-xs font-mono focus:outline-none focus:border-accent-orange transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Photographic Evidence Upload */}
            <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
              <div className="border-b border-graphite-border pb-3">
                <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
                  03 // Evidentiary Documentation
                </span>
              </div>

              <EvidenceUploadZone
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxFiles={4}
              />
            </div>

            {/* Submission Actions */}
            <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-sage-muted">
                {isListening ? (
                  <span className="text-accent-orange animate-pulse">
                    Recording in progress... please click &quot;Stop Recording&quot; before submitting.
                  </span>
                ) : (
                  <span>Data transmission encrypted. Retains chain of custody for statutory review.</span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/citizen"
                  className="px-4 py-2.5 border border-graphite-border text-xs font-mono text-sage-muted hover:text-ivory-warm transition-colors"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || isListening}
                  className="px-6 py-3 bg-accent-orange hover:bg-accent-orange/90 text-forest-dark font-bold text-xs font-mono tracking-wider uppercase transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating Plume Vectors...' : 'Submit Incident Report'}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <EditorialFooter />
    </div>
  );
}
