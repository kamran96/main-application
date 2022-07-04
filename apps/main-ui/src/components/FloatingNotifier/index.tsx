import { FC, useState, ReactNode } from 'react';
import styled from 'styled-components';
import bellIcon from '@iconify/icons-fe/bell';
import { Icon } from '@iconify/react';
import { DivProps } from '../../modal';
import Clickoutside from '../Clickoutside';

interface Config {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface IProps {
  message: string | ReactNode;
  config?: Config;
}

export const FloatingNotifier: FC<IProps> = ({
  message,
  config = {
    top: 40,
    right: 17,
  },
}) => {
  const [visible, setVisible] = useState(false);

  const positionConfig = `
    top: ${config?.top}px;
    right: ${config?.right}px;
    left: ${config?.left}px;
    bottom: ${config?.bottom}px;
  `;

  return (
    <Clickoutside
      initialVal={visible}
      onClickOutSide={() => setVisible(false)}
      // notEffectingClass={`rendered-text`}
      timeout={100}
    >
      <Wrapper
        className="notifier"
        onClick={() => {
          setVisible(true);
        }}
        visible={visible}
        positionConfig={positionConfig}
      >
        <i>
          {' '}
          <Icon icon={bellIcon} width="22" height="22" />
        </i>
        <span className="label">{message}</span>
      </Wrapper>
    </Clickoutside>
  );
};

interface IWrrapper extends DivProps {
  visible: boolean;
  positionConfig: string;
}

const Wrapper = styled.span<IWrrapper>`
  background-color: #1e75f1;
  max-width: max-content;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  padding: 2px 2px 2px 2px;
  color: white;
  transition: 0.4s all ease-in-out;
  position: fixed;
  ${(props) =>
    props.positionConfig
      ? `
  ${props.positionConfig}
  `
      : `
  top: 40px;
  right: 17px;
  `}
  i {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
  }
  span.label {
    margin-left: 5px;
    color: white;
    display: ${(props) => (props.visible ? 'block' : 'none')};
    padding-right: 5px;
    transition: 0.4s all ease-in-out;
    /* width: 1px; */
    overflow: hidden;
    /* white-space: nowrap; */
  }
`;
