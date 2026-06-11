import Button from "./Button"
import Title from "./Title"
import Popularproducts from "./PopularProducts"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { PATH } from "../constants/paths"

const PopularBanner = () => {
  const { t } = useTranslation()
  
  return (
    <section className="flex flex-col items-end mt-25">
      <Title extraClass="max-w-210  mx-auto mb-15">{t("about.popular.title")}</Title>
      <Popularproducts />
      <Button extraClass="mt-15"><Link to={PATH.products}>{t("about.popular.btn")}</Link></Button>
    </section>
  )
}

export default PopularBanner
