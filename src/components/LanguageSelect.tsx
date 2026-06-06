import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

import { US, RU } from "country-flag-icons/react/3x2";

const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const LanguageList = [
    { id: 1, code: "en", Flag: US },
    { id: 2, code: "ru", Flag: RU },
  ];

  const current = i18n.language.slice(0, 2);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };



  return (
    <div className="relative inline-block mb-1">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-24 justify-center py-2 rounded-xl  text-title font-liter italic"
      >
        {current.toUpperCase()}
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-lg z-50">
          {LanguageList.map((item) => {
            const Flag = item.Flag;

            return (
              <button
                key={item.id}
                onClick={() => changeLanguage(item.code)}
                className="flex items-center justify-between  w-full px-5 py-2 hover:bg-white/10 transition"
              >
                <span className="font-liter mb-1">
                  {item.code}
                </span>
                <Flag className="w-5 h-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;