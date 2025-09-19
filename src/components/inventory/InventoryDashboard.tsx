import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Package, TrendingUp, DollarSign, Calendar, Wrench } from 'lucide-react';

interface InventoryDashboardProps {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  expiringItems: number;
  pendingOrders: number;
  maintenanceDue: number;
}

export function InventoryDashboard({
  totalValue,
  totalItems,
  lowStockItems,
  expiringItems,
  pendingOrders,
  maintenanceDue
}: InventoryDashboardProps) {
  const alerts = [
    { id: 1, type: 'Low Stock', item: 'Composite Resin A2', severity: 'high' },
    { id: 2, type: 'Expiring', item: 'Local Anesthetic', severity: 'medium' },
    { id: 3, type: 'Maintenance', item: 'Ultrasonic Scaler', severity: 'high' }
  ];

  const recentActivity = [
    { id: 1, action: 'Received', item: 'Disposable Gloves', quantity: 500, time: '2 hours ago' },
    { id: 2, action: 'Used', item: 'Amalgam Capsules', quantity: 5, time: '4 hours ago' },
    { id: 3, action: 'Ordered', item: 'Impression Material', quantity: 10, time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Across {12} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{expiringItems}</div>
            <p className="text-xs text-muted-foreground">
              Within next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.severity === 'high' ? 'bg-destructive' : 
                      alert.severity === 'medium' ? 'bg-warning' : 'bg-muted'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{alert.item}</p>
                      <p className="text-xs text-muted-foreground">{alert.type}</p>
                    </div>
                  </div>
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest inventory movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{activity.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action} {activity.quantity} units
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
          <CardDescription>Distribution of inventory value across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: 'Restorative Materials', value: 15000, percentage: 35 },
              { category: 'Disposables', value: 8000, percentage: 18 },
              { category: 'Instruments', value: 12000, percentage: 28 },
              { category: 'Pharmaceuticals', value: 5000, percentage: 12 },
              { category: 'Other', value: 3000, percentage: 7 }
            ].map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span className="font-medium">${item.value.toLocaleString()}</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}