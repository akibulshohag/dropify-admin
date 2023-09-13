import React from "react";

const pagesRoutes = [
  {
    path: "/dashboard",
    component: React.lazy(() => import("./dashboard/dashboard")),
  },
  {
    path: "/create-order",
    component: React.lazy(() => import("./order/posOrder/posOrder")),
  },
  {
    path: "/update-order/:serialId",
    component: React.lazy(() => import("./order/posOrderUpdate/posOrderUpdate")),
  },
  {
    path: "/order-list",
    component: React.lazy(() => import("./order/orderList/orderlist")),
  },
  {
    path: "/order-view/:serialId",
    component: React.lazy(() => import("./order/orderView/orderView")),
  },
  {
    path: "/multiple-order-view",
    component: React.lazy(() => import("./order/orderView/multipleOrderView")),
  },
  {
    path: "/order-return-refund",
    component: React.lazy(() => import("./order/returnRefund/returnRefund")),
  },

  {
    path: "/create-purchase",
    component: React.lazy(() => import("./purchase/purchaseCreate/createPurchase")),
  },
  {
    path: "/purchase-list",
    component: React.lazy(() => import("./purchase/purchaseList/purchaseList")),
  },
  {
    path: "/purchase-view/:serialId",
    component: React.lazy(() => import("./purchase/purhaseView/purchaseView")),
  },
  {
    path: "/customer",
    component: React.lazy(() => import("./customer/customerList")),
  },
  {
    path: "/sms-list",
    component: React.lazy(() => import("./sms/smsList")),
  },
  {
    path: "/direct-sms",
    component: React.lazy(() => import("./sms/bulkMsgSend")),
  },
  {
    path: "/create-supplier",
    component: React.lazy(() => import("./supplier/createSupplier")),
  },
  {
    path: "/update-supplier/:supplierId",
    component: React.lazy(() => import("./supplier/updateSupplier")),
  },
  {
    path: "/supplier-list",
    component: React.lazy(() => import("./supplier/supplierList")),
  },
  {
    path: "/expense-head",
    component: React.lazy(() => import("./expenseHead/expenseHead")),
  },
  {
    path: "/create-expense",
    component: React.lazy(() => import("./expense/createExpense")),
  },
  {
    path: "/update-expense/:expenseId",
    component: React.lazy(() => import("./expense/updateExpense")),
  },
  {
    path: "/expense-list",
    component: React.lazy(() => import("./expense/expenseList")),
  },
  {
    path: "/create-product",
    component: React.lazy(() => import("./product/createProduct/createProducts")),
  },
  {
    path: "/update-product/:productSlug",
    component: React.lazy(() => import("./product/updateProduct/updateProducts")),
  },
  {
    path: "/product-list",
    component: React.lazy(() => import("./product/productList/productList")),
  },
  // {
  //   path: "/alert-products",
  //   component: React.lazy(() => import("./product/stockAlert/stockAlert")),
  // },
  {
    path: "/create-category",
    component: React.lazy(() => import("./category/createCategory")),
  },
  {
    path: "/update-category/:categoryId",
    component: React.lazy(() => import("./category/updateCategory")),
  },
  {
    path: "/category-list",
    component: React.lazy(() => import("./category/CategoryList")),
  },
  {
    path: "/create-attribute",
    component: React.lazy(() => import("./attributes/createAttribute")),
  },
  {
    path: "/update-attribute/:attributeId",
    component: React.lazy(() => import("./attributes/updateAttribute")),
  },
  {
    path: "/attribute-list",
    component: React.lazy(() => import("./attributes/AttributeList")),
  },
  {
    path: "/create-attribute-value",
    component: React.lazy(() => import("./attributes/createAttributeValue")),
  },
  {
    path: "/update-attribute-value/:attributeValueId",
    component: React.lazy(() => import("./attributes/updateAttributeValue")),
  },
  {
    path: "/attribute-value-list",
    component: React.lazy(() => import("./attributes/AttributeValueList ")),
  },
  {
    path: "/create-brand",
    component: React.lazy(() => import("./brand/createBrand")),
  },
  {
    path: "/update-brand/:brandId",
    component: React.lazy(() => import("./brand/updateBrand")),
  },
  {
    path: "/brand-list",
    component: React.lazy(() => import("./brand/brandList")),
  },
  {
    path: "/sticker",
    component: React.lazy(() => import("./sticker/sticker")),
  },
  {
    path: "/create-promo",
    component: React.lazy(() => import("./promo/createPromo")),
  },
  {
    path: "/promo-list",
    component: React.lazy(() => import("./promo/promoList")),
  },
  {
    path: "/create-campaign",
    component: React.lazy(() => import("./campaign/createCampaign")),
  },
  {
    path: "/update-campaign/:campaignId",
    component: React.lazy(() => import("./campaign/updateCampaign")),
  },
  {
    path: "/view-campaign/:campaignId",
    component: React.lazy(() => import("./campaign/viewCampaign")),
  },
  {
    path: "/campaign-list",
    component: React.lazy(() => import("./campaign/campaignList")),
  },
  {
    path: "/products-report",
    component: React.lazy(() => import("./reports/productsReports")),
  },
  // {
  //   path: "/section/:sectionSlug",
  //   component: React.lazy(() =>
  //     import("./section/sectionProducts/sectionProducts")
  //   ),
  // },
  // {
  //   path: "/section",
  //   component: React.lazy(() => import("./section/sectionCrud/sectionDetails")),
  // },
  {
    path: "/flash-deal",
    component: React.lazy(() => import("./flashdeal/flashdeal")),
  },
  {
    path: "/courier",
    component: React.lazy(() => import("./courier/courier")),
  },
  // {
  //   path: "/divisions",
  //   component: React.lazy(() => import("./locations/divisions")),
  // },
  // {
  //   path: "/districts",
  //   component: React.lazy(() => import("./locations/district")),
  // },
  // {
  //   path: "/upazila",
  //   component: React.lazy(() => import("./locations/upazila")),
  // },
  {
    path: "/home-view",
    component: React.lazy(() => import("./homeView/homeView")),
  },
  {
    path: "/page-update",
    component: React.lazy(() => import("./singlePage/pageUpdate")),
  },
  {
    path: "/page-view",
    component: React.lazy(() => import("./singlePage/pagesView")),
  },
  {
    path: "/delivery-charge",
    component: React.lazy(() => import("./deliveryCharge/deliveryCharge")),
  },
  {
    path: "/pop-up-img",
    component: React.lazy(() => import("./media/popupImg")),
  },
  {
    path: "/slider-img",
    component: React.lazy(() => import("./media/sliders")),
  },
  {
    path: "/brand-img",
    component: React.lazy(() => import("./media/brandImg")),
  },
  {
    path: "/banner-img",
    component: React.lazy(() => import("./media/bannerImg")),
  },
  {
    path: "/banner-text",
    component: React.lazy(() => import("./media/bannerText")),
  },
  {
    path: "/create-employee",
    component: React.lazy(() => import("./employee/createEmployee")),
  },
  {
    path: "/employee-list",
    component: React.lazy(() => import("./employee/employeeList.jsx")),
  },
  {
    path: "/employee-role/:employeeId",
    component: React.lazy(() => import("./employee/rolePermission")),
  },
  {
    path: "/profile",
    component: React.lazy(() => import("./general/profile")),
  },
  {
    path: "/password",
    component: React.lazy(() => import("./general/password")),
  },
];

export default pagesRoutes;
