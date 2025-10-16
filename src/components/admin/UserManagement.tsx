'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconUsers,
  IconShield,
  IconDots,
  IconSearch,
  IconDownload,
  IconEdit,
  IconTrash,
  IconEye,
  IconCheck,
  IconX,
  IconCrown,
  IconUser,
  IconAlertTriangle,
  IconEyeOff,
  IconUserPlus,
} from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import type { AdminUser } from '@/types/admin';

interface CellContext<T> {
  row: {
    getValue: (key: string) => T;
    original: AdminUser;
  };
}

const mockUsers: AdminUser[] = [
  {
    id: 'admin_1',
    email: 'john.admin@icm.com',
    name: 'John Anderson',
    role: 'super_admin',
    status: 'active',
    lastLogin: new Date('2024-01-20T09:30:00'),
    createdAt: new Date('2024-01-01'),
    permissions: [
      'pools.view',
      'pools.edit',
      'pools.delete',
      'fees.view',
      'fees.claim',
      'users.view',
      'users.edit',
      'users.delete',
      'analytics.view',
      'settings.view',
      'settings.edit',
    ],
  },
  {
    id: 'admin_2',
    email: 'sarah.manager@icm.com',
    name: 'Sarah Martinez',
    role: 'pool_manager',
    status: 'active',
    lastLogin: new Date('2024-01-20T08:15:00'),
    createdAt: new Date('2024-01-05'),
    permissions: [
      'pools.view',
      'pools.edit',
      'fees.view',
      'fees.claim',
      'analytics.view',
    ],
  },
  {
    id: 'admin_3',
    email: 'mike.viewer@icm.com',
    name: 'Mike Thompson',
    role: 'viewer',
    status: 'active',
    lastLogin: new Date('2024-01-19T16:45:00'),
    createdAt: new Date('2024-01-10'),
    permissions: ['pools.view', 'fees.view', 'analytics.view'],
  },
  {
    id: 'admin_4',
    email: 'lisa.suspended@icm.com',
    name: 'Lisa Johnson',
    role: 'pool_manager',
    status: 'suspended',
    lastLogin: new Date('2024-01-15T12:20:00'),
    createdAt: new Date('2024-01-08'),
    permissions: [],
  },
];

const roleColors = {
  super_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  admin: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  pool_manager: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  finance: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  support: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  viewer: 'bg-muted/50 text-muted-foreground border-border',
};

