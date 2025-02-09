"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Settings,
  Percent,
  CreditCard,
  Award,
  Truck,
  Star,
  Loader2,
} from "lucide-react";
import { useBenefits, Benefit } from '@/hooks/useBenefits';
import { BenefitForm } from './BenefitForm';

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
  const {
    isLoading,
    benefits,
    fetchBenefits,
    createBenefit,
    updateBenefit,
    toggleBenefit,
  } = useBenefits();

  const [benefitFormOpen, setBenefitFormOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

  useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

  const handleCreateBenefit = async (data: any) => {
    await createBenefit(data);
    setBenefitFormOpen(false);
  };

  const handleUpdateBenefit = async (data: any) => {
    if (selectedBenefit) {
      await updateBenefit(selectedBenefit.id, data);
      setSelectedBenefit(null);
      setBenefitFormOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeBenefits = benefits.filter(b => b.isActive);
  const inactiveBenefits = benefits.filter(b => !b.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Benefits</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage membership benefits and rewards
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedBenefit(null);
            setBenefitFormOpen(true);
          }}
          style={{ backgroundColor: "#5FC4D0" }}
        >
          <Gift className="h-4 w-4 mr-2" />
          Add New Benefit
        </Button>
      </div>

      {/* Active Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Active Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeBenefits.map((benefit) => {
              const Icon = BENEFIT_ICONS[benefit.type] || Star;
              const colorClass = BENEFIT_COLORS[benefit.type] || 'bg-gray-50 text-gray-600';

              return (
                <Card key={benefit.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{benefit.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {benefit.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">
                              {benefit.value}{benefit.type === 'DISCOUNT' ? '%' : ' points'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedBenefit(benefit);
                            setBenefitFormOpen(true);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleBenefit(benefit.id, false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Inactive Benefits */}
      {inactiveBenefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inactive Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inactiveBenefits.map((benefit) => {
                const Icon = BENEFIT_ICONS[benefit.type] || Star;
                const colorClass = BENEFIT_COLORS[benefit.type] || 'bg-gray-50 text-gray-600';

                return (
                  <Card key={benefit.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${colorClass}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{benefit.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {benefit.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">
                                {benefit.value}{benefit.type === 'DISCOUNT' ? '%' : ' points'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleBenefit(benefit.id, true)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefit Form Modal */}
      <BenefitForm
        open={benefitFormOpen}
        onClose={() => {
          setBenefitFormOpen(false);
          setSelectedBenefit(null);
        }}
        onSubmit={selectedBenefit ? handleUpdateBenefit : handleCreateBenefit}
        initialData={selectedBenefit || undefined}
        title={selectedBenefit ? 'Edit Benefit' : 'Add New Benefit'}
      />

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}

export default BenefitsContent;