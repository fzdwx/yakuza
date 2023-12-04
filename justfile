build:
  rm -rf bin
  mkdir bin
  cd launcher-native && go build . && mv launcher-native ../bin/launcher-native
  pnpm run build

air:
    cd launcher-native && air

clean:
    rm -rf bin
    rm -rf dist
    rm -rf dist-electron
    rm -rf node_modules
    rm -rf release
