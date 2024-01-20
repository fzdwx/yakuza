build:
  rm -rf bin
  rm -rf dist
  rm -rf dist-electron
  mkdir bin
  cd launcher-native && go build . && mv launcher-native ../bin/launcher-native
  pnpm install
  pnpm run build

install-action: build
    cd launcher-native/cmd/ray && go build .  && mv ray ../../../bin/

i: install

install: build ray
    sudo rm -rf /usr/local/bin/launcher
    sudo mv ./release/0.1.0/launcher-0.1.0.AppImage /usr/local/bin/launcher

pub-launcher-api:
    ni
    cd packages/launcher-api && just pub

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
