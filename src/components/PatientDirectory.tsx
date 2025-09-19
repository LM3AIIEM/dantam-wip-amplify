import { useState, useMemo } from 'react';
import { Patient, PatientFilters, ViewMode, SortField, SortDirection } from '@/types/patient';
import { mockPatients } from '@/data/mockPatients';
import { PatientCard } from '@/components/PatientCard';
import { PatientTable } from '@/components/PatientTable';
import { PatientFiltersComponent } from '@/components/PatientFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const PatientDirectory = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<PatientFilters>({
    search: '',
    status: '',
    dateRange: { start: '', end: '' }
  });

  // Filter and sort patients
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = mockPatients.filter(patient => {
      const matchesSearch = !filters.search || 
        patient.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        patient.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        patient.phone.includes(filters.search);
      
      const matchesStatus = !filters.status || patient.status === filters.status;
      
      const matchesDateRange = (!filters.dateRange.start || patient.lastVisit >= filters.dateRange.start) &&
        (!filters.dateRange.end || patient.lastVisit <= filters.dateRange.end);
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];
      
      if (sortField === 'lastVisit') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPatients.length / itemsPerPage);
  const paginatedPatients = filteredAndSortedPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    const total = mockPatients.length;
    const active = mockPatients.filter(p => p.status === 'active').length;
    const pending = mockPatients.filter(p => p.status === 'pending').length;
    const recentVisits = mockPatients.filter(p => {
      const lastVisit = new Date(p.lastVisit);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastVisit >= weekAgo;
    }).length;

    return { total, active, pending, recentVisits };
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedPatients(selected ? paginatedPatients.map(p => p.id) : []);
  };

  const handleBulkAction = (action: string) => {
    const count = selectedPatients.length;
    switch (action) {
      case 'export':
        toast({
          title: 'Export Started',
          description: `Exporting ${count} patient records...`,
        });
        break;
      case 'message':
        toast({
          title: 'Messaging',
          description: `Opening message composer for ${count} patients...`,
        });
        break;
      default:
        if (action.startsWith('status-')) {
          const newStatus = action.replace('status-', '');
          toast({
            title: 'Status Updated',
            description: `Updated status to ${newStatus} for ${count} patients.`,
          });
        }
    }
    setSelectedPatients([]);
  };

  const addPatient = () => {
    toast({
      title: 'Add Patient',
      description: 'Opening new patient registration form...',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Patient Directory</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all patient records in your healthcare system
            </p>
          </div>
          
          <Button 
            onClick={addPatient}
            className="medical-button-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-surface border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Activity className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">Active Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.recentVisits}</p>
                  <p className="text-sm text-muted-foreground">Recent Visits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <PatientFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          selectedCount={selectedPatients.length}
          onBulkAction={handleBulkAction}
        />

        {/* View Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Cards
              </Button>
            </div>

            <Badge variant="outline" className="text-sm">
              {filteredAndSortedPatients.length} patient{filteredAndSortedPatients.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Patient List */}
        {viewMode === 'table' ? (
          <PatientTable
            patients={paginatedPatients}
            selectedPatients={selectedPatients}
            onSelectPatient={handleSelectPatient}
            onSelectAll={handleSelectAll}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                selected={selectedPatients.includes(patient.id)}
                onSelect={handleSelectPatient}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedPatients.length)} of {filteredAndSortedPatients.length} results
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};