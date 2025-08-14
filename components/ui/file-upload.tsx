'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileJson, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (data: any) => void;
  onError?: (error: string) => void;
}

export function FileUpload({ onFileUpload, onError }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      setUploadStatus('error');
      onError?.('No file selected');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        setUploadStatus('success');
        setTimeout(() => {
          onFileUpload(jsonData);
        }, 500);
      } catch (error) {
        setUploadStatus('error');
        onError?.('Invalid JSON file. Please upload a valid React Profiler JSON file.');
      }
    };

    reader.onerror = () => {
      setUploadStatus('error');
      onError?.('Error reading file');
    };

    reader.readAsText(file);
  }, [onFileUpload, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-lg border-2 border-dashed p-8",
          "bg-gradient-to-br from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-900",
          "transition-all duration-300 ease-out",
          isDragActive 
            ? "border-blue-500 scale-[1.02] shadow-xl" 
            : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600",
          uploadStatus === 'success' && "border-green-500",
          uploadStatus === 'error' && "border-red-500"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative">
            <motion.div
              animate={{
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 5 : 0,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {uploadStatus === 'success' ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : uploadStatus === 'error' ? (
                <XCircle className="h-16 w-16 text-red-500" />
              ) : (
                <FileJson className="h-16 w-16 text-neutral-400 dark:text-neutral-600" />
              )}
            </motion.div>
            {isDragActive && (
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <FileJson className="h-16 w-16 text-blue-500" />
              </motion.div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {isDragActive 
                ? "Drop your file here" 
                : uploadStatus === 'success' 
                ? "File uploaded successfully!"
                : uploadStatus === 'error'
                ? "Upload failed"
                : "Upload React Profiler JSON"}
            </h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {isDragActive 
                ? "Release to upload" 
                : "Drag and drop or click to browse"}
            </p>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 z-0"
          initial={false}
          animate={{
            background: isDragActive
              ? "radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent)"
              : "transparent",
          }}
        />
      </motion.div>
    </div>
  );
}