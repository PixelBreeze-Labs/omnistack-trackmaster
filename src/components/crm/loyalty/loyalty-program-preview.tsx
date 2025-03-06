// components/loyalty/ProgramPreview.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoyaltyProgram } from "@/app/api/external/omnigateway/types/loyalty-program";
import { Star, Gift, Calendar, Coins, Bed } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgramPreviewProps {
  open: boolean;
  onClose: () => void;
  program: LoyaltyProgram;
}

export function ProgramPreview({ open, onClose, program }: ProgramPreviewProps) {
  const { data: session } = useSession();
  const clientType = session?.user?.clientType;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{program.programName} - Program Preview</DialogTitle>
        </DialogHeader>

        {/* Points System Summary */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardContent className="pt-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Earning Points
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {clientType === 'BOOKING' ? 'Points per Stay' : `Points per ${program.currency}`}
                  </span>
                  <span className="font-medium">
                    {clientType === 'BOOKING' ? `${program.pointsSystem.earningPoints.spend} points` : program.pointsSystem.earningPoints.spend}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sign Up Bonus</span>
                  <span className="font-medium">{program.pointsSystem.earningPoints.signUpBonus} points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Review Points</span>
                  <span className="font-medium">{program.pointsSystem.earningPoints.reviewPoints} points</span>
                </div>
                {clientType !== 'BOOKING' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Social Share</span>
                    <span className="font-medium">{program.pointsSystem.earningPoints.socialSharePoints} points</span>
                  </div>
                )}
                {clientType === 'BOOKING' && program.stayTracking && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Stay</span>
                    <span className="font-medium">{program.stayTracking.stayDefinition.minimumNights} night(s)</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Redeeming Points
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Points Required</span>
                  <span className="font-medium">{program.pointsSystem.redeemingPoints.pointsPerDiscount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount Value</span>
                  <span className="font-medium">
                    {program.pointsSystem.redeemingPoints.discountValue}
                    {program.pointsSystem.redeemingPoints.discountType === 'percentage' ? '%' : ` ${program.currency}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Membership Tiers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5" />
            Membership Tiers
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {program.membershipTiers.map((tier) => (
              <Card key={tier.name}>
                <CardContent className="pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant="secondary" 
                      className={
                        tier.name.includes("Platinum") ? "bg-blue-100 text-blue-700" :
                        tier.name.includes("Gold") ? "bg-yellow-100 text-yellow-700" :
                        tier.name.includes("Silver") ? "bg-gray-100 text-gray-700" :
                        "bg-amber-100 text-amber-700"
                      }
                    >
                      {tier.name}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Spend Range:</span>
                      <div className="font-medium">
                        {tier.spendRange.min}-{tier.spendRange.max} {program.currency}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Points Multiplier:</span>
                      <div className="font-medium">{tier.pointsMultiplier}x</div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Birthday Reward:</span>
                      <div className="font-medium">{tier.birthdayReward} {program.currency}</div>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Referral Points:</span>
                      <div className="font-medium">{tier.referralPoints} points</div>
                    </div>
                    
                    {clientType === 'BOOKING' && tier.pointsPerStay && (
                      <div>
                        <span className="text-muted-foreground">Points Per Stay:</span>
                        <div className="font-medium">{tier.pointsPerStay} points</div>
                      </div>
                    )}

                    {tier.perks.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Perks:</span>
                        <ul className="list-disc list-inside font-medium mt-1">
                          {tier.perks.map((perk, index) => (
                            <li key={index}>{perk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bonus Days */}
        {program.pointsSystem.earningPoints.bonusDays.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Bonus Days
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {program.pointsSystem.earningPoints.bonusDays.map((day, index) => (
                <Card key={index}>
                  <CardContent className="pt-2">
                    <div className="font-medium">{day.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString()}
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary">{day.multiplier}x Points</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Stay Tracking for Booking Clients */}
        {clientType === 'BOOKING' && program.stayTracking && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Stay Tracking
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-2">
                  <h4 className="font-medium mb-2">Evaluation Period</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier Upgrade:</span>
                      <span className="font-medium">{program.stayTracking.evaluationPeriod.upgrade} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier Downgrade:</span>
                      <span className="font-medium">{program.stayTracking.evaluationPeriod.downgrade} months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-2">
                  <h4 className="font-medium mb-2">Stay Definition</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minimum Nights:</span>
                      <span className="font-medium">{program.stayTracking.stayDefinition.minimumNights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Checkout Required:</span>
                      <span className="font-medium">{program.stayTracking.stayDefinition.checkoutRequired ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}