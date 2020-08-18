const router = instantsearch.routers.history({
  createURL({ qsModule, routeState, location }) {
    const urlParts = location.href.match(/^(.*?)\/search/);
    const baseUrl = `${urlParts ? urlParts[1] : ''}/`;

    const queryParameters = {};

    if (routeState.query) {
      queryParameters.query = encodeURIComponent(routeState.query);
    }
    if (routeState.page !== 1) {
      queryParameters.page = routeState.page;
    }
    if (routeState.pub_type_name) {
      queryParameters.pub_type_name = routeState.pub_type_name.map(
        encodeURIComponent
      );
    }
    if (routeState.year) {
      queryParameters.year = routeState.year.map(encodeURIComponent);
    }
    if (routeState.authors) {
      queryParameters.authors = routeState.authors.map(encodeURIComponent);
    }
    if (routeState.projects) {
      queryParameters.projects = routeState.projects.map(encodeURIComponent);
    }

    const queryString = qsModule.stringify(queryParameters, {
      addQueryPrefix: true,
      arrayFormat: 'repeat',
    });

    return `${baseUrl}search/${queryString}`;
  },

  parseURL({ qsModule, location }) {
    const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/);

    const {
      query = '',
      page,
      types = [],
      years = [],
      authors = [],
      projects = [],
    } = qsModule.parse(location.search.slice(1));
    // `qs` does not return an array when there's a single value.
    const allTypes = Array.isArray(types) ? types : [types].filter(Boolean);
    const allYears = Array.isArray(years) ? years : [years].filter(Boolean);
    const allAuthors = Array.isArray(authors)
      ? authors
      : [authors].filter(Boolean);
    const allProjects = Array.isArray(projects)
      ? projects
      : [projects].filter(Boolean);

    return {
      query: decodeURIComponent(query),
      page,
      pub_type_name: allTypes.map(decodeURIComponent),
      pub_type_name: allYears.map(decodeURIComponent),
      pub_type_name: allAuthors.map(decodeURIComponent),
      pub_type_name: allProjects.map(decodeURIComponent),
    };
  },
});

const stateMapping = {
  stateToRoute(uiState) {
    // refer to uiState docs for details: https://www.algolia.com/doc/api-reference/widgets/ui-state/js/
    return {
      query: uiState.pubs_test.query,
      page: uiState.pubs_test.page,
      pub_type_name:
        uiState.pubs_test.refinementList &&
        uiState.pubs_test.refinementList.pub_type_name,
      year:
        uiState.pubs_test.refinementList &&
        uiState.pubs_test.refinementList.year,
      authors:
        uiState.pubs_test.refinementList &&
        uiState.pubs_test.refinementList.authors,
      projects:
        uiState.pubs_test.refinementList &&
        uiState.pubs_test.refinementList.projects,
    };
  },

  routeToState(routeState) {
    // refer to uiState docs for details: https://www.algolia.com/doc/api-reference/widgets/ui-state/js/
    return {
      // eslint-disable-next-line camelcase
      pubs_test: {
        query: routeState.query,
        page: routeState.page,
        refinementList: {
          pub_type_name: routeState.pub_type_name,
          year: routeState.year,
          authors: routeState.authors,
          projects: routeState.projects,
        },
      },
    };
  },
};

const searchRouting = {
  router,
  stateMapping,
};

export default searchRouting;
