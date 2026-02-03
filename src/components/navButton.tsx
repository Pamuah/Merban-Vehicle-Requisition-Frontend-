import type { IconType } from "react-icons";

interface Props {
  label: string;
  icon: IconType;
  active: boolean;
  onClick: () => void;
}

export default function NavButton({
  label,
  icon: Icon,
  active,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition w-full text-left
        ${
          active
            ? "bg-[#D7F97C] text-[#0D2A29] font-semibold"
            : "text-[#B6C8C7] hover:bg-[#143838]"
        }
      `}
    >
      <Icon
        className={`
          text-xl
          ${active ? "text-[#0D2A29]" : "text-[#B6C8C7]"}
        `}
      />
      <span>{label}</span>
    </button>
  );
}
