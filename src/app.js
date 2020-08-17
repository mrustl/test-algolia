/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'pubs_test',
  searchClient: algoliasearch('FUZHRLXPF4', '7fb333226a19b1a7af131612dd428928'),
  routing: true,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#pubs-list',
    attribute: 'pub_type_name',
  }),
  instantsearch.widgets.refinementList({
    container: '#author-list',
    attribute: 'authors',
  }),
  instantsearch.widgets.refinementList({
    container: '#project-list',
    attribute: 'projects',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      empty: `<div>
      <p>No results have been found for {{ query }}</p>
      <a role="button" href=".">Clear all filters</a>
    </div>`,
      item: `
        <div>
          <div class="publication">{{authors}} ({{date}}): <a href={{permalink}}>{{title}}</a></div>
          <br></br>
          <div>{{#helpers.highlight}}{ "attribute": "summary" }{{/helpers.highlight}}</div>   
        </div>  
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
