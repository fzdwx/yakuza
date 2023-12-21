# Launcher

![img.png](.github/img.png)

## Run the project

requires [go 1.21.4+](https://golang.org/) and [pnpm](https://pnpm.io/)

```shell
# start frontend
pnpm install
pnpm run dev

# start backend
go install github.com/cosmtrek/air@latest
cd launcher-native && air
```

## Build the project

```shell
mkdir bin
cd launcher-native && go build . && mv launcher-native ../bin/launcher-native
pnpm run build
ls release
```

## Install ctrl cli

```shell
go install github.com/fzdwx/launcher/launcher-native/cmd/ray@main
```

## Related

- [launcher extension sample](https://github.com/fzdwx/launcher-extension-sample)
- [launcher api](https://github.com/fzdwx/launcher-api)
- [build your own extension](https://github.com/fzdwx/launcher-extension)

or https://github.com/topics/launcher-extension
