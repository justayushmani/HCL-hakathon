import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Database, Hash } from 'lucide-react';
import { ProcessedFile } from '@/lib/fileProcessor';

interface DocumentViewerProps {
  document: ProcessedFile | null;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  if (!document) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No document selected</h3>
            <p className="text-muted-foreground">
              Upload a document to see its details and processed chunks here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('markdown')) return '📝';
    if (type.includes('html')) return '🌐';
    return '📄';
  };

  // Mock chunks for demonstration
  const mockChunks = [
    {
      id: 'chunk_1',
      content: 'Introduction to machine learning and its applications in modern technology...',
      page: 1,
      tokens: 156
    },
    {
      id: 'chunk_2', 
      content: 'Understanding supervised learning algorithms including linear regression...',
      page: 2,
      tokens: 203
    },
    {
      id: 'chunk_3',
      content: 'Unsupervised learning techniques such as clustering and dimensionality reduction...',
      page: 3,
      tokens: 178
    },
    {
      id: 'chunk_4',
      content: 'Neural networks and deep learning fundamentals for beginners...',
      page: 4,
      tokens: 189
    }
  ];

  return (
    <Card className="h-full shadow-card">
      <CardHeader className="bg-gradient-bg">
        <CardTitle className="flex items-center gap-3">
          <div className="text-2xl">{getFileTypeIcon(document.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{document.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {document.uploadedAt.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Database className="w-3 h-3" />
                {formatFileSize(document.size)}
              </div>
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {Math.ceil(document.content.length / 1000)} chunks
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{Math.ceil(document.content.length / 1000)}</div>
            <div className="text-sm text-muted-foreground">Text Chunks</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-accent">Ready</div>
            <div className="text-sm text-muted-foreground">Status</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Document Chunks
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {mockChunks.map((chunk, index) => (
              <div
                key={chunk.id}
                className="border rounded-lg p-3 hover:shadow-soft transition-smooth cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Chunk {index + 1}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Page {chunk.page}</span>
                    <span>•</span>
                    <span>{chunk.tokens} tokens</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {chunk.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-accent font-medium text-sm mb-1">
            <Database className="w-4 h-4" />
            Processing Info
          </div>
          <p className="text-xs text-muted-foreground">
            Document has been vectorized and indexed. Each chunk is embedded using advanced AI models for semantic search.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};