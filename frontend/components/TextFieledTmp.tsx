import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookies } from "../components/auth";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const labelMappings = {
  "nom_complet": "full_name",
  "nom_d'utilisateur": "username",
  "ville": "city",
  "e-mail": "email",
  "téléphone": "phone_number",
  "phone": "phone_number",
  "adresse": "address",
  "nombre_completo": "full_name",
  "nombre_de usuario": "username",
  "ciudad": "city",
  "correo_electrónico": "email",
  "teléfono": "phone_number",
  "dirección": "address"
};

function TextFieldTmp({ title, label1, label2, label3, type, values, setValues }) {

  const { t } = useTranslation();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e, field) => {
    setValues(prevValues => ({
      ...prevValues,
      [field]: e.target.value,
    }));
  };

  const getCsrfToken = async () => {
    const cookies = await getCookies();
    return cookies.cookies.csrftoken;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = await getCsrfToken();
      const response = await axios.put(`${API}/update/`, values, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success(t('Information Updated Successfully'));
      } else {
        toast.error(t('An Error Occurred'));
      }
    } catch (error) {
      toast.error(t('An Error Occurred'));
    }
  };

  const renderInputFields = (labels) => {
    return labels.map((label) => {
      const fieldKey = labelMappings[t(label.toLowerCase().replace(" ", "_"))] || label.toLowerCase().replace(" ", "_");
      return (
        <div key={label} className="flex flex-col items-start w-full pl-5">
          <h1 className="text-white w-full opacity-70 laptop:text-[22px]
              tablet:text-[18px] text-[20px] text-start">
            {label}
          </h1>
          <input
            type={type}
            value={values[fieldKey] || ""}
            onChange={(e) => handleChange(e, fieldKey)}
            disabled={fieldKey === "email" || fieldKey === "username"}
            className={`w-[90%] laptop:h-[70px] rounded-[50px] mt-2 bg-white bg-opacity-10 text-white p-4 border-[0.5px] border-gray-500
                focus:outline-none h-[50px] mb-3 tablet:w-[95%] 
              ${fieldKey === "email" || fieldKey === "username" ? "opacity-50" : "opacity-100"}`}
          />
        </div>
      );
    });
  };

  return (
    <div className="bg-[#1A1F26] bg-opacity-50 laptop:h-[90%] min-h-[600px] laptop:w-[691px] border-[0.5px]
       border-white border-opacity-40 rounded-[50px] flex flex-col my-5 mb-10 w-[90%] tablet:h-[500px] tablet:my-5 laptop:mx-3">
      <h1 className="laptop:text-[25px] flex w-full h-[150px] items-center justify-center text-white opacity-50 tablet:text-[20px] text-[20px] mt-2">{title}</h1>

      <div>{renderInputFields([label1, label2, label3])}</div>

      <div className="flex  justify-center w-full mb-10">
        <button onClick={handleSubmit} className="rounded-[50px] border-[0.5px] border-white border-opacity-40
          desktop:h-[80px] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70  w-[85%] mb-3 laptop:h-[60px]
          tablet:h-[50px] h-[50px] tablet:w-[90%]">
          <h1 className="text-[22px] text-center">Submit</h1>
        </button>
      </div>
    </div>
  );
}

export default TextFieldTmp;
