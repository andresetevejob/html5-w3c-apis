## 1 - tap npm install in the folder serviceworker
`````
  npm install

`````
## 2 create certificate files
```
 - use mkcerts : https://github.com/FiloSottile/mkcert

```

## 3 Start server with https protocol

`````
npx http-server -S -C path/<file_name>.pem -K <file_name>-key.pem ./news-api

``````