interface LoaderProps {
  module?: "finance" | "medical" | "learning" | "reminders" | "default";
  /** "page" = centered spinner for full page, "inline" = small spinner for inline text */
  size?: "page" | "inline";
}

const moduleColors: Record<string, { track: string; spinner: string }> = {
  default: { track: "border-gray-200", spinner: "border-t-gray-600" },
  finance: { track: "border-blue-200", spinner: "border-t-blue-600" },
  medical: { track: "border-rose-200", spinner: "border-t-rose-600" },
  learning: { track: "border-green-200", spinner: "border-t-green-600" },
  reminders: { track: "border-purple-200", spinner: "border-t-purple-600" },
};

export default function Loader({ module = "default", size = "page" }: LoaderProps) {
  const colors = moduleColors[module] ?? moduleColors.default;

  if (size === "inline") {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded-full border-2 ${colors.track} ${colors.spinner} animate-spin`}
        />
        <span className="text-gray-400 text-sm">Loading...</span>
      </span>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh]">
      <div
        className={`w-8 h-8 rounded-full border-[3px] ${colors.track} ${colors.spinner} animate-spin`}
      />
    </div>
  );
}
