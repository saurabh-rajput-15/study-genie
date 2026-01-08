// NOTE: pdfjs-dist needs to be available, typically via a CDN or npm install.
// We'll use a CDN link for pdf.js worker.
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js. Using the module worker from esm.sh to match the library import and fix dynamic import errors.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const OCR_API_KEY = 'K82221253788957'; // As provided in the PRD
const OCR_API_ENDPOINT = 'https://api.ocr.space/parse/image';

const processPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(item => ('str' in item ? item.str : '')).join(' ');
    }
    return textContent;
};

const processImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');

    try {
        const response = await fetch(OCR_API_ENDPOINT, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`OCR API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.IsErroredOnProcessing) {
            throw new Error(`OCR processing error: ${data.ErrorMessage}`);
        }
        
        return data.ParsedResults?.[0]?.ParsedText || '';

    } catch (error) {
        console.error("OCR API call failed:", error);
        throw error;
    }
};

export const processFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
        return processPdf(file);
    } else if (file.type.startsWith('image/')) {
        return processImage(file);
    } else {
        throw new Error('Unsupported file type');
    }
};