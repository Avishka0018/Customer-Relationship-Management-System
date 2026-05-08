import React from "react";

const STAGES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

function LeadPipelineDetail({ lead, onClose }) {
  if (!lead) return null;

  const currentIndex = STAGES.indexOf(lead.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-[650px] rounded-3xl shadow-2xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-5">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {lead.name}
            </h2>

            <p className="text-sm text-gray-500">
              {lead.company}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {lead.email}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>

        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-2 gap-3 mb-6">

          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium">
              {lead.phone || "-"}
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-xs text-gray-500">Source</p>
            <p className="font-medium">
              {lead.source || "-"}
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-xs text-gray-500">Value</p>
            <p className="font-semibold text-teal-600">
              ${lead.value || 0}
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-xs text-gray-500">Salesperson</p>
            <p className="font-medium">
              {lead.salesperson || "-"}
            </p>
          </div>

        </div>

        {/* PIPELINE PROGRESS */}
        <div className="mb-4">

          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Sales Pipeline
          </h3>

          <div className="flex items-center justify-between relative">

            {/* LINE BACKGROUND */}
            <div className="absolute top-3 left-0 right-0 h-[2px] bg-gray-200 z-0"></div>

            {STAGES.map((stage, index) => {
              const isActive = index === currentIndex;
              const isDone = index < currentIndex;

              return (
                <div
                  key={stage}
                  className="flex flex-col items-center z-10 w-full"
                >

                  {/* DOT */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${
                        isActive
                          ? "bg-teal-600 text-white"
                          : isDone
                          ? "bg-teal-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {index + 1}
                  </div>

                  {/* LABEL */}
                  <p
                    className={`text-[10px] mt-1 text-center ${
                      isActive
                        ? "text-teal-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {stage}
                  </p>

                </div>
              );
            })}

          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="mt-4">
          <span className="inline-block px-3 py-1 text-sm rounded-full bg-teal-100 text-teal-700">
            Current: {lead.status}
          </span>
        </div>

        {/* CLOSE BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default LeadPipelineDetail;