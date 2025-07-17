import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Palette, Download, Upload, CreditCard, Tags, Moon, Sun, Monitor } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const themeOptions = [
    { value: 'light', label: 'Chiaro', icon: Sun },
    { value: 'dark', label: 'Scuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <Card className="glass-card p-6 smooth-enter">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Impostazioni</h1>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Tema
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={theme === value ? "default" : "ghost"}
                  onClick={() => setTheme(value as typeof theme)}
                  className={`h-16 flex-col gap-2 glass-button ${
                    theme === value 
                      ? 'bg-primary text-primary-foreground' 
                      : 'border border-primary/20 hover:bg-primary/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* App Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferenze App</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg glass-button">
                <div>
                  <Label htmlFor="notifications" className="font-medium">Notifiche</Label>
                  <p className="text-sm text-muted-foreground">Ricevi notifiche per nuove transazioni</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg glass-button">
                <div>
                  <Label htmlFor="autoSync" className="font-medium">Sincronizzazione Automatica</Label>
                  <p className="text-sm text-muted-foreground">Sincronizza automaticamente i dati</p>
                </div>
                <Switch
                  id="autoSync"
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gestione Dati</h3>
            <div className="grid gap-3">
              <Button variant="outline" className="glass-button justify-start h-12">
                <Download className="h-4 w-4 mr-3" />
                Esporta Dati
              </Button>
              <Button variant="outline" className="glass-button justify-start h-12">
                <Upload className="h-4 w-4 mr-3" />
                Importa Dati
              </Button>
            </div>
          </div>

          {/* Account Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gestione</h3>
            <div className="grid gap-3">
              <Button variant="outline" className="glass-button justify-start h-12">
                <CreditCard className="h-4 w-4 mr-3" />
                Gestisci Conti
              </Button>
              <Button variant="outline" className="glass-button justify-start h-12">
                <Tags className="h-4 w-4 mr-3" />
                Gestisci Categorie
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;