/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'netlify_kwb-pubs',
  searchClient: algoliasearch('FUZHRLXPF4', '7fb333226a19b1a7af131612dd428928'),
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'type',
  }),
  instantsearch.widgets.refinementList({
    container: '#author-list',
    attribute: 'authors',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <div class="publication">{{authors}} ({{date}}): {{title}}</div>
          <br></br>
          <div>{{summary}}</div>   
        </div>  
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
