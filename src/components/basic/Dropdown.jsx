import React from "react";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

export default function Dropdown({ title, options, selected, onClick }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={`flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-700 border-b border-gray-100 hover:bg-gray-50 
        md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto`}>
        <>{selected ? selected : title}</>
        <ChevronDownIcon className={`-mr-1 ml-2 h-5 w-5`} aria-hidden="true" />
      </Menu.Button>

      <Menu.Items className="origin-top-right absolute left-[-16px] w-48 rounded-md bg-white shadow-lg bg-orange-600">
        <div className="py-2 max-h-64 overflow-x-hidden overflow-y-scroll">
          {options?.map((option, index) => (
            <Menu.Item key={index}>
              <div
                className={`text-black hover:bg-purple-800 hover:text-white transition ${
                  selected === option.id && "bg-purple-700"
                }`}
              >
                <button
                  className={`font-semibold text-left px-4 py-2 block w-full ${
                    selected === option.id && "text-white"
                  }`}
                  onClick={() => {
                    onClick(option.id);
                    selected = option.id;
                  }}
                >
                  {option.title}
                </button>
              </div>
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
