import type { ReactNode } from "react";

interface VerifyLayoutProps {
  children: ReactNode;
}

const VerifyLayout = ({ children }: VerifyLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo_website.png"
              alt="Logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sneaker Shop</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-border p-8 space-y-6">
          {children}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Sneaker Shop. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyLayout;
