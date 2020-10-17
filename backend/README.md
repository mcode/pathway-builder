# Pathways Backend

## Requirements

## Running the project

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
The location can be changed with the `--dbpath` parameter.  For example:

```shell
mongod --config mongod.config --fork
```

You can then access the mongo console and shutdown the database with:

```shell
mongo
db.adminCommand({shutdown: 1})
exit
```

### Installing MongoDB

**On MacOS with homebrew**

```shell
brew tap mongodb/brew
brew install mongodb-community
```
