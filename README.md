# Cubus

## Running the project (without docker)
Make sure your `.env` is configured to run with an sqlite instance `DB_CONNECTION=sqlite`. Then you can run
```sh
composer run dev
```

> [!NOTE]
> If this is the first time you're running the server use `php artisan migrate` to generate the db tables.


## Running the project (using docker)
Make sure you have `docker` and `docker compose` installed. If you haven't, check [the docker installation guide](https://docs.docker.com/engine/install/#supported-platforms) and [the docker compose installation guide](https://docs.docker.com/compose/install/linux/).

Then the only thing you need to run is
```sh
composer run dev-docker
```

> [!NOTE]
> If this is the first time you're running the server use `vendor/bin/sail artisan migrate`

