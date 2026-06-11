import { Flower17, Flower16 } from "../../assets/images"
import Title from "../Title"
import { useTranslation } from "react-i18next"

type Flower = {
    id: number,
    contentKey: string,
    img: string,
    off: number
}

const HomeAd = () => {
  const { t } = useTranslation()

  const flowerList: Flower[] = [
    { id: 1, contentKey: "ad.item1", img: Flower17, off: 20 },
    { id: 2, contentKey: "ad.item2", img: Flower16, off: 17 },
  ]

  return (
    <section className="w-full h-screen flex flex-col items-center justify-center gap-8">
        <Title extraClass="max-w-[650px]">{t("ad.title")}</Title>
        <p className="max-w-[880px] text-center text-title">{t("ad.description")}</p>
        <ul className="flex gap-10 mt-8">
            {flowerList.map(item =>
              <li key={item.id} className="relative">
                  <span className="bg-[#F7FF00] px-2 py-0.5 absolute -top-4 -right-5 font-liter">{item.off}%</span>
                  <img src={item.img} alt={t(item.contentKey)} />
                  <p className="mt-5 text-center font-liter text-xl text-title">{t(item.contentKey)}</p>
              </li>
            )}
        </ul>
    </section>
  )
}

export default HomeAd
