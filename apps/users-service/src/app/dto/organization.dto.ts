import { IsNotEmpty } from 'class-validator';

export class OrganizationDto {
  id: number;
  @IsNotEmpty()
  name: string;
  niche: string;
  financialEnding: string;
  packageId: number;
  currencyId: number;
  isNewRecord: boolean;
  email: string;
  website: string;
  attachmentId: number;
  organizationType: string;
  permanentAddress: string;
  residentialAddress: string;
  phoneNumber: string;
  faxNumber: string;
  prefix: string;
  userId: number;
  roleId: number;
  description: string;
  city: string;
  country: string;
  postalCode: string;
}

export class OrganizationParams {
  id: string;
}
