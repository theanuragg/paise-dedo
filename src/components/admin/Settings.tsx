'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Check,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Settings() {
  const [platformFee, setPlatformFee] = useState('0.25');
  const [creatorFee, setCreatorFee] = useState('0.75');
  const [maxSlippage, setMaxSlippage] = useState('5');
  const [minTradeAmount, setMinTradeAmount] = useState('0.01');
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="min-h-screen - space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Platform Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Configure platform parameters and settings
          </p>
        </div>
  
      </div>

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="platform-name" className="text-gray-300">Platform Name</Label>
                      <Input
                        id="platform-name"
                        defaultValue="ICM Launchpad"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="platform-description" className="text-gray-300">Description</Label>
                      <Textarea
                        id="platform-description"
                        defaultValue="Advanced token launchpad platform"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-slippage" className="text-gray-300">Max Slippage (%)</Label>
                      <Input
                        id="max-slippage"
                        type="number"
                        value={maxSlippage}
                        onChange={(e) => setMaxSlippage(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="min-trade" className="text-gray-300">Min Trade Amount (SOL)</Label>
                      <Input
                        id="min-trade"
                        type="number"
                        step="0.001"
                        value={minTradeAmount}
                        onChange={(e) => setMinTradeAmount(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Maintenance Mode</Label>
                        <p className="text-xs text-gray-500">
                          Temporarily disable platform operations
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">New Pool Creation</Label>
                        <p className="text-xs text-gray-500">
                          Allow users to create new pools
                        </p>
                      </div>
                      <Switch checked={true} onCheckedChange={() => {}} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fees" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="platform-fee" className="text-gray-300">Platform Fee (%)</Label>
                      <Input
                        id="platform-fee"
                        type="number"
                        step="0.01"
                        value={platformFee}
                        onChange={(e) => setPlatformFee(e.target.value)}
      
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Percentage of trading fees collected by platform
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="creator-fee" className="text-gray-300">Creator Fee (%)</Label>
                      <Input
                        id="creator-fee"
                        type="number"
                        step="0.01"
                        value={creatorFee}
                        onChange={(e) => setCreatorFee(e.target.value)}
                        
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Percentage of trading fees paid to pool creators
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-300">Fee Distribution Preview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Platform:</span>
                          <span className="text-white">{platformFee}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Creator:</span>
                          <span className="text-white">{creatorFee}%</span>
                        </div>
                        <Separator className="bg-gray-700" />
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-300">Total:</span>
                          <span className="text-white">{(parseFloat(platformFee) + parseFloat(creatorFee)).toFixed(2)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Two-Factor Authentication</Label>
                        <p className="text-xs text-gray-500">
                          Require 2FA for admin actions
                        </p>
                      </div>
                      <Switch checked={true} onCheckedChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">IP Whitelist</Label>
                        <p className="text-xs text-gray-500">
                          Restrict admin access to specific IPs
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Session Timeout</Label>
                        <p className="text-xs text-gray-500">
                          Auto-logout after inactivity
                        </p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent >
                          <SelectItem value="15">15m</SelectItem>
                          <SelectItem value="30">30m</SelectItem>
                          <SelectItem value="60">1h</SelectItem>
                          <SelectItem value="120">2h</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle >
                          <Shield className="h-4 w-4 mr-2" />
                          Security Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">SSL Certificate</span>
                          <Badge className="bg-emerald-500/20 text-emerald-300">
                            <Check className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Firewall</span>
                          <Badge className="bg-emerald-500/20 text-emerald-300">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Rate Limiting</span>
                          <Badge className="bg-emerald-500/20 text-emerald-300">
                            <Check className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Email Notifications</Label>
                        <p className="text-xs text-gray-500">
                          Send email alerts for important events
                        </p>
                      </div>
                      <Switch checked={true} onCheckedChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">High Volume Alerts</Label>
                        <p className="text-xs text-gray-500">
                          Alert when trading volume exceeds threshold
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">Security Alerts</Label>
                        <p className="text-xs text-gray-500">
                          Immediate notification of security events
                        </p>
                      </div>
                      <Switch checked={true} onCheckedChange={() => {}} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="admin-email" className="text-gray-300">Admin Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        defaultValue="admin@example.com"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="volume-threshold" className="text-gray-300">Volume Alert Threshold ($)</Label>
                      <Input
                        id="volume-threshold"
                        type="number"
                        defaultValue="100000"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="api" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">API Key</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value="sk_live_51H4JjkFZm9..."
                          readOnly
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-cyan-400 hover:border-cyan-400"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">API Access</Label>
                        <p className="text-xs text-gray-500">
                          Enable external API access
                        </p>
                      </div>
                      <Switch checked={true} onCheckedChange={() => {}} />
                    </div>
                    <div>
                      <Label className="text-gray-300">Rate Limit (requests/minute)</Label>
                      <Select defaultValue="100">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Card >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-300">API Usage (Last 24h)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Requests:</span>
                          <span className="text-white">12,847</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Unique IPs:</span>
                          <span className="text-white">234</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Errors:</span>
                          <span className="text-red-400">12 (0.09%)</span>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" >
                        Regenerate Key
                      </Button>
                      <Button variant="outline" size="sm">
                            View Logs
                      </Button>
                    </div>
                  </div>
                </div>  
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-end gap-3"
      >
        <Button variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </motion.div>
    </div>
  );
}
