import { Logo1, Logo2, Logo3, Logo4, Logo5 } from "../assets/icons"

const Banner = () => {
    const logoList:{id:number,img:string}[] = [
        {
            id:1,
            img: Logo1
        },
        {
            id:2,
            img: Logo2
        },
        {
            id:3,
            img: Logo3
        },
        {
            id:4,
            img: Logo4
        },
        {
            id:5,
            img: Logo5
        }
    ]
  return (
    <div className="bg-brownish py-10 w-full mt-30">
      <ul className="flex items-center justify-center gap-30">
        {logoList.map(item => <li key={item.id}><img src={item.img} alt="banner-image"/></li>)}
      </ul>
    </div>
  )
}

export default Banner



