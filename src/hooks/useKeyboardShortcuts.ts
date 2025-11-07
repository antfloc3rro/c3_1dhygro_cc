import { useEffect } from 'react';
import { useAppStore } from '@/store/index';

/**
 * Custom hook for keyboard shortcuts
 *
 * Shortcuts:
 * - Cmd/Ctrl + Z: Undo
 * - Cmd/Ctrl + Shift + Z: Redo
 * - Cmd/Ctrl + Y: Redo (alternative)
 * - Cmd/Ctrl + S: Save
 * - Cmd/Ctrl + D: Duplicate selected layer
 * - Delete/Backspace: Delete selected layer/monitor
 * - Escape: Close modal/Clear selection
 */
export function useKeyboardShortcuts(saveCallback?: () => void) {
  const undo = useAppStore((state) => state.actions.undo);
  const redo = useAppStore((state) => state.actions.redo);
  const canUndo = useAppStore((state) => state.actions.canUndo);
  const canRedo = useAppStore((state) => state.actions.canRedo);
  const openModal = useAppStore((state) => state.ui.openModal);
  const closeModal = useAppStore((state) => state.actions.closeModal);
  const selectedLayerId = useAppStore((state) => state.ui.selectedLayerId);
  const selectedMonitorId = useAppStore((state) => state.ui.selectedMonitorId);
  const duplicateLayer = useAppStore((state) => state.actions.duplicateLayer);
  const deleteLayer = useAppStore((state) => state.actions.deleteLayer);
  const deleteMonitor = useAppStore((state) => state.actions.deleteMonitor);
  const selectLayer = useAppStore((state) => state.actions.selectLayer);
  const selectMonitor = useAppStore((state) => state.actions.selectMonitor);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Cmd+S and Cmd+Z even in inputs
        if (!ctrlKey || (event.key !== 's' && event.key !== 'z' && event.key !== 'y')) {
          return;
        }
      }

      // Undo: Cmd/Ctrl + Z (without Shift)
      if (ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo()) {
          undo();
          console.log('[Shortcuts] Undo triggered');
        }
        return;
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if ((ctrlKey && event.shiftKey && event.key === 'z') || (ctrlKey && event.key === 'y')) {
        event.preventDefault();
        if (canRedo()) {
          redo();
          console.log('[Shortcuts] Redo triggered');
        }
        return;
      }

      // Save: Cmd/Ctrl + S
      if (ctrlKey && event.key === 's') {
        event.preventDefault();
        if (saveCallback) {
          saveCallback();
          console.log('[Shortcuts] Save triggered');
        }
        return;
      }

      // Duplicate: Cmd/Ctrl + D
      if (ctrlKey && event.key === 'd') {
        event.preventDefault();
        if (selectedLayerId) {
          duplicateLayer(selectedLayerId);
          console.log('[Shortcuts] Duplicate layer triggered');
        }
        return;
      }

      // Delete: Delete or Backspace (without Cmd/Ctrl)
      if ((event.key === 'Delete' || event.key === 'Backspace') && !ctrlKey) {
        // Don't delete if modal is open
        if (openModal) return;

        event.preventDefault();
        if (selectedLayerId) {
          const confirmDelete = confirm('Delete selected layer?');
          if (confirmDelete) {
            deleteLayer(selectedLayerId);
            selectLayer(null);
            console.log('[Shortcuts] Delete layer triggered');
          }
        } else if (selectedMonitorId) {
          const confirmDelete = confirm('Delete selected monitor?');
          if (confirmDelete) {
            deleteMonitor(selectedMonitorId);
            selectMonitor(null);
            console.log('[Shortcuts] Delete monitor triggered');
          }
        }
        return;
      }

      // Escape: Close modal or clear selection
      if (event.key === 'Escape') {
        if (openModal) {
          closeModal();
          console.log('[Shortcuts] Close modal triggered');
        } else if (selectedLayerId) {
          selectLayer(null);
          console.log('[Shortcuts] Clear layer selection');
        } else if (selectedMonitorId) {
          selectMonitor(null);
          console.log('[Shortcuts] Clear monitor selection');
        }
        return;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    saveCallback,
    openModal,
    closeModal,
    selectedLayerId,
    selectedMonitorId,
    duplicateLayer,
    deleteLayer,
    deleteMonitor,
    selectLayer,
    selectMonitor,
  ]);
}

/**
 * Get platform-specific keyboard shortcut text
 */
export function getShortcutText(
  key: string,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];

  if (modifiers.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (modifiers.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (modifiers.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }

  parts.push(key.toUpperCase());

  return parts.join(isMac ? '' : '+');
}
