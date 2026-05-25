import React, { useState, useEffect } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import { motion } from "framer-motion";
import { apiFetch } from "../../lib/api";
import {
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  Search,
  ArrowLeft,
  Phone,
  Mail,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  Download,
  X,
  Printer,
} from "lucide-react";

const AdminVictimReport = () => {
  // --- DATA STATE ---
  const [victims, setVictims] = useState([]);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  // --- REPORT DOWNLOAD FUNCTION ---
  const createReportHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Victim Report - ${selectedVictim.name}</title>
<style>
body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
.page { background: white; max-width: 900px; margin: 0 auto; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
.header { text-align: center; border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
.header-logo { font-size: 24px; font-weight: bold; color: #0066cc; margin-bottom: 5px; }
.header-title { font-size: 18px; font-weight: bold; color: #333; text-transform: uppercase; letter-spacing: 1px; }
.header-subtitle { font-size: 12px; color: #666; margin-top: 5px; }
.report-date { text-align: right; font-size: 11px; color: #999; margin-bottom: 20px; }
.section { margin-bottom: 25px; }
.section-title { font-size: 13px; font-weight: bold; color: white; background: #0066cc; padding: 10px 15px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 3px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.info-grid.full { grid-template-columns: 1fr; }
.info-item { background: #f8f8f8; padding: 12px; border-left: 4px solid #0066cc; border-radius: 3px; }
.info-label { font-size: 10px; color: #666; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 5px; }
.info-value { font-size: 12px; color: #333; font-weight: 500; }
.family-list { list-style: none; background: #f8f8f8; padding: 12px; border-left: 4px solid #0066cc; border-radius: 3px; }
.family-item { padding: 8px 0; border-bottom: 1px solid #ddd; font-size: 12px; display: flex; justify-content: space-between; align-items: center; }
.family-item:last-child { border-bottom: none; }
.family-name { font-weight: 500; color: #333; }
.family-category { background: #e8f0fe; color: #0066cc; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
.status-badge { display: inline-block; padding: 5px 12px; border-radius: 3px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
.status-pending { background: #fffbea; color: #d97706; }
.status-approved { background: #ecfdf5; color: #10b981; }
.status-rejected { background: #fef2f2; color: #dc2626; }
.footer { border-top: 1px solid #ddd; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #999; text-align: center; }
.signature-area { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; text-align: center; font-size: 11px; }
.signature-line { border-top: 1px solid #333; padding-top: 5px; margin-top: 30px; }
@media print { body { background: white; } .page { margin: 0; box-shadow: none; padding: 0.5in; } }
</style>
</head>
<body>
<div class="page">
<div class="header">
<div class="header-logo">🚨 FLOOD MANAGEMENT SYSTEM</div>
<div class="header-title">Victim Registration Report</div>
<div class="header-subtitle">Official Documented Record</div>
</div>

<div class="report-date">
<strong>Report Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
</div>

<div class="section">
<div class="section-title">👤 Victim Identity</div>
<div class="info-grid">
<div class="info-item">
<div class="info-label">Full Name</div>
<div class="info-value">${selectedVictim.name}</div>
</div>
<div class="info-item">
<div class="info-label">Reference ID</div>
<div class="info-value"><strong>${selectedVictim.id}</strong></div>
</div>
</div>
<div class="info-grid">
<div class="info-item">
<div class="info-label">CNIC Number</div>
<div class="info-value">${selectedVictim.cnic || "N/A"}</div>
</div>
<div class="info-item">
<div class="info-label">Gender</div>
<div class="info-value">${selectedVictim.gender || "N/A"}</div>
</div>
</div>
<div class="info-grid full">
<div class="info-item">
<div class="info-label">Age</div>
<div class="info-value">${selectedVictim.age ? selectedVictim.age + " years" : "N/A"}</div>
</div>
</div>
</div>

<div class="section">
<div class="section-title">📞 Contact Information</div>
<div class="info-grid full">
<div class="info-item">
<div class="info-label">Phone Number</div>
<div class="info-value">${selectedVictim.phone || "N/A"}</div>
</div>
</div>
<div class="info-grid full">
<div class="info-item">
<div class="info-label">Father's Name</div>
<div class="info-value">${selectedVictim.fatherName || "N/A"}</div>
</div>
</div>
</div>

<div class="section">
<div class="section-title">📍 Location &amp; Incident Details</div>
<div class="info-grid full">
<div class="info-item">
<div class="info-label">Incident Location</div>
<div class="info-value">${selectedVictim.location}</div>
</div>
</div>
<div class="info-grid full">
<div class="info-item">
<div class="info-label">Description</div>
<div class="info-value">${selectedVictim.description || "No description provided"}</div>
</div>
</div>
</div>

${
  selectedVictim.family && selectedVictim.family.length > 0
    ? `
<div class="section">
<div class="section-title">👨‍👩‍👧‍👦 Family Members</div>
<ul class="family-list">
${selectedVictim.family.map((member) => `<li class="family-item"><span class="family-name">${member.name}</span><span class="family-category">${member.category || "Unknown"}</span></li>`).join("")}
</ul>
</div>
`
    : ""
}

<div class="section">
<div class="section-title">✓ Application Status</div>
<div class="info-grid">
<div class="info-item">
<div class="info-label">Current Status</div>
<div class="info-value"><span class="status-badge status-${selectedVictim.status?.toLowerCase()}">${selectedVictim.status}</span></div>
</div>
<div class="info-item">
<div class="info-label">Registration Date</div>
<div class="info-value">${selectedVictim.createdAt ? new Date(selectedVictim.createdAt).toLocaleDateString() : "N/A"}</div>
</div>
</div>
</div>

<div style="border-top: 1px dashed #ddd; margin: 30px 0;"></div>

<div class="signature-area">
<div>
<div class="signature-line">Authorized Officer Signature</div>
<div style="margin-top: 5px; font-size: 10px; color: #999;">Date: ______________</div>
</div>
<div>
<div class="signature-line">System Generated Report</div>
<div style="margin-top: 5px; font-size: 10px; color: #999;">${new Date().toLocaleDateString()}</div>
</div>
</div>

<div class="footer">
<p>© 2024-${new Date().getFullYear()} Flood Management System. This is an official document. Unauthorized reproduction is prohibited.</p>
<p>Report ID: ${selectedVictim.id} | Generated on ${new Date().toLocaleString()}</p>
</div>
</div>
</body>
</html>`;
  };

  const downloadReportAsPDF = () => {
    if (!selectedVictim) return;
    const htmlContent = createReportHTML();
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `Victim_Report_${selectedVictim.id}_${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    if (!selectedVictim) return;
    const htmlContent = createReportHTML();
    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const generateReportHTML = () => {
    const formatDate = (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Victim Report - ${selectedVictim.name}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
          }
          
          .page {
            background: white;
            max-width: 8.5in;
            height: 11in;
            margin: 0.5in auto;
            padding: 1in;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header-logo {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 5px;
          }
          
          .header-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .header-subtitle {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          
          .report-date {
            text-align: right;
            font-size: 11px;
            color: #999;
            margin-bottom: 20px;
          }
          
          .section {
            margin-bottom: 25px;
          }
          
          .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #ffffff;
            background: #0066cc;
            padding: 8px 12px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-radius: 3px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          
          .info-grid.full {
            grid-template-columns: 1fr;
          }
          
          .info-item {
            background: #f8f8f8;
            padding: 12px;
            border-left: 4px solid #0066cc;
            border-radius: 3px;
          }
          
          .info-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 12px;
            color: #333;
            font-weight: 500;
          }
          
          .family-list {
            list-style: none;
            background: #f8f8f8;
            padding: 12px;
            border-left: 4px solid #0066cc;
            border-radius: 3px;
          }
          
          .family-item {
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .family-item:last-child {
            border-bottom: none;
          }
          
          .family-name {
            font-weight: 500;
            color: #333;
          }
          
          .family-category {
            background: #e8f0fe;
            color: #0066cc;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-pending {
            background: #fffbea;
            color: #d97706;
            border: 1px solid #fbbf24;
          }
          
          .status-approved {
            background: #ecfdf5;
            color: #10b981;
            border: 1px solid #6ee7b7;
          }
          
          .status-rejected {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fca5a5;
          }
          
          .footer {
            border-top: 1px solid #ddd;
            padding-top: 15px;
            margin-top: 30px;
            font-size: 10px;
            color: #999;
            text-align: center;
          }
          
          .signature-area {
            margin-top: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            text-align: center;
            font-size: 11px;
          }
          
          .signature-line {
            border-top: 1px solid #333;
            padding-top: 5px;
            margin-top: 30px;
          }
          
          .separator {
            border-top: 1px dashed #ddd;
            margin: 20px 0;
          }
          
          @media print {
            body {
              background: white;
            }
            
            .page {
              margin: 0;
              box-shadow: none;
              padding: 0.5in;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- Header -->
          <div class="header">
            <div class="header-logo">🚨 FLOOD MANAGEMENT SYSTEM</div>
            <div class="header-title">Victim Registration Report</div>
            <div class="header-subtitle">Official Documented Record</div>
          </div>
          
          <!-- Report Date -->
          <div class="report-date">
            <strong>Report Date:</strong> ${formatDate(new Date())}
          </div>
          
          <!-- Victim Identity Section -->
          <div class="section">
            <div class="section-title">👤 Victim Identity</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Full Name</div>
                <div class="info-value">${selectedVictim.name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Reference ID</div>
                <div class="info-value"><strong>${selectedVictim.id}</strong></div>
              </div>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">CNIC Number</div>
                <div class="info-value">${selectedVictim.cnic || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Gender</div>
                <div class="info-value">${selectedVictim.gender || "N/A"}</div>
              </div>
            </div>
            <div class="info-grid full">
              <div class="info-item">
                <div class="info-label">Age</div>
                <div class="info-value">${selectedVictim.age ? selectedVictim.age + " years" : "N/A"}</div>
              </div>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div class="section">
            <div class="section-title">📞 Contact Information</div>
            <div class="info-grid full">
              <div class="info-item">
                <div class="info-label">Phone Number</div>
                <div class="info-value">${selectedVictim.phone || "N/A"}</div>
              </div>
            </div>
            <div class="info-grid full">
              <div class="info-item">
                <div class="info-label">Father's Name</div>
                <div class="info-value">${selectedVictim.fatherName || "N/A"}</div>
              </div>
            </div>
          </div>
          
          <!-- Location Information -->
          <div class="section">
            <div class="section-title">📍 Location & Incident Details</div>
            <div class="info-grid full">
              <div class="info-item">
                <div class="info-label">Incident Location</div>
                <div class="info-value">${selectedVictim.location}</div>
              </div>
            </div>
            <div class="info-grid full">
              <div class="info-item">
                <div class="info-label">Description</div>
                <div class="info-value">${selectedVictim.description || "No description provided"}</div>
              </div>
            </div>
          </div>
          
          <!-- Family Information -->
          ${
            selectedVictim.family && selectedVictim.family.length > 0
              ? `
          <div class="section">
            <div class="section-title">👨‍👩‍👧‍👦 Family Members</div>
            <ul class="family-list">
              ${selectedVictim.family
                .map(
                  (member) => `
              <li class="family-item">
                <span class="family-name">${member.name}</span>
                <span class="family-category">${member.category || "Unknown"}</span>
              </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          `
              : ""
          }
          
          <!-- Status Section -->
          <div class="section">
            <div class="section-title">✓ Application Status</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Current Status</div>
                <div class="info-value">
                  <span class="status-badge status-${selectedVictim.status?.toLowerCase()}">
                    ${selectedVictim.status}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Registration Date</div>
                <div class="info-value">${formatDate(selectedVictim.createdAt)}</div>
              </div>
            </div>
          </div>
          
          <!-- Separator -->
          <div class="separator"></div>
          
          <!-- Signature Area -->
          <div class="signature-area">
            <div>
              <div class="signature-line">Authorized Officer Signature</div>
              <div style="margin-top: 5px; font-size: 10px; color: #999;">Date: ______________</div>
            </div>
            <div>
              <div class="signature-line">System Generated Report</div>
              <div style="margin-top: 5px; font-size: 10px; color: #999;">${formatDate(new Date())}</div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>© 2024-${new Date().getFullYear()} Flood Management System. This is an official document. Unauthorized reproduction is prohibited.</p>
            <p>Report ID: ${selectedVictim.id} | Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    const fetchVictims = async () => {
      setIsLoading(true);
      setFetchError("");

      try {
        const response = await apiFetch("/api/victims");
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Failed to load victim reports");
        }

        setVictims(
          (Array.isArray(data.registrations) ? data.registrations : []).map(
            (victim) => ({
              id: victim.id ?? victim._id?.toString() ?? "",
              name: victim.victim_name ?? victim.name ?? "Unknown",
              cnic: victim.cnic_number ?? victim.cnic ?? "",
              phone: victim.phone_number ?? victim.phone ?? "",
              location:
                victim.incident_location ?? victim.location ?? "Unknown",
              status: victim.status ?? "Pending",
              needs: [victim.loss_type ?? victim.lossType ?? "Unknown"],
              family: Array.isArray(victim.family) ? victim.family : [],
              fatherName: victim.father_name ?? victim.fatherName ?? "",
              gender: victim.gender ?? "",
              age: victim.age ?? null,
              description: victim.description ?? "",
              idFrontPath: victim.id_front_path ?? victim.idFrontPath ?? "",
              idBackPath: victim.id_back_path ?? victim.idBackPath ?? "",
              createdAt: victim.created_at ?? victim.createdAt ?? "",
            }),
          ),
        );
      } catch (error) {
        setFetchError(error.message || "Unable to fetch victim reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVictims();
  }, []);

  // --- KEYBOARD FEATURE: ESCAPE KEY TO GO BACK ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedVictim(null); // Escape dabanay par view band ho jayega
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- STATUS UPDATE LOGIC ---
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await apiFetch(`/api/victims/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to update status");
      }

      const data = await response.json();
      const updatedStatus = data.registration?.status || newStatus;

      setVictims((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: updatedStatus } : v)),
      );

      if (selectedVictim && selectedVictim.id === id) {
        setSelectedVictim((prev) =>
          prev ? { ...prev, status: updatedStatus } : prev,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- SEARCH/FILTER LOGIC ---
  const filteredVictims = victims.filter((victim) => {
    const query = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanCNIC = (victim.cnic || "").replace(/[^0-9]/g, "");
    const cleanID = (victim.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanName = (victim.name || "").toLowerCase();

    return (
      cleanName.includes(searchTerm.toLowerCase()) ||
      cleanCNIC.includes(query) ||
      cleanID.includes(query)
    );
  });

  return (
    <motion.section
      className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar::-webkit-scrollbar-track { display: none !important; }
        .no-scrollbar::-webkit-scrollbar-thumb { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        .no-scrollbar::-webkit-scrollbar-corner { display: none !important; }
      `}</style>
      {/* SIDEBAR - Jo aapne pehle use kiya tha */}
      <aside className="w-64 h-full bg-[#1e1e1e] border-r border-gray-800 hidden md:flex flex-col shrink-0">
        <SideBar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden pl-9">
        {/* HEADER - Jo aapne pehle use kiya tha */}
        <Header />

        {/* CONTENT CONTAINER (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#0a0a0a] no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* --- TOP BAR (Stats & Search) --- */}
            {!selectedVictim && (
              <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                      Live Victim Intel
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                    <ShieldCheck className="text-blue-500 w-8 h-8" />
                    Victim <span className="text-slate-500">Reports</span>
                  </h1>
                </div>

                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search Name, CNIC or ID..."
                    className="bg-[#1e1e1e] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 w-full transition-all text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </header>
            )}

            {/* --- MAIN VIEW SWITCHER --- */}
            {!selectedVictim ? (
              /* --- LIST VIEW --- */
              <div className="bg-[#1e1e1e]/50 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl animate-in fade-in duration-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black">
                        <th className="p-6">Reference</th>
                        <th className="p-6">Victim Details</th>
                        <th className="p-6">Location</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-10 text-center text-sm text-gray-400"
                          >
                            Loading victim reports...
                          </td>
                        </tr>
                      ) : fetchError ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-10 text-center text-sm text-red-400"
                          >
                            {fetchError}
                          </td>
                        </tr>
                      ) : filteredVictims.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-10 text-center text-sm text-gray-400"
                          >
                            No victim reports found yet.
                          </td>
                        </tr>
                      ) : (
                        filteredVictims.map((victim, index) => {
                          return (
                            <motion.tr
                              key={victim.id}
                              className="hover:bg-white/[0.03] transition-all group"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <td className="p-6">
                                <span className="font-mono text-blue-400 text-xs font-bold bg-blue-500/5 px-3 py-1 rounded-lg border border-blue-500/10 tracking-widest uppercase">
                                  {victim.id}
                                </span>
                              </td>
                              <td className="p-6">
                                <div className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                                  {victim.name}
                                </div>
                                <div className="text-[11px] text-gray-500 font-mono mt-1 tracking-tighter italic">
                                  {victim.cnic}
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex items-start gap-2 text-sm text-gray-400 max-w-[200px]">
                                  <MapPin
                                    size={16}
                                    className="text-red-500 shrink-0 mt-0.5"
                                  />
                                  <span className="leading-snug">
                                    {victim.location}
                                  </span>
                                </div>
                              </td>
                              <td className="p-6">
                                <span
                                  className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${
                                    victim.status === "Pending"
                                      ? "bg-yellow-500/5 text-yellow-500 border-yellow-500/20"
                                      : victim.status === "Approved"
                                        ? "bg-green-500/5 text-green-500 border-green-500/20"
                                        : victim.status === "Responded"
                                          ? "bg-blue-500/5 text-blue-400 border-blue-500/20"
                                          : "bg-red-500/5 text-red-500 border-red-500/20"
                                  }`}
                                >
                                  {victim.status}
                                </span>
                              </td>
                              <td className="p-6 text-right">
                                <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() =>
                                      updateStatus(victim.id, "Approved")
                                    }
                                    className="p-2.5 text-green-500 hover:bg-green-500/10 rounded-xl transition-all"
                                    title="Approve"
                                  >
                                    <CheckCircle size={20} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateStatus(victim.id, "Rejected")
                                    }
                                    className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    title="Reject"
                                  >
                                    <XCircle size={20} />
                                  </button>
                                  <button
                                    onClick={() => setSelectedVictim(victim)}
                                    className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 ml-2"
                                    title="View Full Report"
                                  >
                                    <Eye size={20} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedVictim(victim);
                                      setShowReportModal(true);
                                    }}
                                    className="bg-slate-700 text-white p-2.5 rounded-xl hover:bg-slate-600 transition-all shadow-lg shadow-slate-500/20 ml-2"
                                    title="Download Report"
                                  >
                                    <Download size={20} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* --- DETAIL VIEW --- */
              <div className="animate-in slide-in-from-right-8 duration-500">
                {/* Back Navigation & ESC Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <button
                    onClick={() => setSelectedVictim(null)}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-all font-bold text-xs uppercase tracking-[0.2em] group"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10">
                      <ArrowLeft size={18} />
                    </div>
                    Go Back to Table
                  </button>
                  <div className="px-4 py-2 bg-[#1e1e1e] border border-white/10 rounded-xl">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                      Shortcut: Press{" "}
                      <span className="text-blue-400 underline underline-offset-4 font-black tracking-tighter">
                        Esc
                      </span>{" "}
                      key to exit
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Victim Card */}
                    <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-[40px] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                      <div
                        className={`absolute top-0 right-0 w-48 h-1.5 ${
                          selectedVictim.status === "Approved"
                            ? "bg-green-500"
                            : selectedVictim.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      />

                      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 flex-wrap">
                        <div className="min-w-0">
                          <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">
                            {selectedVictim.name}
                          </h2>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-blue-400 font-mono text-sm font-bold tracking-[0.2em]">
                              {selectedVictim.id}
                            </span>
                            <div className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">
                              {selectedVictim.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-end w-full md:w-auto">
                          <button
                            onClick={() =>
                              updateStatus(selectedVictim.id, "Approved")
                            }
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl active:scale-95 min-w-[130px]"
                          >
                            <CheckCircle size={16} /> Approve
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(selectedVictim.id, "Rejected")
                            }
                            className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 min-w-[130px]"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                          <button
                            type="button"
                            onClick={downloadReportAsPDF}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl active:scale-95 min-w-[140px]"
                            title="Download Report"
                          >
                            <Download size={16} /> Download Report
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <h3 className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-black">
                            Identity Details
                          </h3>
                          <div className="space-y-4">
                            <div className="bg-black/20 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                              <CreditCard className="text-blue-400" size={20} />
                              <div>
                                <p className="text-[9px] uppercase text-gray-500 font-bold tracking-widest">
                                  CNIC
                                </p>
                                <p className="text-sm font-mono font-bold">
                                  {selectedVictim.cnic}
                                </p>
                              </div>
                            </div>
                            <div className="bg-black/20 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                              <Phone className="text-blue-400" size={20} />
                              <div>
                                <p className="text-[9px] uppercase text-gray-500 font-bold tracking-widest">
                                  Phone
                                </p>
                                <p className="text-sm font-bold">
                                  {selectedVictim.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h3 className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-black">
                            Family Info
                          </h3>
                          <div className="space-y-3">
                            {selectedVictim.family.map((m, idx) => (
                              <div
                                key={idx}
                                className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center italic"
                              >
                                <span className="text-sm font-bold">
                                  {m.name}
                                </span>
                                <span className="text-[9px] bg-slate-800 text-gray-400 px-3 py-1 rounded-lg uppercase font-black">
                                  {m.category}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Panel */}
                    <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl shadow-2xl">
                      <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-8">
                        Location Intelligence
                      </h3>
                      <div className="flex items-center gap-6 bg-red-500/5 p-8 rounded-3xl border border-red-500/10">
                        <div className="p-5 bg-red-500/10 rounded-2xl">
                          <MapPin
                            size={40}
                            className="text-red-500 animate-bounce"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-red-400 font-black tracking-[0.2em] mb-2">
                            Registry Address
                          </p>
                          <p className="text-2xl font-black text-white italic">
                            {selectedVictim.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Sidebar */}
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group flex flex-col min-h-[420px]">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <MessageSquare size={100} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white mb-3">
                          Action Command
                        </h3>
                        <p className="text-blue-100 text-[11px] mb-8 font-medium uppercase tracking-widest opacity-80">
                          Send instructions directly
                        </p>
                      </div>
                      <textarea
                        placeholder="Type message here..."
                        className="w-full bg-black/20 border border-white/10 rounded-3xl p-5 text-sm text-white placeholder:text-white/30 outline-none focus:bg-black/40 h-40 mb-6 resize-none transition-all"
                      />
                      <button
                        onClick={() =>
                          updateStatus(selectedVictim.id, "Responded")
                        }
                        className="w-full bg-white text-blue-800 font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-blue-50 transition-all active:scale-95 shadow-xl mt-auto"
                      >
                        Deploy Message
                      </button>
                    </div>

                    <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">
                      <div className="flex items-center gap-3 text-yellow-500 mb-5">
                        <AlertTriangle size={20} />
                        <span className="text-[11px] uppercase font-black tracking-widest">
                          Protocol Notice
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-400 leading-relaxed italic">
                        Cross-verify CNIC data with NADRA registry before
                        finalizing{" "}
                        <span className="text-green-500 font-bold">
                          Approval
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- REPORT MODAL --- */}
      {showReportModal && selectedVictim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">Victim Report</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedVictim.name} - ID: {selectedVictim.id}
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Report Content - Preview */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                {/* Header */}
                <div className="text-center border-b-4 border-blue-600 pb-6 mb-8">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    🚨 FLOOD MANAGEMENT SYSTEM
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                    Victim Registration Report
                  </h1>
                  <p className="text-gray-600 text-sm mt-2">
                    Official Documented Record
                  </p>
                </div>

                {/* Report Date */}
                <div className="text-right text-xs text-gray-500 mb-6">
                  <strong>Report Date:</strong>{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {/* Victim Identity Section */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-white bg-blue-600 px-4 py-2 mb-4 uppercase tracking-wide">
                    👤 Victim Identity
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Full Name
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {selectedVictim.name}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Reference ID
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {selectedVictim.id}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        CNIC Number
                      </div>
                      <div className="text-sm font-mono text-gray-800">
                        {selectedVictim.cnic || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Gender
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {selectedVictim.gender || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-white bg-blue-600 px-4 py-2 mb-4 uppercase tracking-wide">
                    📞 Contact Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Phone Number
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {selectedVictim.phone || "N/A"}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Father's Name
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {selectedVictim.fatherName || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-white bg-blue-600 px-4 py-2 mb-4 uppercase tracking-wide">
                    📍 Location & Incident Details
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Incident Location
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {selectedVictim.location}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Description
                      </div>
                      <div className="text-sm text-gray-800">
                        {selectedVictim.description ||
                          "No description provided"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family Information */}
                {selectedVictim.family && selectedVictim.family.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-sm font-bold text-white bg-blue-600 px-4 py-2 mb-4 uppercase tracking-wide">
                      👨‍👩‍👧‍👦 Family Members
                    </h2>
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      {selectedVictim.family.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="font-bold text-gray-800">
                            {member.name}
                          </span>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded uppercase">
                            {member.category || "Unknown"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Section */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-white bg-blue-600 px-4 py-2 mb-4 uppercase tracking-wide">
                    ✓ Application Status
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Current Status
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase ${
                          selectedVictim.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : selectedVictim.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedVictim.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 border-l-4 border-blue-600">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                        Registration Date
                      </div>
                      <div className="text-sm text-gray-800">
                        {selectedVictim.createdAt
                          ? new Date(
                              selectedVictim.createdAt,
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t pt-6 text-center text-xs text-gray-500">
                  <p>
                    © 2024-{new Date().getFullYear()} Flood Management System.
                    This is an official document. Unauthorized reproduction is
                    prohibited.
                  </p>
                  <p className="mt-2">
                    Report ID: {selectedVictim.id} | Generated on{" "}
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4 justify-end">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                Close
              </button>
              <button
                onClick={printReport}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <Printer size={20} /> Print/Save as PDF
              </button>
              <button
                onClick={downloadReportAsPDF}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <Download size={20} /> Download Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
};

export default AdminVictimReport;
