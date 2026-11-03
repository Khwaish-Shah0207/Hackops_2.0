'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle, 
  Mic, 
  MicOff, 
  RefreshCw,
  Camera,
  Upload,
  X,
  Compass,
  Globe2,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

// Dynamic import for Leaflet map to ensure client-only render
const InvestigationMap = dynamic(() => import('@/components/InvestigationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-900 animate-pulse rounded-xl flex items-center justify-center text-slate-500 text-sm border border-slate-800">
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

  // Image Upload & Camera State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [satelliteStatus, setSatelliteStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const baseDescriptionRef = useRef<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Trigger simulated satellite verification
  const triggerSatelliteVerification = () => {
    setSatelliteStatus('scanning');
    const timer = setTimeout(() => {
      setSatelliteStatus('verified');
    }, 1600);
    return () => clearTimeout(timer);
  };

  // Option A: Handle Device Upload
  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setImageUrl(base64);
        triggerSatelliteVerification();
      };
      reader.readAsDataURL(file);
    }
  };

  // Option B: Camera Capture
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraModalOpen(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        // Fall back to native mobile camera file input
        setIsCameraModalOpen(false);
        mobileCameraRef.current?.click();
      }
    } catch (err: any) {
      console.warn('Webcam stream error, falling back to file input:', err);
      setIsCameraModalOpen(false);
      // Fallback directly to native device camera capture input
      mobileCameraRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(dataUrl);
        setImageUrl(dataUrl);
        setImageFileName(`camera_capture_${Date.now()}.jpg`);
        closeCamera();
        triggerSatelliteVerification();
      }
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageUrl('');
    setImageFileName('');
    setSatelliteStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (mobileCameraRef.current) mobileCameraRef.current.value = '';
  };

  const startVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setVoiceError('Voice recognition is not supported in this browser. Please type your description manually.');
      return;
    }

    try {
      setVoiceError(null);
      baseDescriptionRef.current = description ? description.trim() + ' ' : '';
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentSpeech = (finalTranscript || interimTranscript).trim();
        if (currentSpeech) {
          setDescription(baseDescriptionRef.current + currentSpeech);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error !== 'no-speech') {
          setVoiceError(`Voice input error (${event.error}). You can continue typing manually.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      setVoiceError('Unable to start voice recording. Please verify microphone permissions.');
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    setIsListening(false);
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setLatitude(parseFloat(lat.toFixed(5)));
    setLongitude(parseFloat(lon.toFixed(5)));
    setAddress(`Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)} (Selected via map)`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      stopVoiceInput();
    }

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
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
          <ShieldAlert className="w-4 h-4" />
          <span>Public Reporting Channel</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Report Air Pollution or Waste Burning
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Provide observation details, attach photographic evidence, and pin the coordinates. Our automated engine evaluates ambient CPCB air quality and triggers backward plume dispersion modeling.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl text-red-300 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Reporting Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 text-slate-100">
        
        {/* Incident Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
            <span>Observation Details</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Incident Title / Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dense black smoke and burning plastic smell near school"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Pollution Type *
              </label>
              <select
                value={pollutionType}
                onChange={(e) => setPollutionType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Date & Time Observed *
              </label>
              <input
                type="datetime-local"
                value={observedAt}
                onChange={(e) => setObservedAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Description & Voice Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Detailed Observation *
              </label>

              {speechSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isListening
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Recording... (Click to Stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Speak Description (Voice Input)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {voiceError && (
              <div className="p-2.5 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-300 text-xs">
                {voiceError}
              </div>
            )}

            <div className="relative">
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe color of smoke (white/grey/black), smell, burning material, wind intensity, or visible origins... (You can also click the voice button above to speak)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Photographic Evidence Section with Device Upload, Camera Capture, and Satellite Verification */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">2</span>
                <span>Photographic Evidence (Device or Camera)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Upload from your device storage or capture live using your device camera / webcam.
              </p>
            </div>
            {selectedImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 transition self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            )}
          </div>

          {/* Hidden Inputs for File & Camera */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleDeviceUpload}
            className="hidden"
          />
          <input
            type="file"
            ref={mobileCameraRef}
            accept="image/*"
            capture="environment"
            onChange={handleDeviceUpload}
            className="hidden"
          />

          {!selectedImage ? (
            /* Dual Acquisition Options */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Upload from Device */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-800/50 hover:bg-slate-800 text-left transition flex flex-col justify-between space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Option A: Upload from Device</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select JPG, PNG, or WebP photo from local storage, gallery, or files.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-400">Choose File →</span>
              </button>

              {/* Option B: Capture Using Camera */}
              <button
                type="button"
                onClick={startCamera}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-800/50 hover:bg-slate-800 text-left transition flex flex-col justify-between space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Option B: Capture Using Camera</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Use smartphone camera or desktop webcam to snap live plume evidence.
                  </p>
                </div>
                <span className="text-xs font-semibold text-indigo-400">Take Photo →</span>
              </button>
            </div>
          ) : (
            /* Selected Image Preview & Controls */
            <div className="bg-slate-800/70 rounded-2xl border border-slate-700 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Evidence Attachment Preview</span>
                  {imageFileName && (
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                      ({imageFileName})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Replace Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/70 border border-red-800/60 transition flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Image Preview Box */}
              <div className="relative rounded-xl overflow-hidden max-h-72 bg-black flex items-center justify-center border border-slate-700">
                <img
                  src={selectedImage}
                  alt="Incident Evidence"
                  className="w-full max-h-72 object-contain rounded-xl"
                />
              </div>

              {/* 5. FRONTEND-ONLY SATELLITE IMAGE VERIFICATION DEMONSTRATION */}
              {satelliteStatus === 'scanning' && (
                <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-4 flex items-center space-x-3 text-slate-300 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-indigo-300 block">
                      Synthesizing Optical Satellite Overlays (Simulated)...
                    </span>
                    <span className="text-slate-400">
                      Cross-referencing incident coordinates with optical surface reflectance & thermal anomaly bands...
                    </span>
                  </div>
                </div>
              )}

              {satelliteStatus === 'verified' && (
                <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe2 className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-sm text-white">Image Verification Status</h4>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                      Demonstration UI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300 pt-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Image received successfully.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Satellite imagery comparison: Demonstration mode.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Verification result: Simulated successful verification.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Status: <b className="text-emerald-400">Verified (Demo)</b></span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 italic">
                    Demonstration Notice: Simulated frontend verification showing automated satellite optical cross-referencing capabilities.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location Picker Section */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                <span>Incident Coordinates & Map Pin</span>
              </h2>
              <p className="text-xs text-slate-400">
                Click anywhere on the map to place the exact plume location.
              </p>
            </div>
            <div className="text-xs font-mono bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-emerald-400">
              Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-md">
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
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Approximate Street Address / Landmark
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Diamond Garden, Chembur Colony"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-end space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-emerald-900/40 transition"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Submitting & Assessing Severity...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Complaint for Investigation</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Camera Modal (For desktop webcam capture) */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl space-y-4 text-white relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Capture Live Evidence</h3>
              </div>
              <button
                type="button"
                onClick={closeCamera}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={closeCamera}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition flex items-center space-x-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Snapshot</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
