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
  phoneNumber: string;
  faxNumber: string;
  prefix: string;
  address: {
    description: string;
    city: string;
    country: string;
    postalCode: string;
  };
}
