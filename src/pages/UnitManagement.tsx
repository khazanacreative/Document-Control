
import React, { useState } from 'react';
import { folders, deleteDepartment } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AddDepartmentModal from '@/components/AddDepartmentModal';
import { useAuth } from '@/context/AuthContext';
import { FolderPlus, Search, Trash2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UnitManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (!user || user.role !== 'admin') {
    // Redirect non-admin users
    navigate('/dashboard');
    return null;
  }
  
  // Filter departments based on search query
  const filteredDepartments = folders.filter(folder => {
    const query = searchQuery.toLowerCase();
    return folder.name.toLowerCase().includes(query);
  });
  
  const handleDeleteDepartment = () => {
    if (!selectedDepartment) return;
    
    try {
      const deleted = deleteDepartment(selectedDepartment);
      if (deleted) {
        toast.success('Department deleted successfully');
      } else {
        toast.error('Failed to delete department');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete department');
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onUpload={() => toast.info('Please use the dashboard to upload documents')} />
        
        <main className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Department Management
                  </CardTitle>
                  <CardDescription>
                    Add and remove departments for document organization
                  </CardDescription>
                </div>
                
                <Button 
                  onClick={() => setIsAddDepartmentModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                  Add Department
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search departments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department Name</TableHead>
                      <TableHead>Document Count</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                          No departments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartments.map((department) => (
                        <TableRow key={department.id} className="animate-enter">
                          <TableCell className="font-medium">
                            {department.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {department.documents.length} documents
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedDepartment(department.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              disabled={department.documents.length > 0}
                              title={department.documents.length > 0 ? "Cannot delete department with documents" : "Delete department"}
                            >
                              <Trash2 className={`h-4 w-4 ${department.documents.length > 0 ? 'text-muted-foreground' : 'text-red-500'}`} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <AddDepartmentModal
        isOpen={isAddDepartmentModalOpen}
        onClose={() => setIsAddDepartmentModalOpen(false)}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnitManagement;
