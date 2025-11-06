import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/index';
import { useToast } from '@/components/ui/Toast';

/**
 * Custom hook for auto-saving project changes with debouncing
 *
 * Features:
 * - 1-second debounce (as per spec)
 * - Only saves when there are actual changes
 * - Saves to localStorage and optionally to API
 * - Shows toast notifications on save
 * - Handles save errors gracefully
 */
export function useAutoSave(enabled: boolean = true, debounceMs: number = 1000) {
  const assembly = useAppStore((state) => state.assembly);
  const project = useAppStore((state) => state.project);
  const climate = useAppStore((state) => state.climate);
  const { showToast } = useToast();

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedStateRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);

  const saveProject = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;

    try {
      isSavingRef.current = true;

      // Create save payload
      const saveData = {
        assembly,
        project,
        climate,
        savedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const serializedData = JSON.stringify(saveData);

      // Check if data has actually changed
      if (serializedData === lastSavedStateRef.current) {
        isSavingRef.current = false;
        return;
      }

      // Save to localStorage
      localStorage.setItem('wufi-cloud-project-autosave', serializedData);
      lastSavedStateRef.current = serializedData;

      // Optionally save to API (for future implementation)
      // await saveToAPI(saveData);

      // Show success toast
      showToast('success', 'Project saved', undefined, 2000);

      console.log('[AutoSave] Project saved at', new Date().toISOString());
    } catch (error) {
      console.error('[AutoSave] Save failed:', error);
      showToast('error', 'Failed to save project', undefined, 4000);
    } finally {
      isSavingRef.current = false;
    }
  }, [assembly, project, climate, enabled, showToast]);

  // Watch for changes and trigger debounced save
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      saveProject();
    }, debounceMs);

    // Cleanup on unmount or dependency change
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [assembly, project, climate, enabled, debounceMs, saveProject]);

  // Manual save function (can be called directly, e.g., on Cmd+S)
  const saveNow = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveProject();
  }, [saveProject]);

  return { saveNow };
}

/**
 * Hook to restore project from auto-save on app load
 */
export function useRestoreAutoSave() {
  const setProject = useAppStore((state) => state.actions.setProject);
  const addLayer = useAppStore((state) => state.actions.addLayer);
  const setClimate = useAppStore((state) => state.actions.setClimate);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('wufi-cloud-project-autosave');
      if (!savedData) return;

      const parsed = JSON.parse(savedData);

      // Restore assembly layers
      if (parsed.assembly?.layers) {
        parsed.assembly.layers.forEach((layer: any) => {
          addLayer(layer);
        });
      }

      // Restore project data
      if (parsed.project?.currentProject) {
        setProject(parsed.project.currentProject);
      }

      // Restore climate
      if (parsed.climate?.climate) {
        setClimate(parsed.climate.climate);
      }

      const savedAt = parsed.savedAt ? new Date(parsed.savedAt) : null;
      const timeAgo = savedAt
        ? Math.round((Date.now() - savedAt.getTime()) / 1000 / 60)
        : null;

      showToast(
        'info',
        'Project restored',
        `Restored from ${timeAgo ? `${timeAgo} minutes ago` : 'auto-save'}`,
        3000
      );

      console.log('[AutoSave] Project restored from auto-save');
    } catch (error) {
      console.error('[AutoSave] Failed to restore project:', error);
    }
  }, [addLayer, setProject, setClimate, showToast]);
}
