import { Logo1, Logo2, Logo3, Logo4, Logo5 } from "../assets/icons"
import { motion } from "motion/react"

const Banner = () => {
    const logoList:{id:number,img:string}[] = [
        { id:1, img: Logo1 },
        { id:2, img: Logo2 },
        { id:3, img: Logo3 },
        { id:4, img: Logo4 },
        { id:5, img: Logo5 },
    ]
  return (
    <div className="py-10 w-full mt-20 md:mt-30">
      <ul className="flex flex-wrap items-center justify-center gap-10 md:gap-30 px-4">
        {logoList.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 }}
          >
            <img src={item.img} alt="banner-image"/>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export default Banner



