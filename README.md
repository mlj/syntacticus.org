# Syntacticus

This is the code for [Syntacticus](http://syntacticus.org), an end-user frontend for the [PROIEL Treebank](http://dev.syntacticus.org/proiel.html), [ISWOC Treebank](http://dev.syntacticus.org/iswoc.html) and [TOROT Treebank](https://torottreebank.github.io/), which are treebanks of ancient Indo-European languages.

Syntacticus is a single-page application and relies on a backend to serve the actual language data.

## Build setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn serve

# build for production with minification
yarn build
```

## Attributions

Syntactius uses [Vue.js](http://vuejs.org/), [Bulma](http://bulma.io/) and a bit of [D3.js](https://d3js.org/).

The front-page miniatures are from the manuscript [Burney 272](http://www.bl.uk/catalogues/illuminatedmanuscripts/record.asp?MSID=1498&CollID=18&NStart=272) (British Museum, Public Domain).

The two large manuscript details are from the [Codex Argenteus](https://commons.wikimedia.org/wiki/File:Wulfila_bibel.jpg) (Wikimedia, Public Domain) and from [Codex Vaticanus Latinus 3868](https://commons.wikimedia.org/wiki/File:Terence_Andria_1.1_Vat3868f4v.jpg) (Wikimedia, Public Domain).

The flat view of dependency graphs is derived from work by [http://www.sobhe.ir/dependency-parse-tree/](http://www.sobhe.ir/dependency-parse-tree/).
