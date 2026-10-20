# ARAMYA FOODS PVT LTD — Corporate Catering & Canteen Management ERP

A professional, high-density, interactive frontend web demo engineered for **ARAMYA FOODS PVT LTD** to demonstrate end-to-end corporate catering workflows, kitchen commissary operations, live meal punch attendance, recipe unit costing, and rule-based AI demand forecasting.

Designed and built following **Taste Skill (Anti-Slop Art Direction & B2B App Screen Rules)** using the **Framed Sheet** architecture with IBM Plex typography, disciplined color tokens, and authentic domain data.

---

## 1. Technology Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Framed Sheet Design Tokens
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM v7
- **Typography**: Google Fonts — *IBM Plex Sans* (Primary UI) & *IBM Plex Mono* (SKUs, Currency & Tabular Figures)
- **State Store**: Centralized reactive React Context with persistent browser `localStorage` syncing and instant reset capabilities

---

## 2. Implemented Business Modules (13 Core Modules)

### 2.1 Overview Dashboard (`/`)
- Total meals served today vs planned batch yields with live fulfillment percentage.
- Active corporate client portfolios and kitchen facility count.
- Daily sales revenue, raw food cost, and estimated gross profit margin (%).
- Critical inventory stock shortage alerts with direct stock movement triggers.
- Pending corporate client receivables and receivables summary.
- Daily food wastage metrics (kg & financial value loss).
- 7-day trend chart with multi-series switcher: Meal Volume, Sales & Profit (₹), and Wastage (kg).
- Real-time active batch status tracking with HACCP temperature probe compliance.

### 2.2 Corporate Client Management (`/clients`)
- Complete client portfolio cards: *Nexus Technologies SEZ*, *Vertex BioLabs Global*, *Horizon FinServ Towers*.
- Client contract details, SPOC contact persons, corporate site addresses, and GSTIN records.
- Daily meal entitlements (Breakfast, Lunch, Dinner, High-Tea caps) and negotiated per-pax tariffs.
- Designated kitchen commissary assignments.
- Monthly spend cap consumption progress bars.
- Interactive modal to register new corporate clients.
- One-click corporate contract terms text file export.

### 2.3 Menu & Meal Management (`/menus`)
- Rotational thali and catering menu catalog across slots: Breakfast, Lunch, Snacks, Dinner.
- Dietary tags: Vegetarian, Non-Vegetarian, Vegan / Jain Friendly.
- Recipe specifications: Portion weight (grams), calories (kcal), food cost %, selling price, and allergen disclosures.
- Daily Kitchen Production Sheet mode: batch schedules, prep windows, and FSSAI hot holding dispatch checklists.
- Add new menu item modal with automatic gross margin and food cost percentage calculation.
- Browser print support for daily batch sheets.

### 2.4 Employee Meal Counting & Attendance (`/attendance`)
- Employee roster across corporate client accounts with unique employee IDs (`NEX-1001`, `VER-2001`, `HOR-3001`, etc.).
- Daily attendance statuses: *Present on Site*, *Work From Home (WFH)*, *On Leave*.
- Meal entitlements & interactive punch desk: click to punch Breakfast, Lunch, or High-Tea in real time.
- Biometric simulation with timestamp recording.
- Client filter and real-time search across employees, departments, and IDs.
- Simulated CSV Import interface to ingest HRMS attendance feeds.

### 2.5 Kitchen Operations (`/kitchens`)
- Dual-facility operational view:
  * **Central Commissary & Base Kitchen** (Okhla Phase III): Heavy batching, steam kettles, 3,500 daily capacity.
  * **Cyber Gateway Satellite Finishing Pantry** (DLF Cybercity Gurugram): Live regeneration, tandoor counter, 1,400 daily capacity.
- Production phases: *Prepped & Simmering* ➔ *In Cooking / Assembly* ➔ *Ready to Serve* ➔ *Dispatched & Delivered*.
- Interactive phase progression via dropdown selector.
- FSSAI HACCP core temperature probe audit logs.
- Daily operational shift handover notes with live submission form.

### 2.6 Inventory & Stock Management (`/inventory`)
- Raw material ingredients directory with SKUs, units (kg, L, bags, units), unit prices, and expiry dates.
- Automated low-stock warning indicators when stock drops below minimum safety thresholds.
- Total warehouse inventory valuation in ₹.
- Interactive Stock Movement Modal:
  * **Stock In (+)**: Receive supplier delivery.
  * **Stock Out (-)**: Issue raw ingredients to kitchen batch.
  * **Location Transfer**: Move inventory from Central Base Kitchen to Satellite Pantry.

