"use client";

import JobForm from "./JobForm";

const JobModal = ({ open, onClose, onSubmit, initialData, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">
            {initialData ? "Update Job" : "Create Job"}
          </h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* Body */}
        <div className="p-4">
          <JobForm
            initialData={initialData}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default JobModal;
