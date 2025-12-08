// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "Student Portal",
  description: "Student dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-orange-50">
        {children}
      </body>
    </html>
  );
}
