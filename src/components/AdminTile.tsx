import type { IconType } from "react-icons";
import { type ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: IconType;
  onClick?: () => void;
  children?: ReactNode;
}

const AdminTile = ({
  title,
  value,
  //   icon: Icon,
  onClick,
  children,
}: DashboardCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 min-h-[200px] shadow-lg flex items-start justify-start"
    >
      {/* Left Text Section */}
      <div className="flex flex-col">
        <p className="text-neutral-700 font-semibold  text-xl mb-10">{title}</p>
        <p className="text-neutral-500 font-semibold text-4xl mt-1">{value}</p>
      </div>

      {children && <div className="ml-auto">{children}</div>}
    </div>
  );
};

export default AdminTile;
