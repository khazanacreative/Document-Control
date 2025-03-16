
import React, { useState, useRef } from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { useAuth } from '@/context/AuthContext';
import { Department, folders } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, File, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadDocument } = useDocuments();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [department, setDepartment] = useState<Department | ''>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isManagement = user.role === 'management';
  
  // Get departments this user can upload to
  const allowedDepartments = isAdmin
    ? folders.map(f => f.name)
    : isManagement
      ? folders.map(f => f.name) // Management can upload to any department in this simplified version
      : [user.department]; // Employees can only upload to their department
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      // Auto-set department for non-admin users if there's only one option
      if (!isAdmin && allowedDepartments.length === 1) {
        setDepartment(allowedDepartments[0]);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      
      // Auto-set department for non-admin users if there's only one option
      if (!isAdmin && allowedDepartments.length === 1) {
        setDepartment(allowedDepartments[0]);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!department) {
      toast.error('Please select a department');
      return;
    }
    
    try {
      setIsUploading(true);
      await uploadDocument(file, department as Department);
      handleReset();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setDepartment('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const needsApproval = user.role === 'employee';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to the selected department.
            {needsApproval && " Your upload will need approval from management or admin."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <File className="h-6 w-6 text-primary" />
                <span className="font-medium">{file.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop your file here, or click to browse
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={department}
              onValueChange={(value) => setDepartment(value as Department)}
              disabled={allowedDepartments.length === 1 && Boolean(department)}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {allowedDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {needsApproval && (
            <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                As an employee, your document will require approval from management or admin before it becomes visible to others.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleReset} disabled={isUploading}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || !department || isUploading}
              className="min-w-[80px]"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
