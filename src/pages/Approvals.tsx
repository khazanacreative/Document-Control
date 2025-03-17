
import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useDocuments } from '@/context/DocumentContext';
import { useAuth } from '@/context/AuthContext';
import DocumentCard from '@/components/DocumentCard';
import ApprovalModal from '@/components/ApprovalModal';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const Approvals = () => {
  const { user } = useAuth();
  const { pendingDocuments } = useDocuments();
  const [selectedDocument, setSelectedDocument] = React.useState<any>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = React.useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const isAdmin = user.role === 'admin';
  const isManagement = user.role === 'management';

  if (!isAdmin && !isManagement) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>
                  You don't have permission to view this page.
                </CardDescription>
              </CardHeader>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const handleOpenApprovalModal = (doc: any) => {
    setSelectedDocument(doc);
    setIsApprovalModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Documents Pending Approval</CardTitle>
              <CardDescription>
                Review and approve or reject documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border p-4">
                {pendingDocuments.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No documents pending approval</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingDocuments.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="relative group"
                        onClick={() => handleOpenApprovalModal(doc)}
                      >
                        <div className="absolute inset-0 bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-10">
                          <div className="bg-white/90 px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">Review</span>
                          </div>
                        </div>
                        <DocumentCard document={doc} />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </div>

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

export default Approvals;
