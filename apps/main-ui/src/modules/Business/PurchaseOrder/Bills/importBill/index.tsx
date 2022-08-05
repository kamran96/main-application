import React, { FC } from 'react'
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import { ButtonTag } from '../../../../../components/ButtonTags'


export const ImportBill:FC = (props) => {
    const {setBills} = useGlobalContext();
  return (
    <ButtonTag
        onClick={() => {
            setBills(true, 'bills');
        }}
      className="mr-10"
      title='Import'
     size='middle'
    />
   )
 }
