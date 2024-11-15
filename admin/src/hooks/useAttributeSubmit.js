import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

import { SidebarContext } from "@/context/SidebarContext";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import AttributeServices from "@/services/AttributeServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useAttributeSubmit = (id) => {
  const location = useLocation();
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [variants, setVariants] = useState([]);
  const [resData, setResData] = useState({});
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setServiceId } = useToggleDrawer();

  let variantArrayOfObject = [];

  (async () => {
    for (let i = 0; i < variants.length; i++) {
      variantArrayOfObject = [
        ...variantArrayOfObject,
        {
          name: variants[i],
        },
      ];
    }
  })();

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ title, name, option }) => {

    try {
      setIsSubmitting(true);
      if (!id) {
        if (variants.length === 0) {
          notifyError("Minimum one value is required for add attribute!");
          return;
        }
      }

      const attributeData = {
        title: title,
        name: name,
        variants: variantArrayOfObject,
        option: option,
        type: "attribute",
      };
      console.log("attributeData", attributeData);

      if (id) {
        const res = await AttributeServices.updateAttributes(id, attributeData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setServiceId();
      } else {
        const res = await AttributeServices.addAttribute(attributeData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setServiceId();
      }
    } catch (err) {
      console.log("err", err);
      notifyError(err ? err.response.data.message : err.message);
      closeDrawer();
      setIsSubmitting(false);
      setServiceId();
    }
  };

  // child attribute
  const onSubmits = async ({ name }) => {
    try {
      setIsSubmitting(true);
      if (id) {
        const res = await AttributeServices.updateChildAttributes(
          { ids: location.pathname.split("/")[2], id },
          {
            name: name,
            status: published ? "show" : "hide",
          }
        );
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await AttributeServices.addChildAttribute(
          location.pathname.split("/")[2],
          {
            name: name,
            status: published ? "show" : "hide",
          }
        );
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
      closeDrawer();
      setIsSubmitting(false);
      setServiceId();
    }
  };

  const removeVariant = (indexToRemove) => {
    setVariants([...variants.filter((_, index) => index !== indexToRemove)]);
  };

  const addVariant = (e) => {
    e.preventDefault();
    if (e.target.value !== "") {
      setVariants([...variants, e.target.value]);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("title");
      setValue("name");
      setValue("option");
      clearErrors("title");
      clearErrors("name");
      clearErrors("option");
      setVariants([]);

      return;
    }

    if (location.pathname === "/attributes" && id) {
      (async () => {
        try {
          const res = await AttributeServices.getAttributeById(id);
          if (res) {
            setResData(res);
            setValue("title", res.title);
            setValue("name", res.name);
            setValue("option", res.option);
          }
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    } else if (
      location.pathname === `/attributes/${location.pathname.split("/")[2]}`
    ) {
      (async () => {
        try {
          const res = await AttributeServices.getChildAttributeById({
            id: location.pathname.split("/")[2],
            ids: id,
          });
          if (res) {
            // console.log('res child', res);
            setValue("name", res.name);
            setPublished(res.status === "show" ? true : false);
          }
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
  }, [clearErrors, id, isDrawerOpen, setValue, location]);

  return {
    handleSubmit,
    onSubmits,
    onSubmit,
    register,
    errors,
    variants,
    setVariants,
    addVariant,
    removeVariant,
    published,
    setPublished,
    isSubmitting,
  };
};

export default useAttributeSubmit;
