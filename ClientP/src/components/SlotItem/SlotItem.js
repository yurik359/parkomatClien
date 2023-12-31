import "./slotItem.css";
import icoPark from "../../services/img/Rectangle28.png";
import { useDispatch, useSelector } from "react-redux";
import { addIndexParkomat, changeClickedParkomat } from "./slotItemSlice";

import { useState } from "react";
const SlotItem = ({
  slotInfo: { nameOfslot, location, payment, formPic, notes, uid },
  index,
}) => {
  const dispatch = useDispatch();
  const { indexOfParkomat, clickedParkomat } = useSelector(
    (state) => state.slotItemSlice
  );
  // const [clickedParkomat,setClickedParkomat] = useState(false)
  const selectParkomatItem = () => {
    if (clickedParkomat == true && indexOfParkomat == uid) {
      dispatch(addIndexParkomat(null));
      dispatch(changeClickedParkomat(false));
    } else {
      dispatch(changeClickedParkomat(true));
      dispatch(addIndexParkomat(uid));
    }
  };
  return (
    <div
      className="slot-item"
      onClick={selectParkomatItem}
      style={{
        background:
          indexOfParkomat == uid && clickedParkomat ? "#a3caf1" : null,
      }}
    >
      <img src={formPic} alt="" />
      <div className="name-payment">
        <div className="slot__name">{nameOfslot}</div>
        <div className="slot__payment">{payment}</div>
      </div>
      <div className="slot-item__location">{location?.address}</div>
      <div className="slot-item__line"></div>
      <div className="slot-item__description">{notes}</div>
    </div>
  );
};

export default SlotItem;
