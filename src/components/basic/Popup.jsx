import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";

export function Popup({ title, children, popupVisible, setPopupVisible, width }) {
  const cancelButtonRef = useRef(null);
  if (!width) {
    width = 'sm:w-[740px]';
  }

  return (
    <Transition.Root show={popupVisible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-40 inset-0 overflow-y-auto bg-black/75"
        initialFocus={cancelButtonRef}
        onClose={() => setPopupVisible(false)}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-opacity-80 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`inline-block align-bottom bg-white 
              rounded-xl overflow-hidden shadow-xl sm:px-10 px-5 pt-7 pb-10 
              transform transition-all sm:align-middle 
              w-full ${width}`}
            >
              <XIcon
                className="h-8 w-8 absolute right-5 top-6 hover:opacity-70 opacity-90 cursor-pointer transition duration-200"
                onClick={() => setPopupVisible(false)}
              />
              <Dialog.Title
                as="h3"
                className="sm:text-2xl text-xl uppercase leading-6 text-gray-600 font-bold pb-8 px-7"
              >
                {title}
              </Dialog.Title>

              {children}

            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
