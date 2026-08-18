// app/(public)/auth/layout.tsx
import './auth-styles.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <div className="auth-background">
        <div className="brand-overlay">
          <span className="brand-kicker">Licores Premium</span>
          <h1>Deluxe Spirits</h1>
          <p>
            Selección premium para celebraciones, gifting y momentos inolvidables.
          </p>
        </div>
      </div>

      <div className="auth-content">{children}</div>
    </div>
  );
}