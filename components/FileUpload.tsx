import React, { useState, useCallback } from 'react';
import { processFile } from '../services/fileProcessorService';
import { AppState } from '../types';

interface FileUploadProps {
    onProcess: (text: string, fileName?: string) => void;
    setAppState: (state: AppState) => void;
    setError: (error: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onProcess, setAppState, setError }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback(async (file: File | null) => {
        if (!file) return;
        
        const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!supportedTypes.includes(file.type)) {
            setError(`Unsupported file type: ${file.type}. Please upload a PDF or an image.`);
            return;
        }

        setError(null);
        setAppState(AppState.PROCESSING);
        try {
            const text = await processFile(file);
            if (text && text.trim().length > 50) { // Basic check for meaningful content
                onProcess(text, file.name);
            } else {
                setError('Could not extract enough text from the file. It might be empty or scanned as an image without text.');
                setAppState(AppState.UPLOAD);
            }
        } catch (error) {
            console.error('File processing error:', error);
            setError('An error occurred while processing the file. Please try again.');
            setAppState(AppState.UPLOAD);
        }
    }, [onProcess, setAppState, setError]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        handleFile(file);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Upload Your Study Material</h2>
                <p className="text-slate-400">Transform any document into interactive study tools</p>
            </div>
            
            {/* Upload Area */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 backdrop-blur-md ${isDragging ? 'border-purple-400 bg-purple-500/10 scale-[1.02]' : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'}`}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <p className="text-xl font-semibold text-white mb-2">Drag & drop your file here</p>
                    <p className="text-slate-400 mb-4">or click to browse</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">PDF</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">JPG</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">PNG</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">WEBP</span>
                    </div>
                </label>
            </div>
            
            {/* Help Text */}
            <p className="text-center text-slate-500 text-sm mt-4">
                Upload lecture notes, textbook pages, or any study material to get started
            </p>
        </div>
    );
};

export default FileUpload;