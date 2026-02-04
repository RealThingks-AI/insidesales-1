import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ActionItemColumnConfig {
  field: string;
  label: string;
  visible: boolean;
  order: number;
  width: number;
}

const defaultColumnWidths: Record<string, number> = {
  checkbox: 48,
  title: 300,
  assigned_to: 120,
  status: 110,
  due_date: 100,
  priority: 80,
  module: 140,
  actions: 80,
};

export function useActionItemColumnPreferences() {
  const { user } = useAuth();
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(defaultColumnWidths);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load column preferences from localStorage (fallback) or could be DB
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        // First try localStorage for faster load
        const savedWidths = localStorage.getItem(`action-items-column-widths-${user.id}`);
        if (savedWidths) {
          const parsed = JSON.parse(savedWidths);
          setColumnWidths({ ...defaultColumnWidths, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load column preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save column widths
  const saveColumnWidths = async (newWidths: Record<string, number>) => {
    if (!user) return;

    setColumnWidths(newWidths);
    
    // Save to localStorage for immediate persistence
    try {
      localStorage.setItem(
        `action-items-column-widths-${user.id}`,
        JSON.stringify(newWidths)
      );
    } catch (error) {
      console.error('Failed to save column widths:', error);
    }
  };

  // Update a single column width
  const updateColumnWidth = (field: string, width: number) => {
    const newWidths = { ...columnWidths, [field]: width };
    saveColumnWidths(newWidths);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    saveColumnWidths(defaultColumnWidths);
  };

  return {
    columnWidths,
    isLoading,
    isSaving,
    updateColumnWidth,
    saveColumnWidths,
    resetToDefaults,
  };
}
