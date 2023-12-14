# Launcher

![img.png](.github/img.png)

## Run the project

```shell
# start frontend
pnpm install
pnpm run dev

# start backend
go install github.com/cosmtrek/air@latest
cd launcher-native && air
```

## Build the project

requires [go](https://golang.org/) and [pnpm](https://pnpm.io/)

```shell
mkdir bin
cd launcher-native && go build . && mv launcher-native ../bin/launcher-native
pnpm run build
ls release
```

## Related

- [launcher sample extension](https://github.com/fzdwx/launcher-extension-sample)
- [launcher api](https://github.com/fzdwx/launcher-api)
- [launcher extension collect](https://github.com/fzdwx/launcher-extension)
