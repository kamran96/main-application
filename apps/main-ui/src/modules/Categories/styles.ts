import styled from "styled-components";
import convertToRem from "../../utils/convertToRem";

export const WrapperCategoriesContainer = styled.div`

.edit{
      display: flex;
      a{
        margin : 0 ${convertToRem(10)}
      }
    }
`;

export const CategoriesContainerWrapper = styled.div`
  position: relative;
  .CategoriesMainContainer {
    padding: 18px 1px;
    width: 100%;
    overflow-x: auto;
    margin: 10px 0;
  }

  .Category_List {
    display: flex;
  }
  *::-webkit-scrollbar,
  table tbody::-webkit-scrollbar {
    height: 7px;
  }
`;

export const CategoriesWrapper = styled.div`
  display: flex;
  align-items: end;
  flex-direction: column;
  *::-webkit-scrollbar-track,
  table tbody::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0;
    background-color: #ffff;
    border-radius: 10px;
  }
`;

export const ParentCategoriesWrapper = styled.div`
  width: 250px;
  background: #ffffff;
  padding-top: 16px;
  text-align: center;
  border-radius: 5px;
  margin: 0 18px 0 0;
  box-shadow: 0px 2px 6px -2px #c5c5c5;

  .add_new_category_container {
    border-top: 1px solid #ececec;
    padding: 10px 0px;
  }
  .add_new_category {
    color: #30c2ff;
    font-size: 14px;
    padding: 12px 0;
    border-top: 1px solid #efefef;
  }

  .Category_List_Array {
    min-height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 380px;
  }

  .category_flex_wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 0 0;
  }
`;
