import React from "react";

const STAGES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

function LeadPipeline({ leads = [], onSelectLead }) {
  return (
    <div className="flex gap-4 overflow-x-auto p-4">

      {STAGES.map((stage) => {
        const stageLeads = leads.filter(
          (l) => l.status === stage
        );

        return (
          <div
            key={stage}
            className="min-w-[260px] bg-gray-100 rounded-2xl p-3"
          >
            <h3 className="font-bold mb-3 text-gray-700">
              {stage} ({stageLeads.length})
            </h3>

            <div className="space-y-2">
              {stageLeads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => onSelectLead?.(lead)}
                  className="bg-white p-3 rounded-xl border shadow-sm cursor-pointer hover:bg-gray-50"
                >
                  <div className="font-semibold">
                    {lead.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lead.company}
                  </div>
                </div>
              ))}
            </div>

          </div>
        );
      })}

    </div>
  );
}

export default LeadPipeline;