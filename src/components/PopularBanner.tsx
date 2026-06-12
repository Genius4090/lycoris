import Button from "./Button"
import Title from "./Title"
import Popularproducts from "./PopularProducts"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { PATH } from "../constants/paths"
import { motion } from "motion/react"

const PopularBanner = () => {
  const { t } = useTranslation()
  
  return (
    <section className="flex flex-col items-center md:items-center mt-10 md:mt-25 w-full px-4">
      <motion.div
        className="mx-auto mb-8 md:mb-15"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <Title extraClass="max-w-[90vw] md:max-w-210">{t("about.popular.title")}</Title>
      </motion.div>
      <Popularproducts />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <Button extraClass="mt-15"><Link to={PATH.products}>{t("about.popular.btn")}</Link></Button>
      </motion.div>
    </section>
  )
}

export default PopularBanner



// const PopularBanner = () => {
//   const { t } = useTranslation()
  
//   return (
//     <section className="flex flex-col items-end mt-25">
//       <motion.div
//         className="mx-auto mb-15"
//         initial={{ opacity: 0, y: 32 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.3 }}
//         transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
//       >
//         <Title extraClass="max-w-210">{t("about.popular.title")}</Title>
//       </motion.div>
//       <Popularproducts />
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.5 }}
//         transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
//       >
//         <Button extraClass="mt-15"><Link to={PATH.products}>{t("about.popular.btn")}</Link></Button>
//       </motion.div>
//     </section>
//   )
// }

// export default PopularBanner