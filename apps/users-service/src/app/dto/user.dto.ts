import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  username: string;
  @IsEmail()
  email: string;
  password: string;
  roleId: number;
  fullName: string;
  branchId: number;
  organizationId: number;
  terms: boolean;
  marketing: boolean;
  fullname: string;
  phoneNumber: string;
  country: string;
  prefix;
}

export class InvitedUserDto {
  users: Array<InvitedUserDetailDto>;
}

export class InvitedUserDetailDto {
  fullname: string;
  @IsNotEmpty()
  email: string;
  @IsEmail()
  username: string;
  password: string;
  country: string;
  phoneNumber: string;
  attachmentId: string;
  website: string;
  location: string;
  jobTitle: string;
  prefix: string;
  cnic: string;
  bio: string;
  roleId: string;
  branchId: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  username: string;
  email?: string;
  password?: string;
}

export class SendCodeDto {
  code: string;
}

export class ForgetPasswordDto {
  username: string;
}

export class PasswordDto {
  password: string;
  confirmPassword: string;
  code: string;
}

export class ProfileDto {
  userId: number;
  attachmentId: number;
  fullName: string;
  website: string;
  location: string;
  bio: string;
  phoneNumber: string;
  jobTitle: string;
}

export class UserIdsDto {
  ids: Array<number>;
}

export class SendOtp {
  email: string;
  otp: string;
}

export class UserThemeDto {
  theme: string;
}
