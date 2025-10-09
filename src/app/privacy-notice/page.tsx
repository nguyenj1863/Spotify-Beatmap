import type { Metadata } from "next";
import Link from "next/link";

const LAST_UPDATED_DATE = "October 9, 2025";

export const metadata: Metadata = {
  title: "Privacy Notice - BeatMap",
  description: "How BeatMap uses your Spotify data and your privacy choices.",
};

export default function PrivacyNoticePage() {
  return (
    <main className="px-6 py-14 text-white">
      <div className="mx-auto w-full max-w-4xl leading-relaxed">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1ed760] mb-6 text-center">
          Privacy Notice
        </h1>
        <p className="text-center text-sm text-neutral-400 mb-12">
          Last updated: {LAST_UPDATED_DATE}
        </p>

        <hr className="border-neutral-800 my-10" />

        <p className="text-neutral-300 mb-6">
          Personal information (hereinafter referred to as “personal data”) will
          only be collected, used, and disclosed by us to the extent necessary
          for the purpose of providing a functional and user-friendly website
          and application, including its contents and related services.
        </p>

        <p className="text-neutral-300 mb-6">
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

        <p className="text-neutral-300 mb-6">
          The following privacy policy is intended to inform you about the type,
          scope, purpose, duration, and legal basis for the processing of such
          data, either under our own control or in conjunction with third
          parties. We also outline below any third-party components we use to
          optimize our application and improve the user experience, which may
          result in said third parties also processing data they collect and
          control.
        </p>

        <p className="text-neutral-300 mb-10">
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

        {/* I. Information about us as controllers */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            I. Information about us as controllers of your data
          </h2>
          <p className="text-neutral-300">
            The party responsible for this website and application (the
            “controller”) for purposes of privacy and data protection law is:
          </p>

          <div className="mt-4 rounded-lg border border-neutral-800 p-4 text-neutral-200">
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

        {/* II. Rights of users */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            II. The rights of users and data subjects
          </h2>
          <p className="text-neutral-300 mb-3">
            With regard to the processing of personal data described below,
            users and data subjects have the following rights under PIPEDA:
          </p>
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
              </a>{" "}
              if they believe their information has been mishandled.
            </li>
          </ul>
        </section>

        {/* III. Data Processing */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            III. Information about the data processing
          </h2>
          <p className="text-neutral-300 mb-4">
            Your personal data processed when using BeatMap will be deleted or
            anonymized as soon as the purpose for its storage ceases to apply,
            unless otherwise required by law. The main categories of processing
            are outlined below.
          </p>

          <h3 className="text-xl font-semibold mb-2 text-[#1ed760]">
            1. Spotify Data Access
          </h3>
          <p className="text-neutral-300 mb-3">
            BeatMap integrates with your Spotify account using the OAuth system.
            Depending on which features you use, we may access the following
            data through Spotify's API:
          </p>
          <ul className="list-disc pl-6 marker:text-[#1ed760] text-neutral-300 space-y-1 mb-4">
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-read-email
              </code>{" "}
              — for secure account identification.
            </li>
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-top-read
              </code>{" "}
              — to display your top artists and tracks.
            </li>
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-read-recently-played
              </code>{" "}
              — to show your recently played items.
            </li>
            <li>
              <code className="bg-neutral-800 px-1 py-0.5 rounded text-white text-sm">
                user-read-playback-state
              </code>{" "}
              — to reflect your current playback state (device, progress,
              playback status).
            </li>
          </ul>

          <p className="text-neutral-400 mt-4">
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

          <h3 className="text-xl font-semibold mt-6 mb-2 text-[#1ed760]">
            2. Cookies
          </h3>
          <p className="text-neutral-300 mb-3">
            BeatMap uses only essential cookies required for secure
            authentication and user experience. These cookies:
          </p>
          <ul className="list-disc pl-6 marker:text-[#1ed760] text-neutral-300 space-y-1 mb-4">
            <li>Maintain login sessions between requests.</li>
            <li>Remember theme and consent preferences.</li>
            <li>
              Do not track browsing activity outside BeatMap or create
              advertising profiles.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-[#1ed760]">
            3. Data Retention
          </h3>
          <p className="text-neutral-300 mb-3">
            BeatMap processes Spotify data in real time while you are logged in.
            We do not permanently store listening data. Authentication tokens
            are securely encrypted and retained only for the duration of your
            session or until you log out or revoke access via Spotify.
          </p>
        </section>

        <hr className="border-neutral-800 my-10" />

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">
            IV. Contact Information
          </h2>
          <p className="text-neutral-300 mb-2">
            For privacy-related inquiries, data access requests, or complaints,
            please contact:
          </p>
          <p className="text-neutral-300">
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
      </div>
    </main>
  );
}
