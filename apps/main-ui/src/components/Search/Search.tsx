import React, { SFC, useState } from 'react';
import { SearchWrapper } from './SearchStyles';
import bxSearch from '@iconify/icons-bx/bx-search';
import { Icon } from '@iconify/react';

interface IProps {
  searchFind?: (searchVal: string) => void;
  className?: string;
  placeholder?: string;
  showSearchIcon?: boolean;
}
interface IState {
  searchValue: string;
}

let searchTimeOut: any;

export const Search: SFC<IProps> = ({
  className,
  placeholder,
  searchFind,
  showSearchIcon,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const updateValue = (e: any): void => {
    let searchTerm = e.target.value;
    e.preventDefault();
    setSearchValue(e.target.value);

    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => {
      if (searchFind) {
        searchFind(searchTerm);
      }
    }, 400);
  };

  return (
    <SearchWrapper className={className}>
      <Icon className={'search_icon'} icon={bxSearch} />
      <input
        placeholder={placeholder ? placeholder : 'Search'}
        value={searchValue}
        autoComplete="off"
        onChange={updateValue}
      />
    </SearchWrapper>
  );
};
