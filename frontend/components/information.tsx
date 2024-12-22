import React, { useState, useEffect, useContext } from "react";
import TextFieledTmp from "./TextFieledTmp";
import { UserContext } from "./context/usercontext";
import { useTranslation } from 'react-i18next';
import { usePathname } from "next/navigation";

export default function Information() {
  const { authUser, loading, fetchAuthUser} = useContext(UserContext);
  const { t } = useTranslation();
  const pathname = usePathname();

  const [personalInfo, setPersonalInfo] = useState({
    full_name: authUser?.full_name || "",
    username: authUser?.username || "",
    city: authUser?.city || "",
  });

  const [contactInfo, setContactInfo] = useState({
    email: authUser?.email || "",
    phone_number: authUser?.phone_number || "",
    address: authUser?.address || "",
  });

  useEffect(() => {
    authUser && fetchAuthUser();
    if (authUser) {
      setPersonalInfo({
        full_name: authUser.full_name,
        username: authUser.username,
        city: authUser.city,
      });
      setContactInfo({
        email: authUser.email,
        phone_number: authUser.phone_number,
        address: authUser.address,
      });
    }
  }, [pathname]);

  if (loading || !authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-white w-full h-full flex items-center laptop:justify-evenly
      flex-col laptop:flex-row tablet:flex-col overflow-y-auto no-scrollbar">

      <TextFieledTmp
        title={t("Personal Information")}
        label1={t("Full Name")}
        label2={t("Username")}
        label3={t("City")}
        type="text"
        values={personalInfo}
        setValues={setPersonalInfo}
      />

      <TextFieledTmp
        title={t("Contact")}
        label1={t("Email")}
        label2={t("Phone")}
        label3={t("Address")}
        type="text"
        values={contactInfo}
        setValues={setContactInfo}
      />
    </div>
  );
}
