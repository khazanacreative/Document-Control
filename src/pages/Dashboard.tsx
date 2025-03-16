
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import UploadModal from '@/components/UploadModal';
import ApprovalModal from '@/components/ApprovalModal';
import DocumentCard from '@/components/DocumentCard';
import FolderView from '@/components/FolderView';
import AddUserModal from '@/components/AddUserModal';
import AddDepartmentModal from '@/components/AddDepartmentModal';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Department, folders } from '@/lib/data';
import {
  FolderOpen,
  Clock,
  PlusCircle,
  Search,
  UserPlus,
  FolderPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const departmentParam = searchParams.get('department') as Department | null;
  
  const { user } = useAuth();
  const {
    getAllDocuments,
    pendingDocuments,
    getUserDocuments,
    getDepartmentDocuments,
    canViewDocument,
  } = useDocuments();
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const isAdmin = user.role === 'admin';
  const isManagement = user.role === 'management';
  
  // Filter documents based on user role and department
  const allDocuments = getAllDocuments().filter(doc => canViewDocument(doc));
  const userDocuments = getUserDocuments(user.id);
  
  // Apply search filter
  const filterDocuments = (docs: any[]) => {
    if (!searchQuery) return docs;
    const query = searchQuery.toLowerCase();
    return docs.filter(doc => 
      doc.name.toLowerCase().includes(query) || 
      doc.department.toLowerCase().includes(query)
    );
  };
  
  // Get department documents if department is selected
  const departmentDocuments = departmentParam 
    ? getDepartmentDocuments(departmentParam as Department)
    : getDepartmentDocuments(user.department);
  
  const filteredAll = filterDocuments(allDocuments);
  const filteredUser = filterDocuments(userDocuments);
  const filteredDepartment = filterDocuments(departmentDocuments);
  const filteredPending = filterDocuments(pendingDocuments);
  
  const handleOpenApprovalModal = (doc: any) => {
    setSelectedDocument(doc);
    setIsApprovalModalOpen(true);
  };
  
  // Determine which view to display
  const renderMainContent = () => {
    if (departmentParam) {
      return <FolderView department={departmentParam as Department} />;
    }
    
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  Manage your documents and folders
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                {isAdmin && (
                  <>
                    <Button onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4" />
                      Add User
                    </Button>
                    <Button onClick={() => setIsAddDepartmentModalOpen(true)} className="flex items-center gap-1.5">
                      <FolderPlus className="h-4 w-4" />
                      Add Department
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="department">{departmentParam || user.department}</TabsTrigger>
                <TabsTrigger value="my">My Uploads</TabsTrigger>
                {(isAdmin || isManagement) && (
                  <TabsTrigger value="pending" className="relative">
                    Pending Approval
                    {filteredPending.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white px-1">
                        {filteredPending.length}
                      </span>
                    )}
                  </TabsTrigger>
                )}
              </TabsList>
              
              <ScrollArea className="h-[calc(100vh-20rem)] rounded-md border p-4">
                <TabsContent value="all" className="mt-0">
                  {filteredAll.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No documents found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredAll.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="department" className="mt-0">
                  {filteredDepartment.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No department documents found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDepartment.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="my" className="mt-0">
                  {filteredUser.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">You haven't uploaded any documents yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUser.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {(isAdmin || isManagement) && (
                  <TabsContent value="pending" className="mt-0">
                    {filteredPending.length === 0 ? (
                      <div className="text-center p-8">
                        <p className="text-muted-foreground">No documents pending approval</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPending.map((doc) => (
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
                  </TabsContent>
                )}
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onUpload={() => setIsUploadModalOpen(true)} />
        
        <main className="flex-1 overflow-auto p-6">
          {renderMainContent()}
        </main>
      </div>
      
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      
      <ApprovalModal
        document={selectedDocument}
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedDocument(null);
        }}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />

      <AddDepartmentModal
        isOpen={isAddDepartmentModalOpen}
        onClose={() => setIsAddDepartmentModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
