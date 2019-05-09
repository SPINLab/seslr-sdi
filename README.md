# SESLR Hub

## Setup

### web

Go to ./seslr-hub/seslr-hub/static

```bash
npm install
```

Create a ./data folder containing:

-   imagery/
-   features/
-   terrain/

and corresponding data.

### database

Create ./database/postgres.env and fill in user, password and database as shown in the -TEMPLATE file

Create a ./pgdata folder

### SDI

Use docker-compose to set everything up

```bash
docker-compose up -e SESLR_APP_MODE=full
```

For the demo version:

```bash
docker-compose up -e SESLR_APP_MODE=demo
```