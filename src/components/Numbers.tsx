import { useTranslation } from "react-i18next"

const Numbers = () => {
  const { t } = useTranslation()

  const InfoList = [
    { id: 1, quantity: "12,500", labelKey: "about.numbers.bouquets" },
    { id: 2, quantity: "3,400",  labelKey: "about.numbers.deliveries" },
    { id: 3, quantity: "2,100",  labelKey: "about.numbers.reviews" },
  ]

  return (
    <section className="mt-24 mb-10 flex flex-col items-center">
      <div className="relative mt-10">
        <p className="text-[40px] text-title font-liter italic text-center">{t("about.numbers.heading")}</p>
      </div>

      <div className="flex gap-10">
        {InfoList.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center justify-center py-10 gap-5 p-4"
          >
            <span
              className="font-liter text-[56px] leading-none text-title"
              style={{ textShadow: '0 0 40px rgba(200,80,5,0.4)' }}
            >
              {item.quantity} +
            </span>
            <span className="font-sora text-[11px] uppercase tracking-[0.2em] text-textish mt-1">
              {t(item.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Numbers
