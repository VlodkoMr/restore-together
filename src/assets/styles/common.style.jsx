import styled from "styled-components";
import { Link as ReactLink, NavLink as ReactNavLink } from "react-router-dom";

export const Wrapper = styled.section.attrs({
  className: `
  relative
  h-screen
  z-1`
})``;

export const Container = styled.section.attrs((props) => ({
  className: `
  mx-auto
  px-6
  ${props.width === "full" ? "" : "container"}`
}))``;

export const Link = styled(ReactLink).attrs(() => ({
  className: `
    text-current
    transition
    ease-in-out
    duration-200
    `,
}))``;

export const NavLink = styled(ReactNavLink).attrs((props) => ({
  className: `
    mx-4
    px-1
    py-3
    font-medium
    transition
    ease-in-out
    duration-200
    hover:text-main/90
    cursor-pointer`,
}))``;

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

export const FormLabel = styled.div.attrs({
  className: `
    block
    text-base
    mb-1
    font-medium
    `,
})``;

export const FormInput = styled.input.attrs({
  className: `
    border py-1.5 px-2 w-full
    `,
})``;

export const FormTextarea = styled.textarea.attrs({
  className: `
    border p-2 w-full mb-1 h-20
    `,
})``;
