import { AboutFlower1, AboutFlower2, AboutFlower3, AboutInfo1, AboutInfo2 } from "../../assets/images"
import { Button, Title } from "../../components"
import { useTranslation } from "react-i18next"

const AboutInfo = () => {
  const { t } = useTranslation()

  const ImgList: { id: number; img: string }[] = [
    { id: 1, img: AboutFlower1 },
    { id: 2, img: AboutFlower2 },
    { id: 3, img: AboutFlower3 },
  ]

  return (
    <section className="flex flex-col items-center containers px-5">
      <Title extraClass="max-w-[900px] mt-40">{t("about.info.title1")}</Title>

      <div className="flex gap-10 w-full mt-25">
        <img src={AboutInfo1} alt="about-info-img1" />
        <div className="flex flex-col justify-start items-end max-w-[600px]">
          <p className="text-title">{t("about.info.body1a")}</p>
          <p className="mt-4 text-title">{t("about.info.body1b")}</p>
          <Button extraClass="mt-20">{t("about.info.readMore")}</Button>
        </div>
      </div>

      <Title extraClass="text-start text-5xl! mt-20">{t("about.info.title2")}</Title>

      <div className="flex w-full justify-between items-start gap-9 mt-25">
        <div className="max-w-[800px]">
          <p className="text-title">{t("about.info.body2a")}</p>
          <p className="mt-5 text-title">{t("about.info.body2b")}</p>
          <div className="flex gap-7 mt-8">
            {ImgList.map(item => <img key={item.id} src={item.img} alt="about-flower-img" />)}
          </div>
        </div>
        <img src={AboutInfo2} alt="about-info-img2" />
      </div>
    </section>
  )
}

export default AboutInfo
