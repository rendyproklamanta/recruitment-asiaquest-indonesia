# How To Use

- Change environment

```sh
copy .env.example to .env
```

- Preparation

```sh
npm install
```

- Migrate DB

```sh
npx sequelize-cli db:migrate --force
```

- Run!

```sh
npm run dev
```

## More commands

- Create schema/migration

```sh
npx sequelize-cli migration:generate --name update-blablabla
```

- Run unit test

```sh
npm run test
```

## URL

- API : <http://localhost:3000>

- Swagger Doc : <http://localhost:3000/api-docs>