### 2.7 Purchasing & Vendor Management (`/purchasing`)
- Directory of institutional vendors (*Mother Dairy*, *Royal Agri Grain Mills*, *GreenFarm APMC*, *Annapurna Spices*).
- Complete Purchase Orders listing with PO numbers, dates, line items, and delivery statuses.
- Interactive PO generator with dynamic multi-line item addition, subtotal, 5% GST, and grand total.
- **Simulated Receiving**: Clicking "Receive Delivery" marks PO delivered and automatically increments corresponding ingredient inventory in the warehouse!

### 2.8 Recipe Formulation & Food Costing (`/recipes`)
- Recipe catalog (*Executive North Indian Thali*, *Hyderabadi Dum Chicken Biryani*, *South Indian Idli-Vada*).
- Interactive Live Recipe Cost Simulator:
  * Adjust batch portion yields.
  * Adjust selling price per portion.
  * Edit individual ingredient quantities and unit rates.
  * Live calculated metrics: Total Batch Cost, Cost per Serving, Food Cost %, Gross Profit Margin %, and Batch Profit.

### 2.9 Staff & HR Management (`/staff`)
- Culinary brigade profiles: Executive Head Chef, Hot Kitchen Sous Chef, Satellite Pantry Lead, QA Officer, Logistics Lead, Kitchen Stewards.
- Shift schedules, duty attendance, and FSSAI hygiene audit compliance scores.
- Interactive Compensation & Overtime Calculator:
  * Base Salary + Monthly Allowances + Overtime Pay (hours × hourly rate) − Statutory Deductions (PF/ESI/TDS) = Net Estimated Monthly Disbursal.

### 2.10 Sales, Expenses & Billing (`/billing`)
- Corporate client tax invoices (`INV-2026-081`, `INV-2026-082`, `INV-2026-083`).
- Track Total Invoiced, Collected Remittances, and Outstanding Balances.
- Filter invoices by status: *Paid*, *Partially Paid*, *Unpaid*.
- Interactive "Record Payment" modal with bank UTR reference logging and instant balance reconciliation.
- Clean Printable GST Tax Invoice Preview modal with official Aramya Foods letterhead, HSN/SAC codes, and print action.
- One-click CSV export of complete billing statements.

### 2.11 Food Wastage Monitoring (`/wastage`)
- Daily food wastage logs by item, weight (kg), and financial loss.
- Root cause breakdown chart: *Unserved Surplus*, *Preparation Trim*, *Overproduction*, *Storage Spoilage*.
- Automated culinary waste reduction protocols (e.g. Friday lunch remote WFH buffer reduction).
- Zero-landfill tracking: Commercial composting, in-house biogas, and FeedIndia certified NGO food donation.
- Interactive "Log Wastage" modal with financial loss calculation.

### 2.12 Multi-Location Network Hub (`/locations`)
- Centralized multi-facility management dashboard.
- Facility capacity, stock valuation, and fulfillment metrics.
- Corporate client allocations per kitchen facility.
- One-click facility scope filter.

### 2.13 AI Demand & Raw Material Forecasting (`/forecasting`)
- Simulated predictive modeling engine:
  * Select target day (Monday through Friday with real hybrid WFH curves).
  * Adjust expected corporate headcount attendance slider (50% – 100%).
  * Adjust weather / monsoon rain factor (Normal, Drizzle, Heavy Rain).
- Outputs:
  * Client-wise forecasted meal counts across Breakfast, Lunch, Snacks, and Dinner.
  * Precise raw ingredient requirements (Basmati Rice kg, Fresh Paneer kg, Dal kg, Cooking Oil L, Vegetables kg).
  * Inventory sufficiency / shortage alerts against current warehouse stock.
  * Estimated monetary savings achieved through smart buffer batch trimming.
  * Automated daily kitchen operational directives.

---

## 3. Taste Skill (Design Taste Frontend) Compliance

- **Framed Sheet Shell**: `#f9fbfc` tinted chrome L-frame with an inset 14px radius white surface sheet, 1px subtle borders, and zero resting shadows.
- **Data-First Color Palette**: Deep corporate petrol teal (`#1b6c80`) accent, neutral dark ink (`#131416`), muted labels (`#5d5f60`), and high-contrast accessible status pills (`#dcfae5` / `#04250e`, `#ffedea` / `#831c1e`, `#fffbeb` / `#92400e`).
- **Anti-Slop Cleanliness**: Zero AI-template clichés (no purple/indigo accents, no emojis in UI labels, no generic icons in colored circles, no resting gradients).
- **Tabular Figures**: Every monetary number, percentage, and quantity is rendered with `font-variant-numeric: tabular-nums` or `IBM Plex Mono` for alignment.

---

## 4. Setup and Local Execution

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to explore the interactive demo.

### Build Production Bundle
```bash
npm run build
```

### Static Remote Deployment (Vercel / Netlify / Cloudflare)
This application is completely frontend-only with mock browser-side state and can be deployed directly to Vercel, Netlify, or any static web host without backend or database dependencies.
