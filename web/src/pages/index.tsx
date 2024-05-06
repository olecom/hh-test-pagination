import Head from "next/head";
import {Inter} from "next/font/google";
import {Alert, Table, Container, Pagination} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";

const NEXT_PUBLIC_API_URL = 'http://localhost:3001'
const PAGES = 10
const PAGES_QS = '?page='

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  searchParams: { [key: string]: string | string[] | undefined },
  statusCode: number
  users: TUserItem[] | null
  meta: {
    itemsPerPage: number
    totalItems: number
    currentPage: number
    totalPages: number
  } | null
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const ret = { props: { statusCode: 200, users: null, meta: null, searchParams: ctx.query }}

  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/users?limit=${ctx.query.limit}&page=${ctx.query.page}`)
    ret.props.statusCode = res.status
    if (res.ok) {
      const json = await res.json()
      ret.props.users = json.data
      ret.props.meta = json.meta
    }
  } catch (e) {
    ret.props.statusCode = 500
  }
  return ret
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, users, meta, searchParams}: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  const pages = meta ? Math.trunc((meta.currentPage - 1)/PAGES) * PAGES : 0

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users?.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First href={PAGES_QS + 1}/>
            <Pagination.Prev href={PAGES_QS + (pages > 0 ? pages : 1)}/>
            {meta && Array(PAGES).fill(pages).map((start, i) => {
              const pidx = start + i + 1

              return (pidx <= meta.totalPages) && <Pagination.Item
                key={pidx}
                active={meta.currentPage === pidx}
                href={PAGES_QS + pidx}
                >
                  {pidx}
                </Pagination.Item>
              })
            }
            <Pagination.Next href={PAGES_QS + (pages + PAGES + 1)} disabled={((pages + PAGES + 1) > (meta?.totalPages || Infinity))}/>
            <Pagination.Last href={PAGES_QS + meta?.totalPages}/>
          </Pagination>
        </Container>
      </main>
    </>
  )
}
