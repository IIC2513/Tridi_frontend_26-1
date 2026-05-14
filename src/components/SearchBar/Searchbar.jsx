import { MdSearch } from "react-icons/md";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Search models..." }) {
  return (
    <div className="searchBar">
      <MdSearch className="searchIcon" />
      <input
        type="text"
        className="searchInput"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}