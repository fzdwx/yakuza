# Yakuza

![img.png](.github/img.png)

## Run

Requires [go 1.21.4+](https://golang.org/) and [pnpm](https://pnpm.io/)

```shell
# start backend first
go install github.com/cosmtrek/air@latest
go install github.com/fzdwx/yakuza/yakuza-native/cmd/yactrl@main
cd yakuza-native && air

# start frontend
pnpm install
pnpm run dev:pre
pnpm run dev
```

## Build

```shell
mkdir bin
cd yakuza-native && go build . && mv yakuza-native ../bin/yakuza-native
cd ..
pnpm run build
ls release
```

Or use [just](https://github.com/casey/just)

```
just install && yakuza
```

## Yakuza ctrl cli

Install:

```shell
go install github.com/fzdwx/yakuza/yakuza-native/cmd/yactrl@main
```

### main window

Show/hide main window

```shell
yactrl bridge toggle
```

### extension

Upgrade extension

```shell
yactrl ext local upgrade
```

Install extension

```shell
yactrl ext local install -i '{
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

- extension template
    - [react](https://github.com/fzdwx/yakuza-extension-template-react)
    - [vue](https://github.com/fzdwx/yakuza-extension-template-vue)
    - [blog, step by step](https://fzdwx.vercel.app/blog/2023-12-24-wei-kai-fa-cha-jian)
- [yakuza api](../packages/yakuza-api)
- [share your extension](https://github.com/fzdwx/yakuza-extension)

or https://github.com/topics/yakuza-extension
