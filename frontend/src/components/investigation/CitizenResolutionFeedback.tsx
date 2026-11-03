'use client';

import React, { useState } from 'react';

interface CitizenResolutionFeedbackProps {
  complaintNumber: string;
}

export function CitizenResolutionFeedback({ complaintNumber }: CitizenResolutionFeedbackProps) {
  const [smokeStatus, setSmokeStatus] = useState<'cleared' | 'partially' | 'persisting' | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smokeStatus) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSmokeStatus(null);
    setRating(0);
    setNotes('');
  };

  return (
    <div className="bg-[#14251F] border border-[#A8B5A5]/20 p-6 md:p-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between pb-6 mb-6 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#EAE8DF]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#EAE8DF]">
              Citizen Verification Loop
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif text-[#EAE8DF]">
            Resolution Verification &amp; Ground Audit
          </h2>
          <p className="text-xs text-[#A8B5A5] mt-1 font-mono">
            Direct public feedback ensures closing reports match reality on the ground. Negative reports automatically trigger case reopening.
          </p>
        </div>

        <div className="text-xs font-mono text-[#A8B5A5] px-3 py-1.5 bg-[#252C28] border border-[#A8B5A5]/20 self-start md:self-auto">
          Case Ref: <span className="text-[#EAE8DF] font-bold">{complaintNumber}</span>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-[#252C28] border border-[#667B70]/50 p-6 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-none bg-[#667B70]/20 border border-[#667B70] flex items-center justify-center text-[#667B70]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-lg font-serif font-bold text-[#EAE8DF]">
            Verification Submitted Successfully
          </h3>

          <p className="text-xs font-mono text-[#A8B5A5] max-w-xl mx-auto leading-relaxed">
            {smokeStatus === 'persisting' ? (
              <span className="text-[#C77B43]">
                Your report that toxic emissions are persisting has been logged. Under Stage 8 Rapid Response protocols, case status has been flagged for Urgent Field Re-inspection and escalated to the Senior Regional Officer.
              </span>
            ) : (
              <span>
                Thank you for verifying air quality restoration. Your assessment has been integrated into the public air quality docket. Official case closure will conclude following final physical squad countersignature.
              </span>
            )}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-[#14251F] border border-[#A8B5A5]/30 text-xs font-mono text-[#EAE8DF] hover:border-[#EAE8DF] transition-colors"
            >
              Submit Further Update
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1: Air Quality Status */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A8B5A5] mb-3">
              1. What is the current air condition at your location? <span className="text-[#C77B43]">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSmokeStatus('cleared')}
                className={`p-4 border text-left transition-all ${
                  smokeStatus === 'cleared'
                    ? 'bg-[#252C28] border-[#667B70] ring-1 ring-[#667B70]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono uppercase font-bold text-[#EAE8DF]">
                    Smoke Cleared
                  </span>
                  <span
                    className={`w-3 h-3 rounded-full border ${
                      smokeStatus === 'cleared'
                        ? 'bg-[#667B70] border-[#EAE8DF]'
                        : 'border-[#A8B5A5]/30'
                    }`}
                  />
                </div>
                <p className="text-[11px] font-mono text-[#A8B5A5] leading-relaxed">
                  Visible emissions have ceased; odor has fully dissipated.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSmokeStatus('partially')}
                className={`p-4 border text-left transition-all ${
                  smokeStatus === 'partially'
                    ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono uppercase font-bold text-[#EAE8DF]">
                    Partially Cleared
                  </span>
                  <span
                    className={`w-3 h-3 rounded-full border ${
                      smokeStatus === 'partially'
                        ? 'bg-[#C77B43] border-[#EAE8DF]'
                        : 'border-[#A8B5A5]/30'
                    }`}
                  />
                </div>
                <p className="text-[11px] font-mono text-[#A8B5A5] leading-relaxed">
                  Visible smoke is reduced, but noticeable acrid smell lingers.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSmokeStatus('persisting')}
                className={`p-4 border text-left transition-all ${
                  smokeStatus === 'persisting'
                    ? 'bg-[#252C28] border-[#B65348] ring-1 ring-[#B65348]'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono uppercase font-bold text-[#B65348]">
                    Smoke Persisting
                  </span>
                  <span
                    className={`w-3 h-3 rounded-full border ${
                      smokeStatus === 'persisting'
                        ? 'bg-[#B65348] border-[#EAE8DF]'
                        : 'border-[#A8B5A5]/30'
                    }`}
                  />
                </div>
                <p className="text-[11px] font-mono text-[#A8B5A5] leading-relaxed">
                  Active burning continues; requires immediate inspection re-dispatch.
                </p>
              </button>
            </div>
          </div>

          {/* Question 2: Transparency & Response Rating */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A8B5A5] mb-2">
              2. Rate the investigation transparency &amp; dispatch speed
            </label>
            <div className="flex items-center gap-2">
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
                    className="p-1 focus:outline-none"
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
              <span className="text-xs font-mono text-[#A8B5A5] ml-2">
                {rating > 0 ? `${rating} of 5 stars` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Question 3: Observation Notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A8B5A5] mb-2">
              3. Ground Observations or Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any recent notes on smoke color changes, shifting winds, or observations of inspection personnel on site..."
              className="w-full bg-[#1B201D] border border-[#A8B5A5]/25 p-3 text-xs font-mono text-[#EAE8DF] placeholder-[#A8B5A5]/40 focus:border-[#C77B43] focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-[11px] font-mono text-[#A8B5A5]/70">
              * Verified submission logged in public accountability ledger.
            </div>

            <button
              type="submit"
              disabled={!smokeStatus || submitting}
              className={`w-full sm:w-auto px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                !smokeStatus || submitting
                  ? 'bg-[#252C28] text-[#A8B5A5]/40 border border-[#A8B5A5]/20 cursor-not-allowed'
                  : smokeStatus === 'persisting'
                  ? 'bg-[#B65348] hover:bg-[#B65348]/90 text-[#EAE8DF] border border-[#EAE8DF]/40'
                  : 'bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] border border-[#EAE8DF]/40'
              }`}
            >
              {submitting
                ? 'Logging Verification...'
                : smokeStatus === 'persisting'
                ? 'Flag Smoke Persisting & Request Re-dispatch'
                : 'Confirm Citizen Verification'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

