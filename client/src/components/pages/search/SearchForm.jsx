import React from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./SearchForm.css";

const SearchForm = ({ searchQuery, setSearchQuery, handleSearchSubmit }) => {
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <form className="search-form " onSubmit={handleSearchSubmit}>
      <Input
        className="search-input"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleChange}
        style={{ color: "#226089" }}
        suffix={
          <Button
            className="search-button"
            type="dashed"
            htmlType="submit"
            icon={<SearchOutlined />}
          />
        }
      />
    </form>
  );
};

export default SearchForm;
