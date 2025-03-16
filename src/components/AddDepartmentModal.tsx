
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addDepartment } from '@/lib/data';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose }) => {
  const [departmentName, setDepartmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (!departmentName.trim()) {
      toast.error('Please enter a department name');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      addDepartment(departmentName);
      
      toast.success(`Department ${departmentName} added successfully`);
      setDepartmentName('');
      onClose();
    } catch (error) {
      console.error('Failed to add department:', error);
      toast.error('Failed to add department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>
            Create a new department folder for document organization.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="departmentName">Department Name</Label>
            <Input 
              id="departmentName" 
              placeholder="e.g. Marketing" 
              value={departmentName} 
              onChange={(e) => setDepartmentName(e.target.value)} 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentModal;
