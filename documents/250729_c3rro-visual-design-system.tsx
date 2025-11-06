import React, { useState, useMemo } from 'react';

// =================================================================
// FOUNDATION LAYER - ENHANCED DESIGN TOKENS
// =================================================================

// Core C3RRO Colors - Extended with intermediate tones
const C3_colors = {
  // Primary colors
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
  white: '#FFFFFF',
  
  // Extended intermediate tones for smooth gradients
  tealVeryLight: '#F0FDFB',
  tealLight: '#E8F7F4', 
  tealMidLight: '#6BC4AE',
  tealMidDark: '#2F6B5D',
  tealVeryDark: '#1A4A4A',
  blueVeryLight: '#F2F8FF',
  blueMidLight: '#6BA8D2',
  blueMidDark: '#2E5A6B',
  greenVeryLight: '#F4F7ED',
  greenMidLight: '#9BB87F',
  redLight: '#F2D4D4',
  redMidLight: '#D86B6B',
  orangeLight: '#FAE5C8',
  orangeMidLight: '#F2B366'
};

// Comprehensive Palette System
const buildingSciencePalettes = {
  // Sequential palettes
  sequential: [C3_colors.red, C3_colors.bluegreen, C3_colors.greenlight, C3_colors.blue, C3_colors.orange, C3_colors.bluedark, C3_colors.yellowgreen, C3_colors.green],
  thermal: [C3_colors.bluedark, C3_colors.blue, C3_colors.bluelight, C3_colors.yellowlight, C3_colors.yellow, C3_colors.orange, C3_colors.red],
  performance: [C3_colors.red, C3_colors.orange, C3_colors.yellow, C3_colors.bluegreen, C3_colors.greenlight],
  
  // Monochrome gradients
  tealMono5: [C3_colors.bluelight, C3_colors.bluegreen, C3_colors.green, C3_colors.greendark, C3_colors.tealVeryDark],
  tealMono7: [C3_colors.tealVeryLight, C3_colors.tealLight, C3_colors.bluelight, C3_colors.bluegreen, C3_colors.green, C3_colors.greendark, C3_colors.tealVeryDark],
  blueMono5: [C3_colors.bluelight, C3_colors.blue, C3_colors.bluedark, C3_colors.blueMidDark, C3_colors.greendark],
  
  // Diverging palettes
  coolWarm7: [C3_colors.greendark, C3_colors.bluegreen, C3_colors.bluelight, C3_colors.yellowlight, C3_colors.yellow, C3_colors.orange, C3_colors.red],
  coolWarm9: [C3_colors.tealVeryDark, C3_colors.greendark, C3_colors.bluegreen, C3_colors.bluelight, C3_colors.yellowlight, C3_colors.yellow, C3_colors.orange, C3_colors.red, C3_colors.redMidLight],
  blueRed7: [C3_colors.bluedark, C3_colors.blue, C3_colors.bluelight, C3_colors.yellowlight, C3_colors.yellow, C3_colors.red, C3_colors.redMidLight],
  
  // Specialty palettes
  riskAssessment: [C3_colors.greenlight, C3_colors.bluegreen, C3_colors.bluelight, C3_colors.yellowlight, C3_colors.yellow, C3_colors.orange, C3_colors.red],
  sustainability: [C3_colors.yellowgreen, C3_colors.greenlight, C3_colors.bluegreen, C3_colors.grey, C3_colors.greydark],
  buildingSystems: [C3_colors.text, C3_colors.bluedark, C3_colors.bluegreen, C3_colors.greenlight, C3_colors.yellow, C3_colors.orange, C3_colors.red, C3_colors.greydark]
};

// Typography System
const typography = {
  plotTitle: { fontFamily: 'Jost, sans-serif', fontSize: '18px', fontWeight: 'bold', fill: C3_colors.text },
  plotSubtitle: { fontFamily: 'Lato, sans-serif', fontSize: '14px', fontWeight: 'normal', fill: C3_colors.bluegreen },
  axisTitle: { fontFamily: 'Lato, sans-serif', fontSize: '14px', fontWeight: 'normal', fill: C3_colors.text },
  axisText: { fontFamily: 'Lato, sans-serif', fontSize: '12px', fontWeight: 'normal', fill: C3_colors.text },
  legendText: { fontFamily: 'Lato, sans-serif', fontSize: '12px', fontWeight: 'normal', fill: C3_colors.text },
  tooltipText: { fontFamily: 'Lato, sans-serif', fontSize: '11px', fontWeight: 'normal', fill: C3_colors.text },
  caption: { fontFamily: 'Lato, sans-serif', fontSize: '10px', fontWeight: 'normal', fill: C3_colors.greydark },
  sectionTitle: { fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: '600', color: C3_colors.text },
  cardTitle: { fontFamily: 'Jost, sans-serif', fontSize: '16px', fontWeight: '600', color: C3_colors.text },
  bodyText: { fontFamily: 'Lato, sans-serif', fontSize: '14px', fontWeight: 'normal', color: C3_colors.greydark }
};

