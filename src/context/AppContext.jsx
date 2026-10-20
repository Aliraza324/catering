import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  COMPANY_INFO,
  INITIAL_LOCATIONS,
  INITIAL_CLIENTS,
  INITIAL_MENU_ITEMS,
  INITIAL_INGREDIENTS,
  INITIAL_VENDORS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_RECIPES,
  INITIAL_STAFF,
  INITIAL_INVOICES,
  INITIAL_WASTAGE_LOGS,
  INITIAL_KITCHEN_BATCHES,
  INITIAL_EMPLOYEES,
  INITIAL_DAILY_TRENDS,
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Safe localStorage helper
  const loadState = (key, fallback) => {
    try {
      const stored = localStorage.getItem(`aramya_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [locations, setLocations] = useState(() => loadState('locations', INITIAL_LOCATIONS));
  const [selectedLocationId, setSelectedLocationId] = useState('all');
  const [clients, setClients] = useState(() => loadState('clients', INITIAL_CLIENTS));
  const [menuItems, setMenuItems] = useState(() => loadState('menu_items', INITIAL_MENU_ITEMS));
  const [ingredients, setIngredients] = useState(() => loadState('ingredients', INITIAL_INGREDIENTS));
  const [vendors, setVendors] = useState(() => loadState('vendors', INITIAL_VENDORS));
  const [purchaseOrders, setPurchaseOrders] = useState(() => loadState('purchase_orders', INITIAL_PURCHASE_ORDERS));
  const [recipes, setRecipes] = useState(() => loadState('recipes', INITIAL_RECIPES));
  const [staff, setStaff] = useState(() => loadState('staff', INITIAL_STAFF));
  const [invoices, setInvoices] = useState(() => loadState('invoices', INITIAL_INVOICES));
  const [wastageLogs, setWastageLogs] = useState(() => loadState('wastage_logs', INITIAL_WASTAGE_LOGS));
  const [kitchenBatches, setKitchenBatches] = useState(() => loadState('batches', INITIAL_KITCHEN_BATCHES));
  const [employees, setEmployees] = useState(() => loadState('employees', INITIAL_EMPLOYEES));
  const [dailyTrends] = useState(() => loadState('trends', INITIAL_DAILY_TRENDS));

  const [notification, setNotification] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aramya_clients', JSON.stringify(clients));
      localStorage.setItem('aramya_menu_items', JSON.stringify(menuItems));
      localStorage.setItem('aramya_ingredients', JSON.stringify(ingredients));
      localStorage.setItem('aramya_purchase_orders', JSON.stringify(purchaseOrders));
      localStorage.setItem('aramya_invoices', JSON.stringify(invoices));
      localStorage.setItem('aramya_wastage_logs', JSON.stringify(wastageLogs));
      localStorage.setItem('aramya_batches', JSON.stringify(kitchenBatches));
      localStorage.setItem('aramya_employees', JSON.stringify(employees));
      localStorage.setItem('aramya_staff', JSON.stringify(staff));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [clients, menuItems, ingredients, purchaseOrders, invoices, wastageLogs, kitchenBatches, employees, staff]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Add or Edit Client
  const addClient = (newClient) => {
    const id = `client-${Date.now()}`;
    const code = `CORP-${clients.length + 1}`;
    const client = { ...newClient, id, code, status: 'Active' };
    setClients((prev) => [client, ...prev]);
    showNotification(`Corporate Client "${client.name}" registered successfully.`);
    return client;
  };

  const updateClient = (id, updatedFields) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    showNotification('Client contract and parameters updated.');
  };

  // Add or Edit Menu Item
  const addMenuItem = (item) => {
    const id = `menu-${Date.now()}`;
    const newItem = { ...item, id, isAvailable: true };
    setMenuItems((prev) => [newItem, ...prev]);
    showNotification(`Menu Item "${newItem.name}" added to menu catalog.`);
    return newItem;
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
    showNotification('Menu item pricing/details updated.');
  };

  // Stock In / Out
  const updateStock = (ingredientId, delta, reason = 'Adjustment') => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === ingredientId) {
          const updated = Math.max(0, ing.currentStock + Number(delta));
          return {
            ...ing,
            currentStock: updated,
            lastRestocked: delta > 0 ? new Date().toISOString().split('T')[0] : ing.lastRestocked,
          };
        }
        return ing;
      })
    );
    const ingName = ingredients.find((i) => i.id === ingredientId)?.name || 'Ingredient';
    const action = delta > 0 ? `Stock In: +${delta}` : `Stock Out: ${delta}`;
    showNotification(`${action} recorded for ${ingName} (${reason}).`);
  };

  // Stock Transfer between locations
  const transferStock = (ingredientId, fromLocId, toLocId, qty) => {
    const ing = ingredients.find((i) => i.id === ingredientId);
    if (!ing) return;
    if (ing.currentStock < qty) {
      showNotification('Cannot transfer: Insufficient source stock balance.', 'error');
      return;
    }
    setIngredients((prev) =>
      prev.map((i) => {
        if (i.id === ingredientId) {
          return { ...i, currentStock: i.currentStock - Number(qty) };
        }
        return i;
      })
    );
    const fromLoc = locations.find((l) => l.id === fromLocId)?.name || 'Central Kitchen';
    const toLoc = locations.find((l) => l.id === toLocId)?.name || 'Satellite Pantry';
    showNotification(`Transferred ${qty} ${ing.unit} of ${ing.name} from ${fromLoc} to ${toLoc}.`);
  };

  // Add Purchase Order
  const addPurchaseOrder = (newPO) => {
    const id = `po-${Date.now()}`;
    const poNumber = `PO-2026-${String(purchaseOrders.length + 101)}`;
    const po = { ...newPO, id, poNumber, status: 'Pending Delivery', date: new Date().toISOString().split('T')[0] };
    setPurchaseOrders((prev) => [po, ...prev]);
    showNotification(`Purchase Order ${poNumber} created and dispatched to ${po.vendorName}.`);
  };

  // Receive PO Delivery
  const receivePurchaseOrder = (poId) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    // Automatically increment stock of each line item
    po.items.forEach((item) => {
      if (item.ingredientId) {
        updateStock(item.ingredientId, item.qty, `PO Inward: ${po.poNumber}`);
      }
    });

    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status: 'Delivered' } : p))
    );
    showNotification(`PO ${po.poNumber} marked Delivered. Inventory levels updated.`);
  };

  // Record Client Invoice Payment
  const recordInvoicePayment = (invoiceId, paymentAmount, paymentRef) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaid = Math.min(inv.totalAmount, (inv.paidAmount || 0) + Number(paymentAmount));
          const newStatus = newPaid >= inv.totalAmount ? 'Paid' : newPaid > 0 ? 'Partially Paid' : 'Unpaid';
          return {
            ...inv,
            paidAmount: newPaid,
            status: newStatus,
            paymentRef: paymentRef || inv.paymentRef || `TXN-${Date.now()}`,
          };
        }
        return inv;
      })
    );
    showNotification(`Payment of ₹${Number(paymentAmount).toLocaleString('en-IN')} recorded successfully.`);
  };

  // Log Food Wastage
  const logWastage = (entry) => {
    const id = `wst-${Date.now()}`;
    const totalCost = Number(entry.quantityKg) * Number(entry.unitCost);
    const newEntry = {
      ...entry,
      id,
      totalCost,
      date: new Date().toISOString().split('T')[0],
    };
    setWastageLogs((prev) => [newEntry, ...prev]);
    showNotification(`Logged ${entry.quantityKg} kg wastage for ${entry.foodItem}.`);
  };

  // Update Kitchen Batch Status
  const updateBatchStatus = (batchId, status) => {
    setKitchenBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status } : b))
    );
    showNotification(`Batch status updated to "${status}".`);
  };

  // Punch Employee Meal
  const recordMealPunch = (empId, mealType) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          const currentlyConsumed = emp.consumed[mealType];
          const updatedConsumed = {
            ...emp.consumed,
            [mealType]: !currentlyConsumed,
          };
          const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          return {
            ...emp,
            consumed: updatedConsumed,
            lastPunchTime: !currentlyConsumed ? nowStr : emp.lastPunchTime,
          };
        }
        return emp;
      })
    );
  };

  // Bulk CSV Import for Employee Attendance / Meals
  const importEmployeesCSV = (rows) => {
    if (!rows || rows.length === 0) return;
    const newEmps = rows.map((r, idx) => ({
      id: `emp-csv-${Date.now()}-${idx}`,
      empCode: r.empCode || `EMP-${1000 + employees.length + idx}`,
      name: r.name || 'Sample Employee',
      clientName: r.clientName || 'Nexus Technologies SEZ',
      clientId: r.clientId || 'client-1',
      dept: r.dept || 'Operations',
      attendance: r.attendance || 'Present',
      eligible: {
        breakfast: r.breakfast !== 'false',
        lunch: r.lunch !== 'false',
        dinner: r.dinner === 'true',
        snacks: r.snacks !== 'false',
      },
      consumed: {
        breakfast: r.consumedBreakfast === 'true',
        lunch: r.consumedLunch === 'true',
        dinner: r.consumedDinner === 'true',
        snacks: r.consumedSnacks === 'true',
      },
      lastPunchTime: r.lastPunchTime || '12:30 PM',
    }));

    setEmployees((prev) => [...newEmps, ...prev]);
    showNotification(`Imported ${newEmps.length} employee attendance records from CSV.`);
  };

  // Reset to default demo data
  const resetDemoData = () => {
    localStorage.clear();
    setClients(INITIAL_CLIENTS);
    setMenuItems(INITIAL_MENU_ITEMS);
    setIngredients(INITIAL_INGREDIENTS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setInvoices(INITIAL_INVOICES);
    setWastageLogs(INITIAL_WASTAGE_LOGS);
    setKitchenBatches(INITIAL_KITCHEN_BATCHES);
    setEmployees(INITIAL_EMPLOYEES);
    setStaff(INITIAL_STAFF);
    showNotification('Demo data reset to baseline specifications.');
  };

  // Global Aggregated Stats
  const totalMealsServedToday = kitchenBatches.reduce((acc, b) => acc + (b.actualQty || 0), 0);
  const totalMealsPlannedToday = kitchenBatches.reduce((acc, b) => acc + (b.plannedQty || 0), 0);
  const totalStockValue = ingredients.reduce((acc, i) => acc + i.currentStock * i.unitPrice, 0);
  const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minThreshold).length;

  const totalOutstandingBalance = invoices.reduce(
    (acc, inv) => acc + Math.max(0, inv.totalAmount - (inv.paidAmount || 0)),
    0
  );

  const totalWastageCostToday = wastageLogs
    .filter((w) => w.date === '2026-10-20')
    .reduce((acc, w) => acc + w.totalCost, 0);

  const totalWastageKgToday = wastageLogs
    .filter((w) => w.date === '2026-10-20')
    .reduce((acc, w) => acc + w.quantityKg, 0);

  const value = {
    companyInfo: COMPANY_INFO,
    locations,
    selectedLocationId,
    setSelectedLocationId,
    clients,
    addClient,
    updateClient,
    menuItems,
    addMenuItem,
    updateMenuItem,
    ingredients,
    updateStock,
    transferStock,
    vendors,
    purchaseOrders,
    addPurchaseOrder,
    receivePurchaseOrder,
    recipes,
    staff,
    invoices,
    recordInvoicePayment,
    wastageLogs,
    logWastage,
    kitchenBatches,
    updateBatchStatus,
    employees,
    recordMealPunch,
    importEmployeesCSV,
    dailyTrends,
    notification,
    showNotification,
    resetDemoData,
    // Key Aggregates
    totalMealsServedToday,
    totalMealsPlannedToday,
    totalStockValue,
    lowStockCount,
    totalOutstandingBalance,
    totalWastageCostToday,
    totalWastageKgToday,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
