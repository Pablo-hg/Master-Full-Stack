/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export const ModalLogin = ({ message }) => {
  useEffect(() => {
    if (message) {
      // Simula un clic en el botón oculto para abrir el modal
      const btn = document.getElementById("btnmodalError");
      if (btn) btn.click();
    }
  }, [message]);

  return (
    <div>
      <button
        className="btn hidden"
        id="btnmodalError"
        onClick={() => document.getElementById("modalError").showModal()}
      />
      <dialog id="modalError" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="modal-action mt-0">
            <form method="dialog">
              {/* El botón dentro del formulario cerrará el modal */}
              <button>
                <IoClose className="w-6 h-auto" />
              </button>
            </form>
          </div>
          <p className="py-4 text-center">{message}</p>
        </div>
      </dialog>
    </div>
  );
};
