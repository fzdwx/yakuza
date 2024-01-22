build:
  rm -rf bin
  rm -rf dist
  rm -rf dist-electron
  mkdir bin
  cd yakuza-native && go build . && mv yakuza-native ../bin/yakuza-native
  pnpm install
  pnpm run dev:pre
  pnpm run build

install-action: build
    cd yakuza-native/cmd/yactrl && go build .  && mv yactrl ../../../bin/

i: install

install: build yactrl
    sudo rm -rf /usr/local/bin/yakuza
    sudo mv ./release/0.1.0/yakuza-0.1.0.AppImage /usr/local/bin/yakuza

pub-yakuza-api:
    ni
    cd packages/yakuza-api && just pub

air:
    cd yakuza-native && air

yactrl:
    cd yakuza-native/cmd/yactrl && go install .

clean:
    rm -rf bin
    rm -rf dist
    rm -rf dist-electron
    rm -rf node_modules
    rm -rf release
