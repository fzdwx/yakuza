build:
  rm -rf bin
  mkdir bin
  cd launcher-native && go build . && mv launcher-native ../bin/launcher-native
  pnpm run build

install: build
    sudo rm -rf /usr/local/bin/launcher
    sudo mv ./release/0.1.0/Launcher-0.1.0.AppImage /usr/local/bin/launcher

air:
    cd launcher-native && air

clean:
    rm -rf bin
    rm -rf dist
    rm -rf dist-electron
    rm -rf node_modules
    rm -rf release
