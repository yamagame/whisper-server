# Whisper Server / Client


## 準備

nodejsの環境を作成してプロジェクトのルートディレクトリで以下のコマンドを実行。

```bash
$ yarn install
```
## 設定

whisper ディレクトリに stream と ggml-base.bin を配置、以下のコマンドを実行。

```bash
# サーバーの起動
$ WHISPER=./whisper.sh yarn start
```

```bash
# クライアントの起動
$ yarn run client
```
