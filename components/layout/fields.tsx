export default function InputField({
  id = "",
  name = "",
  type = "text",
  placeholder = "",
  label = "",
}) {
  return (
    <div className="flex w-full flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-[#4B4B4B]">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-[#EAEAEA] px-4"
      />
    </div>
  );
}
