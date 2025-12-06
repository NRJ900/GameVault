import { motion } from "motion/react";
import { ArrowLeft, Palette, HardDrive, Cloud, Bell, RotateCw, Upload, Lock, Image as ImageIcon, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { availableThemes } from "./ThemeStore";
import { toast } from "sonner";
import { useRef } from "react";
import { useTheme } from "./theme-provider";

interface GlobalSettingsProps {
  onBack: () => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  ownedThemes: string[];
  unlockedFeatures: { customThemes: boolean };
  bgImage: string | null;
  onBgImageChange: (image: string | null) => void;
  bgBlur: number;
  onBgBlurChange: (value: number) => void;
  bgOpacity: number;
  onBgOpacityChange: (value: number) => void;
  setPoints: (points: number) => void;
  onOpenStore?: () => void;
  uiScale?: number;
  onUiScaleChange?: (scale: number) => void;

  // New Props
  defaultGameDir: string;
  onDefaultGameDirChange: (path: string) => void;
  autoDetectGames: boolean;
  onAutoDetectGamesChange: (enabled: boolean) => void;
  onScanLibrary: () => void;

  cloudEmail: string;
  onCloudEmailChange: (email: string) => void;
  cloudSyncEnabled: boolean;
  onCloudSyncEnabledChange: (enabled: boolean) => void;

  autoBackup: boolean;
  onAutoBackupChange: (enabled: boolean) => void;
  onBackup: () => void;
  onRestore: () => void;
}

export function GlobalSettings({
  onBack,
  accentColor,
  onAccentColorChange,
  ownedThemes,
  unlockedFeatures,
  bgImage,
  onBgImageChange,
  bgBlur,
  onBgBlurChange,
  bgOpacity,
  onBgOpacityChange,
  setPoints,
  onOpenStore,
  uiScale = 1,
  onUiScaleChange,

  defaultGameDir,
  onDefaultGameDirChange,
  autoDetectGames,
  onAutoDetectGamesChange,
  onScanLibrary,

  cloudEmail,
  onCloudEmailChange,
  cloudSyncEnabled,
  onCloudSyncEnabledChange,

  autoBackup,
  onAutoBackupChange,
  onBackup,
  onRestore,
}: GlobalSettingsProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    const customTheme = availableThemes.find(t => t.id === newTheme);
    if (customTheme) {
      onAccentColorChange(customTheme.colors.accent);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleImportTheme = () => {
    if (!unlockedFeatures.customThemes) {
      toast.error("This feature is locked!", {
        description: "Purchase 'Custom Theme Upload' from the Store to unlock.",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          if (themeData.theme) {
            handleThemeChange(themeData.theme);
          }
          if (themeData.accentColor) {
            onAccentColorChange(themeData.accentColor);
            // Update CSS variable
            document.documentElement.style.setProperty('--gaming-accent', themeData.accentColor);
          }
          toast.success("Theme imported successfully!");
        } catch (error) {
          toast.error("Invalid theme file format");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAccentChange = (color: string) => {
    onAccentColorChange(color);
    document.documentElement.style.setProperty('--gaming-accent', color);
    toast.success("Accent color updated!");
  };

  const handleBgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onBgImageChange(e.target.result as string);
          toast.success("Background image updated!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeGameDir = async () => {
    try {
      const path = await window.ipcRenderer.invoke('select-folder');
      if (path) {
        onDefaultGameDirChange(path);
        toast.success("Default game directory updated");
      }
    } catch (e) {
      toast.error("Failed to select folder");
    }
  };

  const handleCloudSyncToggle = () => {
    if (!cloudSyncEnabled) {
      // Enabling
      if (!cloudEmail) {
        toast.error("Please enter your email address");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cloudEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }
      onCloudSyncEnabledChange(true);
      toast.success(`Cloud sync enabled for ${cloudEmail}`);
      toast.info("Your library will sync automatically");
    } else {
      // Disabling
      onCloudSyncEnabledChange(false);
      toast.info("Cloud sync disabled");
    }
  };

  return (
    <div className="size-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1>Settings</h1>
            <p className="text-muted-foreground">Manage your GameVault preferences</p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-[var(--gaming-purple)]" />
              <h2>Appearance</h2>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose your preferred color scheme
                  </p>
                </div>
                <Select value={theme} onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "system")}>
                  <SelectTrigger className="w-36 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    {ownedThemes.filter(t => t !== "light" && t !== "dark").map(themeId => (
                      <SelectItem key={themeId} value={themeId}>
                        {themeId.charAt(0).toUpperCase() + themeId.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Accent Color</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customize the accent color
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccentChange('#8b5cf6')}
                    className={`w-10 h-10 rounded-full bg-[#8b5cf6] border-2 transition-all hover:scale-110 ${accentColor === '#8b5cf6' ? 'border-foreground scale-110' : 'border-transparent'
                      }`}
                  />
                  <button
                    onClick={() => handleAccentChange('#06b6d4')}
                    className={`w-10 h-10 rounded-full bg-[#06b6d4] border-2 transition-all hover:scale-110 ${accentColor === '#06b6d4' ? 'border-foreground scale-110' : 'border-transparent'
                      }`}
                  />
                  <button
                    onClick={() => handleAccentChange('#10b981')}
                    className={`w-10 h-10 rounded-full bg-[#10b981] border-2 transition-all hover:scale-110 ${accentColor === '#10b981' ? 'border-foreground scale-110' : 'border-transparent'
                      }`}
                  />
                </div>
              </div>



              <Separator className="bg-border" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label>UI Scale</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Adjust the size of the interface ({Math.round(uiScale * 100)}%)
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUiScaleChange?.(1)}
                    className="h-8 text-xs"
                  >
                    Reset
                  </Button>
                </div>
                <Slider
                  value={[uiScale]}
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  onValueChange={(value) => onUiScaleChange?.(value[0])}
                  className="w-full"
                />
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Import Custom Theme</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Load theme from JSON file
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={onOpenStore}
                    className="rounded-xl"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Store
                  </Button>
                  <Button
                    variant={unlockedFeatures.customThemes ? "outline" : "ghost"}
                    onClick={handleImportTheme}
                    className={`rounded-xl ${!unlockedFeatures.customThemes ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {unlockedFeatures.customThemes ? (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Background Customization */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-[var(--gaming-cyan)]" />
              <h2>Background</h2>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Background Image</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a custom wallpaper
                  </p>
                </div>
                <div className="flex gap-2">
                  {bgImage && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onBgImageChange(null)}
                      className="rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant={unlockedFeatures.customThemes ? "outline" : "ghost"}
                    onClick={() => {
                      if (unlockedFeatures.customThemes) {
                        bgInputRef.current?.click();
                      } else {
                        toast.error("Locked Feature", { description: "Purchase Custom Theme Upload to unlock." });
                      }
                    }}
                    className={`rounded-xl ${!unlockedFeatures.customThemes ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {unlockedFeatures.customThemes ? (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </>
                    )}
                  </Button>
                  <input
                    ref={bgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBgUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {bgImage && (
                <>
                  <Separator className="bg-border" />
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Blur Level</Label>
                      <span className="text-sm text-muted-foreground">{bgBlur}px</span>
                    </div>
                    <Slider
                      value={[bgBlur]}
                      onValueChange={(vals) => onBgBlurChange(vals[0])}
                      max={20}
                      step={1}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Opacity</Label>
                      <span className="text-sm text-muted-foreground">{Math.round(bgOpacity * 100)}%</span>
                    </div>
                    <Slider
                      value={[bgOpacity]}
                      onValueChange={(vals) => onBgOpacityChange(vals[0])}
                      max={1}
                      step={0.05}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Library */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-[var(--gaming-cyan)]" />
              <h2>Library</h2>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label>Default Game Directory</Label>
                  <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">
                    {defaultGameDir}
                  </p>
                </div>
                <Button variant="outline" className="rounded-xl" onClick={handleChangeGameDir}>
                  Change
                </Button>
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-detect Games</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically scan for new games on startup
                  </p>
                </div>
                <Switch
                  checked={autoDetectGames}
                  onCheckedChange={onAutoDetectGamesChange}
                />
              </div>

              <Separator className="bg-border" />

              <Button
                variant="outline"
                className="w-full justify-start rounded-xl"
                onClick={onScanLibrary}
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Scan for Games Now
              </Button>
            </div>
          </div>

          {/* Cloud Sync */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-5 h-5 text-[var(--gaming-green)]" />
              <h2>Cloud Sync & Storage</h2>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-4 relative overflow-hidden">
              {/* Upcoming Feature Overlay */}
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Upcoming Feature</span>
                </div>
              </div>

              <div className="space-y-3 opacity-50 pointer-events-none">
                <Label>Email for Cloud Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Enter your email to enable automatic library backup and sync across devices
                </p>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    value={cloudEmail}
                    onChange={(e) => onCloudEmailChange(e.target.value)}
                    placeholder="your.email@example.com"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCloudSyncToggle}
                    variant={cloudSyncEnabled ? "destructive" : "default"}
                    className={cloudSyncEnabled ? "" : "bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0"}
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    {cloudSyncEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
                {cloudSyncEnabled && cloudEmail && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-[var(--gaming-green)]"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--gaming-green)] animate-pulse" />
                    <span>Syncing with {cloudEmail}</span>
                  </motion.div>
                )}
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between opacity-50 pointer-events-none">
                <div>
                  <Label>Google Drive Backup</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Backup your library to Google Drive
                  </p>
                </div>
                <Switch checked={cloudSyncEnabled} disabled={!cloudEmail} />
              </div>
            </div>

            {/* Local Backup Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="w-5 h-5 text-[var(--gaming-cyan)]" />
                <h2>Local Backup</h2>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Automatically backup after changes
                    </p>
                  </div>
                  <Switch
                    checked={autoBackup}
                    onCheckedChange={onAutoBackupChange}
                  />
                </div>

                <Separator className="bg-border" />

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={onBackup}>
                    Backup Now
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={onRestore}>
                    Restore Backup
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[var(--gaming-purple)]" />
              <h2>Notifications</h2>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Game News Updates</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified about game updates and news
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Achievement Notifications</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Show achievement unlocks
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Launch Reminders</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Remind you about games you haven't played
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Developer Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-red-500" />
              <h2>Developer Options</h2>
            </div>
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Set Points</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manually set your points balance (for testing)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPoints(5000);
                      toast.success("Points set to 5000!");
                    }}
                  >
                    Set to 5000
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPoints(0);
                      toast.success("Points reset to 0!");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--gaming-purple)]/10 to-[var(--gaming-cyan)]/10 border border-border">
            <h3 className="mb-2">GameVault v1.0.0</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Modern game library management for desktop
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl">
                Check for Updates
              </Button>
              <Button variant="ghost" className="rounded-xl">
                View Changelog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
