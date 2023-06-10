#!/usr/bin/env just --justfile

update:
  go get -u
  go mod tidy -v

dev:
    @wails dev -nosyncgomod

build:
    @wails build

test1:
    go install github.com/wailsapp/wails/v2/cmd/wails@v2.4.1

test2:
    go install github.com/wailsapp/wails/v2/cmd/wails@v2.5.1
