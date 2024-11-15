function getVariantNames(variantIds, variantsData) {
  const variantMap = {};

  // Tạo một bản đồ cho các biến thể
  variantsData.forEach((variant) => {
    variant.variants.forEach((v) => {
      variantMap[v._id] = v.name;
    });
  });

  // Lấy tên biến thể từ ID
  return variantIds.map((id) => variantMap[id]);
}

export default getVariantNames;