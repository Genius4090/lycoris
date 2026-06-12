import type { ReactNode } from "react"

type TitleType  = {
  children: ReactNode,
  extraClass?:string
}

const Title = ({extraClass,children}:TitleType) =>{
  return (
    <h2 className={`text-3xl sm:text-4xl md:text-6xl text-title font-liter text-center leading-tight md:leading-[80px] ${extraClass}`}>{children}</h2>
  )
}

export default Title