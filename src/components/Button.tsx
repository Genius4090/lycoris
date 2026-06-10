import type { FC, ReactNode } from "react"
import { ArrowRight } from "../assets/icons"
type BtnType = {
    children:ReactNode,
    extraClass?:string
}

const Button:FC<BtnType> = ({children,extraClass}) => {
  return (
    <div className={`border border-brownish p-2.5 ${extraClass}`}>
        <button className="cursor-pointer font-liter flex gap-2 items-center text-grayish bg-brownish py-3 px-7 text-lg">{children} <div className="mt-0.5"><ArrowRight/></div> </button>
    </div>
  )
}

export default Button