const statusColors = {
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  suspended: 'bg-red-500/10 text-red-500 border-red-500/20',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

const allPermissions = [
  { id: 'pools.view', label: 'View Pools', category: 'Pool Management' },
  { id: 'pools.edit', label: 'IconEdit Pools', category: 'Pool Management' },
  { id: 'pools.delete', label: 'Delete Pools', category: 'Pool Management' },
  { id: 'fees.view', label: 'View Fees', category: 'Fee Management' },
  { id: 'fees.claim', label: 'Claim Fees', category: 'Fee Management' },
  {
    id: 'users.view',
    label: 'View IconUsers',
    category: 'IconUser Management',
  },
  {
    id: 'users.edit',
    label: 'IconEdit IconUsers',
    category: 'IconUser Management',
  },
  {
    id: 'users.delete',
    label: 'Delete IconUsers',
    category: 'IconUser Management',
  },
  { id: 'analytics.view', label: 'View Analytics', category: 'Analytics' },
  { id: 'settings.view', label: 'View Settings', category: 'Settings' },
  { id: 'settings.edit', label: 'IconEdit Settings', category: 'Settings' },
];

const getRoleIcon = (role: AdminUser['role']) => {
  switch (role) {
    case 'super_admin':
      return IconCrown;
    case 'pool_manager':
      return IconShield;
    case 'viewer':
      return IconUser;
    default:
      return IconUser;
  }
};

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as AdminUser['role'],
    permissions: [] as string[],
  });

  const handleCreateUser = () => {
    // Simulate API call
    console.log('Creating user:', newUser);
    setIsCreateDialogOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      permissions: [],
    });
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: [...user.permissions],
    });
  };

  const handleUpdateUser = () => {
    console.log('Updating user:', editingUser?.id, newUser);
    setEditingUser(null);
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      permissions: [],
    });
  };

  const handleSuspendUser = (userId: string) => {
    console.log('Suspending user:', userId);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Deleting user:', userId);
  };

  const togglePermission = (permissionId: string) => {
    const currentPermissions = newUser.permissions;
    const hasPermission = currentPermissions.includes(permissionId);

    if (hasPermission) {
      setNewUser({
        ...newUser,
        permissions: currentPermissions.filter(p => p !== permissionId),
      });
    } else {
      setNewUser({
        ...newUser,
        permissions: [...currentPermissions, permissionId],
      });
    }
  };

  const userColumns = [
    {
      accessorKey: 'name',
      header: 'IconUser',
      cell: ({ row }: CellContext<string>) => {
        const user = row.original;
        const RoleIcon = getRoleIcon(user.role);
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <RoleIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }: CellContext<AdminUser['role']>) => {
        const role = row.getValue('role');
        return (
          <Badge variant="outline" className={roleColors[role]}>
            {role.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: CellContext<AdminUser['status']>) => {
        const status = row.getValue('status');
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {status === 'active' && <IconCheck className="h-3 w-3 mr-1" />}
            {status === 'suspended' && <IconX className="h-3 w-3 mr-1" />}
            {status === 'pending' && (
              <IconAlertTriangle className="h-3 w-3 mr-1" />
            )}
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }: CellContext<string[]>) => {
        const permissions = row.getValue('permissions');
        return (
          <span className="text-sm text-muted-foreground">
            {permissions.length} permissions
          </span>
        );
      },
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }: CellContext<Date>) => {
        const date = row.getValue('lastLogin');
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: CellContext<string>) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <IconDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                <IconEdit className="h-4 w-4 mr-2" />
                IconEdit IconUser
              </DropdownMenuItem>
              {user.status === 'active' ? (
                <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                  <IconEyeOff className="h-4 w-4 mr-2" />
                  Suspend IconUser
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                  <IconEye className="h-4 w-4 mr-2" />
                  Activate IconUser
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-500"
              >
                <IconTrash className="h-4 w-4 mr-2" />
                Delete IconUser
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const permissionsByCategory = allPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, typeof allPermissions>
  );

  return (
    <div className="min-h-screen - space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            IconUser Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage admin users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <IconUserPlus className="h-4 w-4 mr-2" />
                Add IconUser
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <div className="dark grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className='dark'>
            <CardHeader className='flex items-center justify-between'>
              <CardTitle>Total IconUsers</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {mockUsers.length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className='flex items-center justify-between'>
              <CardTitle>Active IconUsers</CardTitle>
              <IconCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {mockUsers.filter(u => u.status === 'active').length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className='flex items-center justify-between'>
              <CardTitle>Super Admins</CardTitle>
              <IconCrown className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {mockUsers.filter(u => u.role === 'super_admin').length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className='flex items-center justify-between'>
              <CardTitle>Suspended</CardTitle>
              <IconX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {mockUsers.filter(u => u.status === 'suspended').length}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="IconSearch users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="pool_manager">Pool Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="text-base font-medium">
                Admin IconUsers
              </CardTitle>
              <CardDescription>
                Manage admin user accounts and permissions
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <IconDownload className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={userColumns}
              data={filteredUsers}
              searchKey="name"
              searchPlaceholder="IconSearch users..."
            />
          </CardContent>
        </Card>
      </motion.div>

      <Dialog
        open={isCreateDialogOpen || !!editingUser}
        onOpenChange={open => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingUser(null);
            setNewUser({
              name: '',
              email: '',
              role: 'viewer',
              permissions: [],
            });
          }
        }}
      >
        <DialogContent className="min-w-4xl dark max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'IconEdit IconUser' : 'Create New IconUser'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Update user details and permissions'
                : 'Add a new admin user to the platform'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={e =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Enter user name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={e =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: AdminUser['role']) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="pool_manager">Pool Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label>Permissions</Label>
              {Object.entries(permissionsByCategory).map(
                ([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {permissions.map(permission => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={newUser.permissions.includes(
                              permission.id
                            )}
                            onCheckedChange={() =>
                              togglePermission(permission.id)
                            }
                          />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingUser(null);
              }}
              className="border-border text-foreground hover:bg-muted hover:text-cyan-400 hover:border-cyan-400"
            >
              Cancel
            </Button>
            <Button
              onClick={editingUser ? handleUpdateUser : handleCreateUser}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {editingUser ? 'Update IconUser' : 'Create IconUser'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
