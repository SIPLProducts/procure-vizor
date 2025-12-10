import { MainLayout } from "@/components/layout/MainLayout";
import { VendorList } from "@/components/vendor/VendorList";

export default function Vendors() {
  return (
    <MainLayout title="Vendor Management" subtitle="Manage and monitor your vendor network">
      <div className="space-y-6 animate-fade-in">
        <VendorList />
      </div>
    </MainLayout>
  );
}
