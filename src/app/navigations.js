// import { authRoles } from "./auth/authRoles";

export const navigations = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
  },
  {
    name: "Orders",
    icon: "folder",
    children: [
      {
        name: "Pos Order",
        path: "/create-order",
        iconText: "OL",
      },
      {
        name: "Order list",
        path: "/order-list",
        iconText: "OL",
      },
      {
        name: "Return & Refund",
        path: "/order-return-refund",
        iconText: "OL",
      },
    ],
  },
  {
    name: "Purchase",
    icon: "folder",
    children: [
      {
        name: "Create Purchase",
        path: "/create-purchase",
        iconText: "OL",
      },
      {
        name: "Purchase list",
        path: "/purchase-list",
        iconText: "OL",
      },
    ],
  },
  {
    name: "Customer",
    icon: "folder",
    children: [
      {
        name: "Customer List",
        path: "/customer",
        iconText: "OL",
      },
      {
        name: "Direct SMS",
        path: "/direct-sms",
        iconText: "OL",
      },
      {
        name: "SMS List",
        path: "/sms-list",
        iconText: "OL",
      },
    ],
  },
  {
    name: "Supplier",
    icon: "folder",
    children: [
      {
        name: "Add Supplier",
        path: "/create-supplier",
        iconText: "NP",
      },
      {
        name: "Supplier List",
        path: "/supplier-list",
        iconText: "PL",
      },
    ],
  },
  {
    name: "Expense",
    icon: "folder",
    children: [
      {
        name: "Expense Head",
        path: "/expense-head",
        iconText: "OL",
      },
      {
        name: "Create Expense",
        path: "/create-expense",
        iconText: "OL",
      },
      {
        name: "Expense List",
        path: "/expense-list",
        iconText: "OL",
      },
    ],
  },
  {
    label: "Product",
    type: "label",
  },
  {
    name: "Product",
    icon: "folder",
    children: [
      {
        name: "Create Product",
        path: "/create-product",
        iconText: "VO",
      },
      {
        name: "Product List",
        path: "/product-list",
        iconText: "OL",
      },
      // {
      //   name: "Alert Products",
      //   path: "/alert-products",
      //   iconText: "OL",
      // },
    ],
  },
  {
    name: "Categories",
    icon: "folder",
    children: [
      {
        name: "Create Category",
        path: "/create-category",
        iconText: "NP",
      },
      {
        name: "Category List",
        path: "/category-list",
        iconText: "PL",
      },
    ],
  },
  {
    name: "Attributes",
    icon: "folder",
    children: [
      {
        name: "Create Attribute",
        path: "/create-attribute",
        iconText: "NP",
      },
      {
        name: "Attribute List",
        path: "/attribute-list",
        iconText: "PL",
      },
      {
        name: "Create Attribute Value",
        path: "/create-attribute-value",
        iconText: "NP",
      },
      {
        name: "Attribute Value List",
        path: "/attribute-value-list",
        iconText: "PL",
      },
    ],
  },
  {
    name: "Sticker",
    path: "/sticker",
    icon: "folder",
  },
  {
    name: "Brands",
    icon: "folder",
    children: [
      {
        name: "Create Brand",
        path: "/create-brand",
        iconText: "NP",
      },
      {
        name: "Brand List",
        path: "/brand-list",
        iconText: "PL",
      },
    ],
  },
  {
    label: "campaign & Offers",
    type: "label",
  },
  // {
  //   name: "Section",
  //   path: "/section",
  //   icon: "folder",
  // },
  {
    name: "Flash Deal",
    path: "/flash-deal",
    icon: "folder",
  },
  {
    name: "Promo Code",
    icon: "folder",
    children: [
      {
        name: "Create Promo",
        path: "/create-promo",
        iconText: "OL",
      },
      {
        name: "Promo List",
        path: "/promo-list",
        iconText: "VO",
      },
    ],
  },
  {
    name: "Advertising",
    icon: "folder",
    children: [
      {
        name: "Create Campaign",
        path: "/create-campaign",
        iconText: "OL",
      },
      {
        name: "Campaign List",
        path: "/campaign-list",
        iconText: "VO",
      },
    ],
  },
  {
    name: "Reports",
    icon: "folder",
    children: [
      {
        name: "Products Report",
        path: "/products-report",
        iconText: "OL",
      },
    ],
  },
  {
    label: "settings",
    type: "label",
  },
  {
    name: "Courier",
    path: "/courier",
    icon: "folder",
  },
  // {
  //   name: "Location",
  //   icon: "folder",
  //   children: [
  //     {
  //       name: "Division",
  //       path: "/divisions",
  //       iconText: "OL",
  //     },
  //     {
  //       name: "District",
  //       path: "/districts",
  //       iconText: "VO",
  //     },
  //     {
  //       name: "Upazila",
  //       path: "/upazila",
  //       iconText: "OL",
  //     },
  //   ],
  // },
  {
    name: "Delivery Charge",
    path: "/delivery-charge",
    icon: "folder",
  },
  {
    name: "Home View",
    path: "/home-view",
    icon: "folder",
  },
  {
    name: "Pages",
    icon: "folder",
    children: [
      {
        name: "Page Update",
        path: "/page-update",
        iconText: "OL",
      },
      {
        name: "Pages View",
        path: "/page-view",
        iconText: "VO",
      },
    ],
  },
  {
    name: "Media",
    icon: "folder",
    children: [
      {
        name: "Pop up",
        path: "/pop-up-img",
        iconText: "OL",
      },
      {
        name: "Slider",
        path: "/slider-img",
        iconText: "VO",
      },
      // {
      //   name: "Brand",
      //   path: "/brand-img",
      //   iconText: "VO",
      // },
      {
        name: "Banners",
        path: "/banner-img",
        iconText: "VO",
      },
      {
        name: "Banner Text",
        path: "/banner-text",
        iconText: "VO",
      },
    ],
  },
  {
    name: "Employee",
    icon: "folder",
    children: [
      {
        name: "Create Employee",
        path: "/create-employee",
        iconText: "OL",
      },
      {
        name: "Employee List",
        path: "/employee-list",
        iconText: "VO",
      },
    ],
  },
  {
    name: "General",
    icon: "folder",
    children: [
      {
        name: "Profile",
        path: "/profile",
        iconText: "OL",
      },
      {
        name: "Password",
        path: "/password",
        iconText: "VO",
      },
    ],
  },
];
