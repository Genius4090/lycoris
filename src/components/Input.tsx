import { Search } from "lucide-react"


const Input = () => {
  return (
    <div className="w-70 border border-title rounded-lg flex justify-between py-2.5 pr-2 pl-4 gap-2">
        <input type="text" className="outline-none placeholder:font-liter w-full" placeholder="Search..."/>
        <Search className="text-title"/>
    </div>
  )
}

export default Input