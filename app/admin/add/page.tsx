import { SuggestForm } from "@/components/contribute/suggest-form";
import { getPersonFields, getStartupFields } from "@/components/contribute/suggest-form-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStartups } from "@/lib/data-access/startups";
import { Zap } from "lucide-react";

export default async function AdminAddPage() {
  const companyOptions = (await getStartups()).map((startup) => startup.name);

  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center gap-2.5 rounded-xl border border-action-blue/20 bg-action-blue/5 p-4 text-sm text-foreground">
        <Zap className="size-4 shrink-0 text-action-blue" />
        No review queue here — publishing goes live immediately.
      </div>
      <Tabs defaultValue="person">
        <TabsList>
          <TabsTrigger value="person">Add person</TabsTrigger>
          <TabsTrigger value="startup">Add startup</TabsTrigger>
        </TabsList>
        <TabsContent value="person" className="pt-6">
          <SuggestForm
            fields={getPersonFields(companyOptions)}
            kind="person"
            mode="admin-add"
            submitLabel="Publish entrepreneur"
            successMessage="Published — it's live on the site now."
          />
        </TabsContent>
        <TabsContent value="startup" className="pt-6">
          <SuggestForm
            fields={getStartupFields()}
            kind="startup"
            mode="admin-add"
            submitLabel="Publish startup"
            successMessage="Published — it's live on the site now."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
