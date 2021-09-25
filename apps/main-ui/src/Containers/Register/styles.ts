import styled from "styled-components";
import bg from "../../assets/bgReg.png";


export const RegisterWrapper = styled.div`
  background: #e5e5e5;
  min-height: 100vh;
  
  .register_grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    width: 100%;
  
   
    
    .illustration {
      grid-column: span 5;
      background: #0071ff;
      height: 100vh;
      padding: 44px 60px;
      background-image: url(${bg});
      background-repeat: no-repeat;
    background-position: bottom right;
    
      .invyce_logo{
        padding-bottom: 41px;
        img{
          width: 117px;
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
        margin-top: 70px;
        text-align: center;

      }
    }
  }
  @media(min-width: 1600px){
     .illustration{
       padding-left:140px !important ;
     } 
    }
  .form {
    grid-column: span 7;
    height: 100vh;
    background-color: #ffffff;
  }
`;
