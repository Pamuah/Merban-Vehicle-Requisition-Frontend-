import type { IconType } from "react-icons";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  onClick,
}: DashboardCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-linear-to-r from-gray-600 via-green-300 to-gray-800 rounded-2xl p-5 shadow-lg flex items-center justify-between"
    >
      {/* Left Text Section */}
      <div className="flex flex-col">
        <p className="text-white font-normal text-xl">{title}</p>
        <p className="text-white font-bold text-4xl mt-1">{value}</p>
      </div>

      {/* Icon Box */}
      <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
        <Icon className="text-white text-2xl" />
      </div>
    </div>
  );
};

export default DashboardCard;
