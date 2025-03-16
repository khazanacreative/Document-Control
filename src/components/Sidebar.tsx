
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Folder, Upload, FolderOpen, LayoutDashboard, Users, Building2 } from 'lucide-react';
import { folders } from '@/lib/data';

interface SidebarProps {
  onUpload: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onUpload }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return null;
  }
  
  const isAdmin = user.role === 'admin';
  
  return (
    <div className="sidebar-container border-r w-64 h-[calc(100vh-4rem)] flex-shrink-0 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="px-4 py-4">
          <Button 
            onClick={onUpload} 
            className="w-full justify-start gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-1 px-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            
            {isAdmin && (
              <>
                <NavLink
                  to="/user-management"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )
                  }
                >
                  <Users className="h-4 w-4" />
                  User Management
                </NavLink>
                
                <NavLink
                  to="/unit-management"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )
                  }
                >
                  <Building2 className="h-4 w-4" />
                  Department Management
                </NavLink>
              </>
            )}
            
            <div className="mt-6">
              <h3 className="px-3 text-xs font-semibold text-foreground mb-2">
                Departments
              </h3>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <NavLink
                    key={folder.id}
                    to={`/dashboard?department=${folder.name}`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                        (isActive || location.search === `?department=${folder.name}`) 
                          ? "bg-accent text-accent-foreground" 
                          : "text-muted-foreground"
                      )
                    }
                  >
                    {location.search === `?department=${folder.name}` ? (
                      <FolderOpen className="h-4 w-4" />
                    ) : (
                      <Folder className="h-4 w-4" />
                    )}
                    {folder.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
