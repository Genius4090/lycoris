import { HomeImg2 } from "../../assets/images"
import Title from "../Title"
import { useTranslation } from "react-i18next"

const HomeSection1 = () => {
  const { t } = useTranslation()
  const hours: string[] = t("section1.hours", { returnObjects: true }) as string[]

  return (
    <section className="w-full h-screen flex flex-col items-center justify-center mt-30">
      <Title extraClass="max-w-[900px]">{t("section1.title")}</Title>
      <div className="flex gap-10 mt-20">
        <img src={HomeImg2} alt="home-section-1-img"/>
        <div>
          <div className="py-5">
            <div className="w-full">
              <h3 className="font-liter text-title text-3xl font-medium">{t("section1.storeLabel")}</h3>
              <p className="text-textish mt-4 mb-2 whitespace-pre-line">{t("section1.storeAddress")}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {hours.map(item => <li key={item} className="text-textish">{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default HomeSection1
