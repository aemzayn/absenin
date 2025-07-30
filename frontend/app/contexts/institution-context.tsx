"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface Institution {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  establishedDate: string;
  capacity: number;
  currentOrphans: number;
  role: "admin" | "staff" | "volunteer";
  code: string; // Add this line
}

interface InstitutionContextType {
  institutions: Institution[];
  currentInstitution: Institution | null;
  setCurrentInstitution: (institution: Institution) => void;
  addInstitution: (institution: Institution) => void;
  updateInstitution: (id: string, updates: Partial<Institution>) => void;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(
  undefined
);

// Mock institutions data
const mockInstitutions: Institution[] = [
  {
    id: "INST001",
    name: "Sunshine Children's Home",
    address: "123 Hope Street, City Center",
    phone: "+1234567890",
    email: "contact@sunshine.org",
    description: "A loving home for children in need since 1985",
    establishedDate: "1985-03-15",
    capacity: 200,
    currentOrphans: 156,
    role: "admin",
    code: "SCH2024", // Add institution code
  },
  {
    id: "INST002",
    name: "Rainbow Care Foundation",
    address: "456 Care Avenue, Downtown",
    phone: "+1234567891",
    email: "info@rainbow.org",
    description: "Providing hope and care for vulnerable children",
    establishedDate: "1992-08-20",
    capacity: 150,
    currentOrphans: 89,
    role: "staff",
    code: "RCF1992", // Add institution code
  },
  {
    id: "INST003",
    name: "Little Angels Orphanage",
    address: "789 Angel Road, Suburbs",
    phone: "+1234567892",
    email: "hello@littleangels.org",
    description: "Creating bright futures for every child",
    establishedDate: "2001-12-10",
    capacity: 100,
    currentOrphans: 67,
    role: "volunteer",
    code: "LAO2001", // Add institution code
  },
];

export function InstitutionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [institutions, setInstitutions] =
    useState<Institution[]>(mockInstitutions);
  const [currentInstitution, setCurrentInstitution] =
    useState<Institution | null>(null);

  useEffect(() => {
    // Set first institution as default
    if (institutions.length > 0 && !currentInstitution) {
      setCurrentInstitution(institutions[0]);
    }
  }, [institutions, currentInstitution]);

  const addInstitution = (institution: Institution) => {
    setInstitutions([...institutions, institution]);
  };

  const updateInstitution = (id: string, updates: Partial<Institution>) => {
    setInstitutions(
      institutions.map((inst) =>
        inst.id === id ? { ...inst, ...updates } : inst
      )
    );
    if (currentInstitution?.id === id) {
      setCurrentInstitution({ ...currentInstitution, ...updates });
    }
  };

  return (
    <InstitutionContext.Provider
      value={{
        institutions,
        currentInstitution,
        setCurrentInstitution,
        addInstitution,
        updateInstitution,
      }}
    >
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitution() {
  const context = useContext(InstitutionContext);
  if (context === undefined) {
    throw new Error(
      "useInstitution must be used within an InstitutionProvider"
    );
  }
  return context;
}
