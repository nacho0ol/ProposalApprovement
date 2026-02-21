import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposal Approvement - RJI',
  description: 'Sistem Approval Jurnal Relawan Jurnal Indonesia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}