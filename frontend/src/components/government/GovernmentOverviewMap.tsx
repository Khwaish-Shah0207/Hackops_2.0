'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { GovernmentIncident } from '@/lib/governmentContext';

interface GovernmentOverviewMapProps {
  incidents: GovernmentIncident[];
  onSelectIncident?: (incident: GovernmentIncident) => void;
  height?: string;
}

export function GovernmentOverviewMap({
  incidents,
  onSelectIncident,
  height = '500px',
}: GovernmentOverviewMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    incidentLayer?: any;
    stationLayer?: any;
    sourceLayer?: any;
    bufferLayer?: any;
  }>({});

  const [layersState, setLayersState] = useState({
    showIncidents: true,
    showStations: true,
    showSources: true,
    showBuffers: true,
  });

  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'incident' | 'station' | 'source';
    id?: number | string;
    title: string;
    subtitle: string;
    badge?: string;
    badgeColor?: string;
    details: Record<string, string>;
    incidentId?: number;
  } | null>({
    type: 'incident',
    id: 4,
    title: 'INC-2026-0004: Dense White-Grey Toxic Smoke',
    subtitle: 'Chembur Colony Sector 4 // MPCB Rapid Response Squad Dispatched',
    badge: 'Critical Priority',
    badgeColor: '#B65348',
    details: {
      Location: 'Chembur Colony, Sector 4, Ward M/W',
      Coordinates: '19.0580° N, 72.8980° E',
      Status: 'Under Investigation',
      'Assigned Squad': 'Officer R. K. Patil (Team 2)',
      'Primary Candidate': 'Govandi Scrap Yards (Score 88.6)',
    },
    incidentId: 4,
  });

  useEffect(() => {
    let mounted = true;

    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    import('leaflet').then((leafletModule) => {
      if (!mounted || !mapContainerRef.current) return;
      const L = (leafletModule as any).default || leafletModule;

      const map = L.map(mapContainerRef.current, {
        center: [19.0490, 72.9150],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      // 1. Dispersion Buffer Polygons
      const bufferGroup = L.layerGroup().addTo(map);
      const chemburBuffer = L.circle([19.0580, 72.8980], {
        radius: 1200,
        color: '#C77B43',
        fillColor: '#C77B43',
        fillOpacity: 0.08,
        weight: 1,
        dashArray: '4 4',
      }).addTo(bufferGroup);

      const govandiBuffer = L.circle([19.0490, 72.9220], {
        radius: 1500,
        color: '#B65348',
        fillColor: '#B65348',
        fillOpacity: 0.06,
        weight: 1,
        dashArray: '3 3',
      }).addTo(bufferGroup);

      layersRef.current.bufferLayer = bufferGroup;

      // 2. Monitoring Stations
      const stationGroup = L.layerGroup().addTo(map);
      const stations = [
        { id: 'CPCB-GOV-01', name: 'CPCB Govandi East Station', lat: 19.0490, lng: 72.9220, pm25: '218 µg/m³', aqi: '375 (Very Poor)' },
        { id: 'CPCB-CHM-02', name: 'Chembur Colony Monitoring Point', lat: 19.0580, lng: 72.8980, pm25: '195 µg/m³', aqi: '340 (Very Poor)' },
        { id: 'CPCB-KRL-03', name: 'Kurla Central Baseline Station', lat: 19.0650, lng: 72.8790, pm25: '82 µg/m³', aqi: '160 (Moderate)' },
      ];

      stations.forEach((st) => {
        const icon = L.divIcon({
          className: 'custom-station-icon',
          html: `<div style="background-color: #252C28; border: 2px solid #667B70; color: #EAE8DF; font-family: monospace; font-size: 9px; font-weight: bold; padding: 2px 4px; box-shadow: none;">AQI ${st.aqi.split(' ')[0]}</div>`,
          iconSize: [60, 20],
          iconAnchor: [30, 10],
        });

        const marker = L.marker([st.lat, st.lng], { icon }).addTo(stationGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'station',
            id: st.id,
            title: st.name,
            subtitle: `Real-time Telemetry Station // ID: ${st.id}`,
            badge: `PM2.5: ${st.pm25}`,
            badgeColor: '#667B70',
            details: {
              'Station Code': st.id,
              'Current AQI': st.aqi,
              'PM2.5 Concentration': st.pm25,
              Coordinates: `${st.lat.toFixed(4)}° N, ${st.lng.toFixed(4)}° E`,
              Status: 'Active Continuous Transmission',
            },
          });
        });
      });
      layersRef.current.stationLayer = stationGroup;

      // 3. Potential Source Clusters
      const sourceGroup = L.layerGroup().addTo(map);
      const sources = [
        { name: 'Govandi Scrap Sorting Yards', lat: 19.0490, lng: 72.9220, category: 'Informal Polymer Recycling', score: '88.6/100' },
        { name: 'Deonar Solid Waste Landfill Ground', lat: 19.0435, lng: 72.9250, category: 'Municipal Solid Waste Landfill', score: '87.2/100' },
        { name: 'Trombay Chemical & Fertilizer Complex', lat: 19.0180, lng: 72.9050, category: 'Heavy Industrial Point Source', score: '48.0/100' },
      ];

      sources.forEach((src) => {
        const icon = L.divIcon({
          className: 'custom-source-icon',
          html: `<div style="background-color: #14251F; border: 1.5px solid #C77B43; color: #C77B43; font-family: monospace; font-size: 10px; font-weight: bold; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">!</div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const marker = L.marker([src.lat, src.lng], { icon }).addTo(sourceGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'source',
            title: src.name,
            subtitle: `Candidate Source Perimeter // ${src.category}`,
            badge: `Score: ${src.score}`,
            badgeColor: '#C77B43',
            details: {
              Facility: src.name,
              Classification: src.category,
              'Heuristic Evidence Score': src.score,
              Coordinates: `${src.lat.toFixed(4)}° N, ${src.lng.toFixed(4)}° E`,
              Verification: 'Statutory Inspection Squad Dispatched',
            },
          });
        });
      });
      layersRef.current.sourceLayer = sourceGroup;

      // 4. Incident Pins
      const incidentGroup = L.layerGroup().addTo(map);
      incidents.forEach((inc) => {
        const color =
          inc.priority === 'Critical'
            ? '#B65348'
            : inc.priority === 'High'
            ? '#C77B43'
            : inc.priority === 'Medium'
            ? '#A8B5A5'
            : '#667B70';

        const icon = L.divIcon({
          className: 'custom-incident-icon',
          html: `<div style="background-color: ${color}; border: 1.5px solid #EAE8DF; color: #14251F; font-family: monospace; font-size: 9px; font-weight: bold; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">${inc.id}</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], { icon }).addTo(incidentGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'incident',
            id: inc.id,
            title: `${inc.complaint_number}: ${inc.title}`,
            subtitle: `${inc.location_name} // Priority: ${inc.priority}`,
            badge: inc.status,
            badgeColor: color,
            details: {
              Docket: inc.complaint_number,
              Category: inc.pollution_type,
              Location: inc.location_name,
              Ward: inc.ward,
              Observed: inc.observed_at,
              Reported: inc.reported_at,
              Status: inc.status,
              'Assigned Officer': inc.assigned_officer || 'Unassigned',
            },
            incidentId: inc.id,
          });

          if (onSelectIncident) {
            onSelectIncident(inc);
          }
        });
      });
      layersRef.current.incidentLayer = incidentGroup;
    });

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [incidents, onSelectIncident]);

  const toggleLayer = (key: 'showIncidents' | 'showStations' | 'showSources' | 'showBuffers') => {
    setLayersState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const map = mapInstanceRef.current;
      if (!map) return next;

      if (key === 'showIncidents' && layersRef.current.incidentLayer) {
        next.showIncidents ? map.addLayer(layersRef.current.incidentLayer) : map.removeLayer(layersRef.current.incidentLayer);
      }
      if (key === 'showStations' && layersRef.current.stationLayer) {
        next.showStations ? map.addLayer(layersRef.current.stationLayer) : map.removeLayer(layersRef.current.stationLayer);
      }
      if (key === 'showSources' && layersRef.current.sourceLayer) {
        next.showSources ? map.addLayer(layersRef.current.sourceLayer) : map.removeLayer(layersRef.current.sourceLayer);
      }
      if (key === 'showBuffers' && layersRef.current.bufferLayer) {
        next.showBuffers ? map.addLayer(layersRef.current.bufferLayer) : map.removeLayer(layersRef.current.bufferLayer);
      }
      return next;
    });
  };

  return (
    <div className="bg-[#14251F] border border-[#A8B5A5]/25 p-4 md:p-6 space-y-4">
      {/* Header & Layer Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-[#A8B5A5]/15 gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C77B43] block">
            GIS Environmental Surveillance Grid
          </span>
          <h2 className="text-lg md:text-xl font-serif text-[#EAE8DF]">
            Eastern Suburbs Air Quality &amp; Incident Geographic Matrix
          </h2>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => toggleLayer('showIncidents')}
            className={`px-2.5 py-1 border transition-colors ${
              layersState.showIncidents
                ? 'bg-[#252C28] border-[#C77B43] text-[#EAE8DF]'
                : 'bg-[#14251F] border-[#A8B5A5]/20 text-[#A8B5A5]/40'
            }`}
          >
            Incidents ({incidents.length})
          </button>
          <button
            type="button"
            onClick={() => toggleLayer('showStations')}
            className={`px-2.5 py-1 border transition-colors ${
              layersState.showStations
                ? 'bg-[#252C28] border-[#667B70] text-[#EAE8DF]'
                : 'bg-[#14251F] border-[#A8B5A5]/20 text-[#A8B5A5]/40'
            }`}
          >
            CPCB Stations
          </button>
          <button
            type="button"
            onClick={() => toggleLayer('showSources')}
            className={`px-2.5 py-1 border transition-colors ${
              layersState.showSources
                ? 'bg-[#252C28] border-[#C77B43] text-[#EAE8DF]'
                : 'bg-[#14251F] border-[#A8B5A5]/20 text-[#A8B5A5]/40'
            }`}
          >
            Candidate Sources
          </button>
          <button
            type="button"
            onClick={() => toggleLayer('showBuffers')}
            className={`px-2.5 py-1 border transition-colors ${
              layersState.showBuffers
                ? 'bg-[#252C28] border-[#A8B5A5]/60 text-[#EAE8DF]'
                : 'bg-[#14251F] border-[#A8B5A5]/20 text-[#A8B5A5]/40'
            }`}
          >
            Buffers
          </button>
        </div>
      </div>

      {/* Main Map + Inspector Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map Viewport (8 cols) */}
        <div className="lg:col-span-8 relative bg-[#1B201D] border border-[#A8B5A5]/20 overflow-hidden">
          <div ref={mapContainerRef} style={{ height, width: '100%' }} />

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-[1000] bg-[#14251F]/90 border border-[#A8B5A5]/30 px-3 py-1.5 font-mono text-[10px] text-[#A8B5A5] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#667B70] animate-pulse" />
            <span>Telemetry Feed: Active CPCB Network</span>
          </div>
        </div>

        {/* Selected Entity Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-[#252C28] border border-[#A8B5A5]/25 p-4 space-y-3 font-mono text-xs">
          {selectedEntity ? (
            <>
              <div className="pb-3 border-b border-[#A8B5A5]/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#A8B5A5]">Selected Map Entity</span>
                  {selectedEntity.badge && (
                    <span
                      className="px-2 py-0.5 text-[10px] uppercase font-bold border"
                      style={{
                        borderColor: selectedEntity.badgeColor,
                        color: selectedEntity.badgeColor,
                      }}
                    >
                      {selectedEntity.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-serif font-bold text-[#EAE8DF] leading-snug">
                  {selectedEntity.title}
                </h3>
                <p className="text-[11px] text-[#A8B5A5]">{selectedEntity.subtitle}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                {Object.entries(selectedEntity.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-[#A8B5A5]/10">
                    <span className="text-[#A8B5A5]">{k}:</span>
                    <span className="text-[#EAE8DF] font-medium text-right max-w-[180px] truncate">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              {selectedEntity.incidentId && (
                <div className="pt-3">
                  <Link
                    href={`/government/investigation?id=${selectedEntity.incidentId}`}
                    className="block w-full py-2 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] text-xs font-mono font-bold uppercase tracking-wider text-center transition-colors"
                  >
                    Open Investigation Workspace &rarr;
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-[#A8B5A5]">
              Click on an incident marker, monitoring station, or candidate source on the map to inspect telemetry details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

