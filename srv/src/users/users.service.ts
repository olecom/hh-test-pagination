import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

const defaultLimit = 20;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users (paginated)
  findAll(query: PaginateQuery): Promise<Paginated<UsersEntity>> {
    if(!query.limit) query.limit = defaultLimit;
    if(!query.page) query.page = 1;

    return paginate(query, this.usersRepo, {
      sortableColumns: ['id'],
      select: [
        'id',
        'firstname',
        'lastname',
        'phone',
        'email',
        'updatedAt',
      ],
      defaultLimit,
    });
  }
}
