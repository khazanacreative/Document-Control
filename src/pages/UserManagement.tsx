
import React, { useState } from 'react';
import { users, User, deleteUser, resetUserPassword } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AddUserModal from '@/components/AddUserModal';
import ResetPasswordModal from '@/components/ResetPasswordModal';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Search, UserPlus, Users, Trash, Key } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (!user || user.role !== 'admin') {
    // Redirect non-admin users
    navigate('/dashboard');
    return null;
  }
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query)
    );
  });
  
  const handleDeleteUser = () => {
    if (selectedUser) {
      if (deleteUser(selectedUser.id)) {
        toast.success(`User ${selectedUser.name} deleted successfully`);
      } else {
        toast.error('Failed to delete user');
      }
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleResetPassword = (userId: string, newPassword: string) => {
    if (resetUserPassword(userId, newPassword)) {
      toast.success('Password reset successfully');
      setIsResetPasswordModalOpen(false);
      setSelectedUser(null);
    } else {
      toast.error('Failed to reset password');
    }
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'management':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'employee':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
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
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, and manage user accounts
                  </CardDescription>
                </div>
                
                <Button 
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((userItem: User) => (
                        <TableRow key={userItem.id} className="animate-enter">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={userItem.avatar} />
                                <AvatarFallback>{userItem.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{userItem.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{userItem.username}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(userItem.role)}>
                              {userItem.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{userItem.department}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setSelectedUser(userItem);
                                  setIsResetPasswordModalOpen(true);
                                }}
                                title="Reset Password"
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  setSelectedUser(userItem);
                                  setIsDeleteDialogOpen(true);
                                }}
                                title="Delete User"
                                disabled={userItem.id === user.id} // Prevent deleting own account
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
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
      
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />

      {selectedUser && (
        <ResetPasswordModal
          isOpen={isResetPasswordModalOpen}
          onClose={() => {
            setIsResetPasswordModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onReset={handleResetPassword}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for {selectedUser?.name}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
