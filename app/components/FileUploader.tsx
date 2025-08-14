'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileJson, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (data: any) => void;
  onError?: (error: string) => void;
}

export function FileUploader({ onFileUpload, onError }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      onError?.('No file selected');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        onFileUpload(jsonData);
      } catch (error) {
        onError?.('Invalid JSON file. Please upload a valid React Profiler JSON file.');
      }
    };

    reader.onerror = () => {
      onError?.('Error reading file');
    };

    reader.readAsText(file);
  }, [onFileUpload, onError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragActive && !isDragReject ? 'border-blue-500 bg-blue-50' : ''}
        ${isDragReject ? 'border-red-500 bg-red-50' : ''}
        ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        {isDragReject ? (
          <>
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div>
              <p className="text-lg font-semibold text-red-700">Invalid file type</p>
              <p className="text-sm text-red-600 mt-1">Please upload a JSON file</p>
            </div>
          </>
        ) : isDragActive ? (
          <>
            <FileJson className="w-12 h-12 text-blue-500 animate-pulse" />
            <div>
              <p className="text-lg font-semibold text-blue-700">Drop your file here</p>
              <p className="text-sm text-blue-600 mt-1">Release to upload</p>
            </div>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-700">
                Drop your React Profiler JSON here
              </p>
              <p className="text-sm text-gray-600 mt-1">
                or click to browse your files
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported format: .json (React DevTools Profiler export)
            </p>
          </>
        )}
      </div>
    </div>
  );
}