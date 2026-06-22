import type { LucideIcon } from "lucide-react";

interface FeatureIconItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureIconItem({
  icon: Icon,
  title,
  description,
}: FeatureIconItemProps) {
  return (
    <div className="flex flex-col items-center">
      <Icon
        className="h-10 w-10 text-accent-gold mb-6"
        strokeWidth={1}
      />
      <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface mb-3">
        {title}
      </h4>
      <p className="font-caption text-caption text-[#1B130F] max-w-[200px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
