build:
  rm -rf bin
  mkdir bin
  cd launcher-native && go build . && mv launcher-native ../bin/launcher-native
  pnpm run build

i: install

install: build
    sudo rm -rf /usr/local/bin/launcher
    sudo mv ./release/0.1.0/launcher-0.1.0.AppImage /usr/local/bin/launcher

air:
    cd launcher-native && air

ray:
    cd launcher-native/cmd/ray && go install .

clean:
    rm -rf bin
    rm -rf dist
    rm -rf dist-electron
    rm -rf node_modules
    rm -rf release
