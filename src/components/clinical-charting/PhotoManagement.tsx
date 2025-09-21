import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Eye,
  Download,
  Trash2,
  Edit,
  Plus,
  ArrowLeftRight,
  Maximize2,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ClinicalAttachment } from '@/types/clinical-charting';

interface PhotoManagementProps {
  photos: ClinicalAttachment[];
  onAddPhoto: (photo: Omit<ClinicalAttachment, 'id'>) => void;
  onUpdatePhoto: (id: string, updates: Partial<ClinicalAttachment>) => void;
  onDeletePhoto: (id: string) => void;
  patientName: string;
}

export function PhotoManagement({
  photos,
  onAddPhoto,
  onUpdatePhoto,
  onDeletePhoto,
  patientName
}: PhotoManagementProps) {
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ClinicalAttachment | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<[ClinicalAttachment?, ClinicalAttachment?]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const newPhoto: Omit<ClinicalAttachment, 'id'> = {
          type: 'photo',
          filename: file.name,
          url,
          capturedDate: new Date(),
          annotations: []
        };
        onAddPhoto(newPhoto);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsAddingPhoto(false);
  };

  const groupedPhotos = photos.reduce((acc, photo) => {
    const date = format(photo.capturedDate, 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, ClinicalAttachment[]>);

  const sortedDates = Object.keys(groupedPhotos).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Photo Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage clinical photos, X-rays, and documentation for {patientName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setComparisonMode(!comparisonMode)}
            className={comparisonMode ? 'bg-primary text-primary-foreground' : ''}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Compare Mode
          </Button>
          <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Photos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Clinical Photos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-32 flex-col"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mb-2" />
                    Upload Files
                  </Button>
                  <Button
                    variant="outline"
                    className="h-32 flex-col"
                    onClick={() => {
                      // TODO: Implement camera capture
                      console.log('Camera capture not implemented');
                    }}
                  >
                    <Camera className="h-8 w-8 mb-2" />
                    Take Photo
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Supported formats: JPEG, PNG, DICOM
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Comparison Mode */}
      {comparisonMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photo Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Before Photo</Label>
                <Select
                  value={comparePhotos[0]?.id || ''}
                  onValueChange={(value) => {
                    const photo = photos.find(p => p.id === value);
                    setComparePhotos([photo, comparePhotos[1]]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select before photo" />
                  </SelectTrigger>
                  <SelectContent>
                    {photos.map(photo => (
                      <SelectItem key={photo.id} value={photo.id}>
                        {photo.filename} - {format(photo.capturedDate, 'MMM dd, yyyy')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {comparePhotos[0] && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={comparePhotos[0].url}
                      alt="Before"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>After Photo</Label>
                <Select
                  value={comparePhotos[1]?.id || ''}
                  onValueChange={(value) => {
                    const photo = photos.find(p => p.id === value);
                    setComparePhotos([comparePhotos[0], photo]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select after photo" />
                  </SelectTrigger>
                  <SelectContent>
                    {photos.map(photo => (
                      <SelectItem key={photo.id} value={photo.id}>
                        {photo.filename} - {format(photo.capturedDate, 'MMM dd, yyyy')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {comparePhotos[1] && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={comparePhotos[1].url}
                      alt="After"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Gallery */}
      <div className="space-y-6">
        {photos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">No Photos Yet</h4>
              <p className="text-muted-foreground text-center mb-6">
                Upload clinical photos, X-rays, or other documentation to start building the patient's visual record.
              </p>
              <Button onClick={() => setIsAddingPhoto(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Photo
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">{format(new Date(date), 'MMMM dd, yyyy')}</h4>
                <Badge variant="secondary">{groupedPhotos[date].length} photos</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedPhotos[date].map(photo => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={photo.url}
                        alt={photo.filename}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedPhoto(photo)}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {photo.type.toUpperCase()}
                        </Badge>
                      </div>
                      {comparisonMode && (
                        <div className="absolute top-2 left-2 flex gap-1">
                          <Button
                            size="sm"
                            variant={comparePhotos[0]?.id === photo.id ? "default" : "outline"}
                            onClick={() => setComparePhotos([photo, comparePhotos[1]])}
                          >
                            Before
                          </Button>
                          <Button
                            size="sm"
                            variant={comparePhotos[1]?.id === photo.id ? "default" : "outline"}
                            onClick={() => setComparePhotos([comparePhotos[0], photo])}
                          >
                            After
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h5 className="font-medium text-sm truncate" title={photo.filename}>
                        {photo.filename}
                      </h5>
                      {photo.caption && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {photo.caption}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {format(photo.capturedDate, 'HH:mm')}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onDeletePhoto(photo.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Photo Preview Dialog */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedPhoto.filename}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.filename}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="photo-caption">Caption</Label>
                  <Textarea
                    id="photo-caption"
                    value={selectedPhoto.caption || ''}
                    onChange={(e) => 
                      onUpdatePhoto(selectedPhoto.id, { caption: e.target.value })
                    }
                    placeholder="Add a caption for this photo"
                  />
                </div>
                <div>
                  <Label>Photo Details</Label>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {selectedPhoto.type}
                    </div>
                    <div>
                      <span className="font-medium">Captured:</span> {format(selectedPhoto.capturedDate, 'PPP')}
                    </div>
                    <div>
                      <span className="font-medium">Filename:</span> {selectedPhoto.filename}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Annotate
                </Button>
                <Button onClick={() => setSelectedPhoto(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}