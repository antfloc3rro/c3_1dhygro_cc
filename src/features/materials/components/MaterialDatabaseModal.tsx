import { useState, useMemo, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Search, Check } from 'lucide-react';
import { Material, MaterialCategory, MaterialSubcategory } from '../types';
import { cn } from '../../../lib/utils';
import { useAppStore } from '../../../store/index';

interface MaterialDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (material: Material) => void;
  categories: MaterialCategory[];
  subcategories: MaterialSubcategory[];
  materials: Material[];
}

export function MaterialDatabaseModal({
  isOpen,
  onClose,
  onSelect,
  categories,
  subcategories,
  materials,
}: MaterialDatabaseModalProps) {
  // Use store for persistent modal state
  const modalPrefs = useAppStore((state) => state.ui.modalPreferences.materialDatabase);
  const setModalPrefs = useAppStore((state) => state.actions.setMaterialDatabasePreferences);

  const selectedCategory = modalPrefs.selectedCategory;
  const selectedSubcategory = modalPrefs.selectedSubcategory;
  const searchQuery = modalPrefs.searchQuery;

  const setSelectedCategory = (category: string | null) => setModalPrefs({ selectedCategory: category });
  const setSelectedSubcategory = (subcategory: string | null) => setModalPrefs({ selectedSubcategory: subcategory });
  const setSearchQuery = (query: string) => setModalPrefs({ searchQuery: query });

  // Local state for current selection (not persisted)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Clear search query when modal opens (fresh start each time)
  useEffect(() => {
    if (isOpen && searchQuery) {
      setSearchQuery('');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter subcategories by selected category
  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories.filter((sub) => sub.categoryId === selectedCategory);
  }, [selectedCategory, subcategories]);

  // Filter materials by category, subcategory, and search query
  const filteredMaterials = useMemo(() => {
    let result = materials;

    // Filter by subcategory if selected, otherwise by category
    if (selectedSubcategory) {
      result = result.filter((mat) => mat.subcategory === selectedSubcategory);
    } else if (selectedCategory) {
      result = result.filter((mat) => mat.category === selectedCategory);
    }

    // Additional filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (mat) =>
          mat.name.toLowerCase().includes(query) ||
          mat.category.toLowerCase().includes(query) ||
          mat.subcategory.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, selectedSubcategory, searchQuery, materials]);

  // Virtual scrolling for categories
  const categoriesParentRef = useRef<HTMLDivElement | null>(null);
  const categoriesVirtualizer = useVirtualizer({
    count: categories.length,
    getScrollElement: () => categoriesParentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  // Virtual scrolling for subcategories
  const subcategoriesParentRef = useRef<HTMLDivElement | null>(null);
  const subcategoriesVirtualizer = useVirtualizer({
    count: filteredSubcategories.length,
    getScrollElement: () => subcategoriesParentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  // Virtual scrolling for materials
  const materialsParentRef = useRef<HTMLDivElement | null>(null);
  const materialsVirtualizer = useVirtualizer({
    count: filteredMaterials.length,
    getScrollElement: () => materialsParentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  });

  const handleSelect = () => {
    if (selectedMaterial) {
      onSelect(selectedMaterial);
      // Clear search for next time modal opens
      setSearchQuery('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedMaterial(null);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Material Database"
      size="2xl"
    >
      <div className="space-y-md">
        {/* Search */}
        <Input
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={Search}
        />

        {/* 3-Column Layout */}
        <div className="grid grid-cols-3 gap-md h-[50vh] max-h-[600px]">
          {/* Categories Column */}
          <div className="flex flex-col border border-greylight rounded">
            <div className="px-md py-sm border-b border-greylight bg-greylight/5 font-medium text-sm">
              Categories
            </div>
            <div
              ref={categoriesParentRef}
              className="flex-1 overflow-auto"
            >
              <div
                style={{
                  height: `${categoriesVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {categoriesVirtualizer.getVirtualItems().map((virtualItem) => {
                  const category = categories[virtualItem.index];
                  const isSelected = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory(null);
                        setSelectedMaterial(null);
                      }}
                      className={cn(
                        'absolute left-0 w-full px-md py-sm text-left text-sm transition-colors duration-200',
                        'hover:bg-greylight/10',
                        isSelected && 'bg-bluegreen/10 border-l-2 border-bluegreen font-medium'
                      )}
                      style={{
                        top: `${virtualItem.start}px`,
                        height: `${virtualItem.size}px`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className="text-greydark text-xs">({category.count})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Subcategories Column */}
          <div className="flex flex-col border border-greylight rounded">
            <div className="px-md py-sm border-b border-greylight bg-greylight/5 font-medium text-sm">
              Subcategories
            </div>
            <div
              ref={subcategoriesParentRef}
              className="flex-1 overflow-auto"
            >
              {!selectedCategory ? (
                <div className="flex items-center justify-center h-full text-greydark text-sm">
                  Select a category
                </div>
              ) : (
                <div
                  style={{
                    height: `${subcategoriesVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {subcategoriesVirtualizer.getVirtualItems().map((virtualItem) => {
                    const subcategory = filteredSubcategories[virtualItem.index];
                    const isSelected = selectedSubcategory === subcategory.id;

                    return (
                      <button
                        key={subcategory.id}
                        onClick={() => {
                          setSelectedSubcategory(subcategory.id);
                          setSelectedMaterial(null);
                        }}
                        className={cn(
                          'absolute left-0 w-full px-md py-sm text-left text-sm transition-colors duration-200',
                          'hover:bg-greylight/10',
                          isSelected && 'bg-bluegreen/10 border-l-2 border-bluegreen font-medium'
                        )}
                        style={{
                          top: `${virtualItem.start}px`,
                          height: `${virtualItem.size}px`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{subcategory.name}</span>
                          <span className="text-greydark text-xs">({subcategory.count})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Materials Column */}
          <div className="flex flex-col border border-greylight rounded">
            <div className="px-md py-sm border-b border-greylight bg-greylight/5 font-medium text-sm">
              Materials
            </div>
            <div
              ref={materialsParentRef}
              className="flex-1 overflow-auto"
            >
              {!selectedCategory && !searchQuery ? (
                <div className="flex items-center justify-center h-full text-greydark text-sm">
                  Select a category to browse materials
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="flex items-center justify-center h-full text-greydark text-sm">
                  No materials found
                </div>
              ) : (
                <div
                  style={{
                    height: `${materialsVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {materialsVirtualizer.getVirtualItems().map((virtualItem) => {
                    const material = filteredMaterials[virtualItem.index];
                    const isSelected = selectedMaterial?.id === material.id;

                    return (
                      <button
                        key={material.id}
                        onClick={() => setSelectedMaterial(material)}
                        className={cn(
                          'absolute left-0 w-full px-md py-sm text-left text-sm transition-colors duration-200',
                          'hover:bg-greylight/10',
                          isSelected && 'bg-bluegreen/10 border-l-2 border-bluegreen'
                        )}
                        style={{
                          top: `${virtualItem.start}px`,
                          height: `${virtualItem.size}px`,
                        }}
                      >
                        <div className="font-medium">{material.name}</div>
                        <div className="text-xs text-greydark mt-1">
                          λ: {material.properties.thermalConductivity.toFixed(3)} W/(m·K)
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Material Properties Preview */}
        {selectedMaterial && (
          <div className="border border-greylight rounded p-md bg-greylight/5">
            <h4 className="font-medium mb-sm">Material Properties</h4>
            <div className="grid grid-cols-2 gap-sm text-sm">
              <div>
                <span className="text-greydark">Thermal Conductivity (λ):</span>
                <span className="ml-2 font-medium">
                  {selectedMaterial.properties.thermalConductivity.toFixed(4)} W/(m·K)
                </span>
              </div>
              <div>
                <span className="text-greydark">Bulk Density (ρ):</span>
                <span className="ml-2 font-medium">
                  {selectedMaterial.properties.bulkDensity.toFixed(1)} kg/m³
                </span>
              </div>
              <div>
                <span className="text-greydark">Porosity:</span>
                <span className="ml-2 font-medium">
                  {selectedMaterial.properties.porosity.toFixed(3)} m³/m³
                </span>
              </div>
              <div>
                <span className="text-greydark">Heat Capacity (c):</span>
                <span className="ml-2 font-medium">
                  {selectedMaterial.properties.heatCapacity.toFixed(0)} J/(kg·K)
                </span>
              </div>
            </div>
            {selectedMaterial.notes && (
              <div className="mt-sm pt-sm border-t border-greylight text-xs text-greydark">
                {selectedMaterial.notes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-sm mt-lg">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSelect}
          disabled={!selectedMaterial}
          icon={Check}
        >
          Select Material
        </Button>
      </div>
    </Modal>
  );
}
