
import React, { useState } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { useAuth } from '@/context/AuthContext';
import { Department } from '@/lib/data';
import { FolderOpen } from 'lucide-react';
import DocumentCard from './DocumentCard';
import ApprovalModal from './ApprovalModal';
import { Document } from '@/lib/data';
import { cn } from '@/lib/utils';

interface FolderViewProps {
  department: Department;
  className?: string;
}

const FolderView: React.FC<FolderViewProps> = ({ department, className }) => {
  const { getDepartmentDocuments, canViewDocument } = useDocuments();
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  
  if (!user) return null;
  
  const documents = getDepartmentDocuments(department);
  const visibleDocuments = documents.filter(doc => canViewDocument(doc));
  
  const openApprovalModal = (document: Document) => {
    setSelectedDocument(document);
    setIsApprovalModalOpen(true);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <FolderOpen className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">{department} Department</h2>
      </div>
      
      {visibleDocuments.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No documents found in this folder</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleDocuments.map(doc => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
      
      <ApprovalModal
        document={selectedDocument}
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
};

export default FolderView;
