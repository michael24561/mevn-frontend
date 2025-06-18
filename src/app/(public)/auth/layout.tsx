// app/(public)/auth/layout.tsx
import './auth-styles.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <div className="auth-content">
        {children}
      </div>
    </div>
  );
}