# ulysselacour.com

- [Techs](#Techs)
  - [Nuxt](#Nuxt)
  - [Gsap](#Gsap)
  - [Lazysizes](#Lazysizes)
  - [Pwa](#Pwa)
  - [Tailwind](#Tailwind)
- [Deploy](#Deploy)

## Techs :

### `Nuxt`

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org) or bellow :

<details>
  <summary>Details</summary>

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### assets

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### components

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### layouts

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### pages

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### plugins

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### static

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### store

This directory contains your Vuex Store files.
Vuex Store option is implemented in the Nuxt.js framework.

Creating a file in this directory automatically activates the option in the framework.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/vuex-store).

</details>

### `Gsap`

[Npm documentation](https://www.npmjs.com/package/nuxt-gsap-module)

[GreenSock documentation](https://greensock.com/cheatsheet/)

### `Lazysizes`

[Documentation](https://www.npmjs.com/package/nuxt-lazysizes)

### `Pwa`

[Documentation](https://pwa.nuxtjs.org/)

### `Tailwind`

[Cheatsheet](https://tailwindcomponents.com/cheatsheet/)

<br/>
<br/>

# Deploy

## Set up nginx

### Create server block :

```bash
sudo nano /etc/nginx/sites-available/my_project
```

And add :

```nginx
server {
    listen 80;
    listen [::]:80;
    index index.html;
    server_name IP_ADRESS_OR_DOMAIN_NAME;

    access_log /home/eljovial/nuxt/my_project/logs/access.log;
    error_log /home/eljovial/nuxt/my_project/logs/error.log error;

    location / {
        proxy_pass http://localhost:PORT_NUMBER;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Link to sites-enabled :

```bash
sudo ln -s /etc/nginx/sites-available/my_project /etc/nginx/sites-enabled
```

### Check for syntax errors :

```bash
sudo nginx -t
```

Don't forget to use the right directory structure [bellow](#directories-structure) !

### Restart nginx :

```bash
sudo systemctl restart nginx
```

Or you can restart nginx with _bash ~/restart_nginx.sh_

<br/>

## Add project to server

### Directories structure

In order to use versioning we use this directory structure :

```
/MyAppName
|--/releases
|----/v1.0.0
|----/v1.1.0
|----/v1.2.0
|----/...
|
|--/current -> /releases/v1.2.0 (symlink)
|
|--/logs
|----/access.log
|----/error.log
```

<br/>

Create symlink with :

```bash
ln -s /home/eljovial/nuxt/my_project/releases/v1.2.0 /home/eljovial/nuxt/my_project/current
```

<br/>

Git clone inside version directory instead of pull/merge newest version :

```bash
git clone https://$PAT@github.com/GIT_USERNAME/REPOSITORY_NAME.git
```

To update app just git clone to latest version directory you created, update the symlink, delete older symlink and delete older app.

<br/>

Make suree to add a .env file inside project directory and add your env variables

```bash
touch .env
```

<br/>

## Run app in production

First of all :

```bash
# install dependencies
npm install
# build for production
npm run generate
```

### Deplpoy (PM2)

<br/>

[Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

To run the app in background, **inside project directory** next to our package.json file, run :

```bash
pm2 start npm --name MyAppName -- start
```

Then, inside project directory, to configure our pm2 config file run :

```bash
pm2 init
```

This will create _ecosystem.config.js_ file, replace its content with :

```js
module.exports = {
  apps: [
    {
      name: 'app_name', // App name that shows in `pm2 ls`
      exec_mode: 'cluster', // enables clustering
      instances: 'max', // or an integer
      cwd: './current', // only if using a subdirectory
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start'
    }
  ]
}
```

### To reload the app run :

```bash
pm2 reload MyAppName
```

### To see current node.js running :

```bash
pm2 list
```

### Delete app :

```bash
pm2 delete ID_APP
```

## HTTPS with certbot

<br/>

[Documentation](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-debian-11)

<br/>

```bash
sudo certbot --nginx -d example.com
```
