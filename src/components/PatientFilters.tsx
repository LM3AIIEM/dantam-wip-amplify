import { PatientFilters } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Download, MessageSquare, Users, RotateCcw } from 'lucide-react';

interface PatientFiltersProps {
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export function PatientFilters({ 
  filters, 
  onFiltersChange, 
  selectedCount,
  onBulkAction 
}: PatientFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    // Convert "all" back to empty string for filtering logic
    onFiltersChange({ ...filters, status: value === 'all' ? '' : value });
  };

  const handleDateStartChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      dateRange: { ...filters.dateRange, start: value } 
    });
  };

  const handleDateEndChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      dateRange: { ...filters.dateRange, end: value } 
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      dateRange: { start: '', end: '' }
    });
  };

  return (
    <Card className="bg-surface border shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search and Basic Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, ID, or phone..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 medical-input"
              />
            </div>
            
            <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full md:w-48 medical-input">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="discharged">Discharged</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Last Visit From:
              </label>
              <Input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateStartChange(e.target.value)}
                className="medical-input"
              />
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Last Visit To:
              </label>
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateEndChange(e.target.value)}
                className="medical-input"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Users className="h-4 w-4" />
                {selectedCount} patient{selectedCount !== 1 ? 's' : ''} selected
              </div>
              
              <div className="flex gap-2 ml-auto">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onBulkAction('export')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onBulkAction('message')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                
                <Select onValueChange={onBulkAction}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status-active">Set Active</SelectItem>
                    <SelectItem value="status-inactive">Set Inactive</SelectItem>
                    <SelectItem value="status-pending">Set Pending</SelectItem>
                    <SelectItem value="status-discharged">Set Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}