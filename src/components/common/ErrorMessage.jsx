import { MdErrorOutline } from "react-icons/md";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg px-4 py-2 mt-2">
      <MdErrorOutline className="text-red-500 text-lg" />
      <span>{message}</span>
    </div>
  );
}
