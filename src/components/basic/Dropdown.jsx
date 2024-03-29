import React from "react";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

export default function Dropdown({ title, options, selected, border, onSelect, isSmall }) {

  const getTitle = () => {
    let titleStr = title;
    options.map(item => {
      if (item.id === selected) {
        titleStr = item.title;
      }
    });
    return titleStr;
  }

  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <Menu.Button
        className={`flex items-center justify-between pr-4 text-gray-700 max-w-full hover:bg-gray-50 
        ${isSmall ? "w-full min-w-[100px]" : "w-full md:w-[140px] xl:w-[200px]"}  
        ${border ? "border w-[220px]" : "border-0 md:p-0 md:w-auto"}
        md:hover:bg-transparent md:hover:text-main`}>
        {getTitle()}
        <ChevronDownIcon className={`-mr-1 ml-2 h-5 w-5`} aria-hidden="true"/>
      </Menu.Button>

      <Menu.Items
        className={`origin-top-right absolute w-52 z-40 rounded-md bg-white shadow-lg bg-white ${border ? "" : "left-[-16px]"}`}>
        <div className="py-2 max-h-64 overflow-x-hidden overflow-y-scroll">
          {options?.map((option, index) => (
            <Menu.Item key={index}>
              <div
                className={`text-black hover:bg-main hover:text-white transition ${
                  selected === option.id && "bg-main"
                }`}
              >
                <button
                  className={`text-left px-4 py-2 block w-full ${
                    selected === option.id && "text-white"
                  }`}
                  onClick={() => {
                    onSelect(option.id);
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
