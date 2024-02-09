import exp from "constants";

function InputField({
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

function ToggleField({ id = "", name = "", label = "", onChange = () => {} }) {
  return (
    <div className="flex w-full flex-col space-y-2">
      <label
        htmlFor={name}
        className="relative inline-flex cursor-pointer items-center gap-4 my-2 text-sm text-[#4B4B4B]"
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

export { InputField, ToggleField };
