import React from "react";
import { useTranslation } from "react-i18next";
// import "./Platform.css";

const Platform = () => {
    const { t } = useTranslation();
    const duration = "1";
    return (
        <>
              <div className="flex">
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0s" }}
                        >
                            {t('S')}
                        </span>
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0.1s" }}
                        >
                            {t('E')}
                        </span>
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0.2s" }}
                        >
                            {t('A')}
                        </span>
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0.3s" }}
                        >
                            {t('R')}
                        </span>
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0.4s" }}
                        >
                            {t('C')}
                        </span>
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0.5s" }}
                        >
                            {t('H')}
                        </span>
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0.6s" }}
                        >
                            {t('I')}
                        </span>
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0.7s" }}
                        >
                            {t('N')}
                        </span>
                        <span
                            className="searcg_anim lg:text-[6rem] xs:text-[2rem] font-Bruno"
                            style={{ animationDelay: "0.8s" }}
                        >
                            {t('G')}
                        </span>
                        </div>


        </>
    );
};

export default Platform;