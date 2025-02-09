// types/loyalty-program.ts

export interface BonusDay {
    name: string;
    date: Date;
    multiplier: number;
}

export interface EarningPoints {
    spend: number;
    bonusDays: BonusDay[];
    signUpBonus: number;
    reviewPoints: number;
    socialSharePoints: number;
}

export interface RedeemingPoints {
    pointsPerDiscount: number;
    discountValue: number;
    discountType: 'fixed' | 'percentage';
    exclusiveRewards: string[];
}

export interface PointsSystem {
    earningPoints: EarningPoints;
    redeemingPoints: RedeemingPoints;
}

export interface MembershipTier {
    name: string;
    spendRange: {
        min: number;
        max: number;
    };
    pointsMultiplier: number;
    birthdayReward: number;
    perks: string[];
    referralPoints: number;
}

export interface LoyaltyProgram {
    programName: string;
    currency: string;
    pointsSystem: PointsSystem;
    membershipTiers: MembershipTier[];
}

export type UpdateLoyaltyProgramDto = Partial<LoyaltyProgram>;