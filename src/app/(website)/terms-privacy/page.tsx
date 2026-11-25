"use client";

import SectionTitle from "@/app/(website)/components/ui/section-title";
import Link from "next/link";

export default function TermsPrivacyPage() {
  return (
    <section className="py-16 bg-[var(--bg-primary)] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <SectionTitle
          title="Terms & Privacy"
          subtitle="Read our terms and privacy policies carefully before using Flexify."
        />

        {/* Content */}
        <div className="mt-12 space-y-8 text-[var(--text-secondary)] leading-relaxed">

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              1. Terms of Use
            </h3>
            <p>
              By accessing or using Flexify, you agree to comply with all applicable laws, regulations, and these terms. You agree to use the platform responsibly and respect the rights of others.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              2. Account Usage
            </h3>
            <p>
              Some features may require an account. You are responsible for maintaining the confidentiality of your account information. Flexify is not liable for any unauthorized access to your account.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              3. Privacy Policy
            </h3>
            <p>
              Flexify respects your privacy. We do not permanently store personal or health data entered on the platform. Information may be processed temporarily for functionality but is never shared with third parties without your consent.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              4. Content
            </h3>
            <p>
              All content provided by Flexify, including workout plans, articles, and tools, is for informational and educational purposes only. Do not consider it a substitute for professional advice.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              5. Limitation of Liability
            </h3>
            <p>
              Flexify is not liable for any injury, loss, or damages resulting from using the platform. Users engage with content at their own risk.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              6. Changes to Terms
            </h3>
            <p>
              Flexify reserves the right to modify terms and privacy policies at any time. Users are encouraged to review this page periodically for updates.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              7. Support & Contact
            </h3>
            <p>
              If you have questions or issues, our support team is available via the Contact page. We aim to respond to all inquiries within 48 hours.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              8. Cookies & Tracking
            </h3>
            <p>
              Flexify may use cookies and analytics tools to improve user experience. No personally identifiable information is collected without user consent.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              9. Data Usage
            </h3>
            <p>
              All user data entered is used to generate personalized recommendations and is never sold to third parties. Data is handled according to best practices and privacy standards.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              10. Governing Law
            </h3>
            <p>
              These terms and conditions are governed by the laws of the country where Flexify operates. Any disputes shall be subject to local jurisdiction.
            </p>
          </div>
        </div>

        {/* Back To Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl font-semibold
                       bg-[var(--primary)] text-white
                       transition-all duration-300
                       hover:opacity-90
                       hover:-translate-y-1
                       hover:shadow-lg"
          >
            Back To Home
          </Link>
        </div>
      </div>
    </section>
  );
}