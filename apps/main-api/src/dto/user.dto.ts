import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  fullname: string;
  @IsNotEmpty()
  username: string;
  @IsEmail()
  email: string;
  password: string;
  country: string;
  phoneNumber: string;
  roleId: number;
  branchId: number;
  prefix: string;
  terms: boolean;
  marketing: boolean;
}

export class InvitedUser {
  fullname: string;
  @IsNotEmpty()
  username: string;
  password: string;
  country: string;
  phoneNumber: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  username: string;
  password: string;
  email: string;
}

export class ForgetPasswordDto {
  username: string;
  email: string;
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
