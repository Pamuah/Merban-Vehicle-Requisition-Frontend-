import type { IconType } from "react-icons";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  onClick?: () => void;
}

const AdminCard = ({
  title,
  value,
  icon: Icon,
  onClick,
}: DashboardCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-lg flex items-center justify-between"
    >
      {/* Left Text Section */}
      <div className="flex flex-col">
        <p className="text-neutral-700 font-semibold text-4xl mt-1">{value}</p>
        <p className="text-neutral-400 font-semibold text-xl">{title}</p>
      </div>

      {/* Icon Box */}
      <div className="h-12 w-12 rounded-xl bg-gray-200 backdrop-blur-md flex items-center justify-center">
        <Icon className="text-neutral-700 text-2xl" />
      </div>
    </div>
  );
};

export default AdminCard;
