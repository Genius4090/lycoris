import { useTranslation } from "react-i18next";

const LanguageSelect = () => {
  const { i18n } = useTranslation();

  const languageList = [
    { id: 1, code: "en" },
    { id: 2, code: "ru" },
  ];

  const current = i18n.language.slice(0, 2);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="flex items-center gap-1.5">
      {languageList.map((item, i) => (
        <button
          key={item.id}
          onClick={() => changeLanguage(item.code)}
          className={`font-sora text-[11px] tracking-wide cursor-pointer transition-colors duration-200 ${
            current === item.code
              ? "text-white font-semibold underline underline-offset-2"
              : "text-white/45 font-light hover:text-white/70"
          }${i > 0 ? " ml-0.5" : ""}`}
        >
          {item.code}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelect;