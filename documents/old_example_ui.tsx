import React, { useState } from 'react';
import { Settings, Play, Save, Upload, X, Database, Cloud, Calendar, Check, Info, ChevronDown, ChevronRight, Eye, AlertCircle, AlertTriangle, Loader, GripVertical, Copy, Trash2, Plus, Target, Droplet, FileText, Undo, Redo, Home, MoreVertical } from 'lucide-react';

// Custom Grid icon component
const GridIcon = ({ className, style }) => (
  <svg className={className} style={style} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

// Design System Colors from 250729_c3rro-visual-design-system.tsx
const colors = {
  text: '#33302F',
  greydark: '#5E5A58',
  grey: '#BDB2AA',
  greylight: '#D9D8CD',
  bluegreen: '#4AB79F',
  blue: '#4597BF',
  bluedark: '#407188',
  bluelight: '#93D2E1',
  red: '#C04343',
  orange: '#E18E2A',
  yellow: '#F8C36E',
  yellowlight: '#FEF4DC',
  greendark: '#205959',
  green: '#3E7263',
  greenlight: '#89A767',
  yellowgreen: '#B1B52E',
  white: '#FFFFFF'
};

// Design System Spacing
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem'
};

// Design System Shadows
const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
};

// Design System Border Radius
const radius = {
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem'
};

