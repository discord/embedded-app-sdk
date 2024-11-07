import React from 'react';
import * as S from '../AppStyles';

const Search = ({onQueryChanged}: {onQueryChanged: (q: string) => void}) => {
  const [query, setQuery] = React.useState(() => {
    return localStorage.getItem('sdkPlaygroundSearchQuery') ?? '';
  });

  React.useEffect(() => {
    localStorage.setItem('sdkPlaygroundSearchQuery', query);
    onQueryChanged(query);
  }, [onQueryChanged, query]);

  return <S.Input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />;
};

export default Search;
