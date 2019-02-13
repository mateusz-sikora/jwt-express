### create server keys (do not provide passphrase)

```
ssh-keygen -t rsa -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

### install dependencies

`npm install`

### run server

`npm start`

`POST localhost:3000/login` with payload `{login: 'foo', password: 'bar'}` to get token

`GET localhost:3000/protected` with header `'Authorization': 'Bearer :token:'` to get access to protected endpoint

### run tests

`npm test`
