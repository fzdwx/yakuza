# Launcher Api

A collection of api for [launcher](https://github.com/fzdwx/launcher)

```shell
pnpm add launcher-api
```

call api:

```ts
import {clipboard, config, getActionCommand, mainView, shell} from "launcher-api";

clipboard.set("hello world");
clipboard.get();
```
