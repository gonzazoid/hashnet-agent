### #Net agent

#### Configuration

First of all - change ``OWNER_PUBLIC_KEY`` in ``.env`` file.

It's your public key, ``signed://`` messages (with label ``/hashnet-rpc``) signed by the key will be executed by agent as #Net RPC messages.

The rest of settings is pretty much self-explanatory.

#### Run the System
```bash
docker-compose up
```

The services can be run on the background with command:
```bash
docker-compose up -d
```

#### Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker-compose down
```
