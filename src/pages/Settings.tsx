import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Palette, Download, Upload, CreditCard, Tags, Moon, Sun, Monitor, Wifi, WifiOff, RefreshCw, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { isOnline, lastSync, isSyncing, pendingSync, triggerSync } = useOnlineStatus();
  const navigate = useNavigate();
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

          {/* Connection Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
              Stato Connessione
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg glass-button">
                <div>
                  <Label className="font-medium">Stato Online</Label>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? 'Connesso' : 'Disconnesso'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg glass-button">
                <div>
                  <Label className="font-medium">Ultima Sincronizzazione</Label>
                  <p className="text-sm text-muted-foreground">
                    {lastSync ? lastSync.toLocaleString('it-IT') : 'Mai sincronizzato'}
                  </p>
                </div>
                {lastSync && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg glass-button">
                <div>
                  <Label className="font-medium">Sincronizzazione Manuale</Label>
                  <p className="text-sm text-muted-foreground">
                    Forza la sincronizzazione dei dati
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={triggerSync}
                  disabled={!isOnline || isSyncing}
                  className="flex items-center gap-2"
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Sincronizza
                </Button>
              </div>

              {pendingSync > 0 && (
                <div className="flex items-center justify-between p-4 rounded-lg glass-button border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <div>
                    <Label className="font-medium">Dati in Attesa</Label>
                    <p className="text-sm text-muted-foreground">
                      {pendingSync} transazioni in attesa di sincronizzazione
                    </p>
                  </div>
                </div>
              )}
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
              <Button 
                variant="outline" 
                className="glass-button justify-start h-12"
                onClick={() => navigate('/settings/accounts')}
              >
                <CreditCard className="h-4 w-4 mr-3" />
                Gestisci Conti
              </Button>
              <Button 
                variant="outline" 
                className="glass-button justify-start h-12"
                onClick={() => navigate('/settings/categories')}
              >
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