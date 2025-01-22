import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const Input = ({
  label,
  error,
  register,
  containerClassName = "flex flex-col",
  labelClassName = "text-sm font-medium text-gray-200 bg-[#272A33] rounded-t-2xl py-2 px-4",
  errorClassName = "text-red-300 text-sm",
  className,
  ...props
}: InputProps) => {
  return (
    <div className={containerClassName}>
      {label && <label className={labelClassName}>{label}</label>}
      <input
        className={`w-full pb-2 px-4 border border-[#272A33] placeholder:text-[#9396A5] outline-none rounded-b-2xl text-gray-200 bg-[#272A33] ${
          className || ""
        }`}
        {...register}
        {...props}
      />
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
};

export default Input;
