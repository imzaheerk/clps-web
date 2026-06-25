export interface UserOutput {
  id: number;
  name: string | null;
  mobileNumber: string;
  numberVisibility?: "fully_visible" | "masked";
  country: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  area: string | null;
  isActive?: boolean;
  discoveryRadiusKm?: number;
  createdAt: string;
  updatedAt: string;
  token?: string; // JWT token (only returned on login/signup)
}
export type User = UserOutput;
