import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FileUploadProps {
  onUploadSuccess: (documentId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    // This is a mock upload. In a real app, you'd handle the upload to a server here.
    if (file) {
      console.log('Uploading file:', file.name);
      // Simulate a successful upload and get a document ID.
      onUploadSuccess("mock-document-id-123");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>Select a PDF, research paper, or wiki article to get started.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
        <Button onClick={handleUpload} disabled={!file}>Upload and Process</Button>
      </CardContent>
    </Card>
  );
};

export default FileUpload;