import React from "react";
import twitterIcon from '../assets/images/twitter.png';
import discordIcon from '../assets/images/discord.png';
import telegramIcon from '../assets/images/telegram.png';

export const Footer = () => {

  return (
    <footer className="fixed bottom-0 right-0 left-0 border-t-2 border-gray-500 bg-gray-700">
      <div className={`max-w-[1500px] mx-auto px-6 container flex flex-row justify-between pt-4 h-16`}
      >
        <div className="w-1/3 text-sm leading-8 text-gray-300">
          © MADE BY <a href="https://atomic-lab.io/"
                       target="_blank"
                       className="font-semibold"
        >ATOMIC-LAB.IO</a>
        </div>

        <div className="w-1/3 text-sm text-center leading-8 text-gray-300">
          Supported by <a href="https://near.org/" target="_blank" className="border-b border-gray-500">NEAR.UA</a>
          <span className="mx-2 opacity-30">|</span>
          Winner of <a
          href="https://medium.com/the-crowdpolicy-collection-en/these-are-the-finalists-of-coding-challenge-4-ukraine-9ca3c9b64aaf"
          target="_blank"
          className="border-b border-gray-500"
        >
          Coding Challenge for Ukraine
        </a>
        </div>

        <div className="text-right w-1/3">
          <a href="https://twitter.com/Ukraine_restore" target="_blank" className="inline-block">
            <img src={twitterIcon} alt="" className="w-8 h-8 opacity-90" />
          </a>
          {/*<a href="" target="_blank" className="ml-2 inline-block">*/}
          {/*  <img src={telegramIcon} alt="" className="w-8 h-8 opacity-90" />*/}
          {/*</a>*/}
          <a href="https://discord.gg/WhCMVPbEyZ" target="_blank" className="ml-2 inline-block">
            <img src={discordIcon} alt="" className="w-8 h-8 opacity-90" />
          </a>
        </div>
      </div>
    </footer>

  );
};
