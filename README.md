# Тестовое задание

В БД имеется информация о 5000 покупателей. Разработчик добавил страницу со списком всех покупателей. Необходимо доделать этот список, добавив пагинацию - по 20 записей на страницу с разбивкой по 10 страниц.

![Ожидаемый Результат](./result.png)

## Запуск проекта

Для соединения с Postgresql используется переменная окружения `APP_PG_URL` 
(например: `postgresql://user:password@localhost:5432/test_pagination?sslmode=disable`). 

Для загрузки данных в БД используйте файл `test_pagination_localhost-dump.sql` (например: `psql -h localhost -U user -d test_pagination -f test_pagination_localhost-dump.sql`).

Или:
```sh
docker-compose.exe -f srv/docker-compose.dev.yml up &
docker cp test_pagination_localhost-dump.sql hh-test-db:/
docker exec -it hh-test-db psql -h localhost -U user -d test_pagination -f test_pagination_localhost-dump.sql
```

# Финиш

![Результат](./actual-result.png)
