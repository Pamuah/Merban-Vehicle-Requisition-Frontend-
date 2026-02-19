import { useApprovals } from "../hooks/useApprovals";
import ApprovalTable from "../components/ApprovalTable";
import { ShowToast } from "../components/Toast";
import { mapApprovalToRequest } from "../types/mappedRequest";

const HrApprovals = () => {
  const { approvals, approveRequest, rejectRequest } = useApprovals();

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id);
      ShowToast("success", "Approved successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      ShowToast("error", message || "Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(id);
      ShowToast("success", "Rejected successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      ShowToast("error", message || "Failed to reject");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50">
      <div className="shadow-md shadow-lime-700 h-14 p-2.5 w-full mb-12 ">
        <h1 className="text-2xl font-semibold text-center justify-center items-center text-green-700">
          HR Approvals
        </h1>
      </div>

      <div className="px-12">
        <ApprovalTable
          items={approvals.map(mapApprovalToRequest)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default HrApprovals;
