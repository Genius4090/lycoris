import { SocialImg1, SocialImg2, SocialImg3 } from "../../assets/images"
import Title from "../Title"
import { useTranslation } from "react-i18next"

const HomeSocial = () => {
  const { t } = useTranslation()
  const imageList: string[] = [SocialImg1, SocialImg2, SocialImg3]
  return (
    <section className="w-full h-screen flex flex-col my-20 items-center justify-center">
      <p className="text-lg text-textish font-medium">{t("social.handle")}</p>
      <Title extraClass="font-light w-160">{t("social.title")}</Title>
      <div className="flex gap-7 mt-10">
        {imageList.map((item, key) =>
          <img key={key} src={item} alt="social-img" className="hover:scale-105 duration-300" />
        )}
      </div>
    </section>
  )
}

export default HomeSocial
