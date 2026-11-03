'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapProps {
  centerLat?: number;
  centerLon?: number;
  zoom?: number;
  complaintLocation?: { lat: number; lon: number; title?: string };
  candidates?: Array<{
    name: string;
    category: string;
    latitude: number;
    longitude: number;
    overall_evidence_score: number;
    confidence_level: string;
    distance_km: number;
  }>;
  stations?: Array<{
    station_name: string;
    latitude: number;
    longitude: number;
    pm25?: number;
    pm10?: number;
    aqi?: number;
    aqi_bucket?: string;
  }>;
  previousComplaints?: Array<{
    title: string;
    latitude: number;
    longitude: number;
    pollution_type: string;
  }>;
  trajectoryPoints?: Array<{
    latitude: number;
    longitude: number;
    hours_back?: number;
  }>;
  windDirectionDeg?: number;
  windSpeedMs?: number;
  selectable?: boolean;
  onLocationSelect?: (lat: number, lon: number) => void;
  height?: string;
}

export default function InvestigationMap({
  centerLat = 19.043,
  centerLon = 72.909,
  zoom = 13,
  complaintLocation,
  candidates = [],
  stations = [],
  previousComplaints = [],
  trajectoryPoints = [],
  windDirectionDeg,
  windSpeedMs,
  selectable = false,
  onLocationSelect,
  height = '520px',
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current).setView([centerLat, centerLon], zoom);
    mapInstanceRef.current = map;

    // OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom Icon Creators
    const createDivIcon = (bgColor: string, text: string, ringColor: string = 'white') => {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: ${bgColor};
            color: white;
            border: 2px solid ${ringColor};
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          ">${text}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });
    };

    // 1. Complaint Location Marker
    if (complaintLocation) {
      const redIcon = createDivIcon('#ef4444', '📍', '#fee2e2');
      const marker = L.marker([complaintLocation.lat, complaintLocation.lon], { icon: redIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px;">
          <b style="color: #ef4444;">🚨 Reported Complaint Site</b><br/>
          <span>${complaintLocation.title || 'Reported Incident Location'}</span><br/>
          <small>Lat: ${complaintLocation.lat.toFixed(4)}, Lon: ${complaintLocation.lon.toFixed(4)}</small>
        </div>
      `).openPopup();
      selectedMarkerRef.current = marker;
    }

    // 2. Candidate Source Locations
    candidates.forEach((cand, idx) => {
      const color = idx === 0 ? '#ea580c' : '#7c3aed';
      const icon = createDivIcon(color, `${idx + 1}`);
      const marker = L.marker([cand.latitude, cand.longitude], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
          <b style="color: ${color};">🏭 Candidate #${idx + 1}: ${cand.name}</b><br/>
          <span><b>Category:</b> ${cand.category}</span><br/>
          <span><b>Evidence Score:</b> <strong style="color: ${cand.overall_evidence_score > 70 ? '#ea580c' : '#4b5563'};">${cand.overall_evidence_score}/100</strong> (${cand.confidence_level})</span><br/>
          <span><b>Distance:</b> ${cand.distance_km} km</span>
        </div>
      `);
    });

    // 3. Ambient Sensor Monitoring Stations
    stations.forEach((st) => {
      const aqiColor = (st.aqi || 0) > 300 ? '#b91c1c' : (st.aqi || 0) > 200 ? '#ea580c' : '#0284c7';
      const icon = createDivIcon(aqiColor, 'AQ');
      const marker = L.marker([st.latitude, st.longitude], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
          <b style="color: #0369a1;">📡 CPCB Station: ${st.station_name}</b><br/>
          <span><b>AQI:</b> ${st.aqi || 'N/A'} (${st.aqi_bucket || 'Normal'})</span><br/>
          <span><b>PM2.5:</b> ${st.pm25 || 'N/A'} µg/m³</span><br/>
          <span><b>PM10:</b> ${st.pm10 || 'N/A'} µg/m³</span>
        </div>
      `);
    });

    // 4. Clustered Historical Complaints
    previousComplaints.forEach((prev) => {
      const icon = createDivIcon('#f59e0b', '!', '#fef3c7');
      const marker = L.marker([prev.latitude, prev.longitude], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px;">
          <b style="color: #d97706;">⚠️ Previous Citizen Report</b><br/>
          <span>${prev.title}</span><br/>
          <small>Type: ${prev.pollution_type}</small>
        </div>
      `);
    });

    // 5. Backward Plume Trajectory Line (Lagrangian upwind transport simulation)
    if (trajectoryPoints.length > 1) {
      const latlngs = trajectoryPoints.map((p) => [p.latitude, p.longitude] as [number, number]);
      const trajectoryLine = L.polyline(latlngs, {
        color: '#dc2626',
        weight: 4,
        opacity: 0.8,
        dashArray: '6, 8',
      }).addTo(map);

      trajectoryLine.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px;">
          <b>💨 Lagrangian Backward Air Trajectory</b><br/>
          <span>Simulated upwind origin path based on NOAA meteorological wind vector.</span>
        </div>
      `);
    }

    // Interactive Click Selector
    if (selectable && onLocationSelect) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);

        if (selectedMarkerRef.current) {
          selectedMarkerRef.current.setLatLng([lat, lng]);
        } else {
          const redIcon = createDivIcon('#ef4444', '📍', '#fee2e2');
          selectedMarkerRef.current = L.marker([lat, lng], { icon: redIcon }).addTo(map);
        }
        selectedMarkerRef.current.bindPopup(`
          <div style="font-family: sans-serif; font-size: 13px;">
            <b>Selected Observation Point</b><br/>
            Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}
          </div>
        `).openPopup();
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [centerLat, centerLon, zoom, complaintLocation, candidates, stations, previousComplaints, trajectoryPoints, selectable]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Wind condition overlay badge */}
      {windDirectionDeg !== undefined && windSpeedMs !== undefined && (
        <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 text-white backdrop-blur-sm px-3.5 py-2 rounded-lg text-xs font-medium shadow-md flex items-center space-x-2">
          <span>💨 Wind Origin: <b>{windDirectionDeg}°</b> @ <b>{windSpeedMs} m/s</b></span>
          <span
            className="inline-block transform"
            style={{ transform: `rotate(${windDirectionDeg}deg)` }}
          >
            ⬆
          </span>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Map Legend */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-600 flex flex-wrap items-center gap-4">
        <span className="font-semibold text-slate-800">Legend:</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span>Reported Incident</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-600 inline-block"></span>
          <span>Ranked Source Candidate</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
          <span>CPCB Air Quality Station</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span>Previous Citizen Report</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-red-500 inline-block"></span>
          <span>Upwind Transport Path (HYSPLIT)</span>
        </div>
      </div>
    </div>
  );
}

