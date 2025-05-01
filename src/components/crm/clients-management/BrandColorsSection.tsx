// Components/BrandColorsSection.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/new-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";
import { Paintbrush, Check, RefreshCcw, Moon } from "lucide-react";
import { toast } from "react-hot-toast";
import { ClientApp } from "@/app/api/external/omnigateway/types/client-apps";
import { useClientApps } from "@/hooks/useClientApps";
import { Switch } from "@/components/ui/switch";

interface BrandColorsProps {
  clientApp: ClientApp;
  onUpdate: () => void;
}

interface BrandColorsValues {
  primaryColor: string;
  primaryHoverColor: string;
  secondaryColor: string;
  secondaryHoverColor: string;
  textOnPrimaryColor: string;
  textColor: string;
  darkModePreference: boolean;
}

export function BrandColorsSection({ clientApp, onUpdate }: BrandColorsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeColor, setActiveColor] = useState<keyof BrandColorsValues | null>(null);
  const { updateClientApp } = useClientApps();
  
  // Get brand colors from client app or use defaults
  const defaultColors: BrandColorsValues = {
    primaryColor: "#2597a4",
    primaryHoverColor: "#1d7a84",
    secondaryColor: "#0a0a0a",
    secondaryHoverColor: "#6c757d",
    textOnPrimaryColor: "#ffffff",
    textColor: "#0a0a0a",
    darkModePreference: false,
  };
  
  const [brandColors, setBrandColors] = useState<BrandColorsValues>({
    primaryColor: clientApp?.brandColors?.primaryColor || defaultColors.primaryColor,
    primaryHoverColor: clientApp?.brandColors?.primaryHoverColor || defaultColors.primaryHoverColor,
    secondaryColor: clientApp?.brandColors?.secondaryColor || defaultColors.secondaryColor,
    secondaryHoverColor: clientApp?.brandColors?.secondaryHoverColor || defaultColors.secondaryHoverColor,
    textOnPrimaryColor: clientApp?.brandColors?.textOnPrimaryColor || defaultColors.textOnPrimaryColor,
    textColor: clientApp?.brandColors?.textColor || defaultColors.textColor,
    darkModePreference: clientApp?.brandColors?.darkModePreference || defaultColors.darkModePreference,
  });

  const handleColorChange = (color: string) => {
    if (!activeColor || activeColor === 'darkModePreference') return;
    
    setBrandColors(prev => ({
      ...prev,
      [activeColor]: color
    }));
  };

  const handleInputChange = (key: keyof BrandColorsValues, value: string) => {
    if (key === 'darkModePreference') return;
    
    // Validate hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || value === "") {
      setBrandColors(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setBrandColors(prev => ({
      ...prev,
      darkModePreference: checked
    }));
  };

  const saveColors = async () => {
    try {
      setIsUpdating(true);
      
      // Update client app with new brand colors
      await updateClientApp(clientApp._id, {
        brandColors: brandColors
      });
      
      toast.success("Brand colors updated successfully");
      setIsModalOpen(false);
      onUpdate(); // Trigger refresh of parent component
    } catch (error) {
      console.error("Error updating brand colors:", error);
      toast.error("Failed to update brand colors");
    } finally {
      setIsUpdating(false);
    }
  };

  const resetToDefaults = () => {
    setBrandColors(defaultColors);
  };

  const colorFields = [
    { key: "primaryColor", label: "Primary Color", description: "Main brand color" },
    { key: "primaryHoverColor", label: "Primary Hover", description: "Hover state for primary color" },
    { key: "secondaryColor", label: "Secondary Color", description: "Secondary brand color" },
    { key: "secondaryHoverColor", label: "Secondary Hover", description: "Hover state for secondary color" },
    { key: "textOnPrimaryColor", label: "Text on Primary", description: "Text color on primary background" },
    { key: "textColor", label: "Text Color", description: "Default text color" },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            Brand Colors
          </CardTitle>
          <CardDescription>Customize the application's color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {colorFields.slice(0, 3).map(({ key, label }) => (
                <div key={key} className="text-center">
                  <div 
                    className="h-12 w-full rounded-md border mb-2" 
                    style={{ backgroundColor: brandColors[key as keyof BrandColorsValues] }}
                  />
                  <p className="text-xs font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{brandColors[key as keyof BrandColorsValues]}</p>
                </div>
              ))}
            </div>
            
            {/* Add dark mode preference indicator */}
            <div className="flex items-center justify-between mt-2 py-2 px-3 bg-slate-100 rounded-md">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-slate-700" />
                <span className="text-sm font-medium">Dark Mode Preference</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {brandColors.darkModePreference ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setIsModalOpen(true)}>
                Edit Brand Colors
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Brand Colors Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-md" style={{ 
              backgroundColor: brandColors.darkModePreference ? '#222222' : '#f8f9fa',
              color: brandColors.darkModePreference ? '#ffffff' : brandColors.textColor
            }}>
              <div className="space-y-3">
                <h3 className="font-medium">Sample UI with Brand Colors</h3>
                
                <div className="flex gap-2">
                  {/* Primary Button */}
                  <button 
                    className="px-3 py-2 rounded-md transition-colors"
                    style={{ 
                      backgroundColor: brandColors.primaryColor, 
                      color: brandColors.textOnPrimaryColor,
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = brandColors.primaryHoverColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = brandColors.primaryColor}
                  >
                    Primary Button
                  </button>
                  
                  {/* Secondary Button */}
                  <button 
                    className="px-3 py-2 rounded-md transition-colors"
                    style={{ 
                      backgroundColor: brandColors.secondaryColor, 
                      color: "#ffffff",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = brandColors.secondaryHoverColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = brandColors.secondaryColor}
                  >
                    Secondary Button
                  </button>
                </div>
                
                <div 
                  className="p-3 rounded-md border" 
                  style={{ 
                    borderColor: brandColors.primaryColor,
                    backgroundColor: brandColors.darkModePreference ? '#333333' : 'white'
                  }}
                >
                  <p style={{ color: brandColors.darkModePreference ? '#ffffff' : brandColors.textColor }}>
                    This is sample text using your brand colors. The border of this container uses your primary color.
                    {brandColors.darkModePreference && " This preview shows how content looks in dark mode."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Brand Colors Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Brand Colors</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-6">
              {colorFields.map(({ key, label, description }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium">
                    {label}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {description}
                    </span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-8 w-8 rounded-md border cursor-pointer"
                      style={{ backgroundColor: brandColors[key as keyof BrandColorsValues] }}
                      onClick={() => setActiveColor(key as keyof BrandColorsValues)}
                    />
                    <Input
                      id={key}
                      value={brandColors[key as keyof BrandColorsValues]}
                      onChange={(e) => handleInputChange(key as keyof BrandColorsValues, e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              ))}
              
              {/* Dark Mode Toggle */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkModePreference" className="text-sm font-medium flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark Mode Preference
                    <span className="ml-2 text-xs text-muted-foreground">
                      Default theme mode for this client
                    </span>
                  </Label>
                  <Switch
                    id="darkModePreference"
                    checked={brandColors.darkModePreference}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
              </div>
              
              <Button variant="outline" onClick={resetToDefaults} className="w-full">
                Reset to Defaults
              </Button>
            </div>
            
            <div className="space-y-4">
              {activeColor && activeColor !== 'darkModePreference' ? (
                <>
                  <Label className="text-sm font-medium">
                    Color Picker - {activeColor}
                  </Label>
                  <HexColorPicker 
                    color={brandColors[activeColor]} 
                    onChange={handleColorChange}
                    className="w-full"
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">
                    Click on a color box to edit with the color picker
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveColors} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Colors
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}