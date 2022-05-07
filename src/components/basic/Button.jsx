import React from "react";
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Btn, Row } from '../../assets/styles/common.style';

export const Button = ({
  title,
  onClick,
  size,
  noIcon,
  disabled,
  secondary,
  className,
  readonly
}) => {
  const sizeMapping = {
    xs: "text-sm lg:px-4 px-3 lg:py-2 py-1",
    sm: "text-sm lg:px-4 px-3 lg:py-3 py-2.5",
    md: "text-base lg:px-5 px-4 lg:py-2 py-1.5",
  };

  const iconMapping = {
    xs: "lg:h-4 h-3",
    sm: "lg:h-4 h-3",
    md: "lg:h-5 h-4",
  };

  return (
    <>
      <Btn
        className={`border-2 rounded-lg font-semibold uppercase text-white group transition ease-in-out duration-200 ${
          disabled && "grayscale cursor-default opacity-40"
        } 
        ${
          readonly && "grayscale opacity-70"
        }
         ${
          secondary
            ? "border-red-500 hover:text-red-400 hover:border-red-600"
            : "border-transparent bg-red-500 hover:bg-red-600"
        } ${className}`}
        onClick={() => {
          if (!disabled && onClick) {
            onClick();
          }
        }}
      >
        <Row
          className={`justify-center whitespace-nowrap ${
            sizeMapping[size ?? "md"]
          } `}
        >
          {title}
          {!noIcon && (
            <ArrowRightIcon className={`ml-2 ${iconMapping[size ?? "md"]}`} />
          )}
        </Row>
      </Btn>
    </>
  );
};
