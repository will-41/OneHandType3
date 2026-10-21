import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const APP_NAME = "OneType";
const APP_VERSION = "1.0.0";

const CREDITS: { name: string; note: string }[] = [
  { name: "Inter typeface", note: "SIL Open Font License 1.1" },
  { name: "Radix UI", note: "accessible UI primitives, MIT License" },
  { name: "Lucide", note: "icons, ISC License" },
  {
    name: "ARTSEY",
    note: "community-created one-handed layout concept (artsey.io), referenced by name only",
  },
  { name: "React", note: "the library this app is built with" },
];

export default function AboutPage() {
  return (
    <div className="text-foreground">
      <article className="mx-auto max-w-prose px-4 py-8 leading-relaxed sm:py-12">
        <Link
          href="/settings"
          className="mb-8 inline-flex min-h-[48px] items-center gap-2 rounded-md text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Back to Settings
        </Link>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">About {APP_NAME}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Version {APP_VERSION}
        </p>

        <p>
          {APP_NAME} offers accessible typing practice for one-handed typists: people with
          motor disabilities, injuries, or amputations, and anyone who wants to practice
          typing with a single hand.
        </p>

        <h2 className="mb-2 mt-8 text-xl font-semibold">Free and open</h2>
        <p>
          No ads, no tracking, everything stays on your device. Read the{" "}
          <Link
            href="/privacy"
            className="text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            privacy policy
          </Link>
          .
        </p>

        <h2 className="mb-2 mt-8 text-xl font-semibold">License</h2>
        <p>{APP_NAME} is open-source software released under the MIT License.</p>

        <h2 className="mb-2 mt-8 text-xl font-semibold">Credits</h2>
        <ul className="list-disc space-y-1 pl-6">
          {CREDITS.map((c) => (
            <li key={c.name}>
              <strong>{c.name}</strong>: {c.note}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
