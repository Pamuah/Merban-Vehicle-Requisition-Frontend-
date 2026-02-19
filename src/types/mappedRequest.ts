import type { ApprovalRequest, Request } from "./approval.types";

export const mapApprovalToRequest = (req: ApprovalRequest): Request => ({
  _id: req._id,
  requestor:
    typeof req.requestor === "string"
      ? { name: req.requestor }
      : { name: req.requestor?.fullName ?? "Unknown" },
  date: req.date,
  departure_time: req.departure_time,
  estimated_arrival_time: req.estimated_arrival_time,
  destination: req.destination,
  purpose: req.purpose,
  status: req.status,
  createdAt: req.createdAt,
});
