// types/points-system.ts
export interface PointsSystem {
    earningPoints: {
      spend: number;
      bonusDays: BonusDay[];
      signUpBonus: number;
      reviewPoints: number;
      socialSharePoints: number;
    };
    redeemingPoints: {
      pointsPerDiscount: number;
      discountValue: number;
      discountType: 'fixed' | 'percentage';
      exclusiveRewards: string[];
    };
  }
  
  export interface BonusDay {
    name: string;
    date: string;
    multiplier: number;
  }
  
  export type UpdatePointsSystemDto = Omit<PointsSystem, 'bonusDays'>;
  export type BonusDayDto = BonusDay;