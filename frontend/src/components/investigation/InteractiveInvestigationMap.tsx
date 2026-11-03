'use client';

import React, { useEffect, useRef, useState } from 'react';
import { InvestigationDossierData } from '@/lib/investigationDemoData';
import {
  WindVectorIcon,
  CrosshairIcon,
  SensorStationIcon,
  LayersIcon,
} from '@/components/shared/CustomIcons';

interface InteractiveInvestigationMapProps {
  data: InvestigationDossierData;
  height?: string;
}

export default function InteractiveInvestigationMap({
  data,
  height = '480px',
}: InteractiveInvestigationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    trajectoryLayer?: any;
    corridorLayer?: any;
    stationsLayer?: any;
    candidatesLayer?: any;
    incidentLayer?: any;
  }>({});

  // Layer visibility toggles
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showCandidates, setShowCandidates] = useState(true);
  const [showCorridor, setShowCorridor] = useState(true);

  // Progressive Investigation Sequence
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'incident' | 'sensor' | 'candidate' | 'vector';
    title: string;
    subtitle: string;
    metrics: Record<string, string>;
    notes: string;
  }>({
    type: 'incident',
    title: data.title,
    subtitle: `Reference: ${data.complaint_number} // ${data.address}`,
    metrics: {
      'Observed Time': data.observed_at,
      'Classification': data.pollution_type,
      'Coordinates': `${data.coordinates.lat.toFixed(4)}° N, ${data.coordinates.lng.toFixed(4)}° E`,
    },
    notes: data.original_description,
  });

  const [isMapReady, setIsMapReady] = useState(false);

  // Client-safe Leaflet initialization
  useEffect(() => {
    let isCancelled = false;
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    import('leaflet').then((leafletModule) => {
      if (isCancelled || !mapContainerRef.current) return;
      const L = leafletModule.default || leafletModule;

      // Base Map
      const map = L.map(mapContainerRef.current, {
        center: [19.0510, 72.9120],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });
      mapInstanceRef.current = map;

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // 1. Incident Location Marker (Region A: Chembur Colony)
      const incidentIcon = L.divIcon({
        className: 'incident-reticle-marker',
        html: `
          <div style="
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              position: absolute;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              border: 2px dashed #C77B43;
              animation: spin 9s linear infinite;
            "></div>
            <div style="
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: #B65348;
              border: 2px solid #EAE8DF;
              box-shadow: 0 0 12px rgba(182, 83, 72, 0.8);
            "></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const incidentMarker = L.marker([data.coordinates.lat, data.coordinates.lng], {
        icon: incidentIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      incidentMarker.on('click', () => {
        setSelectedEntity({
          type: 'incident',
          title: data.title,
          subtitle: `Reference: ${data.complaint_number} // ${data.address}`,
          metrics: {
            'Observed Time': data.observed_at,
            'Pollution Type': data.pollution_type,
            'Coordinates': `${data.coordinates.lat.toFixed(4)}° N, ${data.coordinates.lng.toFixed(4)}° E`,
          },
          notes: data.original_description,
        });
      });
      layersRef.current.incidentLayer = incidentMarker;

      // 2. Upwind Plume Dispersion Corridor Polygon
      const corridorPolygon = L.polygon(
        [
          [19.0580, 72.8980], // Receptor Chembur
          [19.0380, 72.9360], // Southern Dispersion Edge
          [19.0590, 72.9340], // Northern Dispersion Edge
        ] as [number, number][],
        {
          color: '#C77B43',
          fillColor: '#C77B43',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4 4',
        }
      ).addTo(map);

      corridorPolygon.on('click', () => {
        setSelectedEntity({
          type: 'vector',
          title: 'Lagrangian Backward Dispersion Corridor',
          subtitle: `Wind Origin: ${data.weather.wind_direction_cardinal} (${data.weather.wind_direction_deg}°) at ${data.weather.wind_speed_ms} m/s`,
          metrics: {
            'Surface Velocity': `${data.weather.wind_speed_ms} m/s`,
            'Transport Time': '28 - 35 minutes upwind',
            'Boundary Layer': `${data.weather.boundary_layer_height_m} meters`,
            'Atmospheric Stability': data.weather.atmospheric_stability,
          },
          notes: 'Atmospheric back-projection models surface plume transport from complainant coordinates toward eastern industrial sectors.',
        });
      });
      layersRef.current.corridorLayer = corridorPolygon;

      // 3. Trajectory Vector Polyline
      const trajectoryCoords = data.trajectory.map((t) => [t.lat, t.lng] as [number, number]);
      const trajectoryLine = L.polyline(trajectoryCoords as [number, number][], {
        color: '#C77B43',
        weight: 3,
        dashArray: '6 4',
        opacity: 0.9,
      }).addTo(map);

      trajectoryLine.on('click', () => {
        setSelectedEntity({
          type: 'vector',
          title: 'Backward Lagrangian Plume Vector Path',
          subtitle: 'NOAA HYSPLIT Compatible 3-Hour Particle Backtrack',
          metrics: {
            'Bearing': `${data.weather.wind_direction_deg}° ESE`,
            'Corridor Length': '4.2 km upwind',
            'Confidence': '94.2% trajectory alignment',
          },
          notes: 'Every coordinate along this vector line is cross-referenced with physical ambient sensor stations and land-use records.',
        });
      });
      layersRef.current.trajectoryLayer = trajectoryLine;

      // 4. Monitoring Stations Layer
      const stationGroup = L.layerGroup();
      data.sensors.forEach((s) => {
        const stationIcon = L.divIcon({
          className: 'sensor-station-marker',
          html: `
            <div style="
              background-color: ${s.is_anomaly ? '#B65348' : '#252C28'};
              color: #EAE8DF;
              border: 1.5px solid ${s.is_anomaly ? '#EAE8DF' : '#A8B5A5'};
              padding: 2px 6px;
              font-family: monospace;
              font-size: 10px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 0 8px rgba(0,0,0,0.5);
            ">
              ${s.name.split(' ')[0]}: PM2.5 ${s.pm25}
            </div>
          `,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        });

        const marker = L.marker([s.lat, s.lng], { icon: stationIcon }).addTo(stationGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'sensor',
            title: s.name,
            subtitle: `ID: ${s.id} // Distance: ${s.distance_km} km from complaint`,
            metrics: {
              'PM2.5 Reading': `${s.pm25} µg/m³`,
              'PM10 Reading': `${s.pm10} µg/m³`,
              'AQI Category': `${s.aqi} (${s.aqi_bucket})`,
              'Anomaly Detection': s.is_anomaly ? `Spike Detected (Score ${s.anomaly_score})` : 'Normal Baseline',
            },
            notes: s.is_anomaly
              ? 'Isolation Forest identified statistical particulate deviation directly along the upwind plume transport corridor.'
              : 'Ambient readings are within seasonal baseline fluctuations.',
          });
        });
      });
      stationGroup.addTo(map);
      layersRef.current.stationsLayer = stationGroup;

      // 5. Candidate Sources Layer
      const candidateGroup = L.layerGroup();
      data.candidates.forEach((cand) => {
        const candIcon = L.divIcon({
          className: 'candidate-source-marker',
          html: `
            <div style="
              background-color: #14251F;
              color: ${cand.rank === 1 ? '#C77B43' : '#EAE8DF'};
              border: 2px solid ${cand.rank === 1 ? '#C77B43' : '#3D4741'};
              padding: 3px 7px;
              font-family: monospace;
              font-size: 11px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 0 10px rgba(0,0,0,0.6);
            ">
              #${cand.rank} ${cand.name.split(' ')[0]} (${cand.overall_evidence_score})
            </div>
          `,
          iconSize: [90, 22],
          iconAnchor: [45, 11],
        });

        const marker = L.marker([cand.lat, cand.lng], { icon: candIcon }).addTo(candidateGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'candidate',
            title: cand.name,
            subtitle: `Rank #${cand.rank} // ${cand.category} (${cand.distance_km} km Upwind)`,
            metrics: {
              'Overall Evidence': `${cand.overall_evidence_score} / 100`,
              'Confidence': cand.confidence_level,
              'Wind Alignment': `${cand.sub_scores.wind_alignment_pct}%`,
              'Transport Time': `${cand.sub_scores.transport_time_min} mins`,
              'Chemical Match': `${cand.sub_scores.chemical_match_pct}%`,
            },
            notes: cand.explanation,
          });
        });
      });
      candidateGroup.addTo(map);
      layersRef.current.candidatesLayer = candidateGroup;

      setIsMapReady(true);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  // Handle Layer Toggle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layersRef.current) return;
    const map = mapInstanceRef.current;
    const { trajectoryLayer, corridorLayer, stationsLayer, candidatesLayer } = layersRef.current;

    if (trajectoryLayer) {
      if (showTrajectory) {
        if (!map.hasLayer(trajectoryLayer)) map.addLayer(trajectoryLayer);
      } else {
        if (map.hasLayer(trajectoryLayer)) map.removeLayer(trajectoryLayer);
      }
    }

    if (corridorLayer) {
      if (showCorridor) {
        if (!map.hasLayer(corridorLayer)) map.addLayer(corridorLayer);
      } else {
        if (map.hasLayer(corridorLayer)) map.removeLayer(corridorLayer);
      }
    }

    if (stationsLayer) {
      if (showSensors) {
        if (!map.hasLayer(stationsLayer)) map.addLayer(stationsLayer);
      } else {
        if (map.hasLayer(stationsLayer)) map.removeLayer(stationsLayer);
      }
    }

    if (candidatesLayer) {
      if (showCandidates) {
        if (!map.hasLayer(candidatesLayer)) map.addLayer(candidatesLayer);
      } else {
        if (map.hasLayer(candidatesLayer)) map.removeLayer(candidatesLayer);
      }
    }
  }, [showTrajectory, showCorridor, showSensors, showCandidates]);

  // Handle Progressive Sequence Navigation
  const handleSequenceStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (stepNumber === 1) {
      // Step 1: Incident Location
      map.setView([data.coordinates.lat, data.coordinates.lng], 15);
      setSelectedEntity({
        type: 'incident',
        title: data.title,
        subtitle: `Reference: ${data.complaint_number} // ${data.address}`,
        metrics: {
          'Observed Time': data.observed_at,
          'Pollution Type': data.pollution_type,
          'Coordinates': `${data.coordinates.lat.toFixed(4)}° N, ${data.coordinates.lng.toFixed(4)}° E`,
        },
        notes: data.original_description,
      });
    } else if (stepNumber === 2) {
      // Step 2: Wind Vector & Movement
      map.setView([19.0535, 72.9100], 14);
      setSelectedEntity({
        type: 'vector',
        title: 'Wind Vector & Atmospheric Dispersion',
        subtitle: `Wind blowing from ${data.weather.wind_direction_cardinal} (${data.weather.wind_direction_deg}°) at ${data.weather.wind_speed_ms} m/s`,
        metrics: {
          'Surface Velocity': `${data.weather.wind_speed_ms} m/s`,
          'Transport Duration': '35 minutes back to origin',
          'Atmospheric Stability': data.weather.atmospheric_stability,
        },
        notes: 'Backward Lagrangian trajectory tracks air parcel 3 hours upwind to identify emission sources.',
      });
    } else if (stepNumber === 3) {
      // Step 3: Monitoring Stations & Sensor Anomaly
      map.setView([19.0490, 72.9220], 15);
      const s = data.sensors[0];
      setSelectedEntity({
        type: 'sensor',
        title: s.name,
        subtitle: `ID: ${s.id} // Distance: ${s.distance_km} km from complaint`,
        metrics: {
          'PM2.5 Reading': `${s.pm25} µg/m³ (Spike)`,
          'AQI Category': `${s.aqi} (${s.aqi_bucket})`,
          'Anomaly Score': `${s.anomaly_score} / 1.0`,
        },
        notes: 'Severe PM2.5 outlier recorded at Govandi East corroborates upwind plume transit.',
      });
    } else if (stepNumber === 4) {
      // Step 4: Upwind Candidate Shortlist
      map.setView([19.0460, 72.9235], 14);
      const topCand = data.candidates[0];
      setSelectedEntity({
        type: 'candidate',
        title: topCand.name,
        subtitle: `Rank #1 Candidate // ${topCand.category} (${topCand.distance_km} km Upwind)`,
        metrics: {
          'Evidence Score': `${topCand.overall_evidence_score} / 100`,
          'Confidence': topCand.confidence_level,
          'Wind Compatibility': `${topCand.sub_scores.wind_alignment_pct}%`,
          'Chemical Speciation Match': `${topCand.sub_scores.chemical_match_pct}%`,
        },
        notes: topCand.explanation,
      });
    }
  };

  return (
    <div className="border border-graphite-border bg-forest-dark p-6 sm:p-8 space-y-6">
      {/* Map Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-graphite-border">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
              Geographic Intelligence Map
            </span>
            <span className="font-mono text-[10px] text-sage-muted border border-sage-muted/40 px-1.5 py-0.2">
              Interactive 2D/3D Hybrid
            </span>
          </div>
          <h3 className="font-sans text-xl font-bold text-ivory-warm">
            Plume Dispersion & Source Apportionment Map
          </h3>
        </div>

        {/* Layer Visibility Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="text-sage-muted uppercase flex items-center space-x-1 mr-1">
            <LayersIcon className="w-3.5 h-3.5 text-sage-muted" />
            <span>Layers:</span>
          </span>
          <button
            type="button"
            onClick={() => setShowTrajectory(!showTrajectory)}
            className={`px-2.5 py-1 border transition-colors ${
              showTrajectory
                ? 'border-accent-orange bg-forest-charcoal text-ivory-warm font-semibold'
                : 'border-graphite-border text-sage-muted/70'
            }`}
          >
            Trajectory
          </button>
          <button
            type="button"
            onClick={() => setShowSensors(!showSensors)}
            className={`px-2.5 py-1 border transition-colors ${
              showSensors
                ? 'border-accent-red bg-forest-charcoal text-ivory-warm font-semibold'
                : 'border-graphite-border text-sage-muted/70'
            }`}
          >
            Sensors
          </button>
          <button
            type="button"
            onClick={() => setShowCandidates(!showCandidates)}
            className={`px-2.5 py-1 border transition-colors ${
              showCandidates
                ? 'border-accent-green bg-forest-charcoal text-ivory-warm font-semibold'
                : 'border-graphite-border text-sage-muted/70'
            }`}
          >
            Candidates
          </button>
          <button
            type="button"
            onClick={() => setShowCorridor(!showCorridor)}
            className={`px-2.5 py-1 border transition-colors ${
              showCorridor
                ? 'border-sage-muted bg-forest-charcoal text-ivory-warm font-semibold'
                : 'border-graphite-border text-sage-muted/70'
            }`}
          >
            Plume Cone
          </button>
        </div>
      </div>

      {/* Progressive Investigation Storytelling Sequence Bar */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-sage-muted uppercase tracking-wider block">
          Progressive Investigation Sequence // Click to Explore Stages
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleSequenceStep(1)}
            className={`p-2.5 text-left border transition-all ${
              activeStep === 1
                ? 'border-accent-orange bg-forest-charcoal text-ivory-warm'
                : 'border-graphite-border text-sage-muted hover:border-sage-muted bg-forest-dark'
            }`}
          >
            <span className="font-mono text-[9px] text-accent-orange uppercase block">Step 01</span>
            <span className="font-sans text-xs font-bold block mt-0.5">Complaint Site</span>
          </button>
          <button
            type="button"
            onClick={() => handleSequenceStep(2)}
            className={`p-2.5 text-left border transition-all ${
              activeStep === 2
                ? 'border-accent-orange bg-forest-charcoal text-ivory-warm'
                : 'border-graphite-border text-sage-muted hover:border-sage-muted bg-forest-dark'
            }`}
          >
            <span className="font-mono text-[9px] text-accent-orange uppercase block">Step 02</span>
            <span className="font-sans text-xs font-bold block mt-0.5">Wind Trajectory</span>
          </button>
          <button
            type="button"
            onClick={() => handleSequenceStep(3)}
            className={`p-2.5 text-left border transition-all ${
              activeStep === 3
                ? 'border-accent-orange bg-forest-charcoal text-ivory-warm'
                : 'border-graphite-border text-sage-muted hover:border-sage-muted bg-forest-dark'
            }`}
          >
            <span className="font-mono text-[9px] text-accent-orange uppercase block">Step 03</span>
            <span className="font-sans text-xs font-bold block mt-0.5">Sensor Anomaly</span>
          </button>
          <button
            type="button"
            onClick={() => handleSequenceStep(4)}
            className={`p-2.5 text-left border transition-all ${
              activeStep === 4
                ? 'border-accent-orange bg-forest-charcoal text-ivory-warm'
                : 'border-graphite-border text-sage-muted hover:border-sage-muted bg-forest-dark'
            }`}
          >
            <span className="font-mono text-[9px] text-accent-orange uppercase block">Step 04</span>
            <span className="font-sans text-xs font-bold block mt-0.5">Top Candidates</span>
          </button>
        </div>
      </div>

      {/* Main Map Container with Live Overlays */}
      <div className="relative border border-graphite-border bg-forest-charcoal overflow-hidden">
        <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

        {!isMapReady && (
          <div className="absolute inset-0 bg-forest-dark flex items-center justify-center text-xs font-mono text-sage-muted space-x-2 z-10">
            <span className="w-2 h-2 bg-accent-orange animate-ping" />
            <span>Rendering Leaflet Investigation Layers...</span>
          </div>
        )}

        {/* Architectural Compass & Wind Vector Overlay Badge */}
        <div className="absolute top-3 right-3 z-20 bg-forest-charcoal/95 border border-graphite-border p-3 font-mono text-xs backdrop-blur-sm pointer-events-none space-y-1">
          <div className="flex items-center space-x-2 text-accent-orange">
            <WindVectorIcon className="w-4 h-4" />
            <span className="font-bold">108° ESE @ {data.weather.wind_speed_ms} m/s</span>
          </div>
          <span className="text-[10px] text-sage-muted block">
            Plume Transit: 35 min upwind
          </span>
        </div>

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 z-20 bg-forest-charcoal/95 border border-graphite-border px-3 py-2 font-mono text-[10px] space-y-1 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-red border border-ivory-warm" />
            <span className="text-ivory-warm">Complaint Site (Region A)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-accent-orange" />
            <span className="text-sage-muted">Plume Back-Trajectory</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-orange border border-ivory-warm" />
            <span className="text-sage-muted">Candidate Origins (Region B)</span>
          </div>
        </div>
      </div>

      {/* Dynamic Inspector Panel (Updates on Marker Selection or Sequence Step) */}
      <div className="border border-graphite-border bg-forest-charcoal p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-graphite-border/60">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider">
              Selected Investigation Entity:
            </span>
            <span className="font-sans text-sm font-bold text-ivory-warm">
              {selectedEntity.title}
            </span>
          </div>
          <span className="font-mono text-[11px] text-sage-muted">
            {selectedEntity.subtitle}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {Object.entries(selectedEntity.metrics).map(([key, val]) => (
            <div key={key} className="border border-graphite-border/40 p-2 bg-forest-dark">
              <span className="text-[10px] text-sage-muted uppercase block">{key}</span>
              <span className="text-ivory-warm font-semibold block mt-0.5">{val}</span>
            </div>
          ))}
        </div>

        <p className="text-xs font-mono text-sage-muted leading-relaxed pt-1">
          {selectedEntity.notes}
        </p>
      </div>
    </div>
  );
}

export { InteractiveInvestigationMap };
