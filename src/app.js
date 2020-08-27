import searchRouting from './search-routing';

/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'pubs_test',
  searchClient: algoliasearch('FUZHRLXPF4', '7fb333226a19b1a7af131612dd428928'),
  routing: searchRouting,
  /* https://discourse.algolia.com/t/limit-searches-to-3-characters-or-more-with-instantsearch/8067/2 */
});

search.addWidgets([
  instantsearch.widgets.analytics({
    pushFunction(formattedParameters, state, results) {
      /*  help needed: add code for Matomo  (https://developer.matomo.org/guides/tracking-javascript-guide)*/
    },
  }),
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
    limit: 5,
  }),
  instantsearch.widgets.refinementList({
    container: '#author-list',
    attribute: 'author',
    operator: 'and',
    sortBy: ['count:desc'],
    showMore: true,
    limit: 5,
    searchable: true,
  }),
  instantsearch.widgets.refinementList({
    container: '#project-list',
    attribute: 'project',
    sortBy: ['count:desc'],
    showMore: true,
    limit: 5,
    searchable: true,
  }),
  instantsearch.widgets.hitsPerPage({
    container: '#hits-per-page',
    items: [
      { label: '5 hits per page', value: 5 },
      { label: '10 hits per page', value: 10, default: true },
      { label: '20 hits per page', value: 20 },
    ],
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
        const authors = data.author;
        const authors_link = authors.map(
          (a) =>
            '<span><a href= "search/?authors=' + a + '">' + a + '</a></span>'
        );
        if (data.summary === '') {
          return (
            '<div>' +
            '<span class="article-metadata li-cite-author">' +
            authors_link.join(', ') +
            '</span>' +
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
            authors_link.join(', ') +
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
            '" class="collapse show multi-collapse">' +
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
