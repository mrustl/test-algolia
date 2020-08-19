import searchRouting from './search-routing';

/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'pubs_test',
  searchClient: algoliasearch('FUZHRLXPF4', '7fb333226a19b1a7af131612dd428928'),
  routing: searchRouting,
});

search.addWidgets([
  instantsearch.widgets.currentRefinements({
    container: '#current-refinements',
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#pubs-list',
    attribute: 'pub_type_name',
    sortBy: ['name:asc'],
  }),
  instantsearch.widgets.refinementList({
    container: '#year-list',
    attribute: 'year',
    sortBy: ['name:desc'],
    showMore: true,
  }),
  instantsearch.widgets.refinementList({
    container: '#author-list',
    attribute: 'authors',
    operator: 'and',
    sortBy: ['count:desc'],
    showMore: true,
    searchable: true,
  }),
  instantsearch.widgets.refinementList({
    container: '#project-list',
    attribute: 'projects',
    sortBy: ['count:desc'],
    showMore: true,
    searchable: true,
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      empty: `<div>
      <p>No results have been found for {{ query }}</p>
      <a role="button" href=".">Clear all filters</a>
    </div>`,
      item: function (data) {
        const abstract_id = 'abstract-' + data.__hitIndex + 1;
        if (data.summary === '') {
          return (
            '<div>' +
            data.authors +
            ' (' +
            data._highlightResult.year.value +
            '): <a href= ' +
            data.permalink +
            '> ' +
            data._highlightResult.title.value +
            '</a>. ' +
            data.publication +
            '</div>'
          );
        } else {
          return (
            '<div>' +
            data.authors.join(', ') +
            ' (' +
            data._highlightResult.year.value +
            '): <a href= ' +
            data.permalink +
            '> ' +
            data._highlightResult.title.value +
            '</a>. ' +
            data.publication +
            '<br></br><button type="button" class="btn btn-info" data-toggle="collapse" data-target="#' +
            abstract_id +
            '">Abstract</a><div id="' +
            abstract_id +
            '" class="collapse">' +
            data._highlightResult.summary.value +
            '</div'
          );
        }
      },
    },
  }),

  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
