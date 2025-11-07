import { useAppStore } from '@/store/index';
import { MaterialDatabaseModal } from '@/features/materials/components/MaterialDatabaseModal';
import { MaterialPropertiesModal } from '@/features/materials/components/MaterialPropertiesModal';
import { ClimateSelectionModal } from '@/features/climate/components/ClimateSelectionModal';
import { SurfaceCoefficientsModal } from '@/features/surfaces/components/SurfaceCoefficientsModal';
import { MonitorConfigurationModal } from '@/features/monitors/components/MonitorConfigurationModal';
import { mockMaterialCategories, mockMaterialSubcategories, mockMaterials } from '@/data/mockMaterials';
import { mockClimatePresets } from '@/data/mockClimate';
import { mockSurfacePresets } from '@/data/mockSurfaces';
import { mockMonitorPresets } from '@/data/mockMonitors';
import { DEFAULT_INITIAL_TEMPERATURE, DEFAULT_INITIAL_HUMIDITY } from '@/constants/defaults';
import { Layer } from '@/types/index';

/**
 * ModalManager component that handles rendering all modals based on openModal state
 * This centralizes modal logic and provides proper data connections
 */
export function ModalManager() {
  const openModal = useAppStore((state) => state.ui.openModal);
  const closeModal = useAppStore((state) => state.actions.closeModal);
  const selectedLayerId = useAppStore((state) => state.ui.selectedLayerId);
  const selectedSurfaceId = useAppStore((state) => state.ui.selectedSurfaceId);
  const selectedMonitorId = useAppStore((state) => state.ui.selectedMonitorId);
  const climateActiveSide = useAppStore((state) => state.climate.activeSide);
  const layers = useAppStore((state) => state.assembly.layers);
  const surfaces = useAppStore((state) => state.assembly.surfaces);
  const monitors = useAppStore((state) => state.assembly.monitors);
  const totalThickness = useAppStore((state) => state.assembly.totalThickness);
  const { addLayer, updateLayer, updateSurface, addMonitor, updateMonitor, setExteriorClimate, setInteriorClimate } = useAppStore(
    (state) => state.actions
  );

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const selectedSurface =
    selectedSurfaceId === surfaces.exterior.id
      ? surfaces.exterior
      : selectedSurfaceId === surfaces.interior.id
      ? surfaces.interior
      : null;
  const selectedMonitor = monitors.find((m) => m.id === selectedMonitorId);

  return (
    <>
      {/* Material Database Modal */}
      <MaterialDatabaseModal
        isOpen={openModal === 'material-database'}
        onClose={closeModal}
        onSelect={(material) => {
          // Create material object compatible with Layer's Material type
          const layerMaterial = {
            id: material.id,
            name: material.name,
            thermalConductivity: material.properties.thermalConductivity,
            bulkDensity: material.properties.bulkDensity,
            porosity: material.properties.porosity,
            heatCapacity: material.properties.heatCapacity,
            vaporResistanceFactor: material.hygrothermal?.waterVaporDiffusionResistance || 1.0,
          };

          if (selectedLayer) {
            // Update existing layer's material
            updateLayer(selectedLayer.id, {
              material: layerMaterial,
            });
          } else {
            // Create new layer with selected material
            const newLayer: Layer = {
              id: `layer_${Date.now()}`,
              name: material.name,
              material: layerMaterial,
              thickness: 0.1, // Default 100mm
              initialTemperature: DEFAULT_INITIAL_TEMPERATURE,
              initialHumidity: DEFAULT_INITIAL_HUMIDITY,
            };
            addLayer(newLayer);
          }

          // Close modal after selection
          closeModal();
        }}
        categories={mockMaterialCategories}
        subcategories={mockMaterialSubcategories}
        materials={mockMaterials}
      />

      {/* Climate Selection Modal */}
      <ClimateSelectionModal
        isOpen={openModal === 'climate-selection'}
        onClose={closeModal}
        onSelect={(climate) => {
          const climateData = {
            type: climate.type === 'preset' ? 'steady-state' : 'dynamic',
            name: climate.name,
            source: climate.source,
          };

          // Set climate based on active side
          if (climateActiveSide === 'exterior') {
            setExteriorClimate(climateData);
          } else {
            setInteriorClimate(climateData);
          }
        }}
        initialApplication={climateActiveSide === 'exterior' ? 'outdoor' : 'indoor'}
        presets={mockClimatePresets}
      />

      {/* Surface Coefficients Modal */}
      {selectedSurface && (
        <SurfaceCoefficientsModal
          isOpen={openModal === 'surface-coefficients'}
          onClose={closeModal}
          onSave={(updatedSurface) => {
            const side = updatedSurface.type === 'exterior' ? 'exterior' : 'interior';
            updateSurface(side, updatedSurface);
          }}
          surface={selectedSurface}
          presets={mockSurfacePresets}
        />
      )}

      {/* Monitor Configuration Modal */}
      <MonitorConfigurationModal
        isOpen={openModal === 'monitor-config'}
        onClose={closeModal}
        onSave={(monitor) => {
          if (selectedMonitor) {
            updateMonitor(monitor.id, monitor);
          } else {
            addMonitor(monitor);
          }
        }}
        monitor={selectedMonitor}
        layers={layers}
        totalThickness={totalThickness}
        presets={mockMonitorPresets}
      />

      {/* Material Properties Modal */}
      {selectedLayer && (
        <MaterialPropertiesModal
          isOpen={openModal === 'material-properties'}
          onClose={closeModal}
          material={selectedLayer.material}
          onSave={(updates) => {
            updateLayer(selectedLayer.id, {
              material: {
                ...selectedLayer.material,
                ...updates,
              },
            });
          }}
        />
      )}
    </>
  );
}
