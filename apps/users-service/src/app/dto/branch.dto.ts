export class BranchDto {
  id: number;
  name: string;
  description: string;
  organizationId: string;
  phoneNumber: string;
  faxNumber: string;
  isNewRecord: boolean;
  isMain: boolean;
  prefix: string;
  email: string;
  address: {
    city: string;
    country: string;
    postalCode: string;
  };
}
