import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatNumber } from '../utils/formatters';
import { UserCheck, Upload, Check, X, Search, Filter, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const AttendancePage = () => {
  const { employees, recordMealPunch, importEmployeesCSV, clients } = useApp();
  const [selectedClientFilter, setSelectedClientFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesClient = selectedClientFilter === 'all' || emp.clientId === selectedClientFilter;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClient && matchesSearch;
  });

  // Calculate totals
  const totalEmployees = employees.length;
  const presentCount = employees.filter((e) => e.attendance.includes('Present')).length;
  const wfhCount = employees.filter((e) => e.attendance.includes('Home')).length;
  const leaveCount = employees.filter((e) => e.attendance.includes('Leave')).length;

  const lunchPunchedCount = employees.filter((e) => e.consumed?.lunch).length;
  const breakfastPunchedCount = employees.filter((e) => e.consumed?.breakfast).length;
  const snacksPunchedCount = employees.filter((e) => e.consumed?.snacks).length;

  // Handle sample CSV load
  const handleLoadSampleCSV = () => {
    const sampleRows = [
      { empCode: 'NEX-1008', name: 'Kabir Singhal', clientName: 'Nexus Technologies SEZ', clientId: 'client-1', dept: 'Backend Core', attendance: 'Present', breakfast: 'true', lunch: 'true', dinner: 'false', snacks: 'true', consumedBreakfast: 'true', consumedLunch: 'true', consumedDinner: 'false', consumedSnacks: 'false', lastPunchTime: '12:50 PM' },
      { empCode: 'NEX-1009', name: 'Meera Sen', clientName: 'Nexus Technologies SEZ', clientId: 'client-1', dept: 'Product Design', attendance: 'Present', breakfast: 'true', lunch: 'true', dinner: 'false', snacks: 'true', consumedBreakfast: 'false', consumedLunch: 'true', consumedDinner: 'false', consumedSnacks: 'false', lastPunchTime: '01:15 PM' },
      { empCode: 'VER-2006', name: 'Deepak Rao', clientName: 'Vertex BioLabs Global', clientId: 'client-2', dept: 'Clinical Analytics', attendance: 'Present', breakfast: 'false', lunch: 'true', dinner: 'false', snacks: 'true', consumedBreakfast: 'false', consumedLunch: 'true', consumedDinner: 'false', consumedSnacks: 'true', lastPunchTime: '04:10 PM' },
      { empCode: 'HOR-3007', name: 'Preeti Deshmukh', clientName: 'Horizon FinServ Towers', clientId: 'client-3', dept: 'Wealth Planning', attendance: 'Present', breakfast: 'true', lunch: 'true', dinner: 'true', snacks: 'true', consumedBreakfast: 'true', consumedLunch: 'true', consumedDinner: 'false', consumedSnacks: 'true', lastPunchTime: '04:05 PM' },
    ];
    importEmployeesCSV(sampleRows);
    setIsCsvModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e8eaec]">
        <div>
          <h1 className="text-[22px] font-semibold text-[#131416] tracking-tight leading-tight">
            Employee Meal Attendance & Punch Counter
          </h1>
          <p className="text-[13.5px] text-[#5d5f60] mt-1">
            Simulated biometric cafeteria punch desk, entitlement verification and client attendance tracking
          </p>
        </div>

        <button
          onClick={() => setIsCsvModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 text-[12px] font-medium border border-[#cdced1] hover:bg-[#ebedee] text-[#131416] rounded transition-colors w-full sm:w-auto"
        >
          <Upload className="w-3.5 h-3.5 text-[#5d5f60] shrink-0" />
          <span>Import Attendance CSV</span>
        </button>
      </div>

      {/* Attendance & Meal Counts KPI Strip */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[540px]:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <div className="bg-white border border-[#e8eaec] rounded p-3">
          <span className="text-[11px] font-medium text-[#5d5f60]">Present on Site</span>
          <div className="text-[20px] font-bold text-[#1e7b4f] font-mono mt-1">
            {presentCount} <span className="text-[11px] text-[#5d5f60]">/ {totalEmployees}</span>
          </div>
        </div>
        <div className="bg-white border border-[#e8eaec] rounded p-3">
          <span className="text-[11px] font-medium text-[#5d5f60]">Work From Home</span>
          <div className="text-[20px] font-bold text-[#737678] font-mono mt-1">
            {wfhCount}
          </div>
        </div>
        <div className="bg-white border border-[#e8eaec] rounded p-3">
          <span className="text-[11px] font-medium text-[#5d5f60]">On Leave</span>
          <div className="text-[20px] font-bold text-[#c4242a] font-mono mt-1">
            {leaveCount}
          </div>
        </div>
        <div className="bg-white border border-[#e8eaec] rounded p-3">
          <span className="text-[11px] font-medium text-[#5d5f60]">Breakfast Consumed</span>
          <div className="text-[20px] font-bold text-[#131416] font-mono mt-1">
            {breakfastPunchedCount}
          </div>
        </div>
        <div className="bg-white border border-[#e8eaec] rounded p-3">
          <span className="text-[11px] font-medium text-[#5d5f60]">Lunch Consumed</span>
          <div className="text-[20px] font-bold text-[#1b6c80] font-mono mt-1">
            {lunchPunchedCount}
          </div>
        </div>
        <div className="bg-white border border-[#e8eaec] rounded p-3">
          <span className="text-[11px] font-medium text-[#5d5f60]">High-Tea Consumed</span>
          <div className="text-[20px] font-bold text-[#131416] font-mono mt-1">
            {snacksPunchedCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-[#e8eaec] rounded-lg">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#737678]" />
          <input
            type="text"
            placeholder="Search employee by name, ID or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-2 py-1 text-[13px] border border-[#cdced1] rounded focus:border-[#1b6c80] focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[12px] text-[#5d5f60] whitespace-nowrap">Filter Client:</span>
          <select
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
            className="px-2.5 py-1 text-[12px] border border-[#cdced1] rounded bg-white w-full sm:w-auto"
          >
            <option value="all">All Corporate Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-[#e8eaec] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f9fbfc] border-b border-[#e8eaec] text-[#5d5f60] font-medium">
                <th className="py-2.5 px-3">Emp ID</th>
                <th className="py-2.5 px-3">Employee Name</th>
                <th className="py-2.5 px-3">Company Client</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3 text-center">Breakfast</th>
                <th className="py-2.5 px-3 text-center">Lunch</th>
                <th className="py-2.5 px-3 text-center">High-Tea</th>
                <th className="py-2.5 px-3">Last Punch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f2]">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#f9fbfc]">
                  <td className="py-2.5 px-3 font-mono font-medium text-[#131416]">{emp.empCode}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#131416]">{emp.name}</td>
                  <td className="py-2.5 px-3 text-[#5d5f60]">{emp.clientName}</td>
                  <td className="py-2.5 px-3 text-[#5d5f60]">{emp.dept}</td>
                  <td className="py-2.5 px-3">
                    <Badge
                      variant={
                        emp.attendance === 'Present'
                          ? 'positive'
                          : emp.attendance.includes('Home')
                          ? 'neutral'
                          : 'negative'
                      }
                    >
                      {emp.attendance}
                    </Badge>
                  </td>

                  {/* Breakfast Punch Button */}
                  <td className="py-2.5 px-3 text-center">
                    {emp.eligible.breakfast ? (
                      <button
                        onClick={() => recordMealPunch(emp.id, 'breakfast')}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                          emp.consumed.breakfast
                            ? 'bg-[#dcfae5] text-[#04250e] border-[#bbf7d0]'
                            : 'bg-white text-[#5d5f60] border-[#cdced1] hover:border-[#131416]'
                        }`}
                        title="Click to toggle punch record"
                      >
                        {emp.consumed.breakfast ? 'Punched' : 'Punch'}
                      </button>
                    ) : (
                      <span className="text-[#cdced1] text-[11px]">-</span>
                    )}
                  </td>

                  {/* Lunch Punch Button */}
                  <td className="py-2.5 px-3 text-center">
                    {emp.eligible.lunch ? (
                      <button
                        onClick={() => recordMealPunch(emp.id, 'lunch')}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                          emp.consumed.lunch
                            ? 'bg-[#e6f3f6] text-[#1b6c80] border-[#99d5e3]'
                            : 'bg-white text-[#5d5f60] border-[#cdced1] hover:border-[#131416]'
                        }`}
                        title="Click to toggle punch record"
                      >
                        {emp.consumed.lunch ? 'Punched' : 'Punch'}
                      </button>
                    ) : (
                      <span className="text-[#cdced1] text-[11px]">-</span>
                    )}
                  </td>

                  {/* Snacks Punch Button */}
                  <td className="py-2.5 px-3 text-center">
                    {emp.eligible.snacks ? (
                      <button
                        onClick={() => recordMealPunch(emp.id, 'snacks')}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                          emp.consumed.snacks
                            ? 'bg-[#fffbeb] text-[#92400e] border-[#fef3c7]'
                            : 'bg-white text-[#5d5f60] border-[#cdced1] hover:border-[#131416]'
                        }`}
                        title="Click to toggle punch record"
                      >
                        {emp.consumed.snacks ? 'Punched' : 'Punch'}
                      </button>
                    ) : (
                      <span className="text-[#cdced1] text-[11px]">-</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-[#5d5f60] font-mono text-[11px]">
                    {emp.lastPunchTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal Simulation */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg border border-[#e8eaec] p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8eaec]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#1b6c80]" />
                <h3 className="font-semibold text-[15px] text-[#131416]">Import Attendance CSV</h3>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-[#737678] hover:text-[#131416]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[12px] text-[#5d5f60]">
              In a live deployment, this accepts standard CSV exports from corporate HRMS systems (Workday, Darwinbox, GreytHR). For demonstration, click below to ingest a sample batch of verified records.
            </p>

            <div className="p-3 bg-[#f9fbfc] border border-[#e8eaec] rounded font-mono text-[11px] text-[#5d5f60]">
              <div>EmpID, Name, Client, Dept, Attendance, PunchStatus</div>
              <div className="text-[#131416]">NEX-1008, Kabir Singhal, Nexus SEZ, Core, Present, Lunched</div>
              <div className="text-[#131416]">VER-2006, Deepak Rao, Vertex Bio, Analytics, Present, Lunched</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="px-3 py-1.5 rounded border border-[#cdced1] text-[12px] text-[#5d5f60]"
              >
                Cancel
              </button>
              <button
                onClick={handleLoadSampleCSV}
                className="px-3.5 py-1.5 rounded bg-[#131416] hover:bg-[#222] text-white text-[12px] font-medium transition-colors"
                style={{ color: '#ffffff' }}
              >
                <span className="text-white" style={{ color: '#ffffff' }}>Load Sample Attendance Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
