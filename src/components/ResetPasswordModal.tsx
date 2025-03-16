
import React, { useState } from 'react';
import { User } from '@/lib/data';
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
import { Eye, EyeOff } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onReset: (userId: string, newPassword: string) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onReset 
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    setError('');
    
    if (!newPassword) {
      setError('Password cannot be empty');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsSubmitting(true);
      onReset(user.id, newPassword);
    } catch (error) {
      console.error('Failed to reset password:', error);
      setError('Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset password for user: {user.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input 
                id="new-password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
              id="confirm-password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
          
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetForm} className="mr-auto">
            Reset
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
