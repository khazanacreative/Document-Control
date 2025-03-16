
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { folders } from '@/lib/data';
import {
  Folder,
  FolderOpen,
  PanelLeft,
  PanelLeftClose,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  onUpload: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onUpload }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isManagement = user.role === 'management';
  
  // Determine which folders the user can access
  const accessibleFolders = folders.filter(folder => {
    if (isAdmin || isManagement) return true; // Admin and Management can see all folders
    return folder.name === user.department; // Employees can only see their department folder
  });

  // Handle folder click to navigate to department
  const handleFolderClick = (folderName: string) => {
    navigate(`/dashboard?department=${folderName}`);
  };

  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] border-r bg-sidebar transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h2 className="text-lg font-medium">Documents</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Button
          onClick={onUpload}
          className={cn(
            "mb-4 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90",
            collapsed ? "px-2" : ""
          )}
        >
          <Upload className="h-4 w-4" />
          {!collapsed && <span>Upload Document</span>}
        </Button>

        <Separator className="my-4" />

        <ScrollArea className="flex-grow">
          <div className="space-y-1 pr-2">
            {accessibleFolders.map(folder => (
              <Button
                key={folder.id}
                variant="ghost"
                className="w-full flex items-center justify-start px-2"
                onClick={() => handleFolderClick(folder.name)}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  {!collapsed && <span>{folder.name}</span>}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
