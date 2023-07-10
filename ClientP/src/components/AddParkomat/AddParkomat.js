import "./addParkomat.css";
import { useState, useEffect } from "react";
import { useHandlePOST, handleGET } from "../../services/requests";
import { useSelector, useDispatch } from "react-redux";
import {
  changeNameOfslotValue,
  changeLocationValue,
  changePaymentValue,
  changePicValue,
  changeNotesValue,
  setDeleteIco,
  changeCoordinate,
} from "./addParkomatSlice";
import { updateParkomat } from "../Slots/slotsSlice";
import Map from "../map/map";
import deleteIco from "../../services/img/DeleteButton.png";
import { v4 as uuidv4 } from "uuid";
const AddParkomat = ({ closeModal, setCloseModal, addOneMoreParkomat }) => {
  const uniqueId = uuidv4();
  const handlePOST = useHandlePOST();
  const [addressSuggestion, setAddressSuggestion] = useState(null);
  const [checkedAddress, setCheckedAddress] = useState({
    lat: 50.456561,
    lon: 30.501512,
  });
  const [closeAddressesList, setCloseAddressesList] = useState(false);
  const [onFocusInput, setOnFocusInput] = useState(false);
  const { typeOfmodal } = useSelector((state) => state.slotsSlice);
  const { formValues, deleteIcon } = useSelector(
    (state) => state.addParkomatSlice
  );
  const { indexOfParkomat } = useSelector((state) => state.slotItemSlice);
  const { accessToken } = useSelector((state) => state.mainSlice);
  const dispatch = useDispatch();
  const url = `http://localhost:4001/${
    typeOfmodal == "update" ? "updateParkomat" : "addParkomat"
  }`;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setSelectedImage(reader.result)
        dispatch(changePicValue(reader.result));
        dispatch(setDeleteIco(true));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeoCode = async () => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      `${formValues.locationValue.address}`
    )}&format=json`;

    const adressSuggesti = await handleGET(url);

    if (adressSuggesti.length > 0) {
      setAddressSuggestion(adressSuggesti);
      // const latitude = adressSuggesti[0].lat;
      // const longitude = adressSuggesti[0].lon;
      // console.log("Coordinate:", latitude, longitude);
    } else {
      console.log("Address not found");
    }
  };

  useEffect(() => {
    if (onFocusInput) {
      setCloseAddressesList(false);
      handleGeoCode();
    }
  }, [formValues.locationValue.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameOfslot = formValues.nameOfslotValue;
    const location = {
      address: formValues.locationValue.address,
      coordinate: formValues.locationValue.coordinate,
    };
    const payment = formValues.paymentValue;

    const formPic = formValues.picValue;

    const notes = formValues.notesValue;

    // const accessToken= localStorage.getItem('accessToken');

    const { lastObject } = await handlePOST(url, {
      nameOfslot,
      location,
      payment,
      formPic,
      notes,
      accessToken,
      uniqueId,
    });

    addOneMoreParkomat(lastObject);

    setCloseModal(true);
  };

  const handleEditParkomat = async (e) => {
    e.preventDefault();

    const { updatedParkomat } = await handlePOST(url, {
      formValues,
      accessToken,
      indexOfParkomat,
    });

    dispatch(updateParkomat({ indexOfParkomat, updatedParkomat }));
    setCloseModal(true);
  };

  const handleClickOutside = (e) => {
    if (
      e.target.classList.contains("add-parkomat") &&
      !e.target.classList.contains("add-parkomat__form")
    ) {
      setCloseModal(true);
    }
  };

  useEffect(() => {
    // document.body.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setCloseModal(true);
      }
    });
  }, []);

  const handleGetCoordinate = (e) => {
    dispatch(changeLocationValue(e.display_name));
    dispatch(changeCoordinate({ lat: e.lat, lon: e.lon }));
    // setCheckedAddress({lat:e.lat,lon:e.lon})
    setCloseAddressesList(true);
  };

  const handleDeleteIcon = () => {
    dispatch(setDeleteIco(false));
    dispatch(changePicValue(null));
  };
  return (
    <div
      className="add-parkomat parkomat-modal"
      style={{ display: closeModal ? "none" : "flex" }}
    >
      <form
        className="add-parkomat__form"
        onSubmit={typeOfmodal == "update" ? handleEditParkomat : handleSubmit}
      >
        <div
          className="add-parkomat__close"
          onClick={() => setCloseModal(true)}
        >
          Close
        </div>
        <div className="add-parkomat__title">Add New</div>
        <input
          className="add-parkomat__name-input"
          value={formValues.nameOfslotValue}
          onChange={(e) => dispatch(changeNameOfslotValue(e.target.value))}
          type="text"
          required
          placeholder="name of the slots"
        />
        <div className="add-parkoma__location-section">
          <input
            type="text"
            value={formValues.locationValue.address}
            onFocus={() => setOnFocusInput(true)}
            onBlur={() => setOnFocusInput(false)}
            placeholder="location"
            required
            onChange={(e) => dispatch(changeLocationValue(e.target.value))}
          />
          <div
            className="add-parkomat__address-list"
            style={{ display: closeAddressesList ? "none" : "block" }}
          >
            {addressSuggestion &&
              addressSuggestion.map((e, i) => {
                return (
                  <div
                    key={i}
                    className="add-parkomat__list-item"
                    onClick={() => handleGetCoordinate(e)}
                  >
                    {e.display_name}
                  </div>
                );
              })}
          </div>
          <Map checkedAddress={checkedAddress} />
        </div>
        <select
          value={formValues.paymentValue}
          onChange={(e) => dispatch(changePaymentValue(e.target.value))}
        >
          <option value="google pay">google pay</option>
          <option value="privat24">privat 24</option>
          <option value="card">card</option>
        </select>
        <label class="file-upload">
          <input type="file" class="file-input" onChange={handleImageChange} />
          <span class="file-label">Upload File</span>
        </label>
        <div
          className="add-parkomat__ico"
          style={{ display: deleteIcon ? "block" : "none" }}
        >
          <img
            src={formValues.picValue}
            alt=""
            style={{ width: "120px", height: "70px" }}
          />
          <img src={deleteIco} alt="" onClick={handleDeleteIcon} />
        </div>

        <textarea
          value={formValues.notesValue}
          onChange={(e) => dispatch(changeNotesValue(e.target.value))}
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="notes"
        ></textarea>
        <button> {typeOfmodal}</button>
      </form>

      <div></div>
    </div>
  );
};

export default AddParkomat;
