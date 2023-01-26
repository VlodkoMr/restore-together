import React from "react";
import twitterIcon from '../assets/images/twitter.png';
import discordIcon from '../assets/images/discord.png';
import telegramIcon from '../assets/images/telegram.png';
import { Container } from '../assets/styles/common.style';

export const Footer = ({ color, width }) => {

  return (
    <footer className={`border-t-2 ${color === "dark" ? "bg-gray-50 border-gray-200" : "bg-gray-700 border-gray-500"}`}>
      <Container width={width}
                 className={`flex flex-row justify-between pt-4 h-16`}
      >
        <div className={`xl:w-1/4 w-1/2 text-sm leading-4 md:leading-8 ${color === "dark" ? "text-gray-500/90" : "text-gray-300/80"}`}>
          © MADE BY <a href="https://atomic-lab.io/"
                       target="_blank"
                       className="font-semibold"
        >ATOMIC-LAB.IO</a>
        </div>

        <div
          className={`w-1/2 hidden xl:block text-sm text-center leading-8 ${color === "dark" ? "text-gray-500/90" : "text-gray-300/80"}`}>
          Supported by
          <a href="https://near.org/"
             target="_blank"
             className={`border-b ml-1 ${color === "dark" ? "border-gray-300" : "border-gray-500"}`}>
            NEAR.UA
          </a>

          <span className="mx-2 opacity-30">|</span>

          Winner of
          <a href="https://medium.com/the-crowdpolicy-collection-en/these-are-the-finalists-of-coding-challenge-4-ukraine-9ca3c9b64aaf"
             target="_blank"
             className={`border-b ml-1 ${color === "dark" ? "border-gray-300" : "border-gray-500"}`}
          >
            Coding Challenge for Ukraine
          </a>
        </div>

        <div className="text-right xl:w-1/4 w-1/2">
          <a href="https://twitter.com/Ukraine_restore" target="_blank" className="inline-block opacity-80 hover:opacity-90 transition">
            <img src={twitterIcon} alt="tw" className="w-8 h-8"/>
          </a>
          <a href="https://t.me/restore_together" target="_blank" className="ml-2 inline-block opacity-90 hover:opacity-100 transition">
            <img src={telegramIcon} alt="tg" className="w-8 h-8 opacity-90"/>
          </a>
          <a href="https://discord.gg/WhCMVPbEyZ" target="_blank" className="ml-2 inline-block opacity-80 hover:opacity-90 transition">
            <img src={discordIcon} alt="discord" className="w-8 h-8"/>
          </a>
        </div>
      </Container>
    </footer>

  );
};
