# SESLR Hub

## Setup

### reverse proxy

Create a `.htpasswd` file using a password file creation utility, such as apache2-utils or httpd-tools. Place in `./reverseproxy/`.

### web

Create a `./data` folder containing:

- `tms/`
- `features/`
- `terrain/`
- `pictures/`
- `demo/`

and corresponding data.

### database

Create `./database/postgres.env` and fill in user, password and database as shown in the -TEMPLATE file

Create a `./pgdata` folder

### SDI

Use docker-compose to set everything up

```bash
docker-compose up
```