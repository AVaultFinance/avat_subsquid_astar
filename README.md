# Squid template project

## Quickly running the sample

```bash
# 1. Install dependencies
npm ci

# 2. Compile typescript files
make build

# 3. Start target Postgres database and detach
make up

# 4. Start the processor
make process

# 5. The command above will block the terminal
#    being busy with fetching the chain data,
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
make serve
```

##

- vault address TVL change and wirte
  - key - time -
  - Price
    - pair
    - token

```json
[
  {
    "id": "address-022-01-01",
    "sortId": 0,
    "address": "",
    "price": "",
    "symbol": ""
  }
]
```
