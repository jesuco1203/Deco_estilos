'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  activeSection: string | null;
  showSection: (sectionId: string) => void;
  hideAllSections: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const showSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const hideAllSections = () => {
    setActiveSection(null);
  };

  return (
    <UIContext.Provider value={{ activeSection, showSection, hideAllSections }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};