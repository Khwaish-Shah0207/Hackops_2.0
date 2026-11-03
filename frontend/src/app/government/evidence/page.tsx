'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GovernmentShell } from '@/components/government/GovernmentShell';
import { DEMO_INVESTIGATION_CASE_INC_4 } from '@/lib/investigationDemoData';

export default function EvidencePage() {
  const caseData = DEMO_INVESTIGATION_CASE_INC_4;
  const [selectedSensorId, setSelectedSensorId] = useState('CPCB-GOV-01');

  const selectedSensor =
    caseData.sensors.find((s) => s.id === selectedSensorId) || caseData.sensors[0];

  return (
    <GovernmentShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#A8B5A5]/15 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#667B70]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#667B70]">
              Empirical Sensor Telemetry &amp; Vector Analysis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8DF]">
            Evidence &amp; Source Attribution Console
          </h1>
          <p className="text-xs font-mono text-[#A8B5A5] mt-0.5">
            Cross-examination of CPCB ambient station data, Lagrangian dispersion vectors, and EPA CMB 8.2 speciation profiles.
          </p>
        </div>

        <div className="text-xs font-mono text-[#A8B5A5] flex items-center gap-2">
          <span>Target Docket:</span>
          <Link
            href="/government/investigation?id=4"
            className="px-2.5 py-1 bg-[#252C28] text-[#C77B43] border border-[#C77B43]/50 font-bold hover:underline"
          >
            INC-2026-0004 &rarr;
          </Link>
        </div>
      </div>

      {/* 1. Ambient Sensor Telemetry Network */}
      <section aria-labelledby="sensors-heading" className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#A8B5A5]/15 gap-2">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C77B43] block">
              CPCB Continuous Air Quality Mesh
            </span>
            <h2 id="sensors-heading" className="text-lg font-serif text-[#EAE8DF]">
              Corridor Monitoring Station Observations
            </h2>
          </div>
          <span className="text-xs font-mono text-[#A8B5A5]">
            Observation Time: {caseData.observed_at}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {caseData.sensors.map((sensor) => {
            const isSelected = sensor.id === selectedSensorId;
            return (
              <div
                key={sensor.id}
                onClick={() => setSelectedSensorId(sensor.id)}
                className={`p-4 border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-[#252C28] border-[#C77B43] ring-1 ring-[#C77B43]/50'
                    : 'bg-[#1B201D] border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#EAE8DF]">{sensor.id}</span>
                  {sensor.is_anomaly ? (
                    <span className="px-2 py-0.5 bg-[#B65348]/20 border border-[#B65348]/50 text-[#B65348] text-[9px] uppercase font-bold">
                      Anomaly Spike ({(sensor.anomaly_score * 100).toFixed(0)}%)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#667B70]/20 border border-[#667B70]/40 text-[#667B70] text-[9px] uppercase">
                      Baseline Normal
                    </span>
                  )}
                </div>

                <div className="text-sm font-serif font-bold text-[#EAE8DF]">
                  {sensor.name}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#A8B5A5]/10 text-[11px]">
                  <div>
                    <span className="text-[#A8B5A5] block text-[9px] uppercase">PM2.5 Conc</span>
                    <span className="text-base font-bold text-[#C77B43]">{sensor.pm25} µg/m³</span>
                  </div>
                  <div>
                    <span className="text-[#A8B5A5] block text-[9px] uppercase">Calculated AQI</span>
                    <span className="text-base font-bold text-[#EAE8DF]">{sensor.aqi}</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#A8B5A5] pt-1">
                  Corridor Distance: {sensor.distance_km} km from receptor
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Chemical Speciation Mass Balance Comparison Matrix */}
      <section aria-labelledby="speciation-comparison-heading" className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 space-y-4 font-mono text-xs">
        <div className="pb-3 border-b border-[#A8B5A5]/15">
          <span className="text-[10px] uppercase tracking-widest text-[#667B70] block">
            Receptor Source Fingerprint Matching
          </span>
          <h2 id="speciation-comparison-heading" className="text-lg font-serif text-[#EAE8DF]">
            Chemical Mass Balance Comparison (CMB 8.2 Diagnostic Matrix)
          </h2>
          <p className="text-[#A8B5A5] text-[11px] mt-0.5">
            Comparative mass apportionment comparing Chembur receptor filter capture against EPA Library reference profiles.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#A8B5A5]/20 text-[#A8B5A5] text-[10px] uppercase">
                <th className="py-2.5 px-3">Forensic Tracer Constituent</th>
                <th className="py-2.5 px-3">Formula</th>
                <th className="py-2.5 px-3">Receptor Sample (Chembur)</th>
                <th className="py-2.5 px-3">EPA Profile 8402 (Waste Smolder)</th>
                <th className="py-2.5 px-3">Profile 2104 (Industrial Boiler)</th>
                <th className="py-2.5 px-3 text-right">Attribution Correlation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A8B5A5]/10">
              <tr className="hover:bg-[#252C28]/40">
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">Sulphate Inorganic Aerosol</td>
                <td className="py-2.5 px-3 text-[#C77B43]">SO₄²⁻</td>
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">32.0%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">29.5%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">58.0%</td>
                <td className="py-2.5 px-3 text-right text-[#667B70] font-bold">94.2% Match</td>
              </tr>
              <tr className="hover:bg-[#252C28]/40">
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">Nitrate Oxidation Marker</td>
                <td className="py-2.5 px-3 text-[#C77B43]">NO₃⁻</td>
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">24.0%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">22.0%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">28.0%</td>
                <td className="py-2.5 px-3 text-right text-[#667B70] font-bold">91.7% Match</td>
              </tr>
              <tr className="hover:bg-[#252C28]/40">
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">Organic Carbon (Primary)</td>
                <td className="py-2.5 px-3 text-[#C77B43]">OC</td>
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">18.0%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">19.8%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">6.2%</td>
                <td className="py-2.5 px-3 text-right text-[#667B70] font-bold">90.9% Match</td>
              </tr>
              <tr className="hover:bg-[#252C28]/40">
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">Elemental Carbon (Soot)</td>
                <td className="py-2.5 px-3 text-[#C77B43]">EC</td>
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">14.0%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">15.2%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">5.1%</td>
                <td className="py-2.5 px-3 text-right text-[#667B70] font-bold">92.1% Match</td>
              </tr>
              <tr className="hover:bg-[#252C28]/40">
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">Heavy Metals &amp; Chlorides</td>
                <td className="py-2.5 px-3 text-[#C77B43]">Zn, Pb, Cl⁻</td>
                <td className="py-2.5 px-3 font-bold text-[#EAE8DF]">12.0%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">13.5%</td>
                <td className="py-2.5 px-3 text-[#A8B5A5]">2.7%</td>
                <td className="py-2.5 px-3 text-right text-[#667B70] font-bold">88.8% Match</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#252C28] border border-[#A8B5A5]/20 flex items-center justify-between text-[11px]">
          <span>Composite Profile Correlation to Open Waste Burning (EPA Profile 8402):</span>
          <span className="text-[#C77B43] font-bold text-sm">86.8% (High Statistical Significance)</span>
        </div>
      </section>

      {/* 3. Backward Trajectory Vector Table */}
      <section aria-labelledby="trajectory-table-heading" className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 space-y-4 font-mono text-xs">
        <div className="pb-3 border-b border-[#A8B5A5]/15">
          <span className="text-[10px] uppercase tracking-widest text-[#C77B43] block">
            Lagrangian Atmospheric Dispersion Back-Projection
          </span>
          <h2 id="trajectory-table-heading" className="text-lg font-serif text-[#EAE8DF]">
            Backward Trajectory Interpolation Table (NOAA HYSPLIT Emulation)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#A8B5A5]/20 text-[#A8B5A5] text-[10px] uppercase">
                <th className="py-2 px-3">Step</th>
                <th className="py-2 px-3">Back-Transport Time</th>
                <th className="py-2 px-3">Latitude / Longitude</th>
                <th className="py-2 px-3">Plume Elevation (AGL)</th>
                <th className="py-2 px-3">Ground Terrain Feature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A8B5A5]/10">
              {caseData.trajectory.map((pt, idx) => (
                <tr key={idx} className="hover:bg-[#252C28]/40">
                  <td className="py-2.5 px-3 text-[#C77B43] font-bold">T-{idx}</td>
                  <td className="py-2.5 px-3 text-[#EAE8DF] font-bold">-{pt.transit_minutes} minutes</td>
                  <td className="py-2.5 px-3 text-[#A8B5A5]">{pt.lat.toFixed(4)}° N, {pt.lng.toFixed(4)}° E</td>
                  <td className="py-2.5 px-3 text-[#EAE8DF]">{pt.elevation_m} meters AGL</td>
                  <td className="py-2.5 px-3 text-[#EAE8DF]">{pt.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </GovernmentShell>
  );
}
