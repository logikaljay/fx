# fx

## Getting started

```
$ mkdir -p /path/to/my/new-function
$ pnpm dlx @5oo/fx init
$ pnpm run dev
```

## Development

```
$ git clone https://github.com/logikaljay/fx
$ cd fx

# install deps
$ pnpm i

# build
$ pnpm run build

# global link the binary 
$ pnpm ln -g

# use the binary
$ mkdir -p /some/other/place
$ cd /some/other/place
$ fx init
```