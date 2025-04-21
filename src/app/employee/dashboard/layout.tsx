import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Field Employee Dashboard | Trinayani Medical Equipment',
  description: 'Manage your field tasks, schedule, expenses, and client information.',
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </section>
  );
} 