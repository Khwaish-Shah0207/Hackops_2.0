'use client';

import React, { useState } from 'react';
import { TrackingIncident } from '@/lib/trackingDemoData';

interface CitizenFeedbackFormProps {
  incident: TrackingIncident;
}

export function CitizenFeedbackForm({ incident }: CitizenFeedbackFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [clarity, setClarity] = useState<'clear' | 'somewhat' | 'unclear' | null>(null);
  const [resolutionImpact, setResolutionImpact] = useState<
    'fully_addressed' | 'partially_addressed' | 'not_addressed' | null
  >(null);
  const [writtenNotes, setWrittenNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const starLabels: Record<number, string> = {
    1: '1/5 - Unsatisfactory (Slow or insufficient response)',
    2: '2/5 - Fair (Delays in investigation)',
    3: '3/5 - Satisfactory (Reasonable transparency)',
    4: '4/5 - Good (Prompt dispatch & clear findings)',
    5: '5/5 - Excellent (Fast verification & effective containment)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (rating === 0) {
      setValidationError('Please select an overall experience rating from 1 to 5 stars.');
      return;
    }
    if (!clarity) {
      setValidationError('Please indicate whether the investigation updates were clear and understandable.');
      return;
    }
    if (!resolutionImpact) {
      setValidationError('Please select whether the recorded action addressed your reported concern.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 450);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setRating(0);
    setClarity(null);
    setResolutionImpact(null);
    setWrittenNotes('');
    setValidationError(null);
  };

  if (!incident.feedback_eligible) {
    return (
      <div className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 md:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A8B5A5]/60" />
          <h2 className="text-base font-serif font-bold text-[#EAE8DF]">
            Citizen Feedback &amp; Verification Loop
          </h2>
        </div>
        <p className="font-mono text-xs text-[#A8B5A5] leading-relaxed">
          The feedback mechanism becomes accessible once an investigation milestone, field inspection dispatch, or corrective action has been recorded for this docket. Current status for {incident.complaint_number} is{' '}
          <strong className="text-[#EAE8DF] font-bold">{incident.status}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div id="feedback-section" className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-[#A8B5A5]/15 gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#EAE8DF] block mb-1">
            Accountability &amp; Verification
          </span>
          <h2 className="text-xl md:text-2xl font-serif text-[#EAE8DF]">
            Citizen Feedback on Investigation &amp; Resolution
          </h2>
          <p className="font-mono text-xs text-[#A8B5A5] mt-1">
            Provide direct evaluation of regulatory transparency, dispatch timeliness, and air quality recovery.
          </p>
        </div>

        <div className="px-3 py-1 bg-[#252C28] border border-[#A8B5A5]/25 font-mono text-xs text-[#A8B5A5] self-start sm:self-auto">
          Docket: <span className="text-[#EAE8DF] font-bold">{incident.complaint_number}</span>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-[#252C28] border border-[#667B70]/50 p-6 md:p-8 space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-none bg-[#667B70]/20 border border-[#667B70] flex items-center justify-center text-[#667B70]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-xl font-serif font-bold text-[#EAE8DF]">
            Demonstration Feedback Recorded
          </h3>

          <div className="max-w-xl mx-auto space-y-2 font-mono text-xs text-[#A8B5A5] leading-relaxed">
            {resolutionImpact === 'not_addressed' ? (
              <p className="text-[#B65348] p-3 bg-[#14251F] border border-[#B65348]/40">
                You indicated that the pollution is continuing. In live operation, negative verification automatically prevents case closure, elevates docket priority to High, and alerts the Regional Officer for squad re-inspection.
              </p>
            ) : (
              <p className="p-3 bg-[#14251F] border border-[#667B70]/30 text-[#EAE8DF]">
                Thank you for confirming resolution. Your feedback rating ({rating}/5 stars) has been logged into the public environmental audit register.
              </p>
            )}
            <p className="text-[11px] text-[#A8B5A5]/70 pt-1">
              Notice: This is a frontend demonstration recording. Data structures are formatted for direct backend REST API ingestion.
            </p>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 bg-[#14251F] border border-[#A8B5A5]/30 hover:border-[#EAE8DF] font-mono text-xs uppercase tracking-wider text-[#EAE8DF] transition-colors"
            >
              Submit Additional Update
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validation Notice */}
          {validationError && (
            <div className="p-3 bg-[#252C28] border border-[#B65348] text-[#B65348] font-mono text-xs flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{validationError}</span>
            </div>
          )}

          {/* Section A: Overall Experience Rating */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A8B5A5]">
              A. Overall Investigation &amp; Squad Response Rating <span className="text-[#C77B43]">*</span>
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Investigation Rating">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} of 5 stars`}
                      className="p-1.5 border border-transparent hover:border-[#A8B5A5]/30 transition-all focus:outline-none"
                    >
                      <svg
                        className={`w-7 h-7 transition-colors ${
                          filled ? 'text-[#C77B43] fill-[#C77B43]' : 'text-[#A8B5A5]/30 fill-none'
                        }`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>

              <span className="font-mono text-xs text-[#EAE8DF]">
                {starLabels[hoverRating || rating] || 'Select 1 to 5 stars'}
              </span>
            </div>
          </div>

          {/* Section B: Investigation Updates Clarity */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A8B5A5]">
              B. Were the investigation updates and evidence findings clear and understandable? <span className="text-[#C77B43]">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setClarity('clear')}
                className={`p-3.5 border text-left transition-all ${
                  clarity === 'clear'
                    ? 'bg-[#252C28] border-[#667B70] ring-1 ring-[#667B70]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#EAE8DF]">Clear &amp; Informative</span>
                  <span className={`w-3 h-3 rounded-full border ${clarity === 'clear' ? 'bg-[#667B70] border-[#EAE8DF]' : 'border-[#A8B5A5]/30'}`} />
                </div>
                <p className="text-[11px] text-[#A8B5A5]">Timeline and technical findings were easy to follow.</p>
              </button>

              <button
                type="button"
                onClick={() => setClarity('somewhat')}
                className={`p-3.5 border text-left transition-all ${
                  clarity === 'somewhat'
                    ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#EAE8DF]">Somewhat Clear</span>
                  <span className={`w-3 h-3 rounded-full border ${clarity === 'somewhat' ? 'bg-[#C77B43] border-[#EAE8DF]' : 'border-[#A8B5A5]/30'}`} />
                </div>
                <p className="text-[11px] text-[#A8B5A5]">Some terminology or status changes were overly technical.</p>
              </button>

              <button
                type="button"
                onClick={() => setClarity('unclear')}
                className={`p-3.5 border text-left transition-all ${
                  clarity === 'unclear'
                    ? 'bg-[#252C28] border-[#B65348] ring-1 ring-[#B65348]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#B65348]">Unclear / Ambiguous</span>
                  <span className={`w-3 h-3 rounded-full border ${clarity === 'unclear' ? 'bg-[#B65348] border-[#EAE8DF]' : 'border-[#A8B5A5]/30'}`} />
                </div>
                <p className="text-[11px] text-[#A8B5A5]">Need simpler explanations of what actions were taken.</p>
              </button>
            </div>
          </div>

          {/* Section C: Action or Resolution Feedback */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A8B5A5]">
              C. Did the recorded action or investigation response address your reported concern? <span className="text-[#C77B43]">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setResolutionImpact('fully_addressed')}
                className={`p-3.5 border text-left transition-all ${
                  resolutionImpact === 'fully_addressed'
                    ? 'bg-[#252C28] border-[#667B70] ring-1 ring-[#667B70]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#EAE8DF]">Fully Addressed</span>
                  <span className={`w-3 h-3 rounded-full border ${resolutionImpact === 'fully_addressed' ? 'bg-[#667B70] border-[#EAE8DF]' : 'border-[#A8B5A5]/30'}`} />
                </div>
                <p className="text-[11px] text-[#A8B5A5]">Pollution has ceased; surrounding air quality is restored.</p>
              </button>

              <button
                type="button"
                onClick={() => setResolutionImpact('partially_addressed')}
                className={`p-3.5 border text-left transition-all ${
                  resolutionImpact === 'partially_addressed'
                    ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#EAE8DF]">Partially Addressed</span>
                  <span className={`w-3 h-3 rounded-full border ${resolutionImpact === 'partially_addressed' ? 'bg-[#C77B43] border-[#EAE8DF]' : 'border-[#A8B5A5]/30'}`} />
                </div>
                <p className="text-[11px] text-[#A8B5A5]">Visible smoke is reduced, but noticeable acrid smell lingers.</p>
              </button>

              <button
                type="button"
                onClick={() => setResolutionImpact('not_addressed')}
                className={`p-3.5 border text-left transition-all ${
                  resolutionImpact === 'not_addressed'
                    ? 'bg-[#252C28] border-[#B65348] ring-1 ring-[#B65348]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#B65348]">Not Addressed</span>
                  <span className={`w-3 h-3 rounded-full border ${resolutionImpact === 'not_addressed' ? 'bg-[#B65348] border-[#EAE8DF]' : 'border-[#A8B5A5]/30'}`} />
                </div>
                <p className="text-[11px] text-[#A8B5A5]">Emissions continue; urgent re-inspection required.</p>
              </button>
            </div>
          </div>

          {/* Section D: Written Feedback & Ground Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A8B5A5]">
              D. Additional Ground Observations or Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={writtenNotes}
              onChange={(e) => setWrittenNotes(e.target.value)}
              placeholder="Provide any additional ground notes, observed inspection personnel, changes in smoke density, or suggestions for the response team..."
              className="w-full bg-[#1B201D] border border-[#A8B5A5]/25 p-3 text-xs font-mono text-[#EAE8DF] placeholder-[#A8B5A5]/40 focus:border-[#C77B43] focus:outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-[11px] font-mono text-[#A8B5A5]/70">
              * Response is recorded in the public accountability docket.
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                resolutionImpact === 'not_addressed'
                  ? 'bg-[#B65348] hover:bg-[#B65348]/90 text-[#EAE8DF] border border-[#EAE8DF]/30'
                  : 'bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] border border-[#EAE8DF]/40'
              }`}
            >
              {isSubmitting
                ? 'Recording Feedback...'
                : resolutionImpact === 'not_addressed'
                ? 'Flag Pollution Persisting & Request Re-dispatch'
                : 'Submit Citizen Feedback'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

