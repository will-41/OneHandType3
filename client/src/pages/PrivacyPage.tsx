import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const EFFECTIVE_DATE = "2026-10-21";
const CONTACT_EMAIL = "wilmymoise@gmail.com";

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "What we collect",
    body: [
      "Nothing. One-Type does not collect, receive, or store any personal information on any server. We have no server.",
    ],
  },
  {
    heading: "What stays on your device",
    body: [
      "Your progress (levels, scores, achievements), settings, custom layouts, and custom lessons are saved in your browser's local storage on your own device. Only you can access them. We cannot see them.",
    ],
  },
  {
    heading: "Network activity",
    body: [
      "The app makes no network requests while you use it. Once installed, it works fully offline. Your device or browser may fetch the app files when you first open or update it; that is ordinary web or app delivery and is not something the app does with your data.",
    ],
  },
  {
    heading: "Sharing",
    body: ["We share no data with anyone, because we have no data."],
  },
  {
    heading: "Deleting your data",
    body: [
      "Clear the site data or app data for One-Type in your browser or device settings, or uninstall the app. This permanently removes everything the app has stored.",
    ],
  },
  {
    heading: "Children",
    body: [
      "One-Type collects no data from anyone, including children. There is nothing to collect, share, or delete on our side.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If this policy changes, the new version will be posted in the app, with an updated effective date.",
    ],
  },
];

const SUMMARY = [
  "No accounts, no sign-in.",
  "No analytics, no advertising, no third-party SDKs.",
  "No network requests made by the app.",
  "Your progress and settings stay on your device.",
];

export default function PrivacyPage() {
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

        <h1 className="mb-2 text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Effective date: {EFFECTIVE_DATE}
        </p>
        <p className="mb-6">
          One-Type is a free, offline typing trainer. It collects no personal data, and it
          never sends anything off your device.
        </p>

        <h2 className="mb-2 mt-8 text-xl font-semibold">Summary</h2>
        <ul className="list-disc space-y-1 pl-6">
          {SUMMARY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {SECTIONS.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-2 mt-8 text-xl font-semibold">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}

        <section>
          <h2 className="mb-2 mt-8 text-xl font-semibold">Contact</h2>
          <p>
            Questions? Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
