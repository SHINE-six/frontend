import "./globals.css";

export const metadata = {
  title: "Desmond Foo's Portfolio",
  description: "A portfolio website showcasing Desmond Foo's projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
