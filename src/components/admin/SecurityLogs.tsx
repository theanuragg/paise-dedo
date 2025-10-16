'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconShield,
  IconEye,
  IconLock,
  IconActivity,
  IconDownload,
  IconFilter,
  IconCalendar,
  IconUser,
  IconClock,
  IconSearch,
  IconFileText,
  IconDatabase,
  IconSettings,
  IconLogout,
  IconLogin,
  IconUserX,
  IconTrash,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import type { AuditLog } from '@/types/admin';

interface CellContext<T> {
  row: {
    getValue: (key: string) => T;
    original: AuditLog;
  };
}

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  ipAddress: string;
  status: 'resolved' | 'investigating' | 'open';
}

interface SecurityCellContext<T> {
  row: {
    getValue: (key: string) => T;
    original: SecurityEvent;
  };
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log_1',
    userId: 'admin_1',
    userEmail: 'john.admin@icm.com',
    action: 'pool.pause',
    resource: 'pool_123',
    timestamp: new Date('2024-01-20T10:30:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      reason: 'Emergency maintenance',
      poolId: 'pool_123',
      previousStatus: 'active'
    }
  },
  {
    id: 'log_2',
    userId: 'admin_2',
    userEmail: 'sarah.manager@icm.com',
    action: 'fees.claim',
    resource: 'pool_456',
    timestamp: new Date('2024-01-20T09:15:00'),
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    details: {
      amount: '1.5 ETH',
      poolId: 'pool_456',
      claimType: 'manual'
    }
  },
  {
    id: 'log_3',
    userId: 'admin_1',
    userEmail: 'john.admin@icm.com',
    action: 'user.create',
    resource: 'admin_3',
    timestamp: new Date('2024-01-20T08:45:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      newUserId: 'admin_3',
      role: 'viewer',
      permissions: ['pools.view', 'analytics.view']
    }
  },
];

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'sec_1',
    type: 'failed_login',
    severity: 'medium',
    description: 'Multiple failed login attempts detected',
    timestamp: new Date('2024-01-20T11:00:00'),
    ipAddress: '203.0.113.42',
    status: 'investigating'
  },
  {
    id: 'sec_2',
    type: 'suspicious_activity',
    severity: 'high',
    description: 'Unusual API access pattern detected',
    timestamp: new Date('2024-01-20T10:45:00'),
    ipAddress: '198.51.100.15',
    status: 'open'
  },
  {
    id: 'sec_3',
    type: 'rate_limit_exceeded',
    severity: 'low',
    description: 'Rate limit exceeded for API endpoint',
    timestamp: new Date('2024-01-20T10:30:00'),
    ipAddress: '192.0.2.146',
    status: 'resolved'
  },
];

const getActionIcon = (action: string) => {
  if (action.includes('login')) return IconLogin;
  if (action.includes('logout')) return IconLogout;
  if (action.includes('create')) return IconDatabase;
  if (action.includes('delete')) return IconTrash;
  if (action.includes('suspend')) return IconUserX;
  if (action.includes('settings')) return IconSettings;
  return IconActivity;
};

const getActionColor = (action: string) => {
  if (action.includes('delete') || action.includes('suspend')) {
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  }
  if (action.includes('create') || action.includes('login')) {
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  }
  if (action.includes('update') || action.includes('edit')) {
    return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  }
  return 'bg-muted/50 text-muted-foreground border-border';
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'high':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'low':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default:
      return 'bg-muted/50 text-muted-foreground border-border';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'resolved':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'investigating':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'open':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-muted/50 text-muted-foreground border-border';
  }
};

