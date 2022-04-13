import { PDFDownloadLink } from '@react-pdf/renderer';
import { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { PDFICON } from '../Icons';

interface IProps {
  document: ReactElement<any>;
}
export const PDFDownloader: FC<IProps> = ({ document }) => {
  return (
    <PDFDownloadLinkWrapper document={<>doc</>}>
      <div className="flex alignCenter">
        <PDFICON className="flex alignCenter mr-5" />

        <span> Download PDF</span>
      </div>
    </PDFDownloadLinkWrapper>
  );
};

export default PDFDownloadLink;
const PDFDownloadLinkWrapper = styled(PDFDownloadLink)`
  background: #e4e4e4;
  padding: 5px 5px;
  border-radius: 2px;
  margin-right: 8px;
  color: #333333;
  border: none;
  outline: none;
  transition: 0.4s all ease-in-out;
  &:hover {
    background: #143c69;
    color: #ffff;
  }
`;
