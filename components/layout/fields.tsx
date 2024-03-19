import { LucideEye, LucideEyeOff } from "lucide-react";
import { useEffect, useState } from "react";

function InputField({
  id = "",
  name = "",
  type = "text",
  placeholder = "",
  label = "",
  minLength = 0,
  maxLength = 100,
  defaultValue = "",
  onChange = () => {},
  error = "",
  disabled = false,
  optional = false,
}) {
  return (
    <div className="flex w-full flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-[#4B4B4B]">
        {label}
        {optional && <span className="text-[#858585]"> (Optional)</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`h-12 w-full rounded-lg border border-[#EAEAEA] px-4 ${
          disabled ? "cursor-not-allowed bg-[#F5F5F5] text-[#858585]" : ""
        }`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

function PasswordField({
  id = "",
  name = "",
  placeholder = "",
  label = "",
  minLength = 0,
  maxLength = 100,
  defaultValue = "",
  onChange = () => {},
  error = "",
  disabled = false,
}) {
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <div className="flex w-full flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-[#4B4B4B]">
        {label}
      </label>
      <div className="relative">
        <input
          type={hidePassword ? "password" : "text"}
          id={id}
          name={name}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={onChange}
          className={`h-12 w-full rounded-lg border border-[#EAEAEA] px-4 pr-8 ${
            disabled ? "cursor-not-allowed bg-[#F5F5F5] text-[#858585]" : ""
          }`}
        />
        {hidePassword ? (
          <LucideEye
            className="absolute right-4 top-3 text-[#4B4B4B] hover:cursor-pointer"
            onClick={() => setHidePassword(false)}
          />
        ) : (
          <LucideEyeOff
            className="absolute right-4 top-3 text-[#4B4B4B] hover:cursor-pointer"
            onClick={() => setHidePassword(true)}
          />
        )}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

function ToggleField({ id = "", name = "", label = "", onChange = () => {} }) {
  return (
    <div className="flex w-full flex-col space-y-2">
      <label
        htmlFor={name}
        className="relative my-2 inline-flex cursor-pointer items-center gap-4 text-sm text-[#4B4B4B]"
      >
        <input
          type="checkbox"
          id={id}
          name={name}
          className="peer sr-only"
          value="WORKING"
          onChange={onChange}
        />
        <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-white after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-0 rtl:peer-checked:after:-translate-x-full dark:border-[#D4D4D4] dark:bg-[#D4D4D4]"></div>
        {label}
      </label>
    </div>
  );
}

function formatPhoneNumber(value: string) {
  // Remove all non-numeric characters from the input value
  const cleaned = value.replace(/\D/g, "");

  // Apply formatting based on the cleaned value
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    // Check if all digits are entered, otherwise, return formatted string with only entered digits
    return match[1]
      ? "(" +
          match[1] +
          (match[2] ? ") " + match[2] + (match[3] ? " - " + match[3] : "") : "")
      : "";
  }

  // If no match is found, return an empty string
  return "";
}

function PhoneField({
  id = "",
  name = "",
  placeholder = "",
  label = "",
  minLength = 0,
  maxLength = 100,
  defaultValue = "",
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {},
  error = "",
  optional = false,
  disabled = false,
}) {
  const [phone, setPhone] = useState(
    defaultValue ? formatPhoneNumber(defaultValue) : "",
  );

  useEffect(() => {
    if (defaultValue) setPhone(formatPhoneNumber(defaultValue));
  }, [defaultValue]);

  return (
    <div className="flex w-full flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-[#4B4B4B]">
        {label}
        {optional && <span className="text-[#858585]"> (Optional)</span>}
      </label>
      <input
        type="tel"
        id={id}
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        value={phone}
        disabled={disabled}
        onChange={(e) => {
          const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
          const formattedValue = formatPhoneNumber(numericValue);
          setPhone(formattedValue);
          if (onChange) {
            onChange({
              ...e,
              target: { ...e.target, name: name, value: numericValue },
            });
          } else {
            e.preventDefault();
          }
        }}
        className={`h-12 w-full rounded-lg border border-[#EAEAEA] px-4 ${
          disabled ? "cursor-not-allowed bg-[#F5F5F5] text-[#858585]" : ""
        }`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

export { InputField, PasswordField, ToggleField, PhoneField };
