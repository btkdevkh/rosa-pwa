import { toast } from "react-toastify";

const toastSuccess = (msg: string, msgID: string) => {
  return toast.success(msg, {
    toastId: msgID,
    position: "bottom-center",
    hideProgressBar: true,
    style: {
      borderLeft: "0.3rem solid #4A8D4E",
    },
  });
};

export default toastSuccess;
