import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--bg-nav-footer)] px-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-[var(--text-primary)]">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-[var(--text-secondary)]">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-600">
          Oops! The page you are looking for does not exist or has been moved.
          Lets get you back to a safe place.
        </p>

        <Link
          href="/"
          className="inline-block px-4 py-3 mt-10 font-bold text-white shadow-lg rounded-xl bg-(--primary) shadow-(--primary)/30 hover:bg-orange-600 transition"
        >
          ⬅ Back to Home
        </Link>
      </div>
    </section>
  );
}