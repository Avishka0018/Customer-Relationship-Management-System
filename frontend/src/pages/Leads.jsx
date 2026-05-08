import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import LeadTable from "../components/leads/LeadTable";
import LeadPipeline from "../components/leads/LeadPipeline";
import LeadPipelineDetail from "../components/leads/LeadPipelineDetail";
import api from "../api/axios";
import * as XLSX from "xlsx";
import { Download, Search } from "lucide-react";

function Leads() {
  const [leads, setLeads] = useState([]);

  const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    source: "",
    salesperson: "",
  });

  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [view, setView] = useState("table"); // table | pipeline
  const [selectedLead, setSelectedLead] = useState(null);

  const pageSize = 20;

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Website",
    salesperson: "",
    status: "New",
    value: "",
  });

  // FETCH LEADS
  const fetchLeads = async () => {
    const res = await api.get("/leads");
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // SALESPEOPLE
  const salespeople = [...new Set(leads.map((l) => l.salesperson))];

  // FILTER
  const filteredLeads = leads.filter((l) => {
    return (
      (!filters.status || l.status === filters.status) &&
      (!filters.source || l.source === filters.source) &&
      (!filters.salesperson || l.salesperson === filters.salesperson) &&
      (!filters.search ||
        l.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        l.company?.toLowerCase().includes(filters.search.toLowerCase()) ||
        l.email?.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // SORT
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);

    if (sortBy === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);

    if (sortBy === "valueHigh")
      return (b.value || 0) - (a.value || 0);

    if (sortBy === "valueLow")
      return (a.value || 0) - (b.value || 0);

    return 0;
  });

  // PAGINATION
  const totalPages = Math.ceil(sortedLeads.length / pageSize);

  const paginatedLeads = sortedLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // EXPORT
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedLeads);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Leads"
    );

    XLSX.writeFile(workbook, "leads.xlsx");
  };

  // CREATE LEAD
  const handleCreateLead = async () => {

    // VALIDATION
    if (
      !form.name.trim() ||
      !form.company.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.salesperson.trim() ||
      !form.value
    ) {
      alert("Please fill all required fields");
      return;
    }

    // EMAIL VALIDATION
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Please enter valid email");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/leads", {
        ...form,
        value: Number(form.value),
      });

      // UPDATE UI
      setLeads([res.data, ...leads]);

      // CLOSE MODAL
      setShowModal(false);

      // RESET FORM
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        source: "Website",
        salesperson: "",
        status: "New",
        value: "",
      });

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to create lead"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow p-4">

        {/* HEADER */}
      <div className="flex justify-between items-center mb-5">

        <div>
          <h1 className="text-2xl font-bold">
            Leads
          </h1>

          <p className="text-sm text-gray-500">
            Manage your sales pipeline
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition"
        >
          + Add Lead
        </button>

      </div>

        {/* PIPELINE / TABLE SWITCH */}
        <div className="flex gap-2 mb-4">

          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-xl text-sm ${view === "table"
                ? "bg-teal-600 text-white"
                : "bg-gray-200"
              }`}
          >
            Table View
          </button>

          <button
            onClick={() => setView("pipeline")}
            className={`px-4 py-2 rounded-xl text-sm ${view === "pipeline"
                ? "bg-teal-600 text-white"
                : "bg-gray-200"
              }`}
          >
            Pipeline View
          </button>

        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-5">

          {/* SEARCH */}
          <div className="flex items-center bg-gray-100 px-4 py-3 rounded-2xl w-full xl:w-[350px]">

            <Search
              size={18}
              className="text-gray-500"
            />

            <input
              type="text"
              placeholder="Search leads..."
              className="bg-transparent outline-none ml-2 w-full text-sm"
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
            />

          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2">

            <select
              className="bg-gray-100 px-4 py-3 rounded-2xl outline-none text-sm"
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value,
                })
              }
            >
              <option value="">Status</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Proposal Sent</option>
              <option>Won</option>
              <option>Lost</option>
            </select>

            <select
              className="bg-gray-100 px-4 py-3 rounded-2xl outline-none text-sm"
              value={filters.source}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  source: e.target.value,
                })
              }
            >
              <option value="">Source</option>
              <option>Website</option>
              <option>LinkedIn</option>
              <option>Referral</option>
              <option>Cold Email</option>
              <option>Event</option>
              <option>Ads</option>
            </select>

            <select
              className="bg-gray-100 px-4 py-3 rounded-2xl outline-none text-sm"
              value={filters.salesperson}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  salesperson: e.target.value,
                })
              }
            >
              <option value="">
                Salesperson
              </option>

              {salespeople.map((s, i) => (
                <option key={i}>
                  {s}
                </option>
              ))}
            </select>

            <select
              className="bg-gray-100 px-4 py-3 rounded-2xl outline-none text-sm"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="">
                Sort By
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="valueHigh">
                High Value
              </option>

              <option value="valueLow">
                Low Value
              </option>
            </select>

            {/* EXPORT */}
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition text-sm"
            >
              <Download size={16} />
              Export
            </button>

          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200">

          {view === "pipeline" ? (
            <LeadPipeline
              leads={sortedLeads}
              onSelectLead={setSelectedLead}
            />
          ) : (
            <LeadTable
              leads={paginatedLeads}
              setLeads={setLeads}
            />
          )}

        </div>

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((p) => p - 1)
          }
          className="px-4 py-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-40"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() =>
              setCurrentPage(i + 1)
            }
            className={`w-10 h-10 rounded-full border transition ${currentPage === i + 1
              ? "bg-teal-600 text-white border-teal-600"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage((p) => p + 1)
          }
          className="px-4 py-2 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-40"
        >
          Next
        </button>

      </div>

      <LeadPipelineDetail
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-[750px] max-w-full rounded-3xl shadow-2xl p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-2xl font-bold">
                  Create New Lead
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add lead information below
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-gray-500 text-xl"
              >
                ✕
              </button>

            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NAME */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Lead Name *
                </label>

                <input
                  className="w-full bg-gray-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter lead name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* COMPANY */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Company *
                </label>

                <input
                  className="w-full bg-gray-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter company"
                  value={form.company}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: e.target.value,
                    })
                  }
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Email *
                </label>

                <input
                  type="email"
                  className="w-full bg-gray-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Phone *
                </label>

                <input
                  className="w-full bg-gray-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              {/* SOURCE */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Lead Source
                </label>

                <select
                  className="w-full bg-gray-100 p-3 rounded-2xl outline-none"
                  value={form.source}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      source: e.target.value,
                    })
                  }
                >
                  <option>Website</option>
                  <option>LinkedIn</option>
                  <option>Referral</option>
                  <option>Cold Email</option>
                  <option>Event</option>
                  <option>Ads</option>
                </select>
              </div>

              {/* SALESPERSON */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Salesperson *
                </label>

                <input
                  className="w-full bg-gray-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Assigned salesperson"
                  value={form.salesperson}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      salesperson: e.target.value,
                    })
                  }
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Status
                </label>

                <select
                  className="w-full bg-gray-100 p-3 rounded-2xl outline-none"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Proposal Sent</option>
                  <option>Won</option>
                  <option>Lost</option>
                </select>
              </div>

              {/* VALUE */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Deal Value *
                </label>

                <input
                  type="number"
                  className="w-full bg-gray-100 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter deal value"
                  value={form.value}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      value: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="px-5 py-3 bg-gray-200 rounded-2xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateLead}
                disabled={loading}
                className="px-6 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : "Save Lead"}
              </button>

            </div>

          </div>
        </div>
      )}

    </Layout>
  );
}

export default Leads;