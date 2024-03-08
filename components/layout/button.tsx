import Spinner from "./spinner";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
  disabled?: boolean;
  outline?: boolean;
  full?: boolean;
  text?: string;
  children?: React.ReactNode;
}

export default function Button({
  type = "button",
  className = "",
  title = "",
  onClick = () => {},
  loading = false,
  disabled = false,
  text = "",
  outline = false,
  full = false,
  children = null,
}: ButtonProps) {
  const btnClassNames = [
    "text-md",
    "h-12",
    "rounded-md",
    "focus:outline-none",
    "border-primary",
    "transition-all",
    "duration-300",
    full ? "w-full" : "block mr-auto px-4",
    outline
      ? "bg-transparent border-2 text-primary hover:bg-primary hover:text-white"
      : "bg-primary text-white hover:opacity-80",
    disabled ? "!bg-[#E5E5E5] text-[#BDBDBD] cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={btnClassNames}
      title={title}
      disabled={disabled}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
    >
      {loading ? <Spinner /> : children || text}
    </button>
  );
}
