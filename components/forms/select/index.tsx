import { UseFormRegisterReturn } from "react-hook-form";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  options: { value: string; label: string }[];
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const Select = ({
  label,
  error,
  register,
  options,
  containerClassName = "flex flex-col",
  labelClassName = "text-sm font-medium text-gray-200 bg-[#272A33] rounded-t-2xl py-2 px-4",
  errorClassName = "text-red-300 text-sm",
  className,
  ...props
}: SelectProps) => {
  return (
    <div className={containerClassName}>
      {label && <label className={labelClassName}>{label}</label>}
      <div className="relative">
        <select
          className={`w-full mb-1 pb-2 px-4 border border-[#272A33] placeholder:text-[#9396A5] outline-none rounded-b-2xl text-gray-200 bg-[#272A33] appearance-none ${
            className || ""
          }`}
          {...register}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 fill-current text-gray-400"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
};

export default Select;
