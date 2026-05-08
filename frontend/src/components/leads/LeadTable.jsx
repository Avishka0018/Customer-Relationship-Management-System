import { useState, useEffect } from "react";
import api from "../../api/axios";
import LeadNotes from "./LeadNotes";

function LeadTable({ leads, setLeads }) {
  const [selectedLead, setSelectedLead] =
    useState(null);

  const [isEditing, setIsEditing] =
    useState(false);


  const [editForm, setEditForm] =
    useState(null);

  // ✅ NOTES STATE
  const [notes, setNotes] = useState([]);

  // ✅ LOAD NOTES FOR CURRENT LEAD
  useEffect(() => {
    if (!selectedLead) {
      setNotes([]);
      return;
    }

    const sortedNotes = (
      selectedLead.notes || []
    ).sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    setNotes(sortedNotes);
  }, [selectedLead]);

  // ❌ DELETE LEAD
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this lead?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(`/leads/${id}`);

      setLeads(
        leads.filter(
          (lead) => lead._id !== id
        )
      );

      setSelectedLead(null);

      setIsEditing(false);
    } catch (error) {
      alert("Delete failed");
    }
  };

  // ✏️ START EDIT
  const startEdit = (lead) => {
    setIsEditing(true);

    setEditForm({
      ...lead,
    });
  };

  // 💾 UPDATE LEAD
  const handleUpdate = async () => {
    try {
      const res = await api.put(
        `/leads/${editForm._id}`,
        editForm
      );

      const updatedLead = res.data;

      // ✅ UPDATE TABLE
      setLeads(
        leads.map((lead) =>
          lead._id ===
            updatedLead._id
            ? updatedLead
            : lead
        )
      );

      // ✅ UPDATE MODAL
      setSelectedLead(updatedLead);

      setIsEditing(false);
    } catch (error) {
      alert("Update failed");
    }
  };

  // 💰 FORMAT VALUE
  const formatCurrency = (value) => {
    if (!value) return "0";

    return Number(
      value
    ).toLocaleString();
  };

  // 💰 CLEAN VALUE INPUT
  const handleCurrencyChange = (
    value
  ) => {
    const cleaned =
      value.replace(
        /[^0-9]/g,
        ""
      );

    setEditForm({
      ...editForm,
      value: cleaned,
    });
  };

  // 📅 FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    return `${d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })} ${d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // 🎯 STATUS COLORS
  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "New":
        return "bg-gray-100 text-gray-700";

      case "Contacted":
        return "bg-blue-100 text-blue-700";

      case "Qualified":
        return "bg-indigo-100 text-indigo-700";

      case "Proposal Sent":
        return "bg-purple-100 text-purple-700";

      case "Won":
        return "bg-green-100 text-green-700";

      case "Lost":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // 🌐 SOURCE ICONS
  const getSourceIcon = (
    source
  ) => {
    switch (source) {
      case "Website":
        return "https://cdn-icons-png.flaticon.com/512/1006/1006771.png";

      case "LinkedIn":
        return "https://cdn-icons-png.flaticon.com/512/145/145807.png";

      case "Referral":
        return "https://cdn-icons-png.flaticon.com/512/565/565547.png";

      case "Cold Email":
        return "https://cdn-icons-png.flaticon.com/512/732/732200.png";

      case "Event":
        return "https://cdn-icons-png.flaticon.com/512/1827/1827349.png";

      case "Facebook":
        return "https://cdn-icons-png.flaticon.com/512/733/733547.png";

      case "Instagram":
        return "https://cdn-icons-png.flaticon.com/512/733/733558.png";

      case "Ads":
        return "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";

      default:
        return "https://cdn-icons-png.flaticon.com/512/565/565547.png";
    }
  };

  return (
    <>
      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">

        <table className="w-full text-sm min-w-[1300px]">

          {/* HEADER */}
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">
                Name
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Phone
              </th>

              <th className="p-4">
                Company
              </th>

              <th className="p-4">
                Source
              </th>

              <th className="p-4">
                Salesperson
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Value
              </th>

              <th className="p-4">
                Created Date
              </th>

              <th className="p-4">
                Action
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="border-b hover:bg-gray-50 transition"
              >
                {/* NAME */}
                <td className="p-4 font-medium whitespace-nowrap">
                  {lead.name}
                </td>

                {/* EMAIL */}
                <td className="p-4 whitespace-nowrap">
                  {lead.email}
                </td>

                {/* PHONE */}
                <td className="p-4 whitespace-nowrap">
                  {lead.phone}
                </td>

                {/* COMPANY */}
                <td className="p-4 whitespace-nowrap">
                  {lead.company}
                </td>

                {/* SOURCE */}
                <td className="p-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">

                    <img
                      src={getSourceIcon(
                        lead.source
                      )}
                      alt={
                        lead.source
                      }
                      className="w-5 h-5"
                    />

                    <span>
                      {lead.source}
                    </span>

                  </div>
                </td>

                {/* SALESPERSON */}
                <td className="p-4 whitespace-nowrap">
                  {
                    lead.salesperson
                  }
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${getStatusStyle(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </td>

                {/* VALUE */}
                <td className="p-4 font-semibold whitespace-nowrap">
                  $
                  {formatCurrency(
                    lead.value
                  )}
                </td>

                {/* DATE */}
                <td className="p-4 whitespace-nowrap">
                  {formatDate(
                    lead.createdAt
                  )}
                </td>

                {/* ACTION */}
                <td className="p-4">
                  <button
                    onClick={() => {
                      setSelectedLead(
                        lead
                      );

                      setIsEditing(
                        false
                      );
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b px-6 py-5">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Lead Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage lead details and notes
                </p>
              </div>

              {/* CLOSE */}
              <button
                onClick={() => {
                  setSelectedLead(
                    null
                  );

                  setIsEditing(
                    false
                  );

                  setNotes([]);
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 text-xl"
              >
                ✕
              </button>

            </div>

            {/* BODY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[80vh]">

              {/* LEFT SIDE */}
              <div className="p-6 overflow-y-auto border-r">

                {/* VIEW MODE */}
                {!isEditing && (
                  <>
                    {/* PROFILE */}
                    <div className="flex items-center gap-4 mb-6">

                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                        {selectedLead.name?.charAt(
                          0
                        )}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {
                            selectedLead.name
                          }
                        </h3>

                        <p className="text-gray-500">
                          {
                            selectedLead.company
                          }
                        </p>
                      </div>

                    </div>

                    {/* INFO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <Info
                        label="Name"
                        value={
                          selectedLead.name
                        }
                      />

                      <Info
                        label="Email"
                        value={
                          selectedLead.email
                        }
                      />

                      <Info
                        label="Phone"
                        value={
                          selectedLead.phone
                        }
                      />

                      <Info
                        label="Company"
                        value={
                          selectedLead.company
                        }
                      />

                      <Info
                        label="Source"
                        value={
                          selectedLead.source
                        }
                      />

                      <Info
                        label="Salesperson"
                        value={
                          selectedLead.salesperson
                        }
                      />

                      <Info
                        label="Status"
                        value={
                          selectedLead.status
                        }
                      />

                      <Info
                        label="Value"
                        value={`$${formatCurrency(
                          selectedLead.value
                        )}`}
                      />

                      <Info
                        label="Created Date"
                        value={formatDate(selectedLead.createdAt)}
                      />

                      <Info
                        label="Updated Date"
                        value={formatDate(selectedLead.updatedAt)}
                      />

                    </div>
                  </>
                )}

                {/* EDIT MODE */}
                {isEditing &&
                  editForm && (
                    <>
                      <h3 className="text-2xl font-bold mb-6">
                        Edit Lead
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <EditBox
                          label="Name"
                          value={
                            editForm.name
                          }
                          onChange={(v) =>
                            setEditForm({
                              ...editForm,
                              name: v,
                            })
                          }
                        />

                        <EditBox
                          label="Company"
                          value={
                            editForm.company
                          }
                          onChange={(v) =>
                            setEditForm({
                              ...editForm,
                              company:
                                v,
                            })
                          }
                        />

                        <EditBox
                          label="Email"
                          value={
                            editForm.email
                          }
                          onChange={(v) =>
                            setEditForm({
                              ...editForm,
                              email: v,
                            })
                          }
                        />

                        <EditBox
                          label="Phone"
                          value={
                            editForm.phone
                          }
                          onChange={(v) =>
                            setEditForm({
                              ...editForm,
                              phone: v,
                            })
                          }
                        />

                        {/* SOURCE */}
                        <div className="bg-gray-50 border rounded-2xl p-4">

                          <p className="text-xs text-gray-500 mb-2">
                            Lead Source
                          </p>

                          <select
                            value={
                              editForm.source
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                source:
                                  e.target
                                    .value,
                              })
                            }
                            className="w-full border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Website">
                              Website
                            </option>

                            <option value="LinkedIn">
                              LinkedIn
                            </option>

                            <option value="Referral">
                              Referral
                            </option>

                            <option value="Cold Email">
                              Cold Email
                            </option>

                            <option value="Event">
                              Event
                            </option>

                            <option value="Facebook">
                              Facebook
                            </option>

                            <option value="Instagram">
                              Instagram
                            </option>

                            <option value="Ads">
                              Ads
                            </option>

                            <option value="Other">
                              Other
                            </option>
                          </select>

                        </div>

                        <EditBox
                          label="Salesperson"
                          value={
                            editForm.salesperson
                          }
                          onChange={(v) =>
                            setEditForm({
                              ...editForm,
                              salesperson:
                                v,
                            })
                          }
                        />

                        {/* STATUS */}
                        <div className="bg-gray-50 border rounded-2xl p-4">

                          <p className="text-xs text-gray-500 mb-2">
                            Lead Status
                          </p>

                          <select
                            value={
                              editForm.status
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                status:
                                  e.target
                                    .value,
                              })
                            }
                            className="w-full border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="New">
                              New
                            </option>

                            <option value="Contacted">
                              Contacted
                            </option>

                            <option value="Qualified">
                              Qualified
                            </option>

                            <option value="Proposal Sent">
                              Proposal Sent
                            </option>

                            <option value="Won">
                              Won
                            </option>

                            <option value="Lost">
                              Lost
                            </option>
                          </select>

                        </div>

                        {/* VALUE */}
                        <div className="bg-gray-50 border rounded-2xl p-4">

                          <p className="text-xs text-gray-500 mb-2">
                            Value
                          </p>

                          <input
                            value={formatCurrency(
                              editForm.value
                            )}
                            onChange={(e) =>
                              handleCurrencyChange(
                                e.target
                                  .value
                              )
                            }
                            className="w-full border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                          />

                        </div>

                      </div>
                    </>
                  )}

                {/* ACTION BUTTONS */}
                <div className="flex justify-between mt-8 pt-6 border-t">

                  {!isEditing ? (
                    <>
                      <button
                        onClick={() =>
                          startEdit(
                            selectedLead
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            selectedLead._id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={
                          handleUpdate
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                      >
                        Save
                      </button>

                      <button
                        onClick={() =>
                          setIsEditing(
                            false
                          )
                        }
                        className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                </div>

              </div>

              {/* RIGHT SIDE - NOTES */}
              <div className="bg-gray-50 p-6 overflow-y-auto">

                <LeadNotes
                  leadId={
                    selectedLead._id
                  }
                  notes={notes}
                  setNotes={(
                    updatedNotes
                  ) => {
                    // ✅ UPDATE NOTES STATE
                    setNotes(
                      updatedNotes
                    );

                    // ✅ UPDATE SELECTED LEAD
                    setSelectedLead({
                      ...selectedLead,
                      notes:
                        updatedNotes,
                    });

                    // ✅ UPDATE TABLE LEADS
                    setLeads(
                      leads.map(
                        (lead) =>
                          lead._id ===
                            selectedLead._id
                            ? {
                              ...lead,
                              notes:
                                updatedNotes,
                            }
                            : lead
                      )
                    );
                  }}
                />

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

/* INFO BOX */
function Info({ label, value }) {
  return (
    <div className="bg-gray-50 border rounded-2xl p-4">

      <p className="text-xs text-gray-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-gray-800 break-words">
        {value || "-"}
      </p>

    </div>
  );
}

/* EDIT BOX */
function EditBox({
  label,
  value,
  onChange,
}) {
  return (
    <div className="bg-gray-50 border rounded-2xl p-4">

      <p className="text-xs text-gray-500 mb-2">
        {label}
      </p>

      <input
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
}

export default LeadTable;