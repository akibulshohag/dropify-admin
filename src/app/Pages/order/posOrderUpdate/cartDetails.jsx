import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import imageBasePath from "../../../../config";
import { Scrollbar } from "react-scrollbars-custom";

const CartDetails = ({
  cartProducts,
  setCartProducts,
  totalProductPrice,
  setTotalProductPrice,
  discountPrice,
  setDiscountPrice,
  deliveryCharge,
  setDeliveryCharge,
  totalPayTk,
}) => {
  const [rows, setRows] = useState([]);

  const columns = [
    {
      id: "product",
      label: "Product",
      align: "left",
      minWidth: 120,
      format: (value) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box>
            <Avatar
              className="border-radius-4"
              style={{ cursor: "pointer", width: "32px", height: "32px" }}
              src={imageBasePath + "/" + value?.image}
              alt={value?.name}
            />
          </Box>
          <Box
            sx={{
              ml: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              paragraph
              className="mb-0 text-left whitespace-pre-wrap"
              style={{ hyphens: "auto" }}
            >
              {value?.name}
            </Typography>
            <Typography paragraph className="mb-0 text-green">
              <strong>{value?.variantName}</strong>
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: "price",
      label: "Price",
      align: "center",
      minWidth: 60,
      format: (value) => {
        return (
          <TextField
            type="number"
            inputProps={{ min: 0 }}
            onKeyPress={(event) => {
              if (event?.key === "-" || event?.key === "+") {
                event.preventDefault();
              }
            }}
            label="৳"
            variant="outlined"
            value={value?.price}
            onChange={(e) => {
              setCartProducts(
                cartProducts.map((prod) =>
                  prod?.uid === value?.uid
                    ? {
                        ...prod,
                        price: Number(e.target.value) || 0,
                        subTotal: Number(prod?.quantity) * (Number(e.target.value) || 0),
                      }
                    : prod
                )
              );
            }}
            style={{ minWidth: "80px" }}
            size="small"
          />
        );
      },
    },
    {
      id: "qty",
      label: "Qty",
      align: "center",
      minWidth: 100,
      format: (value) => {
        return (
          <div className={"flex justify-between min-w-90 border"}>
            <Button
              className="p-1 min-w-20 bg-light-primary elevation-z0"
              variant="contained"
              size="small"
              onClick={() => {
                if (Number(value?.quantity) > 1) {
                  setCartProducts(
                    cartProducts.map((prod) =>
                      prod?.uid === value?.uid
                        ? {
                            ...prod,
                            quantity: Number(prod?.quantity) - 1,
                            subTotal: (Number(prod?.quantity) - 1) * Number(prod?.price),
                          }
                        : prod
                    )
                  );
                }
              }}
              disabled={Number(value?.quantity) <= 1}
            >
              -
            </Button>
            <div className="flex-grow flex justify-center items-center bg-paper ml-1 mr-1">
              {value?.quantity}
            </div>
            <Button
              className="p-1 min-w-20 bg-light-primary  elevation-z0"
              variant="contained"
              size="small"
              onClick={() => {
                if (Number(value?.stock) > Number(value?.quantity)) {
                  setCartProducts(
                    cartProducts.map((prod) =>
                      prod?.uid === value?.uid
                        ? {
                            ...prod,
                            quantity: Number(prod?.quantity) + 1,
                            subTotal: (Number(prod?.quantity) + 1) * Number(prod?.price),
                          }
                        : prod
                    )
                  );
                }
              }}
              disabled={Number(value?.quantity) >= Number(value?.stock)}
            >
              +
            </Button>
          </div>
        );
      },
    },
    {
      id: "subTotal",
      label: "SubTotal",
      align: "center",
      minWidth: 60,
      format: (value) => {
        return (
          <TextField
            label="৳"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            value={value?.subTotal}
            style={{ minWidth: "80px" }}
            size="small"
          />
        );
      },
    },
    {
      id: "action",
      label: "Action",
      align: "center",
      minWidth: 60,
      format: (value) => (
        <IconButton
          style={{ backgroundColor: "#ebedec", color: "red" }}
          onClick={() => {
            setCartProducts(cartProducts.filter((cart) => cart?.uid !== value));
          }}
        >
          <RiDeleteBin5Line style={{ fontSize: "16px" }} />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    let dataArray = [];
    for (let data of cartProducts) {
      dataArray.push({
        productId: data?.productId,
        product: {
          name: data?.name,
          variantName: data?.variantName,
          image: data?.images[0],
        },
        price: {
          price: data?.price,
          uid: data?.uid,
        },
        subTotal: {
          subTotal: data?.subTotal,
          uid: data?.uid,
        },
        qty: {
          quantity: data?.quantity,
          stock: data?.stock,
          uid: data?.uid,
        },
        action: data?.uid,
      });
    }
    setRows(dataArray);
    // console.log('dataArray: ',dataArray)
  }, [cartProducts]);

  return (
    <Card elevation={3} style={{ minHeight: 700 }}>
      <CardHeader title="Cart Information" />
      <div style={{ minWidth: "300px", height: "450px", overflow: "auto" }}>
        <Scrollbar>
          <TableContainer sx={{ maxHeight: 700, minWidth: 500 }}>
            <Table stickyHeader className="whitespace-pre">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx1) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={idx1}>
                      {columns.map((column, idx2) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={idx2} align={column.align}>
                            {column.format ? column.format(value, row?.name) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 1,
          mb: 1,
        }}
      >
        <Box>
          <InputLabel className="mr-1">Sub total</InputLabel>
        </Box>
        <Box>
          <TextField
            label=""
            placeholder=""
            name="name"
            size="small"
            variant="outlined"
            fullWidth
            type="number"
            InputProps={{
              readOnly: true,
            }}
            value={totalProductPrice}
            disabled
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 1,
          mb: 1,
        }}
      >
        <Box>
          <InputLabel className="mr-1">Delivery Charge</InputLabel>
        </Box>
        <Box>
          <TextField
            type="number"
            inputProps={{ min: 0 }}
            onKeyPress={(event) => {
              if (event?.key === "-" || event?.key === "+") {
                event.preventDefault();
              }
            }}
            label=""
            placeholder=""
            name="name"
            size="small"
            variant="outlined"
            fullWidth
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 1,
          mb: 1,
        }}
      >
        <Box>
          <InputLabel className="mr-1">Discount</InputLabel>
        </Box>
        <Box>
          <TextField
            type="number"
            inputProps={{ min: 0 }}
            onKeyPress={(event) => {
              if (event?.key === "-" || event?.key === "+") {
                event.preventDefault();
              }
            }}
            label=""
            placeholder=""
            name="name"
            size="small"
            variant="outlined"
            fullWidth
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 1,
          mb: 1,
        }}
      >
        <Box>
          <InputLabel className="mr-1">Grand Total</InputLabel>
        </Box>
        <Box>
          <TextField
            label=""
            placeholder=""
            size="small"
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            value={`${
              Number(totalProductPrice) + Number(deliveryCharge) - Number(discountPrice)
            }/=  (Due: ${
              Number(totalProductPrice) +
              Number(deliveryCharge) -
              Number(discountPrice) -
              Number(totalPayTk)
            }) `}
            disabled
          />
        </Box>
      </Box>
    </Card>
  );
};

export default CartDetails;
