interface InfoType {
    id:number,
    quantity:string,
    text:string
}
    
const Numbers = () => {
    const InfoList:InfoType[] = [
        {
          id:1,
          quantity: "12,500",
          text: "Bouquets Delivered"
        },
        {
          id:2,
          quantity: "3,400",
          text: "Daily Deliveries"
        },
        {
          id:3,
          quantity: "2,100",
          text: "5-Star Reviews"
        }
      ]
  
      return (
    <section className="mt-24 mb-10 flex flex-col items-center">
      <div className="relative mt-10">
       
        <p className="text-[40px] text-title font-liter italic text-center">Our story in numbers</p>
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
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Numbers