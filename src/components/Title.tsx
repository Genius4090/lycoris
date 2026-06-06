import type { ReactNode } from "react"

type TitleType  = {
  children: ReactNode,
  extraClass?:string
}

const Title = ({extraClass,children}:TitleType) =>{
  return (
    <h2 className={`text-6xl text-title font-liter text-center leading-[80px] ${extraClass}`}>{children}</h2>
  )
}

export default Title