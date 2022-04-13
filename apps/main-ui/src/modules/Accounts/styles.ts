import { Button as AntDButton } from 'antd';
import Styled from 'styled-components';

import convertToRem from '../../utils/convertToRem';

export default Styled.div`
    /* background-color: #fff; */

button{
    display: flex;
    align-items: center;
}
    .icon-left {
        display: inline-flex;
        margin-right: 6px;
    }
    .icon-right {
        margin-left: 6px;
    }
`;

export const Header = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Button = Styled(AntDButton)`
    height: ${convertToRem(32)};
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: ${convertToRem(13)};
    line-height: 134%;
    letter-spacing: 0.02em;
    color: #4F4F4F;
    padding: 8px 14px ;
    background: #F8F8F8;
    border-radius: 4px;
    border: none;
    outline: none;
        display: flex;
        align-items: center;
    .icon-left {
        display: inline-flex;
        margin-right: 6px;
    }
    .icon-right {
        margin-left: 6px;
    }
`;
