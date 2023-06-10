#!/usr/bin/env just --justfile

update:
  go get -u
  go mod tidy -v

dev:
    wails dev

