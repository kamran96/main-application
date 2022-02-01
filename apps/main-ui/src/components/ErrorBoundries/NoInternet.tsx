import { Button, Card } from 'antd';
import styled from 'styled-components';
import { NoInternetIllustration } from '../../assets/icons';
export const NoInternet = () => {
  return (
    <Wrapper className="flex alignCenter justifyCenter">
      <div className="illustration flex alignCenter justifyCenter">
        <NoInternetIllustration />
      </div>
      <div className="text textCenter">
        <h4 className="mt-10">No Internet Connection</h4>
        <p>
          Please check your internet connection
          <br />
          and try again
        </p>
      </div>
      {/* <div className="flex alignCenter justifyCenter">
        <Button type="primary" size="middle">
          Try Again
        </Button>
      </div> */}
    </Wrapper>
  );
};

const Wrapper = styled(Card)`
  height: calc(100vh - 76px);
  flex-direction: column;

  .text {
    h4 {
      font-style: normal;
      font-weight: 500;
      font-size: 18.53px;
      line-height: 22px;
      /* identical to box height */

      letter-spacing: 0.04em;
      text-transform: capitalize;

      /* text label */

      color: #3e3e3c;
    }
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 25px;
      /* identical to box height */

      text-align: center;
      letter-spacing: 0.04em;

      color: rgba(62, 62, 60, 0.7);
    }
  }
`;
