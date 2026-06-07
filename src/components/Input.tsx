import { Search } from "lucide-react";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const Input = ({ value, onChange, placeholder = "Search..." }: InputProps) => {
  return (
    <div className="w-70 border border-title rounded-lg flex justify-between py-2.5 pr-2 pl-4 gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none placeholder:font-liter w-full"
        placeholder={placeholder}
      />
      <Search className="text-title" />
    </div>
  );
};




export default Input;


