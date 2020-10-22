# Pathways Backend

## Requirements

## Running the project

Run MongoDB and save to the `data/` directory with:

```shell
mongod --config mongod.conf --fork
```

You can then access the mongo console and shutdown the database with:

```shell
mongo
db.adminCommand({shutdown: 1})
exit
```

Alternatively, MongoDB can be run with brew services and will save in a default directory with:

Run MongoDB:
```shell
brew services start mongodb-community
```

Stop MongoDB:
```shell
brew services stop mongodb-community
```

If you install with brew then MongoDB will save to `/usr/local/var/mongodb/`.
The exact location on can be found in `/usr/local/etc/mongodb.conf`
The location can be changed with the `--dbpath` parameter.

### Installing MongoDB

**On MacOS with homebrew**

```shell
brew tap mongodb/brew
brew install mongodb-community
```

