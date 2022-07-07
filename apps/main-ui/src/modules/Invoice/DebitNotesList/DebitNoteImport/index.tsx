import { ButtonTag } from '../../../../components/ButtonTags'
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext'
import React, { FC } from 'react'



export const DebitNoteImport:FC = (props) => {
    const {setDebitNote} = useGlobalContext();
  return (
    <ButtonTag 
     onClick={() => {
        setDebitNote(true, 'debitNotes');
     }}
     className="mr-10"
     title='Import'
     size='middle'
    />
   )
 }
