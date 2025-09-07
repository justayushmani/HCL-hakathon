// File processing utility for reading files locally without storage
import { config } from '../../config';

export interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  uploadedAt: Date;
}

export class FileProcessor {
  static async processFile(file: File): Promise<ProcessedFile> {
    // Validate file size
    if (file.size > config.maxFileSize) {
      throw new Error(`File size exceeds ${config.maxFileSize / (1024 * 1024)}MB limit`);
    }

    // Validate file type
    const allowedTypes = config.supportedFileTypes;
    const allowedExtensions = ['.pdf', '.txt', '.md', '.html'];
    
    const isValidType = allowedTypes.includes(file.type) || 
                       allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      throw new Error('Unsupported file type. Please upload PDF, TXT, MD, or HTML files.');
    }

    // Read file content
    const content = await this.readFileContent(file);
    
    return {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: content,
      uploadedAt: new Date()
    };
  }

  private static async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      // Read as text for all file types
      // Note: For PDF files, this will only extract basic text. For better PDF parsing, you'd need a PDF library
      reader.readAsText(file);
    });
  }

  static extractTextFromContent(content: string, fileType: string): string {
    // Clean up the content based on file type
    switch (fileType) {
      case 'text/html':
        // Remove HTML tags for better AI processing
        return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      case 'text/markdown':
        // Keep markdown formatting as it's useful for AI
        return content.trim();
      
      case 'application/pdf':
        // PDF text might have extra whitespace and special characters
        return content.replace(/\s+/g, ' ').replace(/[^\w\s.,!?;:()-]/g, ' ').trim();
      
      case 'text/plain':
        // Clean up plain text
        return content.replace(/\s+/g, ' ').trim();
      
      default:
        return content.trim();
    }
  }

  static chunkText(text: string, maxChunkSize: number = 2000): string[] {
    // Split text into chunks for better AI processing
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
