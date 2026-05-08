import React, { useState } from "react";
import api from "../../api/axios";
import LeadNotes from "./LeadNotes";

function LeadDetails({ lead }) {
  const [notes, setNotes] = useState(lead.notes || []);

  const addNote = async (text) => {
    const res = await api.post(`/leads/${lead._id}/notes`, {
      content: text,
      createdBy: "Admin",
    });

    setNotes(res.data.notes);
  };

  return (
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold">{lead.name}</h2>
      <p>{lead.company}</p>
      <p>Status: {lead.status}</p>

      <LeadNotes notes={notes} onAdd={addNote} />

    </div>
  );
}

export default LeadDetails;