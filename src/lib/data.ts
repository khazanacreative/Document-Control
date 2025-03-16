export type UserRole = 'admin' | 'management' | 'employee';
export type Department = 'HR' | 'Finance' | 'IT' | 'Marketing' | 'Operations';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  department: Department;
  avatar?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadDate: string;
  department: Department;
  status: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
  content: string; // Base64 encoded data
}

export interface Folder {
  id: string;
  name: Department;
  documents: Document[];
}

// Mock users
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    department: 'IT',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
  },
  {
    id: '2',
    username: 'hr_manager',
    password: 'manager123',
    name: 'HR Manager',
    role: 'management',
    department: 'HR',
    avatar: 'https://ui-avatars.com/api/?name=HR+Manager&background=2E8B57&color=fff'
  },
  {
    id: '3',
    username: 'finance_manager',
    password: 'manager123',
    name: 'Finance Manager',
    role: 'management',
    department: 'Finance',
    avatar: 'https://ui-avatars.com/api/?name=Finance+Manager&background=4682B4&color=fff'
  },
  {
    id: '4',
    username: 'hr_employee',
    password: 'employee123',
    name: 'HR Staff',
    role: 'employee',
    department: 'HR',
    avatar: 'https://ui-avatars.com/api/?name=HR+Staff&background=20B2AA&color=fff'
  },
  {
    id: '5',
    username: 'finance_employee',
    password: 'employee123',
    name: 'Finance Staff',
    role: 'employee',
    department: 'Finance',
    avatar: 'https://ui-avatars.com/api/?name=Finance+Staff&background=6495ED&color=fff'
  },
  {
    id: '6',
    username: 'it_employee',
    password: 'employee123',
    name: 'IT Staff',
    role: 'employee',
    department: 'IT',
    avatar: 'https://ui-avatars.com/api/?name=IT+Staff&background=9370DB&color=fff'
  },
];

// Mock documents
export const documents: Document[] = [
  {
    id: '1',
    name: 'HR Policy Manual.pdf',
    type: 'application/pdf',
    size: 1024 * 1024 * 2.5, // 2.5MB
    uploadedBy: '2',
    uploadDate: '2023-11-15T10:30:00Z',
    department: 'HR',
    status: 'approved',
    approvedBy: '1',
    content: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp...' // Truncated for brevity
  },
  {
    id: '2',
    name: 'Q3 Financial Report.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 1024 * 1024 * 1.2, // 1.2MB
    uploadedBy: '3',
    uploadDate: '2023-10-05T14:20:00Z',
    department: 'Finance',
    status: 'approved',
    approvedBy: '1',
    content: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAI...' // Truncated for brevity
  },
  {
    id: '3',
    name: 'IT Security Guidelines.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1024 * 512, // 512KB
    uploadedBy: '6',
    uploadDate: '2023-12-01T09:15:00Z',
    department: 'IT',
    status: 'pending',
    content: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAI...' // Truncated for brevity
  },
  {
    id: '4',
    name: 'Employee Handbook.pdf',
    type: 'application/pdf',
    size: 1024 * 1024 * 3, // 3MB
    uploadedBy: '4',
    uploadDate: '2023-09-22T11:45:00Z',
    department: 'HR',
    status: 'approved',
    approvedBy: '2',
    content: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9M...' // Truncated for brevity
  },
  {
    id: '5',
    name: 'Budget Planning Template.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 1024 * 768, // 768KB
    uploadedBy: '5',
    uploadDate: '2023-11-28T16:00:00Z',
    department: 'Finance',
    status: 'pending',
    content: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAI...' // Truncated for brevity
  }
];

// Mock folders
export const folders: Folder[] = [
  {
    id: '1',
    name: 'HR',
    documents: documents.filter(doc => doc.department === 'HR')
  },
  {
    id: '2',
    name: 'Finance',
    documents: documents.filter(doc => doc.department === 'Finance')
  },
  {
    id: '3',
    name: 'IT',
    documents: documents.filter(doc => doc.department === 'IT')
  },
  {
    id: '4',
    name: 'Marketing',
    documents: []
  },
  {
    id: '5',
    name: 'Operations',
    documents: []
  }
];

