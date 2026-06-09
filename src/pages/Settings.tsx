import { useSettingsStore } from '../store/settingsStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { settings, setSettings } = useSettingsStore();
  const { i18n } = useTranslation();

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Store Name (EN)</label>
              <Input defaultValue={settings.storeName.en} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Store Address</label>
              <Input defaultValue={settings.storeAddress} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">VAT / Tax Number</label>
              <Input defaultValue={settings.taxNumber} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Default Currency</label>
              <select className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" defaultValue={settings.currency}>
                <option value="EUR">Euro (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hardware Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">UI Language</label>
              <select 
                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                defaultValue={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="nl">Nederlands (Dutch)</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Thermal Printer Port</label>
              <div className="flex gap-2">
                <Input placeholder="Not connected" readOnly />
                <Button variant="outline">Detect</Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Weight Scale Port</label>
              <div className="flex gap-2">
                <Input placeholder="Not connected" readOnly />
                <Button variant="outline">Detect</Button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <div>
                <div className="font-medium">Customer Display Screen</div>
                <div className="text-sm text-muted-foreground">Show cart live on second monitor</div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.open('/customer-display', '_blank', 'width=1024,height=768')}
              >
                Launch Display
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
