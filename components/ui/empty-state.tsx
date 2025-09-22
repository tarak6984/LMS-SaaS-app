import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = "/images/empty-state.svg",
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Image
            src={icon}
            alt={title}
            width={200}
            height={150}
            className="mx-auto opacity-50"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {action && (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

// Specific empty states for common use cases
export function NoCompanionsEmpty() {
  return (
    <EmptyState
      title="No companions found"
      description="Looks like there are no companions matching your search. Try adjusting your filters or create a new companion."
      icon="/icons/science.svg"
      action={{
        label: "Create Companion",
        href: "/companions/new"
      }}
    />
  );
}

export function NoSessionsEmpty() {
  return (
    <EmptyState
      title="No sessions yet"
      description="You haven't completed any learning sessions yet. Start your first session with a companion to begin your learning journey."
      icon="/icons/cap.svg"
      action={{
        label: "Browse Companions",
        href: "/companions"
      }}
    />
  );
}

export function NoBookmarksEmpty() {
  return (
    <EmptyState
      title="No bookmarked companions"
      description="You haven't bookmarked any companions yet. Bookmark your favorite companions for quick access."
      icon="/icons/check.svg"
      action={{
        label: "Explore Companions",
        href: "/companions"
      }}
    />
  );
}