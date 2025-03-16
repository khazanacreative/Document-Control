
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Document, 
  Folder, 
  User, 
  documents as mockDocuments, 
  folders as mockFolders, 
  addDocument as addMockDocument,
  updateDocumentStatus as updateMockDocumentStatus,
  deleteDocument as deleteMockDocument,
  Department
} from '@/lib/data';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface DocumentContextType {
  documents: Document[];
  folders: Folder[];
  pendingDocuments: Document[];
  addDocument: (doc: Omit<Document, 'id'>) => void;
  approveDocument: (id: string) => void;
  rejectDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  uploadDocument: (file: File, department: Department) => Promise<void>;
  getUserDocuments: (userId: string) => Document[];
  getDepartmentDocuments: (department: Department) => Document[];
  getAllDocuments: () => Document[];
  canEditDocument: (document: Document) => boolean;
  canViewDocument: (document: Document) => boolean;
  canApproveDocument: (document: Document) => boolean;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([...mockDocuments]);
  const [folders, setFolders] = useState<Folder[]>([...mockFolders]);
  const { user } = useAuth();

  // Refetch data from localStorage when initialized
  useEffect(() => {
    const savedDocuments = localStorage.getItem('documents');
    const savedFolders = localStorage.getItem('folders');

    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Get all pending documents
  const pendingDocuments = documents.filter(doc => doc.status === 'pending');

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Upload a document
  const uploadDocument = async (file: File, department: Department) => {
    if (!user) {
      toast.error('You must be logged in to upload documents');
      return;
    }

    try {
      const base64Content = await fileToBase64(file);
      
      // Set initial status based on user role
      const initialStatus = user.role === 'employee' ? 'pending' : 'approved';
      
      const newDoc: Omit<Document, 'id'> = {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedBy: user.id,
        uploadDate: new Date().toISOString(),
        department,
        status: initialStatus,
        approvedBy: user.role !== 'employee' ? user.id : undefined,
        content: base64Content
      };
      
      const addedDoc = addMockDocument(newDoc);
      
      // Update state
      setDocuments(prev => [...prev, addedDoc]);
      
      // Update folders
      setFolders(prev => 
        prev.map(folder => 
          folder.name === department
            ? { ...folder, documents: [...folder.documents, addedDoc] }
            : folder
        )
      );
      
      toast.success(
        user.role === 'employee' 
          ? 'Document uploaded and pending approval' 
          : 'Document uploaded successfully'
      );
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload document');
    }
  };

  // Add a document
  const addDocument = (doc: Omit<Document, 'id'>) => {
    const newDoc = addMockDocument(doc);
    setDocuments(prev => [...prev, newDoc]);
    
    // Update folders
    setFolders(prev => 
      prev.map(folder => 
        folder.name === doc.department
          ? { ...folder, documents: [...folder.documents, newDoc] }
          : folder
      )
    );
    
    toast.success('Document added successfully');
  };

  // Approve a document
  const approveDocument = (id: string) => {
    if (!user) return;
    
    const updatedDoc = updateMockDocumentStatus(id, 'approved', user.id);
    
    if (updatedDoc) {
      // Update documents state
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDoc : doc)
      );
      
      // Update folders state
      setFolders(prev => 
        prev.map(folder => 
          folder.name === updatedDoc.department
            ? {
                ...folder,
                documents: folder.documents.map(doc => 
                  doc.id === id ? updatedDoc : doc
                )
              }
            : folder
        )
      );
      
      toast.success('Document approved');
    }
  };

  // Reject a document
  const rejectDocument = (id: string) => {
    if (!user) return;
    
    const updatedDoc = updateMockDocumentStatus(id, 'rejected', user.id);
    
    if (updatedDoc) {
      // Update documents state
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDoc : doc)
      );
      
      // Update folders state
      setFolders(prev => 
        prev.map(folder => 
          folder.name === updatedDoc.department
            ? {
                ...folder,
                documents: folder.documents.map(doc => 
                  doc.id === id ? updatedDoc : doc
                )
              }
            : folder
        )
      );
      
      toast.success('Document rejected');
    }
  };

  // Delete a document
  const deleteDocument = (id: string) => {
    const docToDelete = documents.find(doc => doc.id === id);
    
    if (!docToDelete) {
      toast.error('Document not found');
      return;
    }
    
    const deleted = deleteMockDocument(id);
    
    if (deleted) {
      // Update documents state
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      // Update folders state
      setFolders(prev => 
        prev.map(folder => 
          folder.name === docToDelete.department
            ? {
                ...folder,
                documents: folder.documents.filter(doc => doc.id !== id)
              }
            : folder
        )
      );
      
      toast.success('Document deleted');
    } else {
      toast.error('Failed to delete document');
    }
  };

  // Get user's documents
  const getUserDocuments = (userId: string): Document[] => {
    return documents.filter(doc => doc.uploadedBy === userId);
  };

  // Get department documents
  const getDepartmentDocuments = (department: Department): Document[] => {
    return documents.filter(doc => doc.department === department);
  };

  // Get all documents
  const getAllDocuments = (): Document[] => {
    return [...documents];
  };

  // Check if user can edit document
  const canEditDocument = (document: Document): boolean => {
    if (!user) return false;
    
    // Admin can edit all documents
    if (user.role === 'admin') return true;
    
    // Management can edit documents in their department
    if (user.role === 'management' && user.department === document.department) {
      return true;
    }
    
    // Users can edit their own documents that they uploaded
    return document.uploadedBy === user.id;
  };

  // Check if user can view document
  const canViewDocument = (document: Document): boolean => {
    if (!user) return false;
    
    // Admin and management can view all documents
    if (user.role === 'admin') return true;
    
    // Management can view documents in their department or any approved doc
    if (user.role === 'management') {
      return document.department === user.department || document.status === 'approved';
    }
    
    // Employees can view documents in their department if approved or their own
    return (
      (document.department === user.department && document.status === 'approved') ||
      document.uploadedBy === user.id
    );
  };

  // Check if user can approve document
  const canApproveDocument = (document: Document): boolean => {
    if (!user) return false;
    
    // Admin can approve all documents
    if (user.role === 'admin') return true;
    
    // Management can approve documents in their department
    return user.role === 'management' && user.department === document.department;
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        folders,
        pendingDocuments,
        addDocument,
        approveDocument,
        rejectDocument,
        deleteDocument,
        uploadDocument,
        getUserDocuments,
        getDepartmentDocuments,
        getAllDocuments,
        canEditDocument,
        canViewDocument,
        canApproveDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
