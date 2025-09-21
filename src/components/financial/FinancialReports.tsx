import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const profitLossData = [
  { category: 'Revenue', amount: 125000, percentage: 100 },
  { category: 'Cost of Goods', amount: -35000, percentage: -28 },
  { category: 'Operating Expenses', amount: -45000, percentage: -36 },
  { category: 'Net Income', amount: 45000, percentage: 36 },
];

const treatmentCategoryData = [
  { name: 'Preventive', value: 35, amount: 43750, color: 'hsl(var(--primary))' },
  { name: 'Restorative', value: 40, amount: 50000, color: 'hsl(var(--secondary))' },
  { name: 'Surgical', value: 15, amount: 18750, color: 'hsl(var(--accent))' },
  { name: 'Orthodontic', value: 10, amount: 12500, color: 'hsl(var(--muted))' },
];

const providerProductivityData = [
  { provider: 'Dr. Smith', patients: 85, revenue: 45000, rvu: 120 },
  { provider: 'Dr. Johnson', patients: 78, revenue: 42000, rvu: 115 },
  { provider: 'Dr. Williams', patients: 92, revenue: 48000, rvu: 125 },
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 58000, expenses: 36000, profit: 22000 },
  { month: 'Jun', revenue: 67000, expenses: 40000, profit: 27000 },
];

export function FinancialReports() {
  const [selectedReport, setSelectedReport] = useState('profit_loss');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-06-30'
  });

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'profit_loss':
        return <ProfitLossReport data={profitLossData} />;
      case 'productivity':
        return <ProductivityReport data={providerProductivityData} />;
      case 'treatment_analysis':
        return <TreatmentAnalysisReport data={treatmentCategoryData} />;
      case 'cash_flow':
        return <CashFlowReport data={monthlyRevenueData} />;
      default:
        return <ProfitLossReport data={profitLossData} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit_loss">Profit & Loss</SelectItem>
                  <SelectItem value="productivity">Provider Productivity</SelectItem>
                  <SelectItem value="treatment_analysis">Treatment Analysis</SelectItem>
                  <SelectItem value="cash_flow">Cash Flow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                type="date" 
                id="startDate" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                type="date" 
                id="endDate" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
}

function ProfitLossReport({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Statement</CardTitle>
        <p className="text-sm text-muted-foreground">January 1, 2024 - June 30, 2024</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">% of Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} className={item.category === 'Net Income' ? 'font-semibold bg-muted/50' : ''}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className={`text-right ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(Math.abs(item.amount))}
                  </TableCell>
                  <TableCell className="text-right">{item.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(125000)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Net Profit Margin</p>
                    <p className="text-2xl font-bold">36%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Avg Monthly Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(20833)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductivityReport({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Productivity Report</CardTitle>
        <p className="text-sm text-muted-foreground">Performance metrics by provider</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Patients Seen</TableHead>
              <TableHead>Revenue Generated</TableHead>
              <TableHead>RVU Points</TableHead>
              <TableHead>Avg Revenue per Patient</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((provider, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{provider.provider}</TableCell>
                <TableCell>{provider.patients}</TableCell>
                <TableCell>{formatCurrency(provider.revenue)}</TableCell>
                <TableCell>{provider.rvu}</TableCell>
                <TableCell>{formatCurrency(provider.revenue / provider.patients)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TreatmentAnalysisReport({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Category Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Revenue breakdown by treatment type</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [
                `${value}% (${formatCurrency(props.payload.amount)})`,
                name
              ]} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(item.amount)}</div>
                  <div className="text-sm text-muted-foreground">{item.value}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CashFlowReport({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Monthly revenue, expenses, and profit trends</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
            <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
            <Bar dataKey="profit" fill="hsl(var(--secondary))" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}