const WUFICloudEditor = () => {
  const [activeView, setActiveView] = useState('setup');
  const [selectedCase, setSelectedCase] = useState(1);
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(4);
  const [selectedElement, setSelectedElement] = useState({ type: 'layer', id: 4 });
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showClimateModal, setShowClimateModal] = useState(null);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [showStatusDetails, setShowStatusDetails] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [projectInfoCollapsed, setProjectInfoCollapsed] = useState(true);
  const [advancedSettingsCollapsed, setAdvancedSettingsCollapsed] = useState(true);
  const [draggedLayer, setDraggedLayer] = useState(null);

  const [simulationStatus, setSimulationStatus] = useState({
    state: 'ready',
    message: 'Ready to run simulation',
    issues: [
      { type: 'warning', message: 'No monitors defined - results will be limited to summary data' }
    ]
  });

  // Cases (iterations) for the project
  const cases = [
    { id: 1, name: 'Base Case', description: 'Original exterior wall design', status: 'completed' },
    { id: 2, name: 'Increased Insulation', description: 'Add 50mm mineral wool', status: 'ready' },
    { id: 3, name: 'Vapor Barrier Test', description: 'PE membrane variant', status: 'draft' }
  ];

  const assembly = {
    name: "Exterior Wall - Chicago",
    layers: [
      { id: 1, name: "Brick (old)", material: "Clay Brick", thickness: 0.104, lambda: 0.7, initTemp: 10, initRH: 80, color: "#8B1A1A", gridCells: 42 },
      { id: 2, name: "Air Gap", material: "Air Layer 25mm", thickness: 0.025, lambda: 0.6, initTemp: 12, initRH: 75, color: "#87CEEB", gridCells: 10 },
      { id: 3, name: "Sheathing", material: "OSB", thickness: 0.0125, lambda: 0.13, initTemp: 15, initRH: 70, color: "#8B7355", gridCells: 5 },
      { id: 4, name: "Insulation", material: "Mineral Wool", thickness: 0.089, lambda: 0.04, initTemp: 18, initRH: 60, color: "#FFE87C", gridCells: 36 },
      { id: 5, name: "Gypsum", material: "Gypsum Board (USA)", thickness: 0.0125, lambda: 0.16, initTemp: 20, initRH: 50, color: "#4682B4", gridCells: 5 }
    ],
    surfaces: {
      exterior: { heatResistance: 0.0588, sdValue: 0, absorptivity: 0.6, rainCoeff: 0.7 },
      interior: { heatResistance: 0.125, sdValue: 0, absorptivity: 0.3 }
    },
    monitors: [
      { id: 'm1', name: 'Interface Brick-Air', layerId: 1, position: 1.0, variables: ['temperature', 'relativeHumidity'] },
      { id: 'm2', name: 'Mid Insulation', layerId: 4, position: 0.5, variables: ['temperature', 'relativeHumidity', 'waterContent'] }
    ],
    sources: [],
    exterior: { climate: "Nashville, TN (cold year)", type: "location", heatResistance: 0.0588, rainCoeff: 0.7 },
    interior: { climate: "EN 15026 Residential", type: "standard", heatResistance: 0.125, derivedFrom: "Nashville, TN" }
  };

  const totalThickness = assembly.layers.reduce((sum, l) => sum + l.thickness, 0);
  const uValue = 0.3;
  const totalGridCells = assembly.layers.reduce((sum, l) => sum + l.gridCells, 0);
  const selectedLayerData = assembly.layers.find(l => l.id === selectedLayer);
  const selectedMonitor = assembly.monitors.find(m => m.id === selectedElement.id);
  const currentCase = cases.find(c => c.id === selectedCase);

  const getStatusIcon = () => {
    switch (simulationStatus.state) {
      case 'ready': return <Check className="w-4 h-4" />;
      case 'warnings': return <AlertTriangle className="w-4 h-4" />;
      case 'errors': return <AlertCircle className="w-4 h-4" />;
      case 'running': return <Loader className="w-4 h-4 animate-spin" />;
      case 'completed': return <Check className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (simulationStatus.state) {
      case 'ready': return colors.greenlight;
      case 'warnings': return colors.orange;
      case 'errors': return colors.red;
      case 'running': return colors.blue;
      case 'completed': return colors.greenlight;
      default: return colors.greydark;
    }
  };

  const getCaseStatusBadge = (status) => {
    const styles = {
      completed: { bg: `${colors.greenlight}20`, color: colors.greenlight, text: 'Completed' },
      ready: { bg: `${colors.bluegreen}20`, color: colors.bluegreen, text: 'Ready' },
      draft: { bg: `${colors.grey}20`, color: colors.greydark, text: 'Draft' }
    };
    const style = styles[status] || styles.draft;
    return (
      <span style={{ 
        padding: `${spacing.xs} ${spacing.sm}`, 
        backgroundColor: style.bg, 
        color: style.color, 
        borderRadius: radius.md, 
        fontSize: '0.75rem', 
        fontWeight: 600,
        fontFamily: 'Lato, sans-serif'
      }}>
        {style.text}
      </span>
    );
  };

  const handleLayerDragStart = (e, layerId) => {
    setDraggedLayer(layerId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLayerDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleLayerDrop = (e, targetLayerId) => {
    e.preventDefault();
    console.log(`Move layer ${draggedLayer} to position of layer ${targetLayerId}`);
    setDraggedLayer(null);
  };

  const getMonitorPosition = (monitor) => {
    const layer = assembly.layers.find(l => l.id === monitor.layerId);
    const layerIndex = assembly.layers.findIndex(l => l.id === monitor.layerId);
    const previousThickness = assembly.layers.slice(0, layerIndex).reduce((sum, l) => sum + l.thickness, 0);
    const positionInLayer = layer.thickness * monitor.position;
    const totalPosition = previousThickness + positionInLayer;
    return (totalPosition / totalThickness) * 100;
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#f9fafb', fontFamily: 'Lato, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: 'Jost', sans-serif; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ backgroundColor: colors.white, borderColor: colors.greylight }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div style={{ fontFamily: 'Jost', fontSize: '1.5rem', fontWeight: 700, color: colors.bluegreen }}>C3RRO</div>
            <div style={{ height: '1.5rem', width: '1px', backgroundColor: colors.greylight }}></div>
            
            {/* Project Name + Case Selector */}
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={assembly.name} 
                style={{ 
                  fontFamily: 'Jost', 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  border: 'none', 
                  outline: 'none', 
                  backgroundColor: 'transparent', 
                  color: colors.text,
                  minWidth: '250px'
                }} 
              />
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowCaseMenu(!showCaseMenu)}
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    backgroundColor: `${colors.bluegreen}15`,
                    border: `1px solid ${colors.bluegreen}`,
                    borderRadius: radius.lg,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.bluegreen,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    fontFamily: 'Lato, sans-serif'
                  }}
                >
                  Case {selectedCase}: {currentCase?.name}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showCaseMenu && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.5rem)',
                      left: 0,
                      backgroundColor: colors.white,
                      border: `1px solid ${colors.greylight}`,
                      borderRadius: radius.xl,
                      boxShadow: shadows.lg,
                      minWidth: '320px',
                      zIndex: 50
                    }}
                  >
                    <div style={{ padding: spacing.md, borderBottom: `1px solid ${colors.greylight}` }}>
                      <div style={{ fontFamily: 'Jost', fontSize: '0.875rem', fontWeight: 600, color: colors.text }}>
                        Select Case
                      </div>
                    </div>
                    {cases.map((caseItem) => (
                      <div
                        key={caseItem.id}
                        onClick={() => {
                          setSelectedCase(caseItem.id);
                          setShowCaseMenu(false);
                        }}
                        style={{
                          padding: spacing.md,
                          cursor: 'pointer',
                          backgroundColor: selectedCase === caseItem.id ? `${colors.bluegreen}08` : 'transparent',
                          borderBottom: `1px solid ${colors.greylight}`,
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCase !== caseItem.id) e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCase !== caseItem.id) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.text }}>
                            Case {caseItem.id}: {caseItem.name}
                          </div>
                          {getCaseStatusBadge(caseItem.status)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: colors.greydark }}>
                          {caseItem.description}
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: spacing.md }}>
                      <button
                        style={{
                          width: '100%',
                          padding: `${spacing.sm} ${spacing.md}`,
                          backgroundColor: colors.white,
                          border: `1px solid ${colors.bluegreen}`,
                          borderRadius: radius.lg,
                          color: colors.bluegreen,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: spacing.sm
                        }}
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate Current Case
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDatabaseModal(true)}
              style={{ 
                padding: `${spacing.sm} ${spacing.md}`, 
                border: `1px solid ${colors.greylight}`, 
                borderRadius: radius.lg, 
                backgroundColor: colors.white, 
                fontSize: '0.875rem', 
                fontWeight: 500,
                display: 'flex', 
                alignItems: 'center', 
                gap: spacing.sm, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: colors.text
              }}
            >
              <Database className="w-4 h-4" />Material Database
            </button>
            <button style={{ padding: spacing.sm, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, backgroundColor: colors.white, cursor: 'pointer' }}>
              <Undo className="w-4 h-4" style={{ color: colors.greydark }} />
            </button>
            <button style={{ padding: spacing.sm, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, backgroundColor: colors.white, cursor: 'pointer', opacity: 0.5 }}>
              <Redo className="w-4 h-4" style={{ color: colors.greydark }} />
            </button>
            <button style={{ padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, backgroundColor: colors.white, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer', color: colors.text }}>
              <Upload className="w-4 h-4" />Import
            </button>
            <button style={{ padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, backgroundColor: colors.white, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer', color: colors.text }}>
              <Save className="w-4 h-4" />Save
            </button>
            <button 
              disabled={simulationStatus.state === 'errors' || simulationStatus.state === 'running'}
              style={{ 
                padding: `${spacing.sm} ${spacing.lg}`, 
                backgroundColor: simulationStatus.state === 'errors' || simulationStatus.state === 'running' ? colors.grey : colors.bluegreen, 
                color: colors.white, 
                borderRadius: radius.lg, 
                border: 'none', 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                gap: spacing.sm, 
                cursor: simulationStatus.state === 'errors' || simulationStatus.state === 'running' ? 'not-allowed' : 'pointer', 
                boxShadow: shadows.sm,
                opacity: simulationStatus.state === 'errors' || simulationStatus.state === 'running' ? 0.6 : 1
              }}
            >
              <Play className="w-4 h-4" />Run Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div 
        className="px-6 py-3 border-b cursor-pointer"
        style={{ backgroundColor: `${getStatusColor()}15`, borderColor: colors.greylight }}
        onClick={() => setShowStatusDetails(!showStatusDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: getStatusColor(), fontWeight: 600, fontSize: '0.875rem' }}>
              {getStatusIcon()}
              Status: {simulationStatus.message}
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.greydark }}>
              {assembly.layers.length} layers • {assembly.monitors.length} monitors • {totalGridCells} grid cells
            </div>
          </div>
          {simulationStatus.issues.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: '0.75rem', color: colors.greydark }}>
              {simulationStatus.issues.length} issue{simulationStatus.issues.length !== 1 ? 's' : ''} • Click for details
              {showStatusDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          )}
        </div>
        {showStatusDetails && simulationStatus.issues.length > 0 && (
          <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
            {simulationStatus.issues.map((issue, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.white, borderRadius: radius.lg, border: `1px solid ${colors.greylight}` }}>
                {issue.type === 'warning' ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.orange }} /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.red }} />}
                <div style={{ fontSize: '0.875rem', color: colors.text }}>{issue.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b" style={{ borderColor: colors.greylight, backgroundColor: '#f9fafb' }}>
        <div className="px-6 flex gap-1">
          <button 
            onClick={() => setActiveView('setup')} 
            style={{ 
              padding: `${spacing.md} ${spacing.lg}`, 
              border: 'none', 
              borderBottom: activeView === 'setup' ? `2px solid ${colors.bluegreen}` : '2px solid transparent', 
              backgroundColor: activeView === 'setup' ? colors.white : 'transparent', 
              color: activeView === 'setup' ? colors.bluegreen : colors.greydark, 
              fontFamily: 'Jost', 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              position: 'relative', 
              top: '1px' 
            }}
          >
            Setup
          </button>
          <button 
            disabled={simulationStatus.state !== 'completed'}
            style={{ 
              padding: `${spacing.md} ${spacing.lg}`, 
              border: 'none', 
              backgroundColor: 'transparent', 
              color: simulationStatus.state === 'completed' ? colors.greydark : colors.grey, 
              fontFamily: 'Jost', 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              cursor: simulationStatus.state === 'completed' ? 'pointer' : 'not-allowed', 
              opacity: simulationStatus.state === 'completed' ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}
          >
            Results {simulationStatus.state === 'completed' && <Check className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Content - Will continue in next message due to length */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-72 border-r overflow-auto" style={{ borderColor: colors.greylight, backgroundColor: colors.white }}>
          <div className="p-6 space-y-6">
            {/* Project Info (Collapsible) */}
            <div>
              <button 
                onClick={() => setProjectInfoCollapsed(!projectInfoCollapsed)}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: `${spacing.sm} 0`,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'Jost',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <FileText className="w-4 h-4" style={{ color: colors.bluegreen }} />
                  Project Info
                </span>
                {projectInfoCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {!projectInfoCollapsed && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Client</label>
                    <input type="text" placeholder="Client name" style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Project Number</label>
                    <input type="text" placeholder="Project #" style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Description</label>
                    <textarea placeholder="Project notes..." style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem', minHeight: '60px', resize: 'vertical' }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ height: '1px', backgroundColor: colors.greylight }}></div>

            {/* Orientation */}
            <div>
              <h3 style={{ fontFamily: 'Jost', fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                Orientation
              </h3>
              <div className="space-y-3">
                <div>
                  <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Direction</label>
                  <select style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }}>
                    <option>North</option>
                    <option>Northeast</option>
                    <option>East</option>
                    <option>Southeast</option>
                    <option>South</option>
                    <option>Southwest</option>
                    <option>West</option>
                    <option>Northwest</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Inclination [°]</label>
                  <input type="number" defaultValue="90" style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }} />
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: colors.greylight }}></div>

            {/* Climate */}
            <div>
              <h3 style={{ fontFamily: 'Jost', fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Cloud className="w-4 h-4" style={{ color: colors.blue }} />Climate
              </h3>
              <div style={{ padding: spacing.md, backgroundColor: `${colors.blue}08`, border: `1px solid ${colors.blue}30`, borderRadius: radius.xl, marginBottom: spacing.md }}>
                <div style={{ fontSize: '0.75rem', color: colors.greydark, marginBottom: spacing.xs }}>Exterior (Left Side)</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.xs }}>{assembly.exterior.climate}</div>
                <div style={{ fontSize: '0.625rem', color: colors.greydark, marginBottom: spacing.sm }}>Location • Heat Res: {assembly.exterior.heatResistance} (m²·K)/W</div>
                <button 
                  onClick={() => setShowClimateModal('exterior')} 
                  style={{ 
                    width: '100%', 
                    padding: `${spacing.xs} ${spacing.md}`, 
                    border: `1px solid ${colors.greylight}`, 
                    borderRadius: radius.md, 
                    backgroundColor: colors.white, 
                    fontSize: '0.75rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: spacing.xs,
                    fontWeight: 500
                  }}
                >
                  <Eye className="w-3 h-3" />View / Change
                </button>
              </div>
              <div style={{ padding: spacing.md, backgroundColor: `${colors.orange}08`, border: `1px solid ${colors.orange}30`, borderRadius: radius.xl }}>
                <div style={{ fontSize: '0.75rem', color: colors.greydark, marginBottom: spacing.xs }}>Interior (Right Side)</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.xs }}>{assembly.interior.climate}</div>
                <div style={{ fontSize: '0.625rem', color: colors.greydark, marginBottom: spacing.sm }}>Standard • Derived from: {assembly.interior.derivedFrom}</div>
                <button 
                  onClick={() => setShowClimateModal('interior')} 
                  style={{ 
                    width: '100%', 
                    padding: `${spacing.xs} ${spacing.md}`, 
                    border: `1px solid ${colors.greylight}`, 
                    borderRadius: radius.md, 
                    backgroundColor: colors.white, 
                    fontSize: '0.75rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: spacing.xs,
                    fontWeight: 500
                  }}
                >
                  <Eye className="w-3 h-3" />View / Change
                </button>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: colors.greylight }}></div>

            {/* Calculation Period */}
            <div>
              <h3 style={{ fontFamily: 'Jost', fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Calendar className="w-4 h-4" style={{ color: colors.bluegreen }} />Calculation Period
              </h3>
              <div className="space-y-3">
                <div>
                  <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Start Date</label>
                  <input type="date" defaultValue="2025-01-01" style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Duration</label>
                  <select style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }}>
                    <option>1 year</option>
                    <option>3 years</option>
                    <option>5 years</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Time Step</label>
                  <select style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }}>
                    <option>1 hour</option>
                    <option>30 minutes</option>
                    <option>15 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Settings (Collapsible) */}
            <div>
              <button 
                onClick={() => setAdvancedSettingsCollapsed(!advancedSettingsCollapsed)}
                style={{ 
                  width: '100%', 
                  padding: spacing.md, 
                  border: `1px solid ${colors.greylight}`, 
                  borderRadius: radius.lg, 
                  backgroundColor: colors.white, 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  color: colors.text
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <Settings className="w-4 h-4" />Advanced Settings
                </span>
                {advancedSettingsCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {!advancedSettingsCollapsed && (
                <div className="mt-3 space-y-3 p-3" style={{ backgroundColor: '#f9fafb', borderRadius: radius.lg, border: `1px solid ${colors.greylight}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '0.75rem', color: colors.greydark }}>Increased Accuracy</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '0.75rem', color: colors.greydark }}>Adaptive Time Step</label>
                    <input type="checkbox" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Grid Discretization</label>
                    <select style={{ width: '100%', padding: `${spacing.sm} ${spacing.md}`, border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }}>
                      <option>Automatic (II)</option>
                      <option>Automatic (I)</option>
                      <option>User-Defined</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Panel */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Performance Summary Bar */}
          <div className="p-6 border-b" style={{ borderColor: colors.greylight, backgroundColor: '#f9fafb' }}>
            <div className="flex items-center justify-between">
              <h2 style={{ fontFamily: 'Jost', fontSize: '1.125rem', fontWeight: 600, color: colors.text }}>Assembly Configuration</h2>
              <div className="flex gap-6 text-sm">
                <div>
                  <span style={{ color: colors.greydark }}>Total: </span>
                  <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{totalThickness.toFixed(4)} m</span>
                </div>
                <div>
                  <span style={{ color: colors.greydark }}>U-value: </span>
                  <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{uValue.toFixed(2)} W/(m²·K)</span>
                  <Check className="w-4 h-4 inline ml-1" style={{ color: colors.greenlight }} />
                </div>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    border: `1px solid ${colors.greylight}`,
                    borderRadius: radius.md,
                    backgroundColor: showGrid ? colors.bluegreen : colors.white,
                    color: showGrid ? colors.white : colors.greydark,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    transition: 'all 0.2s',
                    fontWeight: 500
                  }}
                >
                  <GridIcon className="w-3 h-3" />Grid
                </button>
              </div>
            </div>
          </div>

          {/* Visual Assembly */}
          <div className="p-8">
            <div style={{ border: `2px solid ${colors.greylight}`, borderRadius: radius.xl, padding: spacing['2xl'], backgroundColor: colors.white, boxShadow: shadows.md }}>
              {/* Surface Labels */}
              <div className="flex justify-between mb-2" style={{ fontSize: '0.75rem', color: colors.greydark }}>
                <div>Exterior (Left Side)</div>
                <div>Interior (Right Side)</div>
              </div>

              {/* Layer Thicknesses */}
              <div className="flex mb-2">
                {assembly.layers.map((layer) => {
                  const widthPercent = (layer.thickness / totalThickness) * 100;
                  return (
                    <div key={layer.id} style={{ width: `${widthPercent}%`, textAlign: 'center', fontSize: '0.625rem', color: colors.greydark, fontFamily: 'monospace' }}>
                      {layer.thickness.toFixed(4)}
                    </div>
                  );
                })}
              </div>

              {/* Main Visual Assembly */}
              <div style={{ position: 'relative' }}>
                <div className="flex" style={{ position: 'relative', height: '12rem' }}>
                  {/* Exterior Surface */}
                  <div
                    onClick={() => setSelectedElement({ type: 'surface', id: 'exterior' })}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: selectedElement.type === 'surface' && selectedElement.id === 'exterior' ? colors.bluegreen : colors.greylight,
                      cursor: 'pointer',
                      zIndex: 20,
                      transition: 'all 0.2s'
                    }}
                  />

                  {/* Layers */}
                  {assembly.layers.map((layer, index) => {
                    const widthPercent = (layer.thickness / totalThickness) * 100;
                    const isSelected = selectedElement.type === 'layer' && selectedElement.id === layer.id;
                    return (
                      <div 
                        key={layer.id} 
                        style={{ width: `${widthPercent}%`, position: 'relative' }} 
                        onClick={() => setSelectedElement({ type: 'layer', id: layer.id })}
                      >
                        <div 
                          style={{ 
                            height: '100%', 
                            backgroundColor: layer.color, 
                            borderRight: index < assembly.layers.length - 1 ? `2px solid ${colors.greylight}` : 'none',
                            cursor: 'pointer', 
                            position: 'relative', 
                            transition: 'all 0.2s',
                            ...(isSelected && { 
                              boxShadow: `inset 0 0 0 3px ${colors.bluegreen}`, 
                              zIndex: 10 
                            })
                          }}
                        >
                          <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            opacity: 0.15, 
                            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.5) 8px, rgba(0,0,0,0.5) 9px), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.5) 8px, rgba(0,0,0,0.5) 9px)` 
                          }}></div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Interior Surface */}
                  <div
                    onClick={() => setSelectedElement({ type: 'surface', id: 'interior' })}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: selectedElement.type === 'surface' && selectedElement.id === 'interior' ? colors.bluegreen : colors.greylight,
                      cursor: 'pointer',
                      zIndex: 20,
                      transition: 'all 0.2s'
                    }}
                  />

                  {/* Monitor Positions */}
                  {assembly.monitors.map((monitor) => {
                    const leftPercent = getMonitorPosition(monitor);
                    const isSelected = selectedElement.type === 'monitor' && selectedElement.id === monitor.id;
                    return (
                      <div
                        key={monitor.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement({ type: 'monitor', id: monitor.id });
                        }}
                        style={{
                          position: 'absolute',
                          left: `${leftPercent}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          backgroundColor: isSelected ? colors.bluegreen : colors.orange,
                          cursor: 'pointer',
                          zIndex: 15,
                          transition: 'all 0.2s'
                        }}
                        title={monitor.name}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '20px',
                            height: '20px',
                            backgroundColor: isSelected ? colors.bluegreen : colors.orange,
                            borderRadius: '50%',
                            border: `2px solid ${colors.white}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: shadows.md
                          }}
                        >
                          <Target className="w-3 h-3" style={{ color: colors.white }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Grid Discretization */}
                {showGrid && selectedElement.type === 'layer' && selectedLayerData && (
                  <div className="mt-4" style={{ border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, padding: spacing.md, backgroundColor: '#f9fafb' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text, marginBottom: spacing.sm }}>
                      Grid Discretization: {selectedLayerData.name}
                    </div>
                    <div style={{ display: 'flex', height: '3rem', border: `1px solid ${colors.greylight}`, borderRadius: radius.md, overflow: 'hidden' }}>
                      {Array.from({ length: selectedLayerData.gridCells }).map((_, idx) => (
                        <div
                          key={idx}
                          style={{
                            flex: 1,
                            backgroundColor: idx % 2 === 0 ? colors.white : '#f9fafb',
                            borderRight: idx < selectedLayerData.gridCells - 1 ? `1px solid ${colors.greylight}` : 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          title={`Cell ${idx + 1}/${selectedLayerData.gridCells}`}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.bluegreen}20`}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.white : '#f9fafb'}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: colors.greydark, marginTop: spacing.sm }}>
                      Click on a grid cell to place monitor or source
                    </div>
                  </div>
                )}
              </div>

              {/* Layer Names */}
              <div className="flex mt-4">
                {assembly.layers.map((layer) => {
                  const widthPercent = (layer.thickness / totalThickness) * 100;
                  return (
                    <div key={layer.id} style={{ width: `${widthPercent}%`, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text }}>{layer.name}</div>
                      <div style={{ fontSize: '0.625rem', color: colors.greydark }}>λ: {layer.lambda} W/(m·K)</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Data Table - Continuing in next message */}
          <div className="px-8 pb-8">
            <div style={{ border: `1px solid ${colors.greylight}`, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.white, boxShadow: shadows.md }}>
              <table style={{ width: '100%', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: `1px solid ${colors.greylight}` }}>
                  <tr>
                    <th style={{ padding: spacing.md, textAlign: 'left', fontFamily: 'Jost', fontWeight: 600, width: '40px' }}></th>
                    <th style={{ padding: spacing.md, textAlign: 'left', fontFamily: 'Jost', fontWeight: 600 }}>#</th>
                    <th style={{ padding: spacing.md, textAlign: 'left', fontFamily: 'Jost', fontWeight: 600 }}>Layer Name</th>
                    <th style={{ padding: spacing.md, textAlign: 'left', fontFamily: 'Jost', fontWeight: 600 }}>Material</th>
                    <th style={{ padding: spacing.md, textAlign: 'left', fontFamily: 'Jost', fontWeight: 600 }}>Thick. [m]</th>
                    <th style={{ padding: spacing.md, textAlign: 'left', fontFamily: 'Jost', fontWeight: 600 }}>λ [W/(m·K)]</th>
                    <th style={{ padding: spacing.md, textAlign: 'center', fontFamily: 'Jost', fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assembly.layers.map((layer, index) => {
                    const isSelected = selectedElement.type === 'layer' && selectedElement.id === layer.id;
                    return (
                      <tr 
                        key={layer.id} 
                        draggable
                        onDragStart={(e) => handleLayerDragStart(e, layer.id)}
                        onDragOver={handleLayerDragOver}
                        onDrop={(e) => handleLayerDrop(e, layer.id)}
                        style={{ 
                          borderBottom: `1px solid ${colors.greylight}`, 
                          backgroundColor: isSelected ? `${colors.bluegreen}08` : 'transparent',
                          cursor: 'move',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <td style={{ padding: spacing.md, cursor: 'grab' }}>
                          <GripVertical className="w-4 h-4" style={{ color: colors.grey }} />
                        </td>
                        <td style={{ padding: spacing.md, fontWeight: 500, color: colors.text }}>{index + 1}</td>
                        <td style={{ padding: spacing.md }}>
                          <input 
                            type="text" 
                            value={layer.name}
                            style={{
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: colors.text,
                              outline: 'none',
                              width: '100%'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td style={{ padding: spacing.md }}>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation();
                              setSelectedElement({ type: 'layer', id: layer.id }); 
                              setShowMaterialModal(true); 
                            }} 
                            style={{ 
                              color: colors.bluegreen, 
                              textDecoration: 'underline', 
                              backgroundColor: 'transparent', 
                              border: 'none', 
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            {layer.material}
                          </button>
                        </td>
                        <td style={{ padding: spacing.md }}>
                          <input
                            type="number"
                            value={layer.thickness}
                            step="0.001"
                            style={{
                              border: `1px solid ${colors.greylight}`,
                              borderRadius: radius.md,
                              padding: `${spacing.xs} ${spacing.sm}`,
                              fontSize: '0.875rem',
                              fontFamily: 'monospace',
                              width: '80px',
                              outline: 'none'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td style={{ padding: spacing.md, fontFamily: 'monospace', color: colors.text }}>{layer.lambda}</td>
                        <td style={{ padding: spacing.md }}>
                          <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Duplicate layer', layer.id);
                              }}
                              style={{ 
                                padding: spacing.xs, 
                                backgroundColor: 'transparent', 
                                border: 'none', 
                                cursor: 'pointer',
                                borderRadius: radius.sm,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Duplicate layer"
                            >
                              <Copy className="w-4 h-4" style={{ color: colors.greydark }} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Delete layer', layer.id);
                              }}
                              style={{ 
                                padding: spacing.xs, 
                                backgroundColor: 'transparent', 
                                border: 'none', 
                                cursor: 'pointer',
                                borderRadius: radius.sm,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Delete layer"
                            >
                              <Trash2 className="w-4 h-4" style={{ color: colors.red }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ padding: spacing.md, borderTop: `1px solid ${colors.greylight}`, backgroundColor: '#f9fafb' }}>
                <button
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.greylight}`,
                    borderRadius: radius.lg,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.bluegreen
                  }}
                >
                  <Plus className="w-4 h-4" />Add Layer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Will complete in next message */}
        <div className="w-80 border-l overflow-auto" style={{ borderColor: colors.greylight, backgroundColor: colors.white }}>
          <div className="p-6">
            {/* Layer Selected */}
            {selectedElement.type === 'layer' && selectedLayerData && (
              <div className="space-y-6">
                <div>
                  <div style={{ fontSize: '0.75rem', color: colors.greydark, marginBottom: spacing.xs }}>SELECTED</div>
                  <h3 style={{ fontFamily: 'Jost', fontSize: '1rem', fontWeight: 600, color: colors.text }}>{selectedLayerData.name}</h3>
                </div>

                {/* Quick Actions First */}
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowDatabaseModal(true)} 
                    style={{ 
                      width: '100%', 
                      padding: spacing.md, 
                      backgroundColor: colors.bluegreen, 
                      color: colors.white, 
                      border: 'none', 
                      borderRadius: radius.lg, 
                      cursor: 'pointer', 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      boxShadow: shadows.sm,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing.sm
                    }}
                  >
                    <Database className="w-4 h-4" />
                    Select from Database
                  </button>
                  <button 
                    onClick={() => setShowMaterialModal(true)}
                    style={{ 
                      width: '100%', 
                      padding: spacing.md, 
                      backgroundColor: colors.white, 
                      color: colors.text, 
                      border: `1px solid ${colors.greylight}`, 
                      borderRadius: radius.lg, 
                      cursor: 'pointer', 
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}
                  >
                    Edit Material Properties
                  </button>
                  <button 
                    style={{ 
                      width: '100%', 
                      padding: spacing.md, 
                      backgroundColor: colors.white, 
                      color: colors.text, 
                      border: `1px solid ${colors.greylight}`, 
                      borderRadius: radius.lg, 
                      cursor: 'pointer', 
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing.sm
                    }}
                  >
                    <Droplet className="w-4 h-4" />
                    Add Source / Sink
                  </button>
                </div>

                <div style={{ height: '1px', backgroundColor: colors.greylight }}></div>

                {/* Properties Preview */}
                <div>
                  <h4 style={{ fontFamily: 'Jost', fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.md }}>Material Properties</h4>
                  <div style={{ padding: spacing.md, backgroundColor: '#f9fafb', border: `1px solid ${colors.greylight}`, borderRadius: radius.lg }}>
                    <div style={{ fontSize: '0.875rem', marginBottom: spacing.md }}>
                      <span style={{ color: colors.greydark }}>Material: </span>
                      <span style={{ fontWeight: 600, color: colors.text }}>{selectedLayerData.material}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', marginBottom: spacing.md }}>
                      <span style={{ color: colors.greydark }}>λ (dry): </span>
                      <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{selectedLayerData.lambda} W/(m·K)</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', marginBottom: spacing.md }}>
                      <span style={{ color: colors.greydark }}>Thickness: </span>
                      <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{selectedLayerData.thickness.toFixed(4)} m</span>
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: colors.greydark }}>Grid Cells: </span>
                      <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{selectedLayerData.gridCells}</span>
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: colors.greylight }}></div>

                <div>
                  <h4 style={{ fontFamily: 'Jost', fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.md }}>Initial Conditions</h4>
                  <div className="space-y-3">
                    <div>
                      <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Temperature [°C]</label>
                      <input 
                        type="number" 
                        value={selectedLayerData.initTemp}
                        style={{ 
                          width: '100%', 
                          padding: `${spacing.sm} ${spacing.md}`, 
                          border: `1px solid ${colors.greylight}`, 
                          borderRadius: radius.lg, 
                          fontSize: '0.875rem',
                          fontFamily: 'monospace'
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: colors.greydark, display: 'block', marginBottom: spacing.xs }}>Relative Humidity [%]</label>
                      <input 
                        type="number" 
                        value={selectedLayerData.initRH}
                        style={{ 
                          width: '100%', 
                          padding: `${spacing.sm} ${spacing.md}`, 
                          border: `1px solid ${colors.greylight}`, 
                          borderRadius: radius.lg, 
                          fontSize: '0.875rem',
                          fontFamily: 'monospace'
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Surface Selected */}
            {selectedElement.type === 'surface' && (
              <div className="space-y-6">
                <div>
                  <div style={{ fontSize: '0.75rem', color: colors.greydark, marginBottom: spacing.xs }}>SELECTED</div>
                  <h3 style={{ fontFamily: 'Jost', fontSize: '1rem', fontWeight: 600, color: colors.text }}>
                    {selectedElement.id === 'exterior' ? 'Exterior Surface' : 'Interior Surface'}
                  </h3>
                </div>

                <div>
                  <button 
                    style={{ 
                      width: '100%', 
                      padding: spacing.md, 
                      backgroundColor: colors.bluegreen, 
                      color: colors.white, 
                      border: 'none', 
                      borderRadius: radius.lg, 
                      cursor: 'pointer', 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      boxShadow: shadows.sm
                    }}
                  >
                    Edit Surface Coefficients
                  </button>
                </div>

                <div style={{ height: '1px', backgroundColor: colors.greylight }}></div>

                <div>
                  <h4 style={{ fontFamily: 'Jost', fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.md }}>Surface Properties</h4>
                  {selectedElement.id === 'exterior' ? (
                    <div style={{ padding: spacing.md, backgroundColor: '#f9fafb', border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }}>
                      <div style={{ marginBottom: spacing.md }}>
                        <span style={{ color: colors.greydark }}>Heat Resistance: </span>
                        <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{assembly.surfaces.exterior.heatResistance} (m²·K)/W</span>
                      </div>
                      <div style={{ marginBottom: spacing.md }}>
                        <span style={{ color: colors.greydark }}>sd-Value: </span>
                        <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{assembly.surfaces.exterior.sdValue} m</span>
                      </div>
                      <div style={{ marginBottom: spacing.md }}>
                        <span style={{ color: colors.greydark }}>Absorptivity: </span>
                        <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{assembly.surfaces.exterior.absorptivity}</span>
                      </div>
                      <div>
                        <span style={{ color: colors.greydark }}>Rain Coefficient: </span>
                        <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{assembly.surfaces.exterior.rainCoeff}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: spacing.md, backgroundColor: '#f9fafb', border: `1px solid ${colors.greylight}`, borderRadius: radius.lg, fontSize: '0.875rem' }}>
                      <div style={{ marginBottom: spacing.md }}>
                        <span style={{ color: colors.greydark }}>Heat Resistance: </span>
                        <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{assembly.surfaces.interior.heatResistance} (m²·K)/W</span>
                      </div>
                      <div style={{ marginBottom: spacing.md }}>
                        <span style={{ color: colors.greydark }}>sd-Value: </span>
                        <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{assembly.surfaces.interior.sdValue} m</span>
                      </div>
                      <div>
                        <span style={{ color: colors.greydark }}>Absorptivity: </span>
                        <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{assembly.surfaces.interior.absorptivity}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Monitor Selected */}
            {selectedElement.type === 'monitor' && selectedMonitor && (
              <div className="space-y-6">
                <div>
                  <div style={{ fontSize: '0.75rem', color: colors.greydark, marginBottom: spacing.xs }}>SELECTED MONITOR</div>
                  <h3 style={{ fontFamily: 'Jost', fontSize: '1rem', fontWeight: 600, color: colors.text }}>{selectedMonitor.name}</h3>
                </div>

                <div className="space-y-2">
                  <button 
                    style={{ 
                      width: '100%', 
                      padding: spacing.md, 
                      backgroundColor: colors.orange, 
                      color: colors.white, 
                      border: 'none', 
                      borderRadius: radius.lg, 
                      cursor: 'pointer', 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      boxShadow: shadows.sm
                    }}
                  >
                    Edit Monitor Settings
                  </button>
                  <button 
                    style={{ 
                      width: '100%', 
                      padding: spacing.md, 
                      backgroundColor: colors.white, 
                      color: colors.red, 
                      border: `1px solid ${colors.red}`, 
                      borderRadius: radius.lg, 
                      cursor: 'pointer', 
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing.sm
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Monitor
                  </button>
                </div>

                <div style={{ height: '1px', backgroundColor: colors.greylight }}></div>

                <div>
                  <h4 style={{ fontFamily: 'Jost', fontSize: '0.875rem', fontWeight: 600, color: colors.text, marginBottom: spacing.md }}>Monitor Details</h4>
                  <div style={{ padding: spacing.md, backgroundColor: '#f9fafb', border: `1px solid ${colors.greylight}`, borderRadius: radius.lg }}>
                    <div style={{ fontSize: '0.875rem', marginBottom: spacing.md }}>
                      <span style={{ color: colors.greydark }}>Location: </span>
                      <span style={{ fontWeight: 600, color: colors.text }}>
                        {assembly.layers.find(l => l.id === selectedMonitor.layerId)?.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', marginBottom: spacing.md }}>
                      <span style={{ color: colors.greydark }}>Position: </span>
                      <span style={{ fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>
                        {(selectedMonitor.position * 100).toFixed(0)}% through layer
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: colors.greydark }}>Variables: </span>
                      <div className="mt-2 space-y-1">
                        {selectedMonitor.variables.map((v, idx) => (
                          <div key={idx} style={{ 
                            display: 'inline-block',
                            padding: `${spacing.xs} ${spacing.sm}`, 
                            backgroundColor: colors.white, 
                            borderRadius: radius.sm,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            marginRight: spacing.sm,
                            marginBottom: spacing.sm
                          }}>
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nothing Selected */}
            {!selectedElement.type && (
              <div style={{ textAlign: 'center', paddingTop: spacing['2xl'] }}>
                <Info className="w-12 h-12 mx-auto mb-3" style={{ color: colors.greylight }} />
                <p style={{ fontSize: '0.875rem', color: colors.greydark }}>Select a layer, surface, or monitor to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Material Database Modal - simplified version, full implementation would be very long */}
      {showDatabaseModal && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 50,
            padding: spacing['2xl']
          }} 
          onClick={() => setShowDatabaseModal(false)}
        >
          <div 
            style={{ 
              backgroundColor: colors.white, 
              borderRadius: radius.xl, 
              width: '1200px', 
              height: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: shadows.lg
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: spacing.lg, borderBottom: `1px solid ${colors.greylight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'Jost', fontSize: '1.25rem', fontWeight: 600, color: colors.text }}>Material Database</h2>
                <p style={{ fontSize: '0.875rem', color: colors.greydark, marginTop: spacing.xs }}>Browse and select materials</p>
              </div>
              <button onClick={() => setShowDatabaseModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.sm }}>
                <X className="w-5 h-5" style={{ color: colors.greydark }} />
              </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.greydark }}>
              <div style={{ textAlign: 'center' }}>
                <Database className="w-16 h-16 mx-auto mb-4" style={{ color: colors.grey }} />
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>Material Database Browser</p>
                <p style={{ fontSize: '0.875rem', marginTop: spacing.sm }}>Full implementation with tree navigation, material list, and preview panel</p>
              </div>
            </div>
            
            <div style={{ padding: spacing.lg, borderTop: `1px solid ${colors.greylight}`, display: 'flex', justifyContent: 'flex-end', gap: spacing.md }}>
              <button 
                onClick={() => setShowDatabaseModal(false)} 
                style={{ 
                  padding: `${spacing.sm} ${spacing.lg}`, 
                  border: `1px solid ${colors.greylight}`, 
                  borderRadius: radius.lg, 
                  backgroundColor: colors.white, 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: colors.text
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowDatabaseModal(false);
                  setShowMaterialModal(false);
                }} 
                style={{ 
                  padding: `${spacing.sm} ${spacing.lg}`, 
                  backgroundColor: colors.bluegreen, 
                  color: colors.white, 
                  border: 'none', 
                  borderRadius: radius.lg, 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  boxShadow: shadows.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}
              >
                <Check className="w-4 h-4" />
                Use Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WUFICloudEditor;