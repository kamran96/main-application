import React, { FC } from 'react';
import { ButtonTag } from '../../../components/ButtonTags';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';

const ItemsImport = () => {
  const { setItemsImportconfig, itemsImportconfig } = useGlobalContext();

  console.log(itemsImportconfig, "itemImports");
  
  return (
    <ButtonTag
      onClick={() => {
        setItemsImportconfig(true, 'items');
      }}
      className="mr-10"
      title="Import"
      size="middle"
    />
  );
};

export default ItemsImport;