// Local storage helpers
export const saveToLocalStorage = () => {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('documents', JSON.stringify(documents));
  localStorage.setItem('folders', JSON.stringify(folders));
};

export const loadFromLocalStorage = () => {
  const savedUsers = localStorage.getItem('users');
  const savedDocuments = localStorage.getItem('documents');
  const savedFolders = localStorage.getItem('folders');

  if (savedUsers) {
    const parsedUsers = JSON.parse(savedUsers);
    users.length = 0;
    users.push(...parsedUsers);
  } else {
    saveToLocalStorage();
  }

  if (savedDocuments) {
    const parsedDocuments = JSON.parse(savedDocuments);
    documents.length = 0;
    documents.push(...parsedDocuments);
  }

  if (savedFolders) {
    const parsedFolders = JSON.parse(savedFolders);
    folders.length = 0;
    folders.push(...parsedFolders);
  }
};

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getDocumentsByDepartment = (department: Department): Document[] => {
  return documents.filter(doc => doc.department === department);
};

export const getFolderByDepartment = (department: Department): Folder | undefined => {
  return folders.find(folder => folder.name === department);
};

export const addUser = (user: Omit<User, 'id'>): User => {
  const newUser = {
    ...user,
    id: (users.length + 1).toString()
  };
  users.push(newUser);
  saveToLocalStorage();
  return newUser;
};

export const addDepartment = (departmentName: string): Folder => {
  // Check if department already exists
  if (folders.some(folder => folder.name === departmentName)) {
    throw new Error(`Department ${departmentName} already exists`);
  }
  
  const newFolder: Folder = {
    id: (folders.length + 1).toString(),
    name: departmentName as Department,
    documents: []
  };
  
  folders.push(newFolder);
  saveToLocalStorage();
  return newFolder;
};

export const deleteDepartment = (departmentId: string): boolean => {
  const index = folders.findIndex(folder => folder.id === departmentId);
  
  if (index >= 0) {
    // Check if department has documents
    if (folders[index].documents.length > 0) {
      throw new Error(`Cannot delete department with documents`);
    }
    
    folders.splice(index, 1);
    saveToLocalStorage();
    return true;
  }
  
  return false;
};

export const addDocument = (document: Omit<Document, 'id'>): Document => {
  const newDocument = {
    ...document,
    id: (documents.length + 1).toString()
  };
  
  documents.push(newDocument);
  
  // Update folder
  const folder = folders.find(f => f.name === document.department);
  if (folder) {
    folder.documents.push(newDocument);
  }
  
  saveToLocalStorage();
  return newDocument;
};

export const updateDocumentStatus = (
  id: string, 
  status: 'approved' | 'rejected' | 'pending', 
  approvedBy?: string
): Document | undefined => {
  const document = documents.find(doc => doc.id === id);
  
  if (document) {
    document.status = status;
    document.approvedBy = approvedBy;
    
    // Update in folder
    const folder = folders.find(f => f.name === document.department);
    if (folder) {
      const docIndex = folder.documents.findIndex(doc => doc.id === id);
      if (docIndex >= 0) {
        folder.documents[docIndex] = document;
      }
    }
    
    saveToLocalStorage();
    return document;
  }
  
  return undefined;
};

export const deleteDocument = (id: string): boolean => {
  const index = documents.findIndex(doc => doc.id === id);
  
  if (index >= 0) {
    const document = documents[index];
    documents.splice(index, 1);
    
    // Remove from folder
    const folder = folders.find(f => f.name === document.department);
    if (folder) {
      const docIndex = folder.documents.findIndex(doc => doc.id === id);
      if (docIndex >= 0) {
        folder.documents.splice(docIndex, 1);
      }
    }
    
    saveToLocalStorage();
    return true;
  }
  
  return false;
};

// Initialize data on import
loadFromLocalStorage();
