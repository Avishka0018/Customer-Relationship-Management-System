import { useState } from "react";
import api from "../../api/axios";

function LeadNotes({
  leadId,
  notes = [],
  setNotes,
}) {
  const [text, setText] = useState("");

  const [loading, setLoading] =
    useState(false);

  // ✅ ADD NOTE
  const addNote = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await api.post(
        `/leads/${leadId}/notes`,
        {
          content: text,
          createdBy: "Admin",
        }
      );

      // ✅ UPDATED LEAD
      const updatedLead = res.data;

      // ✅ SORT NOTES BY DATE
      const sortedNotes = (
        updatedLead.notes || []
      ).sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      // ✅ UPDATE NOTES
      setNotes(sortedNotes);

      // ✅ CLEAR INPUT
      setText("");
    } catch (err) {
      alert("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Lead Notes
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Notes for this lead
        </p>
      </div>

      {/* INPUT */}
      <div className="flex gap-3 mb-5">

        <input
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a note..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
        />

        <button
          onClick={addNote}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl font-semibold transition"
        >
          {loading
            ? "Adding..."
            : "Add"}
        </button>

      </div>

      {/* NOTES LIST */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">

        {notes.length === 0 && (
          <div className="bg-white border rounded-2xl p-6 text-center text-gray-400">
            No notes added yet
          </div>
        )}

        {notes.map((note, index) => (
          <div
            key={note._id || index}
            className="bg-white border rounded-2xl p-4 shadow-sm"
          >
            {/* NOTE CONTENT */}
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {note.content}
            </p>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">

              <span className="font-medium">
                {note.createdBy ||
                  "Admin"}
              </span>

              <span>
                {note.createdAt
                  ? new Date(
                      note.createdAt
                    ).toLocaleString()
                  : "Just now"}
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default LeadNotes;