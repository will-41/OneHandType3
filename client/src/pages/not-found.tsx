import { Link } from "wouter";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <Compass className="h-12 w-12 mx-auto mb-4 text-primary" aria-hidden="true" />
        <h1 className="font-display text-2xl font-medium leading-[1.875rem] text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          This path doesn't lead anywhere in the realm. Let's get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-12 px-6 rounded-lg bg-primary text-primary-foreground font-bold active:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
