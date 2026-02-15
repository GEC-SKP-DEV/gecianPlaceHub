"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProjectGrid from '@/components/repeto/ProjectGrid';
import FilterSection from '@/components/repeto/FilterSection';
import TabSection from '@/components/repeto/TabSection';
import AddProjectFAB from '@/components/repeto/AddProjectFAB';
import Link from 'next/link';
import LoadingScreen from '@/components/loadingScrenn';

export default function Home() {
  const [activeTab, setActiveTab] = useState("Active");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setRefreshTrigger(prev => !prev);
  }, []);

  const handleClearFilters = () => {
    // Clear all filters
    setFilters({});
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex flex-col md:flex-row p-4 md:p-0">
        <FilterSection onFilterSubmit={setFilters} onClearFilters={handleClearFilters} />
        <div className="flex-1 max-w-7xl px-4 py-6 space-y-8 w-full">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Active Job Opportunities</h1>
            <p className="text-gray-600">Discover placement opportunities from top companies</p>
          </div>
          <TabSection activeTab={activeTab} onTabChange={setActiveTab} />
          <ProjectGrid activeTab={activeTab} filters={filters} refreshTrigger={refreshTrigger} />
        </div>
        <AddProjectFAB />
      </div>
      {/* <Footer /> */}
    </main>
  );
}
