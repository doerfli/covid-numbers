# covid-numbers

## About this project

This project shows Covid-19 data for Switzerland and its cantons. 
Displayed values are _confirmed cases_, _incidence numbers_, _hospitalization as well as icu counts_ and the _number of deceased_. 

All data is directly retrieved from the [doerfli/foph-covid19-data](https://github.com/doerfli/foph-covid19-data) repository without any backend to handle the data. 

The frontend is build using [Vue.js](https://github.com/vuejs/vue) and [Typescript](https://github.com/microsoft/TypeScript), the graphs are rendered with [d3.js](https://github.com/d3/d3).
Styling is done using [tailwindcss](https://github.com/tailwindlabs/tailwindcss). 
To keep things interesting I have added continuous deployment to Github pages and a Heroku site (with a Container) using Github Actions.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run container manually

```
docker run -p 8080:8080 -e PORT=8080 <imageid>
```

### Release new version

```
git switch main && git pull && git merge develop && git push && git switch develop
```

