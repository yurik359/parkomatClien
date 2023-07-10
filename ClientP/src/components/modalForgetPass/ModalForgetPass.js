import { useState, useEffect } from "react";
import "./modalForgetPass.css";
import { useHandlePOST } from "../../services/requests";
import { useSelector, useDispatch } from "react-redux";
import { setForgotPassword } from "../Pages/login/loginSlice";

const ModalForgetPass = () => {
  const dispatch = useDispatch();
  const handlePOST = useHandlePOST();
  const [emailRecover, setEmailRecover] = useState("");
  const { forgotPassword } = useSelector((state) => state.loginSlice);
  const [resServer, setResServer] = useState(null);

  const handleClickOutside = (e) => {
    if (
      e.target.classList.contains("background-forget") &&
      !e.target.classList.contains("modal-forget")
    ) {
      dispatch(setForgotPassword(false));
      setResServer(null);
    }
  };
  useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);
    // window.addEventListener('keydown', (e)=> {
    //     if (e.key === 'Escape') {
    //         setCloseModal(true);
    //       }})
  }, []);
  const sendEmail = async () => {
    const res = await handlePOST("http://localhost:4001/sendEmail", {
      emailRecover,
    });
    setEmailRecover("");

    if (res && res.message) {
      setResServer(res.message);
    }
  };

  return (
    <div
      className="background__modal add-parkomat background-forget"
      style={{ display: forgotPassword ? "flex" : "none" }}
    >
      <div className="modal modal-forget">
        <span>Enter your email</span>
        <span style={{ display: resServer ? "inline-block" : "none" }}>
          {resServer}
        </span>
        <input
          type="email"
          value={emailRecover}
          onChange={(e) => setEmailRecover(e.target.value)}
          placeholder="Email"
        />
        <div className="modal__send-btn" onClick={sendEmail}>
          send
        </div>
      </div>
    </div>
  );
};

export default ModalForgetPass;
