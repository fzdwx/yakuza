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

## Launcher ctrl cli

install:

```shell
go install github.com/fzdwx/launcher/launcher-native/cmd/ray@main
```

### main window

show/hide main window

```shell
ray bridge toggle
```

### extension

upgrade extension

```shell
ray ext local upgrade
```

install extension

```shell
ray ext local install -i '{
    "name": "Notes",
    "description": "A markdown note extension",
    "author": "fzdwx",
    "icon": "https://raw.githubusercontent.com/fzdwx/launcher-notes/main/public/logo.svg",
    "github": "https://github.com/fzdwx/launcher-notes",
    "actions": [
      {
        "name": "New note",
        "command": "newNote"
      }
    ]
  }'
```


## Related

- [build your own extension](https://github.com/fzdwx/launcher-extension-sample)
- [launcher api](https://github.com/fzdwx/launcher-api)
- [share your extension](https://github.com/fzdwx/launcher-extension)
- [为 launcher 开发插件](https://fzdwx.vercel.app/blog/2023-12-24-wei-kai-fa-cha-jian)

or https://github.com/topics/launcher-extension
