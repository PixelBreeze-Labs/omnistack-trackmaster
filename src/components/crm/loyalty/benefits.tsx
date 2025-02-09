"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Settings,
  Truck,
  Star,
  Crown,
  Percent,
  CreditCard,
  Award,
  Loader2,
  AlertCircle,
  Info,
  Shield,
  Heart
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBenefits, Benefit } from '@/hooks/useBenefits';
import { useLoyaltyProgram } from '@/hooks/useLoyaltyProgram';
import { BenefitForm } from './BenefitForm';
import { TierBenefitForm } from './TierBenefitForm';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import toast from 'react-hot-toast';

// Icon mapping for benefit types
const BENEFIT_ICONS = {
  'DISCOUNT': Percent,
  'CASHBACK': CreditCard,
  'POINTS': Award,
  'FREE_SHIPPING': Truck,
};

const BENEFIT_COLORS = {
  'DISCOUNT': 'bg-blue-50 text-blue-600',
  'CASHBACK': 'bg-green-50 text-green-600',
  'POINTS': 'bg-purple-50 text-purple-600',
  'FREE_SHIPPING': 'bg-amber-50 text-amber-600',
};


export function BenefitsContent() {
  // Core benefits state and handlers
  const {
    isLoading: isBenefitsLoading,
    benefits,
    fetchBenefits,
    createBenefit,
    updateBenefit,
    toggleBenefit,
    error: benefitsError
  } = useBenefits();
  
   // Loyalty program state and handlers
   const {
    isLoading: isLoyaltyLoading,
    program: loyaltyProgram,
    fetchProgram: fetchLoyaltyProgram,
    updateProgram: updateLoyaltyProgram,
    error: loyaltyError
  } = useLoyaltyProgram();


  const TIER_STYLES = {
    'PLATINUM': {
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Crown,
      cardBorder: 'border-blue-200',
      color: 'text-blue-600'
    },
    'GOLD': {
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: Star,
      cardBorder: 'border-yellow-200',
      color: 'text-yellow-600'
    },
    'SILVER': {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Shield,
      cardBorder: 'border-slate-200',
      color: 'text-slate-600'
    },
    'BRONZE': {
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: Heart,
      cardBorder: 'border-amber-200',
      color: 'text-amber-600'
    }
  };

  const [benefitFormOpen, setBenefitFormOpen] = useState(false);
  const [tierBenefitFormOpen, setTierBenefitFormOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  

  useEffect(() => {
    Promise.all([fetchBenefits(), fetchLoyaltyProgram()]);
  }, [fetchBenefits, fetchLoyaltyProgram]);

 
  const handleCreateBenefit = async (data: any) => {
    try {
      await createBenefit(data);
      toast.success('Benefit created successfully');
      setBenefitFormOpen(false);
    } catch (error) {
      toast.error('Failed to create benefit');
    }
  };

  const handleUpdateBenefit = async (data: any) => {
    try {
      if (!selectedBenefit) return;
      await updateBenefit(selectedBenefit._id, data);
      toast.success('Benefit updated successfully');
      setBenefitFormOpen(false);
    } catch (error) {
      toast.error('Failed to update benefit');
    }
  };

  const handleTierBenefitSubmit = async (tierData: any) => {
    try {
      if (!loyaltyProgram) return;

      const updatedTiers = selectedTier
        ? loyaltyProgram.membershipTiers.map(tier => 
            tier.name === selectedTier ? { ...tier, ...tierData } : tier
          )
        : [...loyaltyProgram.membershipTiers, tierData];

      const updatedProgram = {
        ...loyaltyProgram,
        membershipTiers: updatedTiers
      };

      await updateLoyaltyProgram(updatedProgram);
      setTierBenefitFormOpen(false);
      toast.success(selectedTier ? 'Tier updated successfully' : 'New tier created successfully');
    } catch (error) {
      console.error('Error updating tier benefits:', error);
      toast.error('Failed to update tier benefits');
    }
  };


  if (isBenefitsLoading || isLoyaltyLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

   // Split benefits into active and inactive
   const activeBenefits = benefits.filter(b => b.isActive);
   const inactiveBenefits = benefits.filter(b => !b.isActive);
 
   const renderBenefitCard = (benefit: Benefit, isActive: boolean = true) => {
     const Icon = BENEFIT_ICONS[benefit.type] || Star;
     const colorClass = BENEFIT_COLORS[benefit.type] || 'bg-gray-50 text-gray-600';
 
     return (
       <Card key={benefit._id} className={!isActive ? 'opacity-60' : ''}>
         <CardContent className="p-4">
           <div className="flex items-start justify-between">
             <div className="flex items-start gap-3">
               <div className={`p-2 rounded-lg ${colorClass}`}>
                 <Icon className="h-4 w-4" />
               </div>
               <div>
                 <div className="flex items-center gap-2">
                   <h4 className="font-medium">{benefit.name}</h4>
                   {benefit.applicableTiers?.length > 0 && (
                     <TooltipProvider>
                       <Tooltip>
                         <TooltipTrigger>
                           <Info className="h-4 w-4 text-muted-foreground" />
                         </TooltipTrigger>
                         <TooltipContent>
                           <p>Applied to tiers: {benefit.applicableTiers.join(', ')}</p>
                         </TooltipContent>
                       </Tooltip>
                     </TooltipProvider>
                   )}
                 </div>
                 <p className="text-sm text-muted-foreground mt-1">
                   {benefit.description}
                 </p>
                 <div className="flex items-center gap-2 mt-2">
                   <Badge variant="secondary">
                     {benefit.value}{benefit.type === 'DISCOUNT' ? '%' : ' points'}
                   </Badge>
                   {benefit.minSpend > 0 && (
                     <Badge variant="outline">
                       Min. spend: {benefit.minSpend}€
                     </Badge>
                   )}
                 </div>
               </div>
             </div>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon">
                   <Settings className="h-4 w-4" />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuItem
                   onClick={() => {
                     setSelectedBenefit(benefit);
                     setBenefitFormOpen(true);
                   }}
                 >
                   Edit
                 </DropdownMenuItem>
                 <DropdownMenuItem
                   onClick={() => toggleBenefit(benefit._id, !isActive)}
                 >
                   {isActive ? 'Deactivate' : 'Activate'}
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
         </CardContent>
       </Card>
     );
   };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Benefits Management</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage core benefits and tier-specific perks
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              setSelectedTier(null);
              setTierBenefitFormOpen(true);
            }}
          >
            <Crown className="h-4 w-4 mr-2" />
            Add Tier Benefit
          </Button>
          <Button 
            onClick={() => {
              setSelectedBenefit(null);
              setBenefitFormOpen(true);
            }}
            style={{ backgroundColor: "#5FC4D0" }}
          >
            <Gift className="h-4 w-4 mr-2" />
            Add Core Benefit
          </Button>
        </div>
      </div>

      {(benefitsError || loyaltyError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {benefitsError || loyaltyError}
          </AlertDescription>
        </Alert>
      )}

{/* Tier Benefits Card */}
<Card>
  <CardHeader className="pb-6">
  <div>
    <h2 className="text-xl font-bold tracking-tight">Tier Benefits</h2>
    <p className="text-sm text-muted-foreground mt-1">
    Configure membership tiers and their specific benefits
    </p>
  </div>
  </CardHeader>
  <CardContent>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {loyaltyProgram?.membershipTiers.map((tier) => {
       const tierLevel = tier.name.split(' ')[0].toUpperCase();
       const style = TIER_STYLES[tierLevel];
       const TierIcon = style?.icon || Star;
       
        
        return (
          <Card 
      key={tier.name} 
      className={`relative border ${style?.cardBorder || 'border-gray-200'}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border ${style?.badge || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            <TierIcon className={`h-3.5 w-3.5 ${style?.color || 'text-gray-600'}`} />
            <span className="text-sm font-medium">{tier.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              setSelectedTier(tier.name);
              setTierBenefitFormOpen(true);
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Spend Range</span>
                    <span className="text-sm font-medium">{tier.spendRange.min}€ - {tier.spendRange.max}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Points</span>
                    <span className="text-sm font-medium">{tier.pointsMultiplier}x multiplier</span>
                  </div>
                </div>
                <div className="pt-1 space-y-2">
                  {tier.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </CardContent>
</Card>

{/* Active Core Benefits Card */}
<Card className="relative">
  <CardHeader>
    
    <div>
    <h2 className="text-xl font-bold tracking-tight">Active Core Benefits</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Currently active benefits available to your members
      </p>
    </div>
  </CardHeader>
  <div className="absolute top-6 right-6">
    <Button 
      onClick={() => {
        setSelectedBenefit(null);
        setBenefitFormOpen(true);
      }}
      style={{ backgroundColor: "#5FC4D0" }}
      size="sm"
    >
      <Gift className="h-4 w-4 mr-2" />
      Add Benefit
    </Button>
  </div>
  <CardContent>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activeBenefits.map(benefit => renderBenefitCard(benefit))}
    </div>
  </CardContent>
</Card>


       {/* Inactive Core Benefits */}
       {inactiveBenefits.length > 0 && (
        <Card>
          <div>
          <h2 className="text-xl font-bold tracking-tight">Inactive Core Benefits</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Deactivated benefits that can be reactivated when needed
            </p>
          </div>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inactiveBenefits.map(benefit => renderBenefitCard(benefit, false))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forms */}
      <BenefitForm
        open={benefitFormOpen}
        onClose={() => {
          setBenefitFormOpen(false);
          setSelectedBenefit(null);
        }}
        onSubmit={selectedBenefit ? handleUpdateBenefit : handleCreateBenefit}
        initialData={selectedBenefit || undefined}
        title={selectedBenefit ? 'Edit Core Benefit' : 'Add Core Benefit'}
        loyaltyProgram={loyaltyProgram}
      />

      <TierBenefitForm
        open={tierBenefitFormOpen}
        onClose={() => {
          setTierBenefitFormOpen(false);
          setSelectedTier(null);
        }}
        onSubmit={handleTierBenefitSubmit}
        selectedTier={selectedTier}
        loyaltyProgram={loyaltyProgram}
      />

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}

export default BenefitsContent;