import { Table, Select } from "antd";
import React, { FC, useState } from "react";
import { EditableSelect } from "../../components/Editable";
import { PurchasesView } from "../../components/PurchasesView/newIndex";

import { Heading } from "../../components/Heading";
import { DatePicker } from "../../components/DatePicker";
import dayjs from "dayjs";

export const TestComponents: FC = () => {

  const [state, setState] = useState(null);

  console.log(dayjs(state).format('LLL'), "value")

  return <>
 test 
  
  </>;
};
