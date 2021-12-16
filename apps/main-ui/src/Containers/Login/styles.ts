import styled from 'styled-components';
import convertToRem from '../../utils/convertToRem';
import bg from '../../assets/bgLogin.png';

export const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  @media (min-width: 1366px) {
    .illustration {
      padding-left: 125px !important;
    }
  }
  .illustration {
    grid-column: 6 span;
    padding: 44px 60px;
    background: #0071ff;
    height: 100vh;
    width: 100%;
    background-image: url(${bg});
    background-repeat: no-repeat;
    background-position: bottom right;
    .invyce_logo {
      padding-bottom: 41px;
      img {
        width: 117px;
      }
    }
    .ant-modal-body {
      height: 247px;
      width: 328px;
      .modal-body {
        width: 328px;
        height : 247px;
      }
    }
    .slogan {
      font-style: normal;
      font-weight: 500;
      font-size: 34px;
      line-height: 51px;
      display: flex;
      align-items: center;
      letter-spacing: 0.01em;
      text-transform: capitalize;

      color: #ffffff;
    }
    .illustration_image {
      text-align: center;
      img {
        max-width: 85%;
        height: auto;
      }
    }
  }
  .form {
    grid-column: 6 span;
  }

  ._no_account_text {
    color: #4a4a4a;
  }

  .no-account-action {
    text-align: center;
    .signuplink {
      color: #4c9fff;
      font-size: ${convertToRem(14)};
      font-weight: 600;
      padding: 0 ${convertToRem(1)};
    }
  }
`;
