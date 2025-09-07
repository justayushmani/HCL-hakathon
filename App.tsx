import { useState } from "react";
import FileUpload from "./FileUpload";
import QandA from "./QandA";

function App() {
  const [documentId, setDocumentId] = useState<string | null>(null);

  const handleUploadSuccess = (docId: string) => {
    setDocumentId(docId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Document-wise Ask</h1>
        {!documentId ? <FileUpload onUploadSuccess={handleUploadSuccess} /> : <QandA documentId={documentId} />}
      </div>
    </div>
  );
}

export default App;