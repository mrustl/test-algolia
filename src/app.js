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
    container: '#year-list',
    attribute: 'year',
    showMore: true,
  }),
  instantsearch.widgets.refinementList({
    container: '#author-list',
    attribute: 'authors',
    operator: 'and',
    showMore: true,
  }),
  instantsearch.widgets.refinementList({
    container: '#project-list',
    attribute: 'projects',
    showMore: true,
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      empty: `<div>
      <p>No results have been found for {{ query }}</p>
      <a role="button" href=".">Clear all filters</a>
    </div>`,
      item: function (data) {
        const position = data.__hitIndex + 1;
        return (
          '<div>' +
          data.authors +
          ' (' +
          data._highlightResult.year.value +
          '): <a href= ' +
          data.relpermalink +
          '> ' +
          data._highlightResult.title.value +
          '</a>. ' +
          data.publication +
          '</div><br></br><p>' +
          data._highlightResult.summary.value +
          ' </p>'
        );
      },
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
