import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import { Save } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components";
import CartDetails from "./cartDetails";
import CustomerDetails from "./customerDetails";
import OrderNote from "./orderNote";
import ProductList from "./productList";
import axios from "../../../../axios";
import { notification } from "antd";
import { useParams } from "react-router-dom";
import imageBasePath from "../../../../config";
import Spinner from "../../../Shared/Spinner/Spinner";
import { convertImageToBase64 } from "../../../util/convertImageToBase64";

const PosOrderUpdate = () => {
  const { serialId } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [courierOptions, setCourierOptions] = useState([]);
  const [courier, setCourier] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [totalPayTk, setTotalPayTk] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState("");
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryData, setDeliveryData] = useState(null);
  const [isInsideLocation, setIsInsideLocation] = useState("");
  const [noteList, setNoteList] = useState([]);
  const [adminNote, setAdminNote] = useState("");
  const [customerPageLoading, setCustomerPageLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCustomerPageLoading(true);
        const [courierData, settingData, orderData] = await Promise.all([
          axios.get("/courier/fetch-all"),
          axios.get("/setting/view"),
          axios.get("order/single-order-for-update/" + serialId),
        ]);
        setCourierOptions(courierData?.data?.data);
        setDeliveryData(settingData?.data?.data?.deliveryCharge);
        setOrderData(orderData?.data?.data);
        setCustomerPageLoading(false);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message);
        setCustomerPageLoading(false);
      }
    };
    if (serialId) {
      fetchData();
    }
  }, [serialId]);

  useEffect(() => {
    if (orderData) {
      setCustomerId(orderData?.customerId);
      setCartProducts(orderData?.products);
      setPhone(orderData?.deliveryAddress?.phone);
      setName(orderData?.deliveryAddress?.name);
      setDetails(orderData?.deliveryAddress?.address?.details);
      setCourier(orderData?.courierName);
      setPaymentType(orderData?.payment?.paymentType);
      setTotalPayTk(orderData?.payment?.amount);
      setPaymentDetails(orderData?.payment?.details);
      setTotalProductPrice(orderData?.customerCharge?.totalProductPrice);
      setDiscountPrice(orderData?.customerCharge?.discountPrice);
      setDeliveryCharge(orderData?.customerCharge?.deliveryCharge);
      let imageArray = [];
      if (orderData?.payment?.documentImg !== "") {
        imageArray = [
          {
            url: imageBasePath + "/" + orderData?.payment?.documentImg,
          },
        ];
      }
      setNoteList(orderData?.adminNote);
      setFileList(imageArray);
    }
  }, [orderData]);

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const imageHandler = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (
      newFileList[0]?.originFileObj.type === "image/jpeg" ||
      newFileList[0]?.originFileObj.type === "image/jpg" ||
      newFileList[0]?.originFileObj.type === "image/png"
    ) {
      setSelectedFile(newFileList[0]?.originFileObj);
    } else {
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    if (cartProducts.length > 0) {
      let productPrice = 0;
      cartProducts.forEach((product) => {
        productPrice += product?.subTotal;
      });
      setTotalProductPrice(productPrice);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (isInsideLocation === "inside") {
      setDeliveryCharge(deliveryData?.inside?.amount);
    } else if (isInsideLocation === "outside") {
      setDeliveryCharge(deliveryData?.outside?.amount);
    } else {
      setDeliveryCharge(0);
    }
  }, [deliveryData, isInsideLocation]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      let errorMsg = "";
      if (cartProducts.length <= 0) {
        errorMsg = "Select minimum one product";
      } else if (!phone) {
        errorMsg = "Phone is required";
      } else if (!name) {
        errorMsg = "Name is required";
      } else if (!details) {
        errorMsg = "Address is required";
      } else if (!paymentType) {
        errorMsg = "Select Payment Type";
      }

      if (errorMsg !== "") {
        openNotificationWithIcon(errorMsg, "error");
        setIsLoading(false);
        return;
      }

      let baseImg = "";
      if (selectedFile) {
        baseImg = await convertImageToBase64(selectedFile);
      } else if (fileList.length > 0) {
        baseImg = fileList[0].url.split(imageBasePath + "/")[1];
      }

      let selectedProducts = [];
      cartProducts.forEach((product) => {
        selectedProducts.push({
          productId: product?.productId,
          isVariant: product?.isVariant,
          variationId: product?.variantId,
          variationName: product?.variantName,
          quantity: product?.quantity,
          price: product?.price,
        });
      });

      let obj = {
        customerId: customerId,
        products: selectedProducts,
        courierName: courier,
        adminNoteMessage: adminNote,
        payment: {
          paymentType: paymentType,
          amount: Number(totalPayTk) || 0,
          details: paymentDetails,
          documentImg: baseImg,
        },
        customerCharge: {
          totalProductPrice: Number(totalProductPrice) || 0,
          discountPrice: Number(discountPrice) || 0,
          deliveryCharge: Number(deliveryCharge) || 0,
          totalPayTk: Number(totalPayTk) || 0,
        },
        deliveryAddress: {
          name: name,
          phone: phone,
          address: details,
        },
      };

      let res = await axios.patch(`/order/update-order/${serialId}`, obj);
      if (res?.data?.success) {
        setNoteList(res?.data?.data?.adminNote);
        setAdminNote("");
        openNotificationWithIcon(res.data?.message, "success");
        window.location.reload(true);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      openNotificationWithIcon(err?.response?.data?.message, "error");
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Update pos order" }]} />
      </div>

      {!customerPageLoading ? (
        errorMsg ? (
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              color: "red",
              paddingY: "14px",
              padding: "8px",
            }}
          >
            {errorMsg}
          </Typography>
        ) : (
          <form onSubmit={formSubmitHandler}>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} md={6} lg={4}>
                <ProductList
                  cartProducts={cartProducts}
                  setCartProducts={setCartProducts}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <CustomerDetails
                  customerId={customerId}
                  fileList={fileList}
                  phone={phone}
                  setPhone={setPhone}
                  name={name}
                  setName={setName}
                  details={details}
                  setDetails={setDetails}
                  courierOptions={courierOptions}
                  courier={courier}
                  setCourier={setCourier}
                  paymentType={paymentType}
                  setPaymentType={setPaymentType}
                  isInsideLocation={isInsideLocation}
                  setIsInsideLocation={setIsInsideLocation}
                  totalPayTk={totalPayTk}
                  setTotalPayTk={setTotalPayTk}
                  paymentDetails={paymentDetails}
                  setPaymentDetails={setPaymentDetails}
                  imageHandler={imageHandler}
                  customerPageLoading={customerPageLoading}
                  grandTotalBill={
                    Number(totalProductPrice) +
                    Number(deliveryCharge) -
                    Number(discountPrice)
                  }
                />
              </Grid>
              <Grid item xs={12} md={12} lg={4}>
                <CartDetails
                  cartProducts={cartProducts}
                  setCartProducts={setCartProducts}
                  totalProductPrice={totalProductPrice}
                  setTotalProductPrice={setTotalProductPrice}
                  discountPrice={discountPrice}
                  setDiscountPrice={setDiscountPrice}
                  deliveryCharge={deliveryCharge}
                  setDeliveryCharge={setDeliveryCharge}
                  totalPayTk={totalPayTk}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <OrderNote
                  adminNote={adminNote}
                  setAdminNote={setAdminNote}
                  noteList={noteList}
                />
              </Grid>
              <Grid item xs={12} md={6}></Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    className="mt-8 px-8"
                    startIcon={<Save />}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "auto",
            width: "auto",
            marginY: "58px",
          }}
        >
          <Spinner />
        </Box>
      )}
    </div>
  );
};

export default PosOrderUpdate;
