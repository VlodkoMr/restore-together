import styled from "styled-components";
import { Link as ReactLink, NavLink as ReactNavLink } from "react-router-dom";

export const Wrapper = styled.section.attrs({
  className: `
  relative
  mb-auto`,
})``;

export const Link = styled(ReactLink).attrs(() => ({
  className: `
    text-current
    transition
    ease-in-out
    duration-200
    `,
}))``;

export const NavLink = styled(ReactNavLink).attrs({
  className: `
    px-2.5
    py-2.5
    lg:px-4
    md:ml-0.5
    xl:ml-1
    font-semibold
    transition
    ease-in-out
    duration-200
    rounded-xl
    uppercase
    hover:text-orange-400
    cursor-pointer`,
})``;

export const Btn = styled.button`
`;

export const Row = styled.div.attrs({
  className: `
    flex
    flex-row
    items-center`,
})``;

export const Col = styled.div.attrs({
  className: `
    flex
    flex-col`,
})``;
