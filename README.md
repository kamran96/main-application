# Invyce

Website Link [Invyce](https://invyce.com/)

<p style="text-align: center;"><img src="https://invyce.com/wp-content/uploads/2021/06/fb-invyce.jpg" ></p>

🔎 **Smart, Accounting and Business Management Tool**

## Quick Guide to Setup Project


- [Nx](https://nx.dev/getting-started/nx-setup)
  - `npm install nx -g`
- **Project Setup**
  - `yarn install`
- **Run Projects**
  - `yarn nx serve <project name> ` || `nx serve <project name>` if you've installed nx as global

## For MACBOOK M1 users only:
 
 If you found `node-gyp : building` issue then follow these steps:

- `npm install node-gyp -g`  --> [Documentation-node-gyp](https://www.npmjs.com/package/node-gyp)
- `npm audit fix --force`
  Open the terminal as an administrator
  Go to your project folder and run:
- `npm config set node_gyp`
- `npm config set msvs_version 2022`
- `yarn install`

Create a file named `binding.gyp` in the rood and paste this code

```

{
  'targets': [
    {
      'target_name': 'bindings',
      'sources': [ 'bindings.node' ],
      'cflags!': [ '-fno-exceptions' ], 
      'cflags_cc!': [ '-fno-exceptions' ],
      'conditions': [
        ['OS=="mac"', {
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
          }
        }]
      ]
    }
  ]
}

```

If you found Error with Puppetter while installing node modules please follow this link [StakeOverflow](https://stackoverflow.com/questions/65928783/puppeteer5-5-0-install-node-install-js-on-m1)

Here is the solution for it

Type following in the terminal `sudo nano ~/.zshrc` and paste
```
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH='which chromium'

``` 
and Save the config file

Then:

1 Remove existing node modules, packages-lock.json and cache from the project
  - `rm -rf node_modules`
  - `rm -rf .cache`
  
2 Install node modules
  - `npm install `  OR `yarn`
   
  Then it will works


## Below are our core plugins if you want to implement in NX project

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/angular`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application 

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@invyce/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
