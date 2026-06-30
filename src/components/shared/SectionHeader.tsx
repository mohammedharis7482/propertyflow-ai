interface SectionHeaderProps {
    badge?: string;
    title: string;
    description?: string;
    center?: boolean;
  }
  
  export default function SectionHeader({
    badge,
    title,
    description,
    center = true,
  }: SectionHeaderProps) {
    return (
      <div
        className={`max-w-3xl ${
          center ? "mx-auto text-center" : ""
        }`}
      >
        {badge && (
          <span className="luxury-badge mb-4">
            {badge}
          </span>
        )}
  
        <h2 className="heading-section text-balance-pf">
          {title}
        </h2>
  
        {description && (
          <p className="mt-4 text-lg">
            {description}
          </p>
        )}
      </div>
    );
  }