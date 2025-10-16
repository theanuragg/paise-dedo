import AdminLayout from '@/components/admin/AdminLayout';
import SecurityLogs from '@/components/admin/SecurityLogs';

export default function SecurityPage() {
  return (
    <AdminLayout>
      <SecurityLogs />
    </AdminLayout>
  );
}
