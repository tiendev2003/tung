import React, { useEffect,useState } from "react";
import "./Filter.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoIosArrowDown } from "react-icons/io";
import Slider from "@mui/material/Slider";
import { BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../Features/Category/categorySlice"; // Import the fetchCategories action

const Filter = ({ onCategoryChange, onPriceRangeChange, onSearchChange }) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useSelector((state) => state.categories.items);
  const categoryStatus = useSelector((state) => state.categories.status);
  const categoryError = useSelector((state) => state.categories.error);

  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    onPriceRangeChange(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div className="filterSection">
      <div className="filterCategories">
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<IoIosArrowDown size={20} />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ padding: 0, marginBottom: 2 }}
          >
            <h5 className="filterHeading">Product Categories</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {categoryStatus === 'loading' && <p>Loading...</p>}
            {categoryStatus === 'failed' && <p>{categoryError}</p>}
            {categoryStatus === 'succeeded' &&
              categories.map((category, index) => (
                <p
                  key={index}
                  className={selectedCategory === category.name ? "selected" : ""}
                  onClick={() => handleCategoryChange(category._id)}
                >
                  {category.name}
                </p>
              ))}
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="filterPrice">
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<IoIosArrowDown size={20} />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ padding: 0, marginBottom: 2 }}
          >
            <h5 className="filterHeading">Price</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value}`}
              min={0}
              max={1000}
              sx={{
                color: "black",
                "& .MuiSlider-thumb": {
                  backgroundColor: "white",
                  border: "2px solid black",
                  width: 18,
                  height: 18,
                },
              }}
            />
            <div className="filterSliderPrice">
              <div className="priceRange">
                <p>
                  Min Price: <span>${priceRange[0]}</span>
                </p>
                <p>
                  Max Price: <span>${priceRange[1]}</span>
                </p>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="filterSearch">
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<IoIosArrowDown size={20} />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ padding: 0, marginBottom: 2 }}
          >
            <h5 className="filterHeading">Search</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <div className="searchBar">
              <BiSearch className="searchIcon" size={20} color={"#767676"} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Filter;