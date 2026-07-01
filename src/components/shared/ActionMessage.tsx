interface ActionMessageProps {
  message: string | null;
  type?: "success" | "error";
}

export default function ActionMessage({
  message,
  type = "success",
}: ActionMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`min-w-0 max-w-full break-words rounded-2xl border px-4 py-3 text-sm font-semibold ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-100 bg-red-50 text-red-700"
      }`}
    >
      {message}
    </div>
  );
}
