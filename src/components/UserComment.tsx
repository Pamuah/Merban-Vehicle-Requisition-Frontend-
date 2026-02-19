import { useState } from "react";
import { useComments } from "../hooks/useComment";

interface UserCommentProps {
  onClose: () => void;
}

const UserComment = ({ onClose }: UserCommentProps) => {
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);
  const { submitComment, loading, error } = useComments();

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    // Get user data from localStorage
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      alert("User not logged in");
      return;
    }

    const userData = JSON.parse(userDataString);

    try {
      await submitComment({
        name: userData.name,
        email: userData.email,
        department: userData.department,
        employeeId: userData._id,
        comment: comment.trim(),
      });

      // Reset form and show success
      setComment("");
      setSuccess(true);

      // Auto-close modal after short delay
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg">
            Comment submitted successfully!
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Report any issues or problems with vehicles..."
          className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-24 resize-y placeholder-gray-500"
          disabled={loading || success}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !comment.trim() || success}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default UserComment;
