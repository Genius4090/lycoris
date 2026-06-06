import { AboutFlower1, AboutFlower2, AboutFlower3, AboutInfo1, AboutInfo2 } from "../../assets/images"
import { Button, Title } from "../../components"

const AboutInfo = () => {
    const ImgList:{id:number,img:string}[] = [
        {
            id:1,
            img:AboutFlower1
        },
        {
            id:2,
            img:AboutFlower2
        },
        {
            id:3,
            img:AboutFlower3
        }
    ]
  return (
    <section className="flex flex-col items-center containers px-5">
     <Title extraClass="max-w-[710px] mt-40">A Fragrant Tale: Weaving Memories with Flowers</Title>


     <div className="flex gap-10 w-full mt-25">
       <img src={AboutInfo1} alt="about-info-img1" />
        <div className="flex flex-col justify-start items-end  max-w-[600px]">
            <p className="text-title">Lycoris Flower Store sprouted from a passion for nature's exquisite blooms, cultivating a haven where the beauty of flowers could inspire and uplift. Each flower that graces our store is carefully selected, ensuring that only the freshest and most vibrant petals find their way into our arrangements.</p>
            <p className="mt-4 text-title">With meticulous attention to detail, our skilled florists handpick the freshest blossoms, crafting enchanting arrangements that become symbols of love, joy, and beauty in life's precious moments. Whether you want to surprise a loved one or decorate an event, Blossomia Flower Store is the perfect choice.</p>
            <Button extraClass="mt-20">Read More</Button>
            
        </div>
       </div>


     <Title extraClass="text-start text-5xl! mt-20">Lycoris Flower studio - where nature's beauty becomes captivating floral artistry, expressing love, joy, and celebration through exquisite arrangements.</Title>

     <div className="flex w-full justify-between items-start gap-9 mt-25">
     <div className="max-w-[600px]">
            <p className="text-title">Lycoris Flower Store sprouted from a passion for nature's exquisite blooms, cultivating a haven where the beauty of flowers could inspire and uplift. Each flower that graces our store is carefully selected, ensuring that only the freshest and most vibrant petals find their way into our arrangements.</p>
            <p className="mt-5 text-title">With meticulous attention to detail, our skilled florists handpick the freshest blossoms, crafting enchanting arrangements that become symbols of love, joy, and beauty in life's precious moments. Whether you want to surprise a loved one or decorate an event, Blossomia Flower Store is the perfect choice.</p>          
        <div>
            
        <div className="flex gap-7 mt-8">
            {ImgList.map(item => <img key={item.id} src={item.img} alt="about-flower-img"/>)}
        </div>

        </div>
        </div>
       <img src={AboutInfo2} alt="about-info-img1" />
     </div>
    
    </section>
  )
}

export default AboutInfo