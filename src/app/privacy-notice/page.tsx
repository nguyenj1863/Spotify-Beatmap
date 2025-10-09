import type { Metadata } from "next";
import Link from "next/link";

const LAST_UPDATED_DATE = "October 9, 2025";

export const metadata: Metadata = {
  title: "Privacy Notice - BeatMap",
  description: "How BeatMap uses your Spotify data and your privacy choices.",
};

export default function PrivacyNoticePage() {
  return (
    <main className="relative px-6 py-16 text-white overflow-hidden">
      <div className="relative mx-auto w-full max-w-5xl leading-relaxed">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1ed760]">
            Privacy Notice
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Last updated: {LAST_UPDATED_DATE}
          </p>
        </header>

        {/* Table of Contents */}
        <section className="relative mb-16">
          <nav
            aria-label="Table of contents"
            className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl text-[#1ed760] mb-4 font-bold tracking-wider uppercase">
              Contents
            </h2>
            <ul className="space-y-3 text-neutral-300">
              <li>
                <a
                  href="#controllers"
                  className="text-lg text-neutral-200 font-semibold hover:text-[#1ed760] transition-colors"
                >
                  I. Information about us as controllers of your data
                </a>
              </li>
              <li>
                <a
                  href="#rights"
                  className="text-lg text-neutral-200 font-semibold hover:text-[#1ed760] transition-colors"
                >
                  II. The rights of users and data subjects
                </a>
              </li>
              <li>
                <a
                  href="#processing"
                  className="text-lg text-neutral-200 font-semibold hover:text-[#1ed760] transition-colors"
                >
                  III. Information about the data processing
                </a>
                <ul className="mt-3 ml-5 space-y-2 border-l border-neutral-700 pl-4">
                  <li>
                    <a
                      href="#processing-spotify"
                      className="text-base text-neutral-400 hover:text-[#1ed760] hover:underline transition-colors"
                    >
                      1. Spotify Data Access
                    </a>
                  </li>
                  <li>
                    <a
                      href="#processing-cookies"
                      className="text-base text-neutral-400 hover:text-[#1ed760] hover:underline transition-colors"
                    >
                      2. Cookies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#processing-retention"
                      className="text-base text-neutral-400 hover:text-[#1ed760] hover:underline transition-colors"
                    >
                      3. Data Retention
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-lg text-neutral-200 font-semibold hover:text-[#1ed760] transition-colors"
                >
                  IV. Contact Information
                </a>
              </li>
            </ul>
          </nav>

          {/* Spotify-green glow under TOC */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-3 flex justify-center">
            <div className="h-5 w-2/3 md:w-1/2 rounded-full bg-emerald-400/25 blur-2xl" />
          </div>
        </section>

        <hr className="border-neutral-800 my-10" />

        {/* Main Text */}
        <section className="space-y-6 text-neutral-300">
          <p>
            Personal information (hereinafter referred to as “personal data”) will
            only be collected, used, and disclosed by us to the extent necessary
            for the purpose of providing a functional and user-friendly website
            and application, including its contents and related services.
          </p>

          <p>
            <strong>
              Pursuant to the Personal Information Protection and Electronic
              Documents Act (PIPEDA), S.C. 2000, c. 5
            </strong>{" "}
            — the federal privacy law applicable to private organizations in
            Canada — “personal information” means information about an identifiable
            individual. “Processing” includes the collection, use, disclosure,
            storage, and destruction of such information, whether by automated
            means or not.
          </p>

          <p>
            The following privacy policy is intended to inform you about the type,
            scope, purpose, duration, and legal basis for the processing of such
            data, either under our own control or in conjunction with third
            parties. We also outline below any third-party components we use to
            optimize our application and improve the user experience, which may
            result in said third parties also processing data they collect and
            control.
          </p>

          <p>
            Our privacy policy is structured as follows:
            <br />
            <span className="block mt-2">
              I. Information about us as controllers of your data
              <br />
              II. The rights of users and data subjects
              <br />
              III. Information about the data processing
            </span>
          </p>
        </section>

        {/* I. Controller */}
        <section id="controllers" className="mt-12 mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-[#1ed760]">
            I. Information about us as controllers of your data
          </h2>
          <p>
            The party responsible for this website and application (the
            “controller”) for purposes of privacy and data protection law is:
          </p>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4 text-neutral-200">
            <p>
              <strong>John Nguyen</strong>
            </p>
            <p>Greater Toronto Area, Ontario, Canada</p>
            <p>
              Email:{" "}
              <a
                href="mailto:nguyenj1863@gmail.com"
                className="text-[#1ed760] font-medium hover:underline"
              >
                nguyenj1863@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* II. Rights */}
        <section id="rights" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-[#1ed760]">
            II. The rights of users and data subjects
          </h2>
          <ul className="list-disc pl-6 marker:text-[#1ed760] text-neutral-300 space-y-2">
            <li>
              To be informed about whether data concerning them is being
              collected, used, or disclosed, and to request copies of such data.
            </li>
            <li>To request corrections to inaccurate or incomplete data.</li>
            <li>
              To withdraw consent for future uses of their data, subject to
              legal or contractual restrictions.
            </li>
            <li>
              To file a complaint with the{" "}
              <a
                href="https://www.priv.gc.ca/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1ed760] hover:underline"
              >
                Office of the Privacy Commissioner of Canada (OPC)
              </a>
              .
            </li>
          </ul>
        </section>

        {/* III. Data Processing */}
        <section id="processing" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-[#1ed760]">
            III. Information about the data processing
          </h2>
          <p className="mb-4">
            Your personal data processed when using BeatMap will be deleted or
            anonymized as soon as the purpose for its storage ceases to apply,
            unless otherwise required by law. The main categories of processing
            are outlined below.
          </p>

          {/* 1. Spotify Data Access */}
          <h3
            id="processing-spotify"
            className="text-xl font-semibold mb-2 text-[#1ed760]"
          >
            1. Spotify Data Access
          </h3>
          <p className="mb-3">
            BeatMap integrates with your Spotify account using OAuth. Depending
            on which features you use, we may access the following data through
            Spotify's API:
          </p>
          <ul className="list-disc pl-6 marker:text-[#1ed760] text-neutral-300 space-y-1 mb-4">
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-read-email
              </code>{" "}
              — read your email for account identification.
            </li>
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-top-read
              </code>{" "}
              — display your top artists and tracks.
            </li>
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-read-recently-played
              </code>{" "}
              — show your recently played items for timelines and summaries.
            </li>
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-read-playback-state
              </code>{" "}
              — read your current playback state (device, is playing, progress)
              to reflect real-time status.
            </li>
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-read-currently-playing
              </code>{" "}
              — show what you're currently playing (track/episode + progress).
            </li>
          </ul>
          <p className="text-neutral-400">
            You can revoke BeatMap's access at any time under{" "}
            <a
              href="https://www.spotify.com/account/apps/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1ed760] hover:underline"
            >
              Spotify &gt; Apps
            </a>
            . Revoking access disables BeatMap's connection immediately.
          </p>

          {/* 2. Cookies */}
          <h3
            id="processing-cookies"
            className="text-xl font-semibold mt-8 mb-2 text-[#1ed760]"
          >
            2. Cookies
          </h3>
          <p className="text-neutral-300 mb-3">
            BeatMap uses a small number of <strong>essential cookies</strong> to
            maintain your session and support core features. These cookies:
          </p>
          <ul className="list-disc pl-6 marker:text-[#1ed760] text-neutral-300 space-y-1 mb-4">
            <li>Keep you logged in securely between requests.</li>
            <li>Remember theme and consent preferences.</li>
            <li>
              Do <strong>not</strong> track activity outside BeatMap or create
              advertising profiles.
            </li>
          </ul>
          <p className="text-neutral-400">
            We may use privacy-respecting analytics (e.g., Vercel Analytics or
            Plausible) to understand aggregated usage trends—never tied to your
            personal Spotify data.
          </p>

          {/* 3. Data Retention */}
          <h3
            id="processing-retention"
            className="text-xl font-semibold mt-8 mb-2 text-[#1ed760]"
          >
            3. Data Retention
          </h3>
          <p className="text-neutral-300">
            BeatMap processes Spotify data <strong>in real time</strong> while
            you're logged in. We <strong>do not permanently store</strong> your
            listening data (e.g., top or recent items). Authentication tokens
            are securely stored only for the duration of your session—or until
            you log out or revoke access via Spotify.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-3 text-[#1ed760]">
            IV. Contact Information
          </h2>
          <p className="mb-2">
            For privacy-related inquiries, data access requests, or complaints,
            please contact:
          </p>
          <p>
            <strong>John Nguyen</strong>
            <br />
            Greater Toronto Area, Ontario, Canada
            <br />
            Email:{" "}
            <a
              href="mailto:nguyenj1863@gmail.com"
              className="text-[#1ed760] hover:underline"
            >
              nguyenj1863@gmail.com
            </a>
          </p>
        </section>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="spotify-button inline-block rounded-full bg-[#1ed760] px-8 py-3 font-semibold text-black shadow-md shadow-[#1ed760]/30 transition-all duration-300 hover:scale-105 hover:bg-[#1fdf64] hover:shadow-[0_0_25px_rgba(30,215,96,0.6)]"
          >
            Back to the Music
          </Link>
        </div>

        {/* Subtle page-bottom glow */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-3 flex justify-center">
          <div className="h-2 w-2/3 md:w-1/2 rounded-full bg-emerald-400/25 blur-2xl" />
        </div>
      </div>
    </main>
  );
}
