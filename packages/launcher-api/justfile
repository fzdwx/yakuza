#!/usr/bin/env just --justfile
export PATH := "./node_modules/.bin:" + env_var('PATH')

build:
  rm -rf dist
  node-sass ./index.scss ./dist/index.css
  pnpm run build

pub: build
    npm version patch
    pnpm publish --access public
