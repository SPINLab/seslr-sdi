# SESLR Hub

## Setup

### web

Create a ./data folder containing:

-   tms/
-   features/
-   terrain/
-   pictures/

and corresponding data.

### database

Create ./database/postgres.env and fill in user, password and database as shown in the -TEMPLATE file

Create a ./pgdata folder

### SDI

Use docker-compose to set everything up

```bash
docker-compose up
```