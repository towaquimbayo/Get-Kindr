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
    full ? "w-full" : "block mr-auto px-4",
    outline ? "bg-transparent border-2 text-primary" : "bg-primary text-white",
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
