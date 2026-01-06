"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MenuItem } from '@/data/menu';

export interface SelectedRow {
  id: string;
  item: MenuItem;
  qty: number;
  slug: string; // categoría origen
}

interface SelectionContextValue {
  items: SelectedRow[];
  total: number;
  add: (item: MenuItem, slug: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);
const LS_KEY = 'sel_v1';

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<SelectedRow[]>([]);

  // Cargar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter(r => r && r.id && r.qty > 0));
      }
    } catch {}
  }, []);

  const persist = (next: SelectedRow[]) => {
    setItems(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  const add = useCallback((item: MenuItem, slug: string) => {
    setItems(prev => {
      const found = prev.find(p => p.id === item.id);
      let next: SelectedRow[];
      if (found) {
        next = prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      } else {
        next = [...prev, { id: item.id, item, qty: 1, slug }];
      }
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const inc = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p);
      persist(next);
      return next;
    });
  }, []);

  const dec = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.map(p => p.id === id ? { ...p, qty: p.qty - 1 } : p).filter(p => p.qty > 0);
      persist(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(p => p.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => { persist([]); }, []);

  const total = items.reduce((s, r) => s + r.qty, 0);

  return (
    <SelectionContext.Provider value={{ items, total, add, inc, dec, remove, clear }}>
      {children}
    </SelectionContext.Provider>
  );
};

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection debe usarse dentro de SelectionProvider');
  return ctx;
}

// Export default (no requerido pero ayuda a ciertos analizadores/bundlers)
export default SelectionContext;
