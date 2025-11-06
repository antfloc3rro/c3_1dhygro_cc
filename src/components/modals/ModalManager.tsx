import { useAppStore } from '@/store/index';
import { MaterialDatabaseModal } from '@/features/materials/components/MaterialDatabaseModal';
import { ClimateSelectionModal } from '@/features/climate/components/ClimateSelectionModal';
import { SurfaceCoefficientsModal } from '@/features/surfaces/components/SurfaceCoefficientsModal';
import { MonitorConfigurationModal } from '@/features/monitors/components/MonitorConfigurationModal';
import { mockMaterialCategories, mockMaterialSubcategories, mockMaterials } from '@/data/mockMaterials';
import { mockClimatePresets } from '@/data/mockClimate';
import { mockSurfacePresets } from '@/data/mockSurfaces';
import { mockMonitorPresets } from '@/data/mockMonitors';

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
  const layers = useAppStore((state) => state.assembly.layers);
  const surfaces = useAppStore((state) => state.assembly.surfaces);
  const monitors = useAppStore((state) => state.assembly.monitors);
  const totalThickness = useAppStore((state) => state.assembly.totalThickness);
  const { updateLayer, updateSurface, addMonitor, updateMonitor, setClimate } = useAppStore(
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
          if (selectedLayer) {
            updateLayer(selectedLayer.id, {
              material: {
                id: material.id,
                name: material.name,
                thermalConductivity: material.properties.thermalConductivity,
                bulkDensity: material.properties.bulkDensity,
                porosity: material.properties.porosity,
                heatCapacity: material.properties.heatCapacity,
              },
            });
          }
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
          setClimate({
            type: climate.type === 'preset' ? 'steady-state' : 'dynamic',
            name: climate.name,
            source: climate.source,
          });
        }}
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
    </>
  );
}
