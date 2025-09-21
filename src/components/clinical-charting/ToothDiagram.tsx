import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  ToothCondition, 
  ToothConditionData, 
  DentalNotation, 
  ADULT_TEETH_FDI, 
  ADULT_TEETH_UNIVERSAL, 
  PEDIATRIC_TEETH_FDI,
  CONDITION_COLORS 
} from '@/types/clinical-charting';

interface ToothDiagramProps {
  type: 'adult' | 'pediatric';
  notation: DentalNotation;
  conditions: ToothConditionData[];
  onToothClick: (toothNumber: string) => void;
  onConditionUpdate: (toothNumber: string, condition: ToothCondition) => void;
  selectedTooth?: string;
  className?: string;
}

export function ToothDiagram({ 
  type, 
  notation, 
  conditions, 
  onToothClick, 
  onConditionUpdate, 
  selectedTooth,
  className = "" 
}: ToothDiagramProps) {
  const [zoom, setZoom] = useState(1);
  const [showConditions, setShowConditions] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const getTeethNumbers = () => {
    if (type === 'pediatric') return PEDIATRIC_TEETH_FDI;
    return notation === 'universal' ? ADULT_TEETH_UNIVERSAL : ADULT_TEETH_FDI;
  };

  const getToothCondition = (toothNumber: string): ToothConditionData | undefined => {
    return conditions.find(c => c.toothNumber === toothNumber);
  };

  const getToothColor = (toothNumber: string): string => {
    const condition = getToothCondition(toothNumber);
    if (!condition || !showConditions) return '#f8fafc'; // slate-50
    return CONDITION_COLORS[condition.condition];
  };

  const getToothPosition = (toothNumber: string, index: number) => {
    const teeth = getTeethNumbers();
    const totalTeeth = teeth.length;
    const isUpperJaw = type === 'adult' ? index < 16 : index < 10;
    
    // Calculate position in a dental arch
    const archIndex = isUpperJaw ? index : index - (totalTeeth / 2);
    const centerX = 400;
    const centerY = 300;
    const radiusX = 280;
    const radiusY = 120;
    
    // Calculate angle for arch positioning
    const teethPerArch = totalTeeth / 2;
    const angleStep = Math.PI / (teethPerArch - 1);
    const angle = archIndex * angleStep;
    
    const x = centerX + radiusX * Math.cos(angle) * (isUpperJaw ? -1 : 1);
    const y = centerY + radiusY * Math.sin(angle) * (isUpperJaw ? -1 : 1);
    
    return { x, y };
  };

  const renderTooth = (toothNumber: string, index: number) => {
    const { x, y } = getToothPosition(toothNumber, index);
    const color = getToothColor(toothNumber);
    const condition = getToothCondition(toothNumber);
    const isSelected = selectedTooth === toothNumber;
    
    return (
      <g key={toothNumber} className="tooth-group">
        {/* Tooth shape */}
        <rect
          x={x - 15}
          y={y - 20}
          width={30}
          height={40}
          rx={8}
          ry={8}
          fill={color}
          stroke={isSelected ? '#2563eb' : '#94a3b8'}
          strokeWidth={isSelected ? 3 : 1}
          className="cursor-pointer transition-all duration-200 hover:stroke-primary hover:stroke-2"
          onClick={() => onToothClick(toothNumber)}
        />
        
        {/* Tooth number */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="text-xs font-medium fill-slate-700 pointer-events-none"
        >
          {toothNumber}
        </text>
        
        {/* Condition indicator */}
        {condition && showConditions && (
          <circle
            cx={x + 12}
            cy={y - 15}
            r={6}
            fill={CONDITION_COLORS[condition.condition]}
            stroke="white"
            strokeWidth={2}
            className="pointer-events-none"
          />
        )}
      </g>
    );
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {type} Chart
          </Badge>
          <Badge variant="outline" className="uppercase">
            {notation} Notation
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConditions(!showConditions)}
          >
            {showConditions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="p-4">
        <div className="overflow-auto max-h-[600px]">
          <svg
            ref={svgRef}
            width="800"
            height="600"
            viewBox="0 0 800 600"
            className="w-full h-auto"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Background */}
            <rect width="800" height="600" fill="#fafafa" />
            
            {/* Upper and Lower jaw guides */}
            <text x="400" y="50" textAnchor="middle" className="text-lg font-semibold fill-slate-600">
              Upper Jaw
            </text>
            <text x="400" y="550" textAnchor="middle" className="text-lg font-semibold fill-slate-600">
              Lower Jaw
            </text>
            
            {/* Center line */}
            <line x1="400" y1="100" x2="400" y2="500" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5,5" />
            
            {/* Render teeth */}
            {getTeethNumbers().map((toothNumber, index) => renderTooth(toothNumber, index))}
          </svg>
        </div>
      </div>

      {/* Legend */}
      {showConditions && (
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium mb-3">Condition Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Object.entries(CONDITION_COLORS).map(([condition, color]) => (
              <div key={condition} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs capitalize">{condition.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}