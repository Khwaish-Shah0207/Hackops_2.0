'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LocateFixedIcon, CrosshairIcon } from '@/components/shared/CustomIcons';

interface LocationPickerMapProps {
  selectedLat: number;
  selectedLng: number;
  onLocationChange: (lat: number, lng: number, locality?: string) => void;
  height?: string;
}

const LOCALITY_PRESETS = [
  { name: 'Chembur Colony', lat: 19.0580, lng: 72.8980, desc: 'Residential Sector 4' },
  { name: 'Govandi East', lat: 19.0490, lng: 72.9220, desc: 'Transit Industrial Verge' },
  { name: 'Deonar Perimeter', lat: 19.0435, lng: 72.9250, desc: 'Disposal Ground Buffer' },
  { name: 'Trombay Industrial', lat: 19.0180, lng: 72.9050, desc: 'Chemical Complex Border' },
];

export default function LocationPickerMap({
  selectedLat,
  selectedLng,
  onLocationChange,
  height = '360px',
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [locating, setLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize and mount Leaflet map safely in browser only
  useEffect(() => {
    let isCancelled = false;

    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    import('leaflet').then((leafletModule) => {
      if (isCancelled || !mapContainerRef.current) return;
      const L = leafletModule.default || leafletModule;

      // Create Leaflet map instance
      const map = L.map(mapContainerRef.current, {
        center: [selectedLat, selectedLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });
      mapInstanceRef.current = map;

      // OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom Reticle Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-location-pin',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              position: absolute;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              border: 2px dashed #C77B43;
              animation: spin 8s linear infinite;
            "></div>
            <div style="
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background-color: #C77B43;
              border: 2px solid #EAE8DF;
              box-shadow: 0 0 10px rgba(199, 123, 67, 0.6);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      // Create Draggable Marker
      const marker = L.marker([selectedLat, selectedLng], {
        draggable: true,
        icon: customIcon,
      }).addTo(map);
      markerRef.current = marker;

      // Marker drag end event
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const newLat = parseFloat(pos.lat.toFixed(5));
        const newLng = parseFloat(pos.lng.toFixed(5));
        onLocationChange(newLat, newLng);
      });

      // Map click event: reposition marker
      map.on('click', (e: any) => {
        const newLat = parseFloat(e.latlng.lat.toFixed(5));
        const newLng = parseFloat(e.latlng.lng.toFixed(5));
        marker.setLatLng([newLat, newLng]);
        onLocationChange(newLat, newLng);
      });

      setIsMapReady(true);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync marker position when props change from preset or external click
  useEffect(() => {
    if (markerRef.current) {
      const cur = markerRef.current.getLatLng();
      if (cur.lat !== selectedLat || cur.lng !== selectedLng) {
        markerRef.current.setLatLng([selectedLat, selectedLng]);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([selectedLat, selectedLng]);
        }
      }
    }
  }, [selectedLat, selectedLng]);

  // Geolocation Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          mapInstanceRef.current.setView([lat, lng], 15);
        }
        onLocationChange(lat, lng, 'Current Device Coordinates');
        setGeoNotice('Location pinned from device sensor.');
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoNotice('Location permission was denied. Please click the map manually.');
        } else {
          setGeoNotice('Unable to acquire current location. Please select manually on the map.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handlePresetSelect = (preset: typeof LOCALITY_PRESETS[0]) => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([preset.lat, preset.lng]);
      mapInstanceRef.current.setView([preset.lat, preset.lng], 14);
    }
    onLocationChange(preset.lat, preset.lng, `${preset.name} (${preset.desc})`);
    setGeoNotice(`Selected corridor preset: ${preset.name}`);
  };

  return (
    <div className="space-y-4">
      {/* Top Map Toolbar: Locate Me & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-sage-muted">
          <CrosshairIcon className="w-4 h-4 text-accent-orange" />
          <span>Interactive Pin: Click map or drag target to adjust</span>
        </div>

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="inline-flex items-center space-x-2 border border-graphite-border hover:border-sage-muted bg-forest-dark px-3 py-1.5 text-xs font-mono text-ivory-warm transition-colors disabled:opacity-50"
        >
          <LocateFixedIcon className="w-3.5 h-3.5 text-accent-orange" />
          <span>{locating ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
        </button>
      </div>

      {/* Map Canvas Frame */}
      <div className="relative border border-graphite-border bg-forest-dark overflow-hidden">
        <div
          ref={mapContainerRef}
          style={{ height }}
          className="w-full z-10"
        />

        {!isMapReady && (
          <div className="absolute inset-0 bg-forest-dark flex items-center justify-center text-xs font-mono text-sage-muted space-x-2 z-10">
            <span className="w-2 h-2 bg-accent-orange animate-ping" />
            <span>Loading Geographic Canvas...</span>
          </div>
        )}

        {/* Live Coordinate Capsule Overlay */}
        <div className="absolute bottom-3 left-3 z-20 bg-forest-charcoal/95 border border-graphite-border px-3 py-1.5 font-mono text-xs flex items-center space-x-3 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center space-x-1.5">
            <span className="text-sage-muted">LAT:</span>
            <span className="font-bold text-accent-orange">{selectedLat.toFixed(4)}° N</span>
          </div>
          <div className="h-3 w-px bg-graphite-border" />
          <div className="flex items-center space-x-1.5">
            <span className="text-sage-muted">LON:</span>
            <span className="font-bold text-accent-orange">{selectedLng.toFixed(4)}° E</span>
          </div>
        </div>
      </div>

      {/* Geolocation Notice (if any) */}
      {geoNotice && (
        <div className="text-xs font-mono text-sage-light bg-forest-dark p-2 border-l-2 border-accent-orange">
          {geoNotice}
        </div>
      )}

      {/* Corridor Quick Presets */}
      <div className="space-y-1.5 pt-1">
        <span className="font-mono text-[10px] text-sage-muted uppercase tracking-wider block">
          Corridor Quick Presets // Eastern Suburbs Case Study
        </span>
        <div className="flex flex-wrap gap-2">
          {LOCALITY_PRESETS.map((p) => {
            const isMatch = selectedLat === p.lat && selectedLng === p.lng;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => handlePresetSelect(p)}
                className={`font-mono text-xs px-2.5 py-1 border transition-colors ${
                  isMatch
                    ? 'border-accent-orange bg-forest-dark text-ivory-warm font-bold'
                    : 'border-graphite-border text-sage-muted hover:border-sage-muted bg-forest-charcoal'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
