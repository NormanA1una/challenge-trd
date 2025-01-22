import { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxProps {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  className?: string;
}

const Checkbox = ({
  label,
  register,
  error,
  className = "",
}: CheckboxProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        {...register}
        className="relative appearance-none w-4 h-4 bg-[#181A1F] border border-[#272A33] rounded-sm 
        checked:bg-[#FCB115] checked:border-[#FCB115]
        hover:border-[#FCB115] transition-colors cursor-pointer
        after:content-[''] after:absolute after:opacity-0 after:checked:opacity-100
        after:w-[6px] after:h-[10px] after:border-r-[2px] after:border-b-[2px] after:border-black
        after:rotate-45 after:left-[5px] after:top-0"
      />
      {label && <p className="text-sm text-[#FFFFFF]">{label}</p>}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default Checkbox;
