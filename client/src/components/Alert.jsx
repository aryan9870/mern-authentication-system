import { useContext } from "react";
import { AlertContext } from "../context/AlertContext";

const Alert = () => {
  const { alert, hideAlert } = useContext(AlertContext);

  if (!alert.message) return null;

  return (
    <div
      className={`fixed top-5 right-20 z-50 px-5 py-3 rounded-lg shadow-lg
      ${alert.type === "success"
        ? "bg-green-500 text-white"
        : "bg-red-500 text-white"}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm">{alert.message}</span>
        <button onClick={hideAlert} className="font-bold text-lg">×</button>
      </div>
    </div>
  );
};

export default Alert;
