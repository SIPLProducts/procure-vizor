import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { VendorList } from "@/components/vendor/VendorList";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, CheckCircle2, ArrowRight } from "lucide-react";

export default function Vendors() {
  return (
    <MainLayout title="Vendor Management" subtitle="Manage and monitor your vendor network">
      <div className="space-y-6 animate-fade-in">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/vendors/onboarding">
            <Card className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-indigo-500">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100">
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Vendor Onboarding</p>
                    <p className="text-sm text-muted-foreground">Invite and onboard new vendors</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/vendors/approvals">
            <Card className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-emerald-500">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Vendor Approvals</p>
                    <p className="text-sm text-muted-foreground">Review and approve vendor applications</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
        </div>

        <VendorList />
      </div>
    </MainLayout>
  );
}
