import { SocialImg1, SocialImg2, SocialImg3 } from "../../assets/images"
import Title from "../Title"

const HomeSocial = () => {
  const imageList:string[] = [SocialImg1,SocialImg2,SocialImg3]
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center">
      <p className="text-lg text-textish font-medium">@LycorisFlower</p>
      <Title extraClass="font-light">Follow us on Instagram</Title>
      <div className="flex gap-7 mt-10">
      {
        imageList.map((item,key) => 
          <img key={key} src={item} alt="social-img" className="hover:scale-105 duration-300" />
        )
      }
      </div>
    </section>
  )
}

export default HomeSocial