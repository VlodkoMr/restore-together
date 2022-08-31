import React from "react";
import twitterIcon from '../assets/images/twitter.png';
import discordIcon from '../assets/images/discord.png';
import telegramIcon from '../assets/images/telegram.png';

export const Footer = () => {

  return (
    <footer className="fixed bottom-0 right-0 left-0">
      <div className={`max-w-[1500px] mx-auto px-6 container flex flex-row justify-between py-4`}
      >
        <div className="w-1/2 text-sm pt-4">
          © MADE BY <a href="https://atomic-lab.io/" target="_blank" className="font-semibold">ATOMIC-LAB.IO</a>
        </div>

        <div className="text-right w-1/2">
          <a href="https://twitter.com/Ukraine_restore" target="_blank" className="inline-block">
            <img src={twitterIcon} alt="" className="w-8 h-8 opacity-90" />
          </a>
          <a href="" target="_blank" className="ml-2 inline-block">
            <img src={telegramIcon} alt="" className="w-8 h-8 opacity-90" />
          </a>
          <a href="https://discord.gg/WhCMVPbEyZ" target="_blank" className="ml-2 inline-block">
            <img src={discordIcon} alt="" className="w-8 h-8 opacity-90" />
          </a>
        </div>
      </div>
    </footer>

  );
};
