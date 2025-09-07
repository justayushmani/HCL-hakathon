import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentUpload } from '@/components/DocumentUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { DocumentViewer } from '@/components/DocumentViewer';
import { Brain, Sparkles, Search, FileText, MessageSquare, Database } from 'lucide-react';
import { ProcessedFile } from '@/lib/fileProcessor';
import heroImage from '@/assets/hero-rag.jpg';

const Index = () => {
  const [currentDocument, setCurrentDocument] = useState<ProcessedFile | null>(null);

  const handleDocumentProcessed = (document: ProcessedFile) => {
    setCurrentDocument(document);
  };

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Document Upload",
      description: "Support for PDFs, Markdown, HTML, and text files with intelligent parsing"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Smart Chunking", 
      description: "Automatically splits documents into semantic chunks for optimal retrieval"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Vector Search",
      description: "Advanced embedding-based similarity search for relevant content"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Natural Q&A",
      description: "Ask questions in natural language and get contextual answers"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered",
      description: "Leverages state-of-the-art language models for accurate responses"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Source Citations",
      description: "Every answer includes references to the original document sections"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
                Ask Anything About Your
                <span className="block bg-gradient-accent bg-clip-text text-transparent">
                  Documents
                </span>
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Upload PDFs, research papers, or wiki articles and get instant, intelligent answers 
                powered by advanced AI and retrieval-augmented generation.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>PDFs</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <span>Research Papers</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span>Semantic Search</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our RAG system combines document understanding with conversational AI to provide accurate, 
            contextual answers from your uploaded documents.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4 text-accent-foreground">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Application Interface */}
      <section className="container mx-auto px-4 pb-16">
        <div className="space-y-8">
          {/* Document Upload Section */}
          {!currentDocument && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Get Started</h2>
                <p className="text-muted-foreground">
                  Upload your first document to begin asking questions
                </p>
              </div>
              <DocumentUpload onDocumentProcessed={handleDocumentProcessed} />
            </div>
          )}

          {/* Active Document Interface */}
          {currentDocument && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Document Analysis</h2>
                <p className="text-muted-foreground">
                  Your document is ready! Ask questions in the chat or explore the processed chunks.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Document Upload - Now compact */}
                <div className="lg:col-span-1">
                  <Card className="mb-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Upload New Document</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DocumentUpload onDocumentProcessed={handleDocumentProcessed} />
                    </CardContent>
                  </Card>
                  
                  {/* Document Viewer */}
                  <DocumentViewer document={currentDocument} />
                </div>
                
                {/* Chat Interface */}
                <div className="lg:col-span-2">
                  <ChatInterface document={currentDocument} />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Powered by Retrieval-Augmented Generation (RAG) Technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;