export default function SecurityLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('audit');

  const auditColumns = [
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ row }: CellContext<Date>) => {
        const date = row.getValue('timestamp');
        return (
          <div className="flex items-center gap-2">
            <IconClock className="h-3 w-3 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{date.toLocaleTimeString()}</p>
              <p className="text-xs text-muted-foreground">{date.toLocaleDateString()}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }: CellContext<string>) => {
        const action = row.getValue('action');
        const ActionIcon = getActionIcon(action);
        return (
          <Badge variant="outline" className={getActionColor(action)}>
            <ActionIcon className="h-3 w-3 mr-1" />
            {action.replace(/[._]/g, ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'userEmail',
      header: 'IconUser',
      cell: ({ row }: CellContext<string>) => {
        const email = row.getValue('userEmail');
        return (
          <div className="flex items-center gap-2">
            <IconUser className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
      cell: ({ row }: CellContext<string | null>) => {
        const resource = row.getValue('resource');
        return resource ? (
          <code className="text-xs bg-muted px-2 py-1 rounded">{resource}</code>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: ({ row }: CellContext<string>) => {
        const ip = row.getValue('ipAddress');
        return (
          <code className="text-xs">{ip}</code>
        );
      },
    },
    {
      accessorKey: 'details',
      header: 'Details',
      cell: ({ row }: CellContext<Record<string, unknown>>) => {
        const details = row.getValue('details');
        const detailsCount = Object.keys(details).length;
        return detailsCount > 0 ? (
          <Badge variant="outline" className="text-xs">
            <IconFileText className="h-3 w-3 mr-1" />
            {detailsCount} fields
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        );
      },
    },
  ];

  const securityColumns = [
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ row }: SecurityCellContext<Date>) => {
        const date = row.getValue('timestamp');
        return (
          <div className="flex items-center gap-2">
            <IconClock className="h-3 w-3 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{date.toLocaleTimeString()}</p>
              <p className="text-xs text-muted-foreground">{date.toLocaleDateString()}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Event Type',
      cell: ({ row }: SecurityCellContext<string>) => {
        const type = row.getValue('type');
        return (
          <Badge variant="outline" className="text-xs">
            <IconAlertTriangle className="h-3 w-3 mr-1" />
            {type.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }: SecurityCellContext<string>) => {
        const severity = row.getValue('severity');
        return (
          <Badge variant="outline" className={getSeverityColor(severity)}>
            {severity.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }: SecurityCellContext<string>) => (
        <span className="text-sm">{row.getValue('description')}</span>
      ),
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: ({ row }: SecurityCellContext<string>) => (
        <code className="text-xs">{row.getValue('ipAddress')}</code>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: SecurityCellContext<string>) => {
        const status = row.getValue('status');
        return (
          <Badge variant="outline" className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
  ];

  const filteredAuditLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.resource && log.resource.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    
    return matchesSearch && matchesAction;
  });

  const filteredSecurityEvents = mockSecurityEvents.filter(event => {
    const matchesSearch = event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Security & Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor system security and audit trail
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="default">
            <IconDownload className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
              <IconActivity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {mockAuditLogs.length + mockSecurityEvents.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Security Alerts
              </CardTitle>
              <IconShield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {mockSecurityEvents.filter(e => e.status === 'open').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active threats
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Failed Logins
              </CardTitle>
              <IconLock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {mockSecurityEvents.filter(e => e.type === 'failed_login').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Admin Actions
              </CardTitle>
              <IconEye className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {mockAuditLogs.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Today
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="IconSearch logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logs Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">System Logs</CardTitle>
            <CardDescription>
              Comprehensive audit trail and security monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="audit">Audit Logs</TabsTrigger>
                <TabsTrigger value="security">Security Events</TabsTrigger>
              </TabsList>
              <TabsContent value="audit" className="mt-4">
                <DataTable
                  columns={auditColumns}
                  data={filteredAuditLogs}
                  searchKey="userEmail"
                  searchPlaceholder="IconSearch audit logs..."
                />
              </TabsContent>
              <TabsContent value="security" className="mt-4">
                <DataTable
                  columns={securityColumns}
                  data={filteredSecurityEvents}
                  searchKey="description"
                  searchPlaceholder="IconSearch security events..."
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
