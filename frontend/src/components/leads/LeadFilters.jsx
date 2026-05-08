function LeadFilters({ filters, setFilters, salespeople = [] }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4 bg-white p-3 rounded shadow">

      {/* SEARCH */}
      <input
        className="border p-2 rounded flex-1"
        placeholder="Search name, company, email..."
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      {/* STATUS */}
      <select
        className="border p-2 rounded"
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
      >
        <option value="">All Status</option>
        <option>New</option>
        <option>Contacted</option>
        <option>Qualified</option>
        <option>Proposal Sent</option>
        <option>Won</option>
        <option>Lost</option>
      </select>

      {/* SOURCE */}
      <select
        className="border p-2 rounded"
        onChange={(e) =>
          setFilters({ ...filters, source: e.target.value })
        }
      >
        <option value="">All Sources</option>
        <option>Website</option>
        <option>LinkedIn</option>
        <option>Referral</option>
        <option>Cold Email</option>
        <option>Event</option>
        <option>Facebook</option>
        <option>Instagram</option>
        <option>Ads</option>
      </select>

      {/* SALESPERSON */}
      <select
        className="border p-2 rounded"
        onChange={(e) =>
          setFilters({ ...filters, salesperson: e.target.value })
        }
      >
        <option value="">All Salespersons</option>
        {salespeople.map((sp) => (
          <option key={sp} value={sp}>
            {sp}
          </option>
        ))}
      </select>

    </div>
  );
}

export default LeadFilters;