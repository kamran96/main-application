import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async show(@Param() params) {
    const user = await this.userService.FindUserById(params.id);

    if (user) {
      return {
        message: 'User fetched successfully.',
        status: true,
        result: user,
      };
    }
  }
}
