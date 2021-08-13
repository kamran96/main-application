import { IsNotEmpty } from 'class-validator';

export class OrganizationDto {
  id: number;
  @IsNotEmpty()
  name: string;
  permanentAddress: string;
  niche: string;
  organizationType: string;
  residentialAddress: string;
  financialEnding: string;
  packageId: number;
  currencyId: number;
  isNewRecord: boolean;
  email: string;
  website: string;
  attachmentId: number;
  city: string;
  country: string;
  postalCode: number;
  phoneNumber: string;
  faxNumber: string;
  prefix: string;
  postalcode: string;
}
