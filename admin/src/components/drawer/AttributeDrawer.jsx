import { Select } from "@windmill/react-ui";
import { Scrollbars } from "react-custom-scrollbars-2";

//internal import
import TagInputTwo from "@/components/common/TagInputTwo";
import DrawerButton from "@/components/form/button/DrawerButton";
import InputArea from "@/components/form/input/InputArea";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useAttributeSubmit from "@/hooks/useAttributeSubmit";

const AttributeDrawer = ({ id }) => {
  const {
    handleSubmit,
    onSubmit,
    register,
    errors,
    variants,
    addVariant,
    isSubmitting,
    removeVariant,
    handleSelectLanguage,
  } = useAttributeSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={"UpdateAttribute"}
            description={"UpdateAttributeDesc"}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={"AddAttribute"}
            description={"AddAttributeDesc"}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"DrawerAttributeTitle"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Attribute Title"
                  name="title"
                  type="text"
                  placeholder="Color or Size or Dimension or Material or Fabric"
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
              <LabelArea label={"DisplayName"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Display Name"
                  name="name"
                  type="text"
                  placeholder="Display Name"
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 relative">
              <LabelArea label={"DrawerOptions"} />
              <div className="col-span-8 sm:col-span-4 ">
                <Select
                  name="option"
                  {...register(`option`, {
                    required: `Option is required!`,
                  })}
                >
                  <option value="" defaultValue hidden>
                    {"DrawerSelecttype"}
                  </option>
                  <option value="Dropdown">{"Dropdown"}</option>
                  <option value="Radio">{"Radio"}</option>
                  {/* <option value="Checkbox">Checkbox</option> */}
                </Select>
                <Error errorName={errors.option} />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Attribute" isSubmitting={isSubmitting} />
        </form>
        <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40 ">
          {!id && (
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
              <LabelArea label={"Variants"} />
              <div className="col-span-8 sm:col-span-4">
                <TagInputTwo
                  notes={variants}
                  addNote={addVariant}
                  removeNote={removeVariant}
                />
              </div>
            </div>
          )}
        </div>
      </Scrollbars>
    </>
  );
};

export default AttributeDrawer;
