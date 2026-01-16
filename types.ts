
// Import React to resolve the "Cannot find namespace 'React'" error
import React from 'react';

export type Category = 
  | 'Image Tools' 
  | 'Design Tools' 
  | 'Dev Tools' 
  | 'Text Tools' 
  | 'Social Tools' 
  | 'Utilities' 
  | 'Daily Pulse'
  | 'Unit Converters'
  | 'Theme Generator'
  | 'Photography'
  | 'Curated Resources';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: React.ReactNode;
  component: React.ComponentType;
}

export interface NavGroup {
  category: Category;
  tools: Tool[];
}
