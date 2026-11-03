'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UploadCloudIcon, TrashIcon, ImageIcon, AlertTriangleIcon } from '@/components/shared/CustomIcons';

export interface UploadedFileItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  sizeKb: number;
}

interface EvidenceUploadZoneProps {
  files: UploadedFileItem[];
  onFilesChange: (files: UploadedFileItem[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
}

export default function EvidenceUploadZone({
  files,
  onFilesChange,
  maxFiles = 4,
  maxSizeMb = 10,
}: EvidenceUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, []);

  const handleProcessFiles = (incomingList: FileList | File[]) => {
    setErrorNotice(null);
    const newItems: UploadedFileItem[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    const incomingArray = Array.from(incomingList);

    if (files.length + incomingArray.length > maxFiles) {
      setErrorNotice(`Maximum of ${maxFiles} photographs can be attached per incident filing.`);
      return;
    }

    for (const file of incomingArray) {
      if (!validTypes.includes(file.type)) {
        setErrorNotice(`"${file.name}" is not supported. Please upload JPEG, PNG, or WebP images.`);
        continue;
      }

      if (file.size > maxSizeMb * 1024 * 1024) {
        setErrorNotice(`"${file.name}" exceeds the ${maxSizeMb}MB maximum file size limit.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        file,
        previewUrl,
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
      });
    }

    if (newItems.length > 0) {
      onFilesChange([...files, ...newItems]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(e.target.files);
      // Reset input value so same file can be re-selected if deleted
      e.target.value = '';
    }
  };

  const handleRemoveFile = (idToRemove: string) => {
    const itemToRemove = files.find((f) => f.id === idToRemove);
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    }
    const updated = files.filter((f) => f.id !== idToRemove);
    onFilesChange(updated);
    setErrorNotice(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-accent-orange bg-forest-dark'
            : 'border-graphite-border hover:border-sage-muted bg-forest-dark/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-10 h-10 mx-auto flex items-center justify-center border border-graphite-border bg-forest-charcoal text-accent-orange">
            <UploadCloudIcon className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <p className="font-sans text-sm font-semibold text-ivory-warm">
              Click to select or drag and drop photographs
            </p>
            <p className="font-mono text-xs text-sage-muted">
              JPEG, PNG, or WebP (up to {maxSizeMb}MB per image, max {maxFiles} files)
            </p>
          </div>

          <p className="font-mono text-[11px] text-sage-muted/80 leading-normal">
            Photographs serve as supporting observational evidence. Recommended captures include visible smoke color, dispersion direction, or smoldering material.
          </p>
        </div>
      </div>

      {/* Validation / Error Message */}
      {errorNotice && (
        <div className="flex items-center space-x-2 text-xs font-mono text-accent-red bg-forest-dark p-3 border-l-2 border-accent-red">
          <AlertTriangleIcon className="w-4 h-4 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Uploaded Previews Grid */}
      {files.length > 0 && (
        <div className="space-y-2">
          <span className="font-mono text-xs text-sage-muted uppercase tracking-wider block">
            Attached Photographic Evidence ({files.length} / {maxFiles})
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {files.map((item) => (
              <div
                key={item.id}
                className="relative border border-graphite-border bg-forest-dark group overflow-hidden"
              >
                <div className="aspect-video w-full relative bg-forest-charcoal overflow-hidden">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-2 flex items-center justify-between text-xs font-mono">
                  <div className="truncate mr-2">
                    <span className="block truncate text-ivory-warm text-[11px]">{item.name}</span>
                    <span className="text-[10px] text-sage-muted">{item.sizeKb} KB</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(item.id);
                    }}
                    className="p-1 text-sage-muted hover:text-accent-red hover:bg-forest-charcoal transition-colors shrink-0"
                    title="Remove photograph"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

