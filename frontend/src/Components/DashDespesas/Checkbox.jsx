import React from "react";

export const CheckBox = props => {
  // {props.doSomething(props.isChecked)}
  return (
    <li className="d-flex mx-auto dropdown-item ">
      <input
        className="mx=auto my-auto"
        // key="split"
        id={props.name}
        // onClick={props.handleCheckChieldElement}
        type="checkbox"
        checked={props.isChecked}
        name="divideBy"
        value={props.name}
        onChange={props.handleCheckChieldElement}
        />
      <label
        className="dropdown-item mx-0 my-0 bg-transparent"
        for={props.name}
      >
        {props.name}
      </label>
    </li>
  );
};

export default CheckBox;
