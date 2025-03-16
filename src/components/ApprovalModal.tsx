
import React from 'react';
import { useDocuments } from '@/context/DocumentContext';
import { Document, getUserById } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, FileText, FileSpreadsheet, File } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ApprovalModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const { approveDocument, rejectDocument } = useDocuments();
  
  if (!document) return null;
  
  const uploader = getUserById(document.uploadedBy);
  
  if (!uploader) return null;
  
  const handleApprove = () => {
    approveDocument(document.id);
    onClose();
  };
  
  const handleReject = () => {
    rejectDocument(document.id);
    onClose();
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (type: string) => {
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    } else if (type.includes('pdf') || type.includes('document') || type.includes('word')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    } else {
      return <File className="h-8 w-8 text-gray-600" />;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Document Approval</DialogTitle>
          <DialogDescription>
            Review this document before approving or rejecting.
          </DialogDescription>
        </DialogHeader>
        
        <Card className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-slate-50 p-3 rounded-md">
              {getFileIcon(document.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{document.name}</h3>
              <p className="text-sm text-muted-foreground">{formatFileSize(document.size)}</p>
              <Badge className="mt-2">{document.department}</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2 border-t">
            <Avatar className="h-8 w-8">
              <AvatarImage src={uploader.avatar} />
              <AvatarFallback>{uploader.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">Uploaded by <span className="font-medium">{uploader.name}</span></p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(document.uploadDate), 'PPP')}
              </p>
            </div>
          </div>
        </Card>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={handleReject}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
            onClick={handleApprove}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalModal;
