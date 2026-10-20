import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { KitchenLoader } from './components/common/KitchenLoader';

import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { MenusPage } from './pages/MenusPage';
import { AttendancePage } from './pages/AttendancePage';
import { KitchensPage } from './pages/KitchensPage';
import { InventoryPage } from './pages/InventoryPage';
import { PurchasingPage } from './pages/PurchasingPage';
import { RecipesPage } from './pages/RecipesPage';
import { StaffPage } from './pages/StaffPage';
import { BillingPage } from './pages/BillingPage';
import { WastagePage } from './pages/WastagePage';
import { LocationsPage } from './pages/LocationsPage';
import { ForecastingPage } from './pages/ForecastingPage';

export default function App() {
  const [isInitialBoot, setIsInitialBoot] = useState(true);

  return (
    <AppProvider>
      {isInitialBoot && (
        <KitchenLoader
          variant="fullscreen"
          autoCompleteDuration={1600}
          onComplete={() => setIsInitialBoot(false)}
        />
      )}
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/menus" element={<MenusPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/kitchens" element={<KitchensPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/purchasing" element={<PurchasingPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/wastage" element={<WastagePage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/forecasting" element={<ForecastingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
}
