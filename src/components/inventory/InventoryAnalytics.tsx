import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, Target } from 'lucide-react';

export function InventoryAnalytics() {
  const categoryData = [
    { category: 'Restorative Materials', value: 35000, percentage: 35, color: '#3b82f6' },
    { category: 'Disposables', value: 18000, percentage: 18, color: '#10b981' },
    { category: 'Instruments', value: 28000, percentage: 28, color: '#f59e0b' },
    { category: 'Pharmaceuticals', value: 12000, percentage: 12, color: '#ef4444' },
    { category: 'Other', value: 7000, percentage: 7, color: '#8b5cf6' }
  ];

  const usageData = [
    { month: 'Jan', usage: 8500, cost: 12000 },
    { month: 'Feb', usage: 9200, cost: 13500 },
    { month: 'Mar', usage: 7800, cost: 11200 },
    { month: 'Apr', usage: 8900, cost: 12800 },
    { month: 'May', usage: 9500, cost: 14000 },
    { month: 'Jun', usage: 8100, cost: 11800 }
  ];

  const turnoverData = [
    { category: 'Restorative Materials', turnover: 4.2, optimal: 4.0, status: 'good' },
    { category: 'Disposables', turnover: 8.5, optimal: 6.0, status: 'high' },
    { category: 'Instruments', turnover: 1.5, optimal: 2.0, status: 'low' },
    { category: 'Pharmaceuticals', turnover: 6.8, optimal: 6.0, status: 'good' }
  ];

  const topUsedItems = [
    { name: 'Disposable Gloves', usage: 2500, cost: 3000, trend: 'up' },
    { name: 'Composite Resin A2', usage: 45, cost: 2025, trend: 'down' },
    { name: 'Local Anesthetic', usage: 120, cost: 1800, trend: 'up' },
    { name: 'Impression Material', usage: 35, cost: 1575, trend: 'stable' }
  ];

  const alerts = [
    { type: 'Overstock', item: 'Amalgam Capsules', message: '150% above optimal level', severity: 'medium' },
    { type: 'Understock', item: 'Suture Material', message: 'Below reorder point', severity: 'high' },
    { type: 'Slow Moving', item: 'Crown Forms', message: 'No usage in 60 days', severity: 'low' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="turnover">Turnover Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$100,000</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$14,000</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2x</div>
                <p className="text-xs text-muted-foreground">
                  Annual turnover rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">12</div>
                <p className="text-xs text-muted-foreground">
                  3 critical, 9 medium
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
                <CardDescription>Distribution of inventory value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ percentage }) => `${percentage}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Used Items */}
            <Card>
              <CardHeader>
                <CardTitle>Top Used Items</CardTitle>
                <CardDescription>Most frequently used inventory items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {getTrendIcon(item.trend)}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.usage} units used
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.cost.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Cost</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Alerts</CardTitle>
              <CardDescription>Items requiring attention for better inventory management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.severity === 'high' ? 'bg-destructive' : 
                        alert.severity === 'medium' ? 'bg-warning' : 'bg-muted'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.item}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                      {alert.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Usage Trends</CardTitle>
              <CardDescription>Track inventory usage and costs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="usage" fill="#3b82f6" name="Usage ($)" />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10b981" name="Cost ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turnover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Turnover Analysis</CardTitle>
              <CardDescription>Compare actual vs optimal turnover rates by category</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Turnover</TableHead>
                    <TableHead>Optimal Turnover</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turnoverData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>{item.turnover}x</TableCell>
                      <TableCell>{item.optimal}x</TableCell>
                      <TableCell>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.status === 'good' ? 'bg-success' :
                              item.status === 'high' ? 'bg-warning' : 'bg-destructive'
                            }`}
                            style={{ width: `${Math.min((item.turnover / item.optimal) * 100, 100)}%` }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === 'good' ? 'default' :
                          item.status === 'high' ? 'secondary' : 'destructive'
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Optimization Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to improve inventory efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Reduce Overstock</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The following items have excess inventory that could be reduced to free up capital.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Amalgam Capsules</span>
                      <span className="text-sm text-muted-foreground">Reduce by 30 units</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Crown Forms</span>
                      <span className="text-sm text-muted-foreground">Reduce by 15 units</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Optimize Reorder Points</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Adjust reorder points based on usage patterns to prevent stockouts.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Local Anesthetic</span>
                      <span className="text-sm text-muted-foreground">Increase reorder point to 25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Disposable Gloves</span>
                      <span className="text-sm text-muted-foreground">Increase reorder point to 150</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Potential Savings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Implementing these optimizations could result in significant cost savings.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-success">$2,500</p>
                      <p className="text-sm text-muted-foreground">Capital Release</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">15%</p>
                      <p className="text-sm text-muted-foreground">Storage Reduction</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">$500</p>
                      <p className="text-sm text-muted-foreground">Monthly Savings</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}