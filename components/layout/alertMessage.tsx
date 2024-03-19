import {  CheckCircle2, AlertCircle, InfoIcon } from "lucide-react";

export default function AlertMessage({ message = "", type = "error" }) {
  function getIcon() {
    switch (type) {
      case "error":
        return <AlertCircle size={24} className="m-2" />;
      case "success":
        return <CheckCircle2 size={24} className="m-2" />;
      case "info":
        return <InfoIcon size={24} className="m-2" />;
      default:
        return null;
    }
  }

  function getClasses() {
    switch (type) {
      case "error":
        return "border-primary text-primary";
      case "success":
        return "border-green-500 text-green-500";
      case "info":
        return "border-blue-500 text-blue-500";
      default:
        return "";
    }
  }

  return (
    <div
      className={`mb-4 flex w-full items-center justify-start rounded-md border-2 px-2 py-1.5 ${getClasses()}`}
    >
      {getIcon()}
      <p>{message}</p>
    </div>
  );
}
