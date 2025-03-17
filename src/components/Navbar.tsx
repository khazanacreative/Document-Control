import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Menu,
  UserCircle,
  Bell,
  ChevronDown,
  Lock,
  Settings,
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/context/DocumentContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { pendingDocuments } = useDocuments();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!user) return null;

  const pendingCount = user.role !== 'employee' ? pendingDocuments.length : 0;
  
  const getRoleBadgeColor = () => {
    switch (user.role) {
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
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-x-6">
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div 
            className="cursor-pointer flex items-center gap-2" 
            onClick={() => navigate('/dashboard')}
          >
            <Lock className="h-5 w-5 text-primary" />
            <span className="text-lg font-medium">DocSecure</span>
          </div>
        </div>

        <nav className={cn(
          "flex-col absolute left-0 right-0 top-full bg-white/90 backdrop-blur-md border-b md:border-0 shadow-lg md:shadow-none p-4 md:p-0 transition-all duration-300 ease-in-out md:relative md:flex md:flex-row md:bg-transparent md:space-y-0 md:space-x-4",
          isMobileMenuOpen ? "flex" : "hidden md:flex"
        )}>
          <Button variant="ghost" className="justify-start md:justify-center" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          
          {user.role === 'admin' && (
            <>
              <Button variant="ghost" className="justify-start md:justify-center" onClick={() => navigate('/user-management')}>
                User Management
              </Button>
              <Button variant="ghost" className="justify-start md:justify-center" onClick={() => navigate('/unit-management')}>
                Department Management
              </Button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard/approvals')}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <Badge 
                className="absolute -top-1 -right-1 bg-destructive text-white text-xs h-4 min-w-4 flex items-center justify-center"
                variant="destructive"
              >
                {pendingCount}
              </Badge>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex md:flex-col md:items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className={cn("text-[10px] px-1 py-0 h-4", getRoleBadgeColor())}>
                      {user.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">({user.department})</span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
