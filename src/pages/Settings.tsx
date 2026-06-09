import { useSettingsStore } from '../store/settingsStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Save, Store, MonitorDot } from 'lucide-react';
import { usePopupStore } from '../store/popupStore';

export default function Settings() {
  const { settings, setSettings } = useSettingsStore();
  const { i18n } = useTranslation();
  const { showPopup } = usePopupStore();

  const handleSave = () => {
    // In a real scenario, this would update the Dexie database 'settings' table as well
    showPopup({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your system configuration has been updated successfully.'
    });
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto bg-muted/5 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-border/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-secondary-foreground">System Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your store, hardware, and localization preferences.</p>
          </div>
        </div>
        <Button onClick={handleSave} className="rounded-xl px-6 gap-2 h-12 shadow-md hover:shadow-lg transition-all-smooth">
          <Save className="w-5 h-5" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-all-smooth">
          <CardHeader className="border-b bg-muted/20 rounded-t-2xl pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Store className="w-5 h-5 text-primary" />
              Store Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div>
              <label className="text-sm font-semibold mb-2 block text-secondary-foreground">Store Name (EN)</label>
              <Input defaultValue={settings.storeName.en} className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-secondary-foreground">Store Address</label>
              <Input defaultValue={settings.storeAddress} className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-secondary-foreground">VAT / Tax Number</label>
              <Input defaultValue={settings.taxNumber} className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-secondary-foreground">Default Currency</label>
              <select className="w-full flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-base ring-offset-background transition-all-smooth focus:ring-2 focus:ring-primary focus:outline-none" defaultValue={settings.currency}>
                <option value="EUR">Euro (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-all-smooth">
          <CardHeader className="border-b bg-muted/20 rounded-t-2xl pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <MonitorDot className="w-5 h-5 text-primary" />
              Hardware & Localization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div>
              <label className="text-sm font-semibold mb-2 block text-secondary-foreground">UI Language</label>
              <select 
                className="w-full flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-base ring-offset-background transition-all-smooth focus:ring-2 focus:ring-primary focus:outline-none" 
                defaultValue={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="nl">Nederlands (Dutch)</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-secondary-foreground">Thermal Printer Port</label>
              <div className="flex gap-2">
                <Input placeholder="Not connected" readOnly className="rounded-xl bg-muted/30" />
                <Button variant="outline" className="rounded-xl font-semibold">Detect</Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-secondary-foreground">Weight Scale Port</label>
              <div className="flex gap-2">
                <Input placeholder="Not connected" readOnly className="rounded-xl bg-muted/30" />
                <Button variant="outline" className="rounded-xl font-semibold">Detect</Button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <div>
                <div className="font-bold text-secondary-foreground">Customer Display Screen</div>
                <div className="text-sm text-muted-foreground mt-1">Show cart live on second monitor</div>
              </div>
              <Button 
                variant="outline" 
                className="rounded-xl font-semibold border-primary/20 text-primary hover:bg-primary/5"
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
