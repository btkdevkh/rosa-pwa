import { toast } from "react-toastify";

const toastError = (msg: string, msgID: string) => {
  return toast.error(msg, {
    toastId: msgID,
    position: "bottom-center",
    hideProgressBar: true,
    style: {
      borderLeft: "0.3rem solid #CC2936",
    },
  });
};

export default toastError;
