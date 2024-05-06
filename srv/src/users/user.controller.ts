import { UserService } from './users.service';
import { Controller, Get, Logger } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers(@Paginate() query: PaginateQuery) {
    this.logger.log('Get all users (paginated)');

    return this.userService.findAll(query);
  }
}
