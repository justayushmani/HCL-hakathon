import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, File, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FileProcessor, ProcessedFile } from '@/lib/fileProcessor';

interface DocumentUploadProps {
  onDocumentProcessed: (document: ProcessedFile) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setCurrentFile(file.name);
    setUploadProgress(0);

    try {
      // Simulate progress updates
      for (let i = 0; i <= 50; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Process the file locally
      const processedFile = await FileProcessor.processFile(file);
      
      // Continue progress simulation
      for (let i = 60; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Extract and clean text content
      const cleanContent = FileProcessor.extractTextFromContent(processedFile.content, processedFile.type);
      
      // Validate that we have content
      if (!cleanContent || cleanContent.trim().length === 0) {
        throw new Error('The file appears to be empty or could not be read properly. Please try a different file.');
      }
      
      // Create final processed document
      const finalDocument: ProcessedFile = {
        ...processedFile,
        content: cleanContent
      };

      onDocumentProcessed(finalDocument);
      toast({
        title: "Document processed successfully!",
        description: `${file.name} is ready for Q&A. The file content has been loaded into memory.`,
      });
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "There was an error processing your document.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setCurrentFile('');
    }
  };

  return (
    <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-smooth">
      <CardContent className="p-8">
        <div
          className={`relative transition-smooth ${
            isDragging ? 'scale-105' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          {isProcessing ? (
            <div className="text-center space-y-4">
              <div className="animate-spin mx-auto w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
              <div className="space-y-2">
                <h3 className="font-semibold">Processing {currentFile}...</h3>
                <p className="text-sm text-muted-foreground">
                  Extracting text, creating chunks, and generating embeddings
                </p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                {isDragging ? (
                  <CheckCircle className="w-16 h-16 text-accent animate-bounce" />
                ) : (
                  <Upload className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Upload your documents</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Drag and drop PDF, Markdown, HTML, or text files here to start asking questions about their content.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="gradient"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.md,.html,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="text-xs text-muted-foreground">
                Supported formats: PDF, Markdown, HTML, TXT
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};