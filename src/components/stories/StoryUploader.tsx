"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, X, FileVideo, FileImage, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface StoryUploaderProps {
  onSuccess?: (storyId: string) => void;
  onClose?: () => void;
}

export default function StoryUploader({ onSuccess, onClose }: StoryUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'requesting' | 'uploading' | 'confirming' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 150 * 1024 * 1024; // 150MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage('');
    if (selectedFile.size > MAX_SIZE) {
      setErrorMessage(`File exceeds the 150MB limit. Selected: ${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime', 'video/webm'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage('Unsupported file type. Please upload a standard image (JPG, PNG, WebP) or video (MP4, MOV, WebM).');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // 1. Get Presigned PUT URL from Backend Express Server
      setStatus('requesting');
      const mediaType = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
      
      const response = await axios.post('/api/v1/stories/upload-url', {
        fileType: file.type,
        fileSize: file.size,
        mediaType,
      });

      const { uploadUrl, storyId } = response.data;

      // 2. Upload file directly to Cloudflare R2 staging path
      setStatus('uploading');
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentage);
          }
        },
      });

      // 3. Confirm upload completion to trigger BullMQ backend transcode job
      setStatus('confirming');
      await axios.post('/api/v1/stories/confirm', { storyId });

      setStatus('success');
      setProgress(100);
      if (onSuccess) onSuccess(storyId);
    } catch (error: any) {
      console.error('Upload flow error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.error || 'Failed to complete story upload. Please try again.');
    }
  };

  const handleCancelFile = () => {
    setFile(null);
    setProgress(0);
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 w-full max-w-md mx-auto shadow-2xl relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <h3 className="text-xl font-bold text-white mb-1">Create Class Story</h3>
      <p className="text-sm text-slate-400 mb-6">Stories disappear automatically after 24 hours.</p>

      {status === 'idle' && !file && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-10 px-4 cursor-pointer transition-all ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-500/5' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />
          <div className="p-4 bg-indigo-600/10 rounded-full text-indigo-400 mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold text-slate-200 text-center">Drag and drop file here, or click to browse</p>
          <p className="text-xs text-slate-500 text-center mt-2">Images & Videos up to 150MB (vertical 9:16 recommended)</p>
        </div>
      )}

      {file && (
        <div className="flex flex-col bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-800 rounded-xl text-slate-300">
                {file.type.startsWith('video/') ? <FileVideo className="w-6 h-6" /> : <FileImage className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate pr-6">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            {status === 'idle' && (
              <button 
                onClick={handleCancelFile}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress bar visual for uploading states */}
          {status !== 'idle' && status !== 'error' && (
            <div className="mt-5">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-indigo-400 font-semibold uppercase tracking-wider text-[10px]">
                  {status === 'requesting' && 'Connecting to Cloud...'}
                  {status === 'uploading' && `Uploading to Cloudflare R2...`}
                  {status === 'confirming' && 'Confirming payload...'}
                  {status === 'success' && 'Ready! Transcoding queued.'}
                </span>
                <span className="text-slate-400">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-2.5 bg-red-950/20 border border-red-900/40 rounded-xl p-3 text-red-400 text-xs mb-6">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Button Controls */}
      <div className="flex gap-3">
        {onClose && status === 'idle' && (
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
        )}
        
        {status === 'idle' && file && (
          <button
            onClick={handleUpload}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md"
          >
            Share to Story
          </button>
        )}

        {(status === 'requesting' || status === 'uploading' || status === 'confirming') && (
          <button
            disabled
            className="flex-1 py-3 px-4 bg-slate-800 text-slate-500 font-semibold rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </button>
        )}

        {status === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center py-2 text-center text-emerald-400 text-sm font-semibold gap-1">
            <CheckCircle className="w-6 h-6 animate-bounce" />
            <span>Uploaded! Auto-compression starting.</span>
          </div>
        )}
      </div>
    </div>
  );
}
