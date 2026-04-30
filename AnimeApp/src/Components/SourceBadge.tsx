interface SourceBadgeProps {
  source: "anipub" | "animekai" | "animeunity";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function SourceBadge({ source, size = "sm", showLabel = true }: SourceBadgeProps) {
  const isAnipub = source === "anipub";
  const isAnimeUnity = source === "animeunity";
  
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[9px]",
    md: "px-2 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };
  
  let badgeClass = "";
  let label = "";
  let icon = "";
  
  if (isAnipub) {
    badgeClass = "bg-orange-500/20 border-orange-500 text-orange-400";
    label = "UNSTABLE";
    icon = "U";
  } else if (isAnimeUnity) {
    badgeClass = "bg-green-500/20 border-green-500 text-green-400";
    label = "WORKING";
    icon = "✓";
  } else {
    badgeClass = "bg-orange-500/20 border-orange-500 text-orange-400";
    label = "UNSTABLE";
    icon = "U";
  }
  
  return (
    <div className={`inline-flex items-center gap-1 rounded-full border ${badgeClass} ${sizeClasses[size]} font-bold`}>
      <span>{icon}</span>
      {showLabel && <span>{label}</span>}
    </div>
  );
}

export default SourceBadge;