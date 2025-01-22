import { ReactNode } from "react";

interface InfoCardProps {
  label: string;
  value: ReactNode;
}

const InfoCard = ({ label, value }: InfoCardProps) => {
  return (
    <div className="flex flex-col gap-2 border border-[#272A33] rounded-xl py-2 px-3 w-full">
      <p className="text-[#9396A5]">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

export default InfoCard;
