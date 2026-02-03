import useSecurityApprovals from "../hooks/useSecurityApprovals";
import ApprovalTable from "../components/ApprovalTable";
import { useSecurityRequest } from "../context/securityRequestContext";
import { useNavigate } from "react-router-dom";

const SecurityPage = () => {
  const { setSelected } = useSecurityRequest();
  const { requests, loading, error, refresh } = useSecurityApprovals();

  const navigate = useNavigate();

  const handleRowClick = (req: any) => {
    setSelected({
      id: req._id,
      employeeName: req?.requestor?.name || req?.user?.fullName || "",
    });

    navigate(`/security/check/${req._id}`);
  };
  return (
    <div className="h-screen w-screen bg-gray-50">
      <div className="shadow-md shadow-green-700 h-14 p-2.5 w-full mb-12">
        <h1 className="text-2xl font-semibold text-center text-green-700">
          Security Check
        </h1>
      </div>

      {/* Optional: show loading or error */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}
      <div className="pt-10 px-30">
        <ApprovalTable
          items={requests}
          showActions={false}
          onRowClick={handleRowClick}
        />
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={refresh}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default SecurityPage;
