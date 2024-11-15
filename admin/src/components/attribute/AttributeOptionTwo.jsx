import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";

const AttributeOptionTwo = ({
  attributes,
  values,
  setValues,
  selectedValueClear,
}) => {
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  // console.log('attributes in attribute option',attributes)

 
  const handleSelectValue = (items) => {
    // setSelectedValueClear(false);
    setSelected(items);
    setValues({
      ...values,
      [attributes._id]: items?.map((el) => el._id),
    });
  };

  useEffect(() => {
    const options = attributes?.variants?.map((val) => {
      return {
        ...val,
        label: val?.name,
        value: val?._id,
      };
    });
    setAttributeOptions(options);
  }, [attributes?.variants]);

  useEffect(() => {
    if (selectedValueClear) {
      setSelected([]);
    }
  }, [selectedValueClear]);

  return (
    <div>
      <MultiSelect
        options={attributeOptions}
        value={selected}
        onChange={(v) => handleSelectValue(v)}
        labelledBy="Select"
      />
    </div>
  );
};

export default AttributeOptionTwo;
