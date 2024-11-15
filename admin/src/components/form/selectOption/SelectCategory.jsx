import { Select } from "@windmill/react-ui";

//internal import

import useAsync from "@/hooks/useAsync";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import CategoryServices from "@/services/CategoryServices";

const SelectCategory = ({ setCategory }) => {
  // console.log('data category',data)
  const { data } = useAsync(CategoryServices.getAllCategories);

  return (
    <>
      <Select onChange={(e) => setCategory(e.target.value)}>
        <option value="All" defaultValue hidden>
          {"Category"}
        </option>
        {data?.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat?.name}
          </option>
        ))}
      </Select>
    </>
  );
};

export default SelectCategory;
