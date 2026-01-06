"use client";
import React from 'react';
import { SelectionProvider } from '@/context/SelectionContext';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SelectionProvider>{children}</SelectionProvider>;
};

export default ClientLayout;