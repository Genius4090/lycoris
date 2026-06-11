import { Social1, Social2, Social3, Social4, Social5 } from "../assets/icons"
import { Title } from "../components"
import { useTranslation } from "react-i18next"

const Footer = () => {
  const { t } = useTranslation()

  const SocialList: { id: number; img: string }[] = [
    { id: 1, img: Social1 },
    { id: 2, img: Social2 },
    { id: 3, img: Social3 },
    { id: 4, img: Social4 },
    { id: 5, img: Social5 },
  ]

  return (
    <section className="flex flex-col items-center pt-20 pb-4 max-w-[670px] mx-auto">
      <Title extraClass="max-w-200">{t("footer.title")}</Title>
      <p className="max-w-120 text-center mt-10 font-light text-title">{t("footer.description")}</p>
      <div className="flex items-center gap-4 mt-5">
        <input
          type="text"
          className="outline-none py-2 px-2 w-[386px] border border-brownish bg-transparent text-title placeholder:text-title/40"
          placeholder=""
        />
        <button className="bg-brownish py-2 px-6 border border-brownish text-grayish font-liter cursor-pointer">
          {t("footer.send")}
        </button>
      </div>
      <div className="flex items-center gap-4 mt-12">
        {SocialList.map(item =>
          <div key={item.id} className="rounded-lg bg-grayish w-[36px] h-[36px] flex items-center justify-center cursor-pointer">
            <img src={item.img} alt="social-icon" />
          </div>
        )}
      </div>
      <div className="border border-brownish my-8 w-full"></div>
      <p className="text-title font-light text-[15px]">{t("footer.copyright")}</p>
    </section>
  )
}

export default Footer