// Layout System
const layout = {
  standardWidth: 800,
  standardHeight: 500,
  margins: { top: 80, right: 140, bottom: 80, left: 90 },
  tickLength: 11,
  textMargin: 15,
  legendPadding: 12,
  tooltipPadding: 8,
  dataPointRadius: 3,
  lineWidth: 2,
  gridPadding: 0.04
};

// Visual Style Tokens
const styles = {
  plot: { background: { fill: C3_colors.white } },
  axis: { stroke: C3_colors.greydark, strokeWidth: 1, top: { strokeWidth: 1.2 } },
  grid: {
    major: { stroke: C3_colors.grey, strokeWidth: 0.5 },
    minor: { stroke: C3_colors.greylight, strokeWidth: 0.2 }
  },
  line: {
    default: { strokeWidth: layout.lineWidth, strokeLinecap: 'round', strokeLinejoin: 'round' },
    selected: { strokeWidth: layout.lineWidth + 1 },
    dimmed: { opacity: 0.3 },
    dashed: { strokeDasharray: '5,3' }
  },
  point: {
    default: { r: layout.dataPointRadius, strokeWidth: 1, stroke: C3_colors.white, opacity: 1, transition: 'all 0.15s ease' },
    hover: { r: layout.dataPointRadius * 1.5, strokeWidth: 2 },
    selected: { stroke: C3_colors.bluegreen, strokeWidth: 2 },
    dimmed: { opacity: 0.8 }
  },
  card: {
    backgroundColor: C3_colors.white,
    border: `1px solid ${C3_colors.greylight}`,
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1.5rem'
  }
};

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

const getColorPalette = (paletteType = 'sequential') => buildingSciencePalettes[paletteType] || buildingSciencePalettes.sequential;
const formatValue = (value, precision = 1) => (typeof value === 'number' ? value.toFixed(precision) : value);
const generateTicks = (min, max, count = 6) => Array.from({ length: count }, (_, i) => min + ((max - min) / (count - 1)) * i);

// =================================================================
// CUSTOM HOOKS
// =================================================================

const usePlotDimensions = (width, height, margin) => {
  return useMemo(() => {
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    return { plotWidth, plotHeight, margin };
  }, [width, height, margin]);
};

const useScales = (data, xKey, yKeys, plotWidth, plotHeight) => {
  return useMemo(() => {
    const xValues = data.map(d => d[xKey]);
    const isCategorical = typeof xValues[0] === 'string';

    const xExtent = isCategorical ? [0, xValues.length - 1] : [Math.min(...xValues), Math.max(...xValues)];
    const xPadding = isCategorical ? 0 : (xExtent[1] - xExtent[0]) * layout.gridPadding;
    const xDomain = [xExtent[0] - xPadding, xExtent[1] + xPadding];
    const xScale = (value) => {
      if (isCategorical) {
        const index = xValues.indexOf(value);
        return (index / (xValues.length - 1)) * plotWidth;
      }
      return ((value - xDomain[0]) / (xDomain[1] - xDomain[0])) * plotWidth;
    };

    const allYValues = data.flatMap(d => yKeys.map(key => d[key]));
    const yExtent = [Math.min(0, ...allYValues), Math.max(...allYValues)];
    const yPadding = (yExtent[1] - yExtent[0]) * layout.gridPadding;
    const yDomain = [yExtent[0] - (yKeys.length === 1 ? 0 : yPadding), yExtent[1] + yPadding];
    const yScale = (value) => plotHeight - (((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * plotHeight);

    return { xScale, yScale, xDomain, yDomain, isCategorical };
  }, [data, xKey, yKeys, plotWidth, plotHeight]);
};

// =================================================================
// CORE SVG COMPONENTS
// =================================================================

const PlotSVG = ({ width, height, children }) => (
  <svg width={width} height={height} style={styles.plot.background}>
    <defs>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap');`}</style>
    </defs>
    {children}
  </svg>
);

const PlotTitle = ({ title, subtitle, x, y }) => (
  <g>
    {title && <text x={x} y={y} style={typography.plotTitle}>{title}</text>}
    {subtitle && <text x={x} y={y + 24} style={typography.plotSubtitle}>{subtitle}</text>}
  </g>
);

const GridSystem = ({ yScale, yDomain, plotWidth }) => (
  <g>
    {generateTicks(yDomain[0], yDomain[1], 6).map((tick, i) => (
      <line key={`h-major-${i}`} x1={0} y1={yScale(tick)} x2={plotWidth} y2={yScale(tick)} style={styles.grid.major} />
    ))}
    {generateTicks(yDomain[0], yDomain[1], 11).map((tick, i) => (
      <line key={`h-minor-${i}`} x1={0} y1={yScale(tick)} x2={plotWidth} y2={yScale(tick)} style={styles.grid.minor} />
    ))}
  </g>
);

const AxisSystem = ({ type, scale, ticks, title, plotWidth, plotHeight }) => {
  if (type === 'x-bottom') {
    return (
      <g>
        <line x1={0} y1={0} x2={plotWidth} y2={0} style={{ stroke: styles.axis.stroke, strokeWidth: styles.axis.strokeWidth }} />
        {ticks.map((tick, i) => {
          const x = scale(tick.value);
          return (
            <g key={i}>
              <line x1={x} y1={0} x2={x} y2={-layout.tickLength} style={{ stroke: styles.axis.stroke, strokeWidth: styles.axis.strokeWidth }}/>
              <text x={x} y={layout.textMargin} textAnchor="middle" style={typography.axisText}>{tick.label}</text>
            </g>
          );
        })}
        {title && <text x={plotWidth / 2} y={layout.textMargin * 3} textAnchor="middle" style={typography.axisTitle}>{title}</text>}
      </g>
    );
  }
  if (type === 'y-left') {
    return (
      <g>
        {ticks.map((tick, i) => (
          <text key={i} x={-layout.textMargin} y={scale(tick.value)} textAnchor="end" dy="0.35em" style={typography.axisText}>{tick.label}</text>
        ))}
        {title && <text x={-60} y={plotHeight / 2} textAnchor="middle" transform={`rotate(-90, -60, ${plotHeight / 2})`} style={typography.axisTitle}>{title}</text>}
      </g>
    );
  }
  return null;
};

const Legend = ({ items, position, plotWidth, onItemClick, onItemHover }) => {
  const legendX = position === 'inside' ? plotWidth - 140 : plotWidth + 20;
  const itemHeight = 20;
  const legendHeight = items.length * itemHeight + layout.legendPadding * 2;
  return (
    <g transform={`translate(${legendX}, 20)`}>
      {position === 'inside' && (
        <rect 
          x={-layout.legendPadding} 
          y={-layout.legendPadding} 
          width={130} 
          height={legendHeight} 
          fill={C3_colors.white} 
          fillOpacity={0.98} 
          rx={4}
          stroke={C3_colors.greylight}
          strokeWidth={1}
        />
      )}
      {items.map((item, i) => (
        <g 
          key={i} 
          transform={`translate(0, ${i * itemHeight})`} 
          style={{ cursor: 'pointer' }}
          onClick={() => onItemClick && onItemClick(i)} 
          onMouseEnter={() => onItemHover && onItemHover(i, true)} 
          onMouseLeave={() => onItemHover && onItemHover(i, false)}
        >
          <line 
            x1={0} 
            y1={0} 
            x2={20} 
            y2={0} 
            stroke={item.color} 
            strokeWidth={styles.line.default.strokeWidth} 
            strokeDasharray={item.dashed ? styles.line.dashed.strokeDasharray : '0'} 
          />
          <circle 
            cx={10} 
            cy={0} 
            r={styles.point.default.r} 
            fill={item.color} 
            stroke={styles.point.default.stroke} 
            strokeWidth={styles.point.default.strokeWidth} 
          />
          <text 
            x={28} 
            y={0} 
            dy="0.35em" 
            style={{ 
              ...typography.legendText, 
              ...(item.dimmed ? { opacity: 0.4 } : {}) 
            }}
          >
            {item.label}
          </text>
        </g>
      ))}
    </g>
  );
};

const Tooltip = ({ visible, x, y, content }) => {
  if (!visible || !content) return null;
  const textWidth = content.length * 7;
  const boxWidth = textWidth + layout.tooltipPadding * 2;
  return (
    <g transform={`translate(${x - boxWidth / 2}, ${y - 24 - 10})`}>
      <rect 
        x={0} 
        y={0} 
        width={boxWidth} 
        height={24} 
        fill={C3_colors.white}
        stroke={C3_colors.grey}
        strokeWidth={1}
        rx={3}
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
      />
      <text x={boxWidth / 2} y={12} textAnchor="middle" dy="0.35em" style={typography.tooltipText}>
        {content}
      </text>
    </g>
  );
};

// =================================================================
// DATA VISUALIZATION COMPONENTS
// =================================================================

const DataLines = ({ data, xKey, yKeys, xScale, yScale, colors, selectedSeries, hoveredLegendItem, onPointHover }) => {
  const createPath = (yKey) => data.map((d) => {
    const x = xScale(d[xKey]);
    const y = yScale(d[yKey]);
    return `${d === data[0] ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return yKeys.map((yKey, seriesIndex) => {
    const isSelected = selectedSeries === seriesIndex;
    const isDimmed = (selectedSeries !== null && !isSelected) || (hoveredLegendItem !== null && hoveredLegendItem !== seriesIndex);
    const lineStyle = { 
      ...styles.line.default, 
      ...(isSelected && styles.line.selected), 
      ...(isDimmed && styles.line.dimmed) 
    };
    
    return (
      <g key={yKey} style={{ transition: 'opacity 0.2s' }}>
        <path 
          d={createPath(yKey)} 
          fill="none" 
          stroke={colors[seriesIndex]} 
          {...lineStyle} 
        />
        {data.map((d, i) => (
          <circle 
            key={i} 
            cx={xScale(d[xKey])} 
            cy={yScale(d[yKey])} 
            fill={colors[seriesIndex]} 
            {...styles.point.default} 
            onMouseEnter={() => onPointHover(`${seriesIndex}-${i}`)} 
            onMouseLeave={() => onPointHover(null)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </g>
    );
  });
};

const DataBars = ({ data, xKey, yKey, xScale, yScale, plotHeight, colors, onBarHover }) => {
  const barWidth = data.length > 1 ? (xScale(data[1][xKey]) - xScale(data[0][xKey])) * 0.4 : 30; // Reduced from 0.7 to 0.4
  return data.map((d, i) => {
    const x = Math.max(0, xScale(d[xKey]) - barWidth / 2); // Ensure bars don't go below x=0
    const y = yScale(d[yKey]);
    const barHeight = plotHeight - y;
    return (
      <rect 
        key={i} 
        x={x} 
        y={y} 
        width={barWidth} 
        height={barHeight} 
        fill={colors[i % colors.length]} 
        style={{ transition: 'opacity 0.15s ease', cursor: 'pointer' }}
        onMouseEnter={() => onBarHover(i)} 
        onMouseLeave={() => onBarHover(null)}
      />
    );
  });
};

// =================================================================
// PLOT COMPONENTS
// =================================================================

const LinePlot = ({ 
  data, 
  xKey, 
  yKeys, 
  title, 
  subtitle, 
  xLabel, 
  yLabel, 
  width = layout.standardWidth, 
  height = layout.standardHeight, 
  legendPosition = 'outside', // Changed default from 'inside' to 'outside'
  colorPalette = 'sequential', // Explicitly set default
  showTooltips = true // Explicitly set default
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [hoveredLegendItem, setHoveredLegendItem] = useState(null);

  const { plotWidth, plotHeight, margin } = usePlotDimensions(width, height, layout.margins);
  const { xScale, yScale, yDomain } = useScales(data, xKey, yKeys, plotWidth, plotHeight);
  
  const colors = useMemo(() => getColorPalette(colorPalette), [colorPalette]);
  const xTicks = useMemo(() => data.map(d => ({ value: d[xKey], label: d[xKey] })), [data, xKey]);
  const yTicks = useMemo(() => generateTicks(yDomain[0], yDomain[1], 6).map(v => ({ value: v, label: formatValue(v, 1) })), [yDomain]);
  
  const legendItems = yKeys.map((key, i) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1), 
    color: colors[i], 
    dashed: key.includes('target'),
    dimmed: (selectedSeries !== null && selectedSeries !== i) || (hoveredLegendItem !== null && hoveredLegendItem !== i)
  }));
  
  const tooltipData = useMemo(() => {
    if (!showTooltips || !hoveredPoint) return null;
    const [seriesIndex, pointIndex] = hoveredPoint.split('-').map(Number);
    const d = data[pointIndex];
    const yKey = yKeys[seriesIndex];
    return { x: xScale(d[xKey]), y: yScale(d[yKey]), content: `${d[xKey]}: ${formatValue(d[yKey], 1)}` };
  }, [hoveredPoint, data, xKey, yKeys, xScale, yScale, showTooltips]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <PlotSVG width={width} height={height}>
        <PlotTitle title={title} subtitle={subtitle} x={margin.left} y={30} />
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <GridSystem yScale={yScale} yDomain={yDomain} plotWidth={plotWidth} />
          <DataLines 
            data={data} 
            xKey={xKey} 
            yKeys={yKeys} 
            xScale={xScale} 
            yScale={yScale} 
            colors={colors} 
            selectedSeries={selectedSeries} 
            hoveredLegendItem={hoveredLegendItem} 
            onPointHover={setHoveredPoint}
          />
        </g>
        <g transform={`translate(${margin.left}, ${margin.top + plotHeight})`}>
          <AxisSystem type="x-bottom" scale={xScale} ticks={xTicks} title={xLabel} plotWidth={plotWidth} />
        </g>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <AxisSystem type="x-top" scale={xScale} ticks={xTicks} plotWidth={plotWidth} />
          <AxisSystem type="y-left" scale={yScale} ticks={yTicks} title={yLabel} plotHeight={plotHeight} />
        </g>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <Legend 
            items={legendItems} 
            position={legendPosition} 
            plotWidth={plotWidth} 
            onItemClick={(i) => setSelectedSeries(selectedSeries === i ? null : i)} 
            onItemHover={(i, h) => setHoveredLegendItem(h ? i : null)} 
          />
          {tooltipData && <Tooltip visible={true} {...tooltipData} />}
        </g>
        <text x={margin.left} y={height - 8} style={typography.caption}>
          C3RRO Building Analytics Platform | Enhanced Visual Design System
        </text>
      </PlotSVG>
    </div>
  );
};

const BarChart = ({ 
  data, 
  xKey, 
  yKey, 
  title, 
  subtitle, 
  xLabel, 
  yLabel, 
  width = layout.standardWidth, 
  height = layout.standardHeight, 
  colorPalette = 'sequential', // Changed default from 'performance' to 'sequential'
  showTooltips = true // Explicitly set default
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const { plotWidth, plotHeight, margin } = usePlotDimensions(width, height, layout.margins);
  const { xScale, yScale, yDomain } = useScales(data, xKey, [yKey], plotWidth, plotHeight);

  const colors = useMemo(() => getColorPalette(colorPalette), [colorPalette]);
  const xTicks = useMemo(() => data.map(d => ({ value: d[xKey], label: d[xKey] })), [data, xKey]);
  const yTicks = useMemo(() => generateTicks(yDomain[0], yDomain[1], 6).map(v => ({ value: v, label: formatValue(v, 0) })), [yDomain]);

  const tooltipData = useMemo(() => {
    if (!showTooltips || hoveredBar === null) return null;
    const d = data[hoveredBar];
    return { x: xScale(d[xKey]), y: yScale(d[yKey]), content: `${d[xKey]}: ${formatValue(d[yKey], 0)}` };
  }, [hoveredBar, data, xKey, yKey, xScale, yScale, showTooltips]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <PlotSVG width={width} height={height}>
        <PlotTitle title={title} subtitle={subtitle} x={margin.left} y={30} />
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <GridSystem yScale={yScale} yDomain={yDomain} plotWidth={plotWidth} />
          <DataBars 
            data={data} 
            xKey={xKey} 
            yKey={yKey} 
            xScale={xScale} 
            yScale={yScale} 
            plotHeight={plotHeight} 
            colors={colors} 
            onBarHover={setHoveredBar} 
          />
        </g>
        <g transform={`translate(${margin.left}, ${margin.top + plotHeight})`}>
          <AxisSystem type="x-bottom" scale={xScale} ticks={xTicks} title={xLabel} plotWidth={plotWidth} />
        </g>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <AxisSystem type="x-top" scale={xScale} ticks={xTicks} plotWidth={plotWidth} />
          <AxisSystem type="y-left" scale={yScale} ticks={yTicks} title={yLabel} plotHeight={plotHeight} />
          {tooltipData && <Tooltip visible={true} {...tooltipData} />}
        </g>
        <text x={margin.left} y={height - 8} style={typography.caption}>
          C3RRO Building Analytics Platform | Enhanced Visual Design System
        </text>
      </PlotSVG>
    </div>
  );
};

// =================================================================
// PALETTE SHOWCASE COMPONENTS
// =================================================================

const PaletteCard = ({ palette, title, description, usage }) => (
  <div style={styles.card}>
    <h3 style={typography.cardTitle}>{title}</h3>
    <p style={{ ...typography.bodyText, fontSize: '12px', margin: '0.5rem 0 1rem 0' }}>{description}</p>
    <div style={{ display: 'flex', height: '40px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
      {palette.map((color, i) => (
        <div 
          key={i} 
          style={{ 
            flex: 1, 
            backgroundColor: color,
            borderRight: i < palette.length - 1 ? `1px solid ${C3_colors.white}` : 'none'
          }} 
          title={color}
        />
      ))}
    </div>
    <p style={{ ...typography.bodyText, fontSize: '11px', fontStyle: 'italic', color: C3_colors.bluegreen }}>
      {usage}
    </p>
  </div>
);

const ColorTokensGrid = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
    {Object.entries(C3_colors).map(([key, value]) => (
      <div key={key} style={{ ...styles.card, padding: '1rem' }}>
        <div style={{ width: '100%', height: '60px', backgroundColor: value, borderRadius: '4px', marginBottom: '0.5rem' }} />
        <div style={typography.cardTitle}>{key}</div>
        <div style={{ ...typography.bodyText, fontSize: '12px', fontFamily: 'monospace' }}>{value}</div>
      </div>
    ))}
  </div>
);

// =================================================================
// MAIN SHOWCASE COMPONENT
// =================================================================

const C3RROVisualDesignSystemShowcase = () => {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [selectedPalette, setSelectedPalette] = useState('sequential');
  const [legendPosition, setLegendPosition] = useState('outside'); // Changed default from 'inside' to 'outside'
  const [showTooltips, setShowTooltips] = useState(true);
  
  // Sample data sets
  const energyData = [
    { month: 'Jan', baseline: 145, optimized: 98, target: 85 },
    { month: 'Feb', baseline: 142, optimized: 95, target: 85 },
    { month: 'Mar', baseline: 138, optimized: 92, target: 85 },
    { month: 'Apr', baseline: 135, optimized: 89, target: 85 },
    { month: 'May', baseline: 132, optimized: 87, target: 85 },
    { month: 'Jun', baseline: 128, optimized: 85, target: 85 }
  ];

  const buildingData = [
    { building: 'Building A', consumption: 142 },
    { building: 'Building B', consumption: 98 },
    { building: 'Building C', consumption: 156 },
    { building: 'Building D', consumption: 89 },
    { building: 'Building E', consumption: 134 }
  ];

  const thermalData = [
    { month: 'Jan', interior: 22, exterior: -2, comfort: 21 },
    { month: 'Feb', interior: 22, exterior: 1, comfort: 21 },
    { month: 'Mar', interior: 22, exterior: 8, comfort: 21 },
    { month: 'Apr', interior: 23, exterior: 15, comfort: 22 },
    { month: 'May', interior: 24, exterior: 20, comfort: 23 },
    { month: 'Jun', interior: 25, exterior: 25, comfort: 24 }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'colors', name: 'Color System' },
    { id: 'palettes', name: 'Data Palettes' },
    { id: 'typography', name: 'Typography' },
    { id: 'plots', name: 'Plot Components' },
    { id: 'examples', name: 'Real Examples' }
  ];

  const paletteShowcases = [
    {
      key: 'sequential',
      title: 'Sequential Palette',
      description: 'For ordered data with progression',
      usage: 'Building performance rankings, energy efficiency scales'
    },
    {
      key: 'thermal',
      title: 'Thermal Gradient',
      description: 'Temperature visualization palette',
      usage: 'Heat maps, thermal comfort analysis, HVAC data'
    },
    {
      key: 'performance',
      title: 'Performance Scale',
      description: 'Quality assessment palette',
      usage: 'Building ratings, efficiency metrics, pass/fail indicators'
    },
    {
      key: 'tealMono7',
      title: 'Teal Monochrome (7-step)',
      description: 'Single-hue gradient for detailed data',
      usage: 'Density maps, single-variable emphasis'
    },
    {
      key: 'coolWarm7',
      title: 'Cool-Warm Diverging',
      description: 'Diverging palette with neutral center',
      usage: 'Above/below baseline comparisons, hot/cold analysis'
    },
    {
      key: 'riskAssessment',
      title: 'Risk Assessment',
      description: 'Safety and risk visualization',
      usage: 'Risk matrices, safety indicators, alert levels'
    }
  ];

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'Lato, sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: C3_colors.white, borderBottom: `1px solid ${C3_colors.greylight}`, padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ ...typography.sectionTitle, fontSize: '32px', margin: '0 0 0.5rem 0' }}>
            C3RRO Visual Design System
          </h1>
          <p style={{ ...typography.bodyText, fontSize: '18px', margin: 0 }}>
            Comprehensive data visualization system for building physics applications
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ backgroundColor: C3_colors.white, borderBottom: `1px solid ${C3_colors.greylight}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDemo(tab.id)}
                style={{
                  padding: '1rem 0',
                  borderBottom: `3px solid ${activeDemo === tab.id ? C3_colors.bluegreen : 'transparent'}`,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: activeDemo === tab.id ? C3_colors.bluegreen : C3_colors.greydark,
                  fontWeight: activeDemo === tab.id ? '600' : '400',
                  fontSize: '14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Lato, sans-serif'
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {activeDemo === 'overview' && (
          <div>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={typography.sectionTitle}>System Architecture</h2>
              <p style={typography.bodyText}>
                This visual design system is built on a robust foundation with clear separation of concerns:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                <div style={styles.card}>
                  <h3 style={typography.cardTitle}>🎨 Design Tokens</h3>
                  <p style={typography.bodyText}>
                    Centralized color palettes, typography scales, and spacing systems that ensure consistency across all visualizations.
                  </p>
                </div>
                <div style={styles.card}>
                  <h3 style={typography.cardTitle}>🔧 Utility Functions</h3>
                  <p style={typography.bodyText}>
                    Reusable functions for scales, formatting, and data transformations that work across different chart types.
                  </p>
                </div>
                <div style={styles.card}>
                  <h3 style={typography.cardTitle}>🎣 Custom Hooks</h3>
                  <p style={typography.bodyText}>
                    React hooks for plot dimensions, scales, and interactive states that encapsulate complex logic.
                  </p>
                </div>
                <div style={styles.card}>
                  <h3 style={typography.cardTitle}>📊 Plot Components</h3>
                  <p style={typography.bodyText}>
                    Modular SVG components for different chart types with consistent APIs and styling.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h2 style={typography.sectionTitle}>Key Features</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ ...styles.card, backgroundColor: '#F0FDFB' }}>
                  <h4 style={{ ...typography.cardTitle, color: C3_colors.bluegreen }}>Domain-Specific Palettes</h4>
                  <p style={typography.bodyText}>48+ specialized color palettes for building physics data</p>
                </div>
                <div style={{ ...styles.card, backgroundColor: '#F2F8FF' }}>
                  <h4 style={{ ...typography.cardTitle, color: C3_colors.blue }}>Interactive Elements</h4>
                  <p style={typography.bodyText}>Hover effects, tooltips, and selection states</p>
                </div>
                <div style={{ ...styles.card, backgroundColor: '#F4F7ED' }}>
                  <h4 style={{ ...typography.cardTitle, color: C3_colors.greenlight }}>Accessibility Focus</h4>
                  <p style={typography.bodyText}>Color-blind friendly palettes and proper contrast ratios</p>
                </div>
                <div style={{ ...styles.card, backgroundColor: '#FDF5E0' }}>
                  <h4 style={{ ...typography.cardTitle, color: C3_colors.orange }}>Modular Architecture</h4>
                  <p style={typography.bodyText}>Composable components for custom visualizations</p>
                </div>
              </div>
            </div>

            <div>
              <h2 style={typography.sectionTitle}>Quick Demo</h2>
              <p style={typography.bodyText}>
                Interactive line chart demonstrating the system's capabilities:
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <LinePlot
                  data={energyData}
                  xKey="month"
                  yKeys={['baseline', 'optimized', 'target']}
                  title="Building Energy Performance"
                  subtitle="Monthly consumption with optimization targets"
                  xLabel="Month (2024)"
                  yLabel="Energy Consumption (kWh/m²)"
                  colorPalette="sequential"
                  showTooltips={true}
                />
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'colors' && (
          <div>
            <h2 style={typography.sectionTitle}>Color System</h2>
            <p style={typography.bodyText}>
              Extended C3RRO brand colors with intermediate tones for smooth gradients and better data visualization.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <ColorTokensGrid />
            </div>
          </div>
        )}

        {activeDemo === 'palettes' && (
          <div>
            <h2 style={typography.sectionTitle}>Data Visualization Palettes</h2>
            <p style={typography.bodyText}>
              Specialized color palettes designed for different types of building physics data visualization.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {paletteShowcases.map((showcase) => (
                <PaletteCard
                  key={showcase.key}
                  palette={buildingSciencePalettes[showcase.key]}
                  title={showcase.title}
                  description={showcase.description}
                  usage={showcase.usage}
                />
              ))}
            </div>
          </div>
        )}

        {activeDemo === 'typography' && (
          <div>
            <h2 style={typography.sectionTitle}>Typography System</h2>
            <p style={typography.bodyText}>
              Consistent typography hierarchy using Jost for headings and Lato for body text.
            </p>
            <div style={{ ...styles.card, marginTop: '2rem' }}>
              <div style={{ display: 'grid', gap: '2rem' }}>
                <div>
                  <div style={typography.plotTitle}>Plot Title (Jost Bold, 18px)</div>
                  <p style={{ color: C3_colors.greydark, fontSize: '12px', margin: '0.5rem 0 0 0' }}>Used for main chart titles</p>
                </div>
                <div>
                  <div style={typography.plotSubtitle}>Plot Subtitle (Lato Regular, 14px)</div>
                  <p style={{ color: C3_colors.greydark, fontSize: '12px', margin: '0.5rem 0 0 0' }}>Used for chart descriptions and context</p>
                </div>
                <div>
                  <div style={typography.axisTitle}>Axis Title (Lato Regular, 14px)</div>
                  <p style={{ color: C3_colors.greydark, fontSize: '12px', margin: '0.5rem 0 0 0' }}>Used for axis labels</p>
                </div>
                <div>
                  <div style={typography.axisText}>Axis Text (Lato Regular, 12px)</div>
                  <p style={{ color: C3_colors.greydark, fontSize: '12px', margin: '0.5rem 0 0 0' }}>Used for tick labels and data values</p>
                </div>
                <div>
                  <div style={typography.caption}>Caption Text (Lato Regular, 10px)</div>
                  <p style={{ color: C3_colors.greydark, fontSize: '12px', margin: '0.5rem 0 0 0' }}>Used for footnotes and attribution</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'plots' && (
          <div>
            <h2 style={typography.sectionTitle}>Plot Components</h2>
            <p style={typography.bodyText}>
              Interactive controls to explore different visualization options:
            </p>
            
            {/* Controls */}
            <div style={{ ...styles.card, marginTop: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <label style={{ ...typography.bodyText, fontWeight: '600', marginRight: '0.5rem' }}>
                    Color Palette:
                  </label>
                  <select 
                    value={selectedPalette} 
                    onChange={(e) => setSelectedPalette(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: `1px solid ${C3_colors.greylight}` }}
                  >
                    <option value="sequential">Sequential</option>
                    <option value="thermal">Thermal</option>
                    <option value="performance">Performance</option>
                    <option value="tealMono7">Teal Monochrome</option>
                    <option value="coolWarm7">Cool-Warm Diverging</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ ...typography.bodyText, fontWeight: '600', marginRight: '0.5rem' }}>
                    Legend Position:
                  </label>
                  <label style={{ marginRight: '1rem' }}>
                    <input 
                      type="radio" 
                      value="inside" 
                      checked={legendPosition === 'inside'} 
                      onChange={(e) => setLegendPosition(e.target.value)} 
                      style={{ marginRight: '0.25rem' }}
                    />
                    Inside
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      value="outside" 
                      checked={legendPosition === 'outside'} 
                      onChange={(e) => setLegendPosition(e.target.value)}
                      style={{ marginRight: '0.25rem' }}
                    />
                    Outside
                  </label>
                </div>
                
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={showTooltips} 
                    onChange={(e) => setShowTooltips(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={typography.bodyText}>Show Tooltips</span>
                </label>
              </div>
            </div>

            {/* Line Chart */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={typography.cardTitle}>Line Chart</h3>
              <p style={typography.bodyText}>Multi-series line chart with interactive legend and hover effects.</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <LinePlot
                  data={energyData}
                  xKey="month"
                  yKeys={['baseline', 'optimized', 'target']}
                  title="Energy Performance Optimization"
                  subtitle="Monthly consumption tracking with targets"
                  xLabel="Month (2024)"
                  yLabel="Energy Consumption (kWh/m²)"
                  legendPosition={legendPosition}
                  colorPalette={selectedPalette}
                  showTooltips={showTooltips}
                />
              </div>
            </div>

            {/* Bar Chart */}
            <div>
              <h3 style={typography.cardTitle}>Bar Chart</h3>
              <p style={typography.bodyText}>Categorical data visualization with hover interactions.</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <BarChart
                  data={buildingData}
                  xKey="building"
                  yKey="consumption"
                  title="Building Energy Comparison"
                  subtitle="Annual consumption across portfolio"
                  xLabel="Building ID"
                  yLabel="Energy Consumption (kWh/m²)"
                  colorPalette={selectedPalette}
                  showTooltips={showTooltips}
                />
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'examples' && (
          <div>
            <h2 style={typography.sectionTitle}>Real-World Examples</h2>
            <p style={typography.bodyText}>
              Practical applications of the design system in building physics contexts:
            </p>

            {/* Thermal Comfort Analysis */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={typography.cardTitle}>Thermal Comfort Analysis</h3>
              <p style={typography.bodyText}>
                Temperature monitoring with thermal gradient palette showing interior/exterior relationships.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <LinePlot
                  data={thermalData}
                  xKey="month"
                  yKeys={['interior', 'exterior', 'comfort']}
                  title="Thermal Comfort Monitoring"
                  subtitle="Interior vs exterior temperatures with comfort targets"
                  xLabel="Month (2024)"
                  yLabel="Temperature (°C)"
                  colorPalette="thermal"
                  legendPosition="inside"
                  showTooltips={true}
                />
              </div>
            </div>

            {/* Building Performance Rating */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={typography.cardTitle}>Building Performance Rating</h3>
              <p style={typography.bodyText}>
                Performance assessment using color-coded quality indicators.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <BarChart
                  data={[
                    { category: 'Energy Efficiency', score: 92 },
                    { category: 'Indoor Air Quality', score: 78 },
                    { category: 'Thermal Comfort', score: 85 },
                    { category: 'Daylighting', score: 67 },
                    { category: 'Acoustics', score: 74 }
                  ]}
                  xKey="category"
                  yKey="score"
                  title="Building Performance Assessment"
                  subtitle="Multi-criteria evaluation scores (0-100)"
                  xLabel="Performance Category"
                  yLabel="Score"
                  colorPalette="performance"
                  showTooltips={true}
                />
              </div>
            </div>

            {/* Usage Guidelines */}
            <div style={styles.card}>
              <h3 style={typography.cardTitle}>Implementation Guidelines</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                <div>
                  <h4 style={{ ...typography.cardTitle, fontSize: '14px', color: C3_colors.bluegreen }}>Palette Selection</h4>
                  <ul style={{ ...typography.bodyText, fontSize: '13px', lineHeight: '1.5' }}>
                    <li>Use <strong>thermal</strong> for temperature data</li>
                    <li>Use <strong>performance</strong> for quality metrics</li>
                    <li>Use <strong>sequential</strong> for ordered rankings</li>
                    <li>Use <strong>diverging</strong> for above/below comparisons</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ ...typography.cardTitle, fontSize: '14px', color: C3_colors.blue }}>Accessibility</h4>
                  <ul style={{ ...typography.bodyText, fontSize: '13px', lineHeight: '1.5' }}>
                    <li>Test with colorblind simulators</li>
                    <li>Ensure sufficient contrast ratios</li>
                    <li>Don't rely solely on color</li>
                    <li>Provide pattern alternatives when needed</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ ...typography.cardTitle, fontSize: '14px', color: C3_colors.greenlight }}>Performance</h4>
                  <ul style={{ ...typography.bodyText, fontSize: '13px', lineHeight: '1.5' }}>
                    <li>Use memoization for expensive calculations</li>
                    <li>Optimize re-renders with proper dependencies</li>
                    <li>Consider data aggregation for large datasets</li>
                    <li>Test on various screen sizes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default C3RROVisualDesignSystemShowcase;