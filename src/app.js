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
      window._paq.push([
        'setDocumentTitle',
        window.location.pathname + window.location.search,
      ]);
      window._paq.push(['trackPageView']);
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
    attribute: 'type',
    sortBy: ['name:asc'],
  }),
  instantsearch.widgets.refinementList({
    container: '#year-list',
    attribute: 'year',
    sortBy: ['name:desc'],
    showMore: true,
    limit: 5,
    templates: {
      showMoreText: `
        {{#isShowingMore}}
          Weniger…
        {{/isShowingMore}}
        {{^isShowingMore}}
          Mehr…
        {{/isShowingMore}}
        `,
    },
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
      { label: '5 hits per page', value: 5, default: true },
      { label: '10 hits per page', value: 10 },
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
        const base_url = 'https://deploy-preview-47--kwb.netlify.app';
        const abstract_id = 'abstract-' + data.__hitIndex + 1;
        const authors_link = data.author.map(
          (a) => '<a href="?author=' + a + '">'
        );
        const authors_name = data._highlightResult.author.map(
          (a) => a.value + '</a>'
        );
        const authors = authors_link.map(function (x, i) {
          return [x, authors_name[i]].join(' ');
        });
        let project = '';
        if (data.project !== null) {
          const project_link = data.project.map(
            (p) =>
              '<a class="btn btn-outline-primary my-1 mr-1 btn-sm" href="?project=' +
              p +
              '">' +
              data.project_btn +
              ': '
          );

          const project_name = data._highlightResult.project.map(
            (p) => p.value + '</a>'
          );
          project += project_link
            .map(function (x, i) {
              return [x, project_name[i]].join('');
            })
            .join(' ');
        }
        const cite =
          '<a class="btn btn-outline-primary my-1 mr-1 btn-sm js-cite-modal" href="' +
          base_url +
          data.cite_link +
          '">' +
          data.cite_name +
          '</a>';
        let pdf = '';
        if (data.pdf !== '') {
          pdf +=
            '<a class="btn btn-outline-primary my-1 mr-1 btn-sm" href="' +
            base_url +
            data.pdf +
            '">PDF</a>';
        }
        let doi = '';
        if (data.doi !== null) {
          doi +=
            '<a class="btn btn-outline-primary my-1 mr-1 btn-sm" href="' +
            base_url +
            data.doi +
            '">DOI</a>';
        }
        const links = '<p>' + cite + doi + pdf + project + '</p>';
        const publication =
          '<div>' +
          '<span class="article-metadata li-cite-author">' +
          authors +
          '</span>' +
          ' (' +
          data._highlightResult.year.value +
          '): <a href= ' +
          data.permalink +
          '> ' +
          data._highlightResult.title.value +
          '</a>. ' +
          data.publication +
          links +
          '</div>';
        if (data.summary === '') {
          return publication;
        } else {
          return (
            publication +
            '<button type="button" class="btn btn-info" data-toggle="collapse" data-target="#' +
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
