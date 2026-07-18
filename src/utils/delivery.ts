export interface DeliverySettings {
  delivery_0_5_cost: number;
  delivery_5_10_cost: number;
  delivery_10_15_cost: number;
  delivery_15_20_cost: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  store_latitude: number;
  store_longitude: number;
}

export interface DeliveryInfo {
  available: boolean;
  distance: number;
  charge: number;
  freeDeliveryApplied: boolean;
  message?: string;
  pincodeChecked?: string;
}

/**
 * Clean deterministic lookup to convert pincodes to repeatable distances (kms)
 * relative to the Village Product Kitchen HQ (Pincode: 415612).
 */
export function getDistanceForPincode(pincode: string): number {
  const code = pincode.trim().replace(/\D/g, '');
  if (!code || code.length !== 6) {
    return 8; // fallback average distance
  }

  // Dedicated village local delivery map
  const knownPincodes: Record<string, number> = {
    '415612': 0.8,   // Village Core HQ (Konkan)
    '415611': 3.5,   // Alore Farms
    '415620': 7.2,   // Sawarde Highs
    '415605': 12.4,  // Margtamhane Valley
    '415603': 17.8,  // Chiplun Riverside
    '415724': 23.5,  // Shringartali Hills (Over 20km limit)
  };

  if (knownPincodes[code] !== undefined) {
    return knownPincodes[code];
  }

  // Stable hashing logic to calculate deterministic distances for any 6-digit PIN
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Maps PIN securely to a repeatable value in the range [1.2, 24.5] km
  const absHash = Math.abs(hash);
  const rawDistance = 1.2 + (absHash % 233) / 10;
  return parseFloat(rawDistance.toFixed(1));
}

/**
 * Calculates delivery eligibility, tier costs, and threshold gaps.
 */
export function calculateDelivery({
  distance,
  subtotal,
  settings,
}: {
  distance: number;
  subtotal: number;
  settings: DeliverySettings;
}): DeliveryInfo {
  const maxDist = settings.max_delivery_distance ?? 20;

  if (distance > maxDist) {
    return {
      available: false,
      distance,
      charge: 0,
      freeDeliveryApplied: false,
      message: `We currently deliver within ${maxDist} km only.`,
    };
  }

  // Free delivery check
  const threshold = settings.free_delivery_threshold ?? 599;
  if (subtotal >= threshold) {
    return {
      available: true,
      distance,
      charge: 0,
      freeDeliveryApplied: true,
    };
  }

  // Tiered pricing
  let charge = settings.delivery_0_5_cost ?? 10;
  if (distance <= 5) {
    charge = settings.delivery_0_5_cost ?? 10;
  } else if (distance <= 10) {
    charge = settings.delivery_5_10_cost ?? 30;
  } else if (distance <= 15) {
    charge = settings.delivery_10_15_cost ?? 60;
  } else if (distance <= 20) {
    charge = settings.delivery_15_20_cost ?? 80;
  } else {
    charge = settings.delivery_15_20_cost ?? 80;
  }

  return {
    available: true,
    distance,
    charge,
    freeDeliveryApplied: false,
  };
}
