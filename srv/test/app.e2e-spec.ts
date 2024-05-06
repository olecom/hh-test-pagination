import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Paginated } from 'nestjs-paginate';
import { UsersEntity } from 'src/users/users.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let http;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    http = app.getHttpServer();
  });

  afterAll(() => app.close())

  it('/ (GET)', () => request(http)
      .get('/')
      .expect(404)
  );

  it('/users (GET)', () => request(http)
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(checkPage1Limit20)
  );

  it('/users (GET) NaN check', () => request(http)
      .get('/users?page=und&limit=efined')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(checkPage1Limit20)
  );

  function checkPage1Limit20(res){
    const json = res.body as Paginated<UsersEntity>;

    expect(json.data.length).toEqual(20);

    expect(Object.entries(json.data[0]).length).toEqual([
      'id',
      'firstname',
      'lastname',
      'phone',
      'email',
      'updatedAt',
    ].length);

    expect(json.meta).toEqual({
      itemsPerPage: 20,
      totalItems: 5000,
      currentPage: 1,
      totalPages: 250,
      sortBy: [[ 'id', 'ASC', ]],
    });
  }
});
