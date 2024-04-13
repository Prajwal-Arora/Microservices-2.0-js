### This code contains all the APIs and features present in the following links

- https://www.coinex.com/en
- https://www.coinex.com/en/markets/coin
- https://www.coinex.com/en/markets/data
- https://www.coinex.com/en/exchange/btc-usdt#spot
- https://www.coinex.com/en/info/BTC

#### docker-compose for dev to start containers in development mode

```
docker compose up -d
```

#### docker-compose for dev to build and start containers in development mode

```
docker compose up -d --build
```

#### Stop containers which are running in development mode

```
docker compose down
```

#### Show logs for all the docker containers running

```
docker compose logs -f --tail=20
```

#### You can run commands inside the docker container via:

```
docker exec -it <container-name> bash
```
