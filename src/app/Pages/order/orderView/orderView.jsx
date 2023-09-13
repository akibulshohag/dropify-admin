import {
  Card,
  Divider,
  Icon,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import imageBasePath from "../../../../config";
import axios from "../../../../axios";
import Spinner from "../../../Shared/Spinner/Spinner";

const PrintComponent = React.forwardRef((props, ref) => {
  const { orderData } = props;

  return (
    <div ref={ref} className="print-content">
      <style>
        {`
          .print-content {
            counter-reset: page;
          }
          
          .page {
            margin: 36px 28px;
            padding: 36px 28px;
            background-color: white;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
            page-break-after: always;
          }
          
          .page:after {
            counter-increment: page;
          }
          
          
          @page {
            margin: 48px 28px;
            @bottom-left {
              content: none;
            }
          
            @bottom-right {
              content: counter(page);
            }
          }

          @media print {
            .page {
              margin: 0;
              padding: 0;
              box-shadow: none;
            }

            td, th, tr{
              padding: 13px 8px !important; 
            }

          }
        
          `}
      </style>

      <div className="page">
        <img src="/images/black-logo.png" alt="black-lefabre" height="60px" className="mx-4 mb-2" />
        <div className="viewer__order-info px-4 mb-4 flex justify-between">
          <div>
            <h5 className="mb-2">Order Info</h5>
            <p className="mb-0">
              <strong>Order Number # </strong> {orderData?.serialId}
            </p>
            <p className="mb-0">
              <strong>Order date: </strong> {moment(orderData?.createdAt).format("lll")}
            </p>
            <p className="mb-0">
              <strong>Order Status :</strong>{" "}
              {orderData?.orderStatus[orderData?.orderStatus.length - 1].status}
            </p>
            <p className="mb-0">
              <strong>Payment Type :</strong> {orderData?.payment?.paymentType}
            </p>
            <p className="mb-0">
              <strong>Courier :</strong> {orderData?.courierName ? orderData?.courierName : "N/A"}
            </p>
          </div>
          <div className="text-right">
            <h5 className="font-normal capitalize mb-2">
              <strong>{orderData?.pageId?.name}</strong>
            </h5>
            <h5 className="mb-2">Shipping To</h5>
            <p className="m-0">{orderData?.deliveryAddress?.name}</p>
            <p className="mb-0">{orderData?.deliveryAddress?.phone}</p>
            <p className="mb-0 whitespace-pre-wrap">{orderData?.deliveryAddress?.address}</p>
          </div>
        </div>

        <Divider className="mb-4" />

        <Card className="mb-4 px-4" elevation={0}>
          <Table>
            <TableHead>
              <TableRow className="px-4">
                <TableCell>#</TableCell>
                <TableCell align="center">Sku</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Item Name</TableCell>
                <TableCell align="center">Unit Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderData?.products?.map((data, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell align="center">{data?.sku}</TableCell>
                  <TableCell align="center">
                    <Avatar
                      className="border-radius-4 mx-auto"
                      style={{ cursor: "pointer", width: "58px" }}
                      src={imageBasePath + "/" + data?.galleryImage[0]}
                      alt={data?.name}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <p>
                      {data?.name}
                      {data?.isVariant && ` (${data?.variationName})`}
                    </p>
                  </TableCell>
                  <TableCell align="center">{data?.price}</TableCell>
                  <TableCell align="center">{data?.quantity}</TableCell>
                  <TableCell align="center">{data?.price * data?.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="px-4 flex justify-end">
          <div className="flex">
            <div className="pr-12">
              <p className="mb-4">Sub Total: </p>
              <p className="mb-4">Delivery Charge:</p>
              <p className="mb-4">Discount:</p>
              <p>
                <strong>Grand Total:</strong>
              </p>
              <p>
                <strong>Paid:</strong>
              </p>
              <p>
                <strong>Due:</strong>
              </p>
            </div>
            <div>
              <p className="mb-4">৳ {orderData?.customerCharge?.totalProductPrice}</p>
              <p className="mb-4">৳ {orderData?.customerCharge?.deliveryCharge}</p>
              <p className="mb-4">৳ {orderData?.customerCharge?.discountPrice}</p>
              <p className="mb-4">
                <strong>৳ {orderData?.customerCharge?.TotalBill}</strong>
              </p>
              <p className="mb-4">
                <strong>৳ {orderData?.customerCharge?.totalPayTk}</strong>
              </p>
              <p className="mb-4">
                <strong>৳ {orderData?.customerCharge?.remainingTkPay}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const OrderView = () => {
  const { serialId } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (serialId) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(`/order/single-order/${serialId}`);
          if (res) {
            setOrderData(res?.data?.data);
          }
          setIsLoading(false);
          setErrorMsg("");
        } catch (err) {
          setIsLoading(false);
          setErrorMsg(err.response.data.message);
        }
      };
      fetchData();
    }
  }, [serialId]);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      {!isLoading ? (
        <>
          <Card elevation={6} className="m-sm-30">
            <div className="px-4 py-2 mb-0 flex justify-end items-center">
              <IconButton
                onClick={handlePrint}
                style={{
                  backgroundColor: "#ebedec",
                  color: "#1976d2",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              >
                <Icon>local_printshop</Icon>
              </IconButton>
            </div>
          </Card>
          <PrintComponent ref={componentRef} orderData={orderData} />
        </>
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
      {errorMsg !== "" && (
        <Typography
          variant="body2"
          style={{
            textAlign: "center",
            color: "gray",
            paddingY: "14px",
            padding: "8px",
          }}
        >
          No Data Found
        </Typography>
      )}
    </>
  );
};

export default OrderView;
