import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InviteVendor } from "@/components/vendor/InviteVendor";
import { OnboardingStatusList } from "@/components/vendor/OnboardingStatusList";
import { DocumentReview } from "@/components/vendor/DocumentReview";
import { UserPlus, ListChecks, FileSearch } from "lucide-react";

export default function VendorOnboarding() {
  const [activeTab, setActiveTab] = useState("invite");

  return (
    <MainLayout title="Vendor Onboarding" subtitle="Manage vendor invitations and document review">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-auto flex-wrap">
          <TabsTrigger value="invite" className="rounded-lg gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
            <UserPlus className="w-4 h-4" />
            Invite Vendor
          </TabsTrigger>
          <TabsTrigger value="status" className="rounded-lg gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
            <ListChecks className="w-4 h-4" />
            Onboarding Status
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
            <FileSearch className="w-4 h-4" />
            Document Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="space-y-6">
          <InviteVendor />
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <OnboardingStatusList />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentReview />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
