import { SuggestForm } from "@/components/contribute/suggest-form";
import { getPersonFields, getStartupFields } from "@/components/contribute/suggest-form-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStartups } from "@/lib/data-access/startups";

export default function AdminAddPage() {
  const companyOptions = getStartups().map((startup) => startup.name);

  return (
    <div className="space-y-4 pt-6">
      <p className="text-sm text-muted-foreground">
        No review queue here — publishing goes live immediately.
      </p>
      <Tabs defaultValue="person">
        <TabsList>
          <TabsTrigger value="person">Add person</TabsTrigger>
          <TabsTrigger value="startup">Add startup</TabsTrigger>
        </TabsList>
        <TabsContent value="person" className="pt-6">
          <SuggestForm
            fields={getPersonFields(companyOptions)}
            submitLabel="Publish entrepreneur"
            successMessage="Published — it's live on the site now."
          />
        </TabsContent>
        <TabsContent value="startup" className="pt-6">
          <SuggestForm
            fields={getStartupFields()}
            submitLabel="Publish startup"
            successMessage="Published — it's live on the site now."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
