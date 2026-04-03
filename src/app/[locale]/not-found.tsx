import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-gold text-6xl font-bold font-[family-name:var(--font-playfair)] mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold text-navy mb-2">Page Not Found</h1>
        <p className="text-muted mb-6">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 bg-gold hover:bg-gold-light text-navy font-semibold rounded-lg transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
