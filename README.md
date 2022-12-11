# Whisper Server / Client


## 準備

nodejsの環境を作成してプロジェクトのルートディレクトリで以下のコマンドを実行。

```bash
$ yarn install
```

## ビルド

```bash
$ yarn build
```

## 設定

whisper ディレクトリに stream と ggml-base.bin を配置、以下のコマンドを実行。

```bash
# サーバーの起動
$ WHISPER_COMMAND=./whisper.sh ./scripts/server.sh
```

```bash
# クライアントの起動
$ WHISPER_HOST=localhost ./scripts/client.sh
```

```bash
$ ./scripts/proxy.sh
```
