import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "../../../../axios";
import imageBasePath from "../../../../config";
import SimpleModal from "../../../Shared/SimpleModal/SimpleModal";
import Spinner from "../../../Shared/Spinner/Spinner";
import { notification } from "antd";
import { useHistory } from "react-router-dom";
import { Breadcrumb } from "../../../components";
import { IoMdAddCircle } from "react-icons/io";
import moment from "moment";
import PaymentUpdate from "./components/paymentUpdate";
import { FaEye, FaFilePdf, FaRegEdit, FaAmazonPay } from "react-icons/fa";
import { RiHomeGearLine } from "react-icons/ri";
import ProductDetails from "./components/productDetails";
import { MdMoreVert } from "react-icons/md";
import AddAdminNote from "./components/addAdminNote";
import AddressUpdate from "./components/addressUpdate";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MySnackbarContentWrapper from "../../../Shared/alert/alert";
import { FaRegCopy } from "react-icons/fa";
import { Print } from "@material-ui/icons";

export default function OrderList() {
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [rows, setRows] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openImgData, setOpenImgData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusName, setStatusName] = useState("ALL");
  const [userType, setUserType] = useState("ALL");
  const [courierData, setCourierData] = useState([]);
  const [paymentUpdateData, setPaymentUpdateData] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [orderNoteData, setOrderNoteData] = useState(null);
  const [orderStatusData, setOrderStatusData] = useState(null);
  const [orderAddressData, setOrderAddressData] = useState(null);
  const [allChecked, setAllChecked] = useState(false);
  const [totalChecked, setTotalChecked] = useState(0);
  const [bulkselect, setBulkSelect] = useState("");
  const [bulkActionData, setBulkActionData] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [actionValue, setActionValue] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [copyValue, setCopyValue] = useState("");
  const [isCopy, setIsCopy] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let courierRes = await axios.get("/courier/fetch-all");
      setCourierData(courierRes?.data?.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let fetchData = async () => {
      try {
        let res = null;
        setIsLoading(true);

        res = await axios.get(
          `/order/all-order-by-admin?status=${statusName}&createdBy=${userType}&page=${
            page + 1
          }&limit=${rowsPerPage}`
        );

        if (searchValue !== "") {
          res = await axios.post(`order/search-order?page=1&limit=10`, {
            value: searchValue,
          });
        } else {
          res = await axios.get(
            `/order/all-order-by-admin?status=${statusName}&createdBy=${userType}&page=${
              page + 1
            }&limit=${rowsPerPage}`
          );
        }

        // console.log("data::: ", res?.data?.data);
        if (res) {
          setTotalData(res?.data?.metaData?.totalData);
          setDataList(
            res?.data?.data.map((i) => {
              // return { ...i, checkStatus: false };
              let isAvoid = false;
              for (let st of i?.orderStatus) {
                if (["CANCELED", "DELIVERED", "RETURNED", "REFUND"].includes(st?.status)) {
                  isAvoid = true;
                }
              }
              return { ...i, checkStatus: false, isAvoid };
            })
          );
        }

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setErrorMsg(err?.response?.data?.message);
      }
    };

    fetchData();
  }, [page, rowsPerPage, statusName, userType, searchValue]);

  useEffect(() => {
    if (dataList.length > 0) {
      let dataArray = [];
      let i = 0;
      for (let data of dataList) {
        if (data?.checkStatus) {
          i++;
        }
        dataArray.push({
          _id: data?._id,
          checkBox: {
            checkStatus: data?.checkStatus,
            _id: data?._id,
            isAvoid: data?.isAvoid,
          },
          serialId: {
            sId: data?.serialId,
            time: data?.createdAt,
          },
          products: data?.products,
          customer: data?.deliveryAddress,
          customerCharge: data?.customerCharge,
          payment: data?.payment,
          prove: data?.payment,
          status: { status: data?.orderStatus, _id: data?._id },
          courier: { name: data?.courierName, _id: data?._id },
          createdBy: data?.createdBy,
          adminNote: {
            notes: data?.adminNote,
            serialId: data?.serialId,
            _id: data?._id,
          },
          action: data,
        });
      }
      let count = 0;
      dataList.forEach((d) => {
        if (!d?.isAvoid) {
          count++;
        }
      });
      if (i === count) {
        setTotalChecked(i);
        setAllChecked(true);
      } else {
        setTotalChecked(i);
        setAllChecked(false);
      }
      setRows(dataArray);
    } else {
      setRows([]);
    }
  }, [dataList]);

  const handleClick = (event, value) => {
    setActionValue(value);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (data) => {
    let isCancel = false;
    for (let st of actionValue?.orderStatus) {
      if (["CANCELED", "DELIVERED", "RETURNED", "REFUND"].includes(st?.status)) {
        isCancel = true;
      }
    }

    if (data?.name === "view") {
      history.push(`/order-view/${actionValue?.serialId}`);
    } else if (data?.name === "pdf") {
      downloadInvoice(actionValue?._id);
    } else if (data?.name === "payment") {
      if (isCancel) {
        openNotificationWithIcon("Payment couldn't be update!", "error");
      } else {
        customerPaymentUpdate({
          ...actionValue?.payment,
          _id: actionValue?._id,
          serialId: actionValue?.serialId,
          customerCharge: actionValue?.customerCharge,
        });
      }
    } else if (data?.name === "address") {
      setOrderAddressData({
        address: actionValue?.deliveryAddress?.address,
        _id: actionValue?._id,
        serialId: actionValue?.serialId,
      });
      setIsOpenModal(true);
    } else if (data?.name === "update") {
      if (isCancel) {
        openNotificationWithIcon("This order couldn't be update!", "error");
      } else {
        history.push("/update-order/" + actionValue?.serialId);
      }
    }

    setAnchorEl(null);
    setActionValue(null);
  };

  const downloadInvoice = async (orderId) => {
    try {
      const res = await axios.get(`/order/order-invoice/${orderId}`);
      if (res?.data?.success) {
        window.open(imageBasePath + "/" + res?.data?.data, "_blank").focus();
      }
    } catch (err) {
      openNotificationWithIcon(err?.response?.data?.message, "error");
    }
  };

  const orderStatusChangeHandler = async (id, value) => {
    if (value === "CANCELED" || value === "DELIVERED") {
      setOrderStatusData({ status: value, id: id });
      setIsOpenModal(true);
    } else {
      updateOrderStatus(id, value);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      let obj = {
        status,
        time: new Date(),
      };
      let res = await axios.patch(`/order/update-order-status/${id}`, obj);

      if (res) {
        setDataList(
          dataList.map((data) =>
            data?._id === id
              ? {
                  ...data,
                  payment: res?.data?.data?.payment,
                  customerCharge: res?.data?.data?.customerCharge,
                  orderStatus: res?.data?.data?.orderStatus,
                }
              : data
          )
        );
      }

      setIsOpenModal(false);
      setOrderStatusData(null);
      openNotificationWithIcon(res?.data?.message, "success");
    } catch (err) {
      openNotificationWithIcon(err?.response?.data?.message, "error");
    }
  };

  const columns = [
    {
      id: "checkBox",
      label: (
        <Checkbox checked={allChecked} onChange={(e) => allCheckedHandler(e.target.checked)} />
      ),
      minWidth: 30,
      format: (value) => (
        <Checkbox
          onClick={() => singleCheckHandler(value)}
          checked={value?.checkStatus}
          disabled={value?.isAvoid}
        />
      ),
    },
    {
      id: "serialId",
      label: "Serial_Id",
      align: "left",
      minWidth: 140,
      format: (value) => (
        <>
          <CopyToClipboard
            text={value?.sId}
            onCopy={() => {
              setCopyValue(value?.sId);
              setIsCopy(true);
            }}
          >
            <p style={{ margin: "0px" }}>
              {value?.sId}{" "}
              <span>
                <FaRegCopy />
              </span>
            </p>
          </CopyToClipboard>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={isCopy}
            autoHideDuration={1500}
            onClose={() => setIsCopy(false)}
          >
            <MySnackbarContentWrapper
              onClose={() => setIsCopy(false)}
              variant="success"
              message={`Copy order Id: ${copyValue}`}
            />
          </Snackbar>

          <p style={{ color: "gray", margin: "0px" }}>
            <small>{moment(value?.time).format("lll")}</small>
          </p>
        </>
      ),
    },
    {
      id: "products",
      label: "Products",
      align: "center",
      minWidth: 100,
      format: (value) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <Avatar
                src={imageBasePath + "/" + value[0]?.galleryImage[0]}
                alt={value[0]?.name}
                className="border-radius-4"
                style={{ cursor: "pointer", width: "58px" }}
                onClick={() => showProductsDetails(value)}
              />
            </Box>
            <Box>
              <p style={{ margin: "0px" }}>{` X ${value.reduce(function (prev, cur) {
                return prev + cur.quantity;
              }, 0)}`}</p>
            </Box>
          </Box>
        );
      },
    },
    {
      id: "customer",
      label: "Customer",
      align: "center",
      minWidth: 120,
      format: (value) => {
        return (
          <div>
            <p style={{ margin: "0px" }}>{value?.name}</p>
            <p style={{ margin: "0px" }}>
              <strong>{value?.phone}</strong>
            </p>
            <p style={{ margin: "0px" }}>{value?.address}</p>
          </div>
        );
      },
    },
    {
      id: "customerCharge",
      label: "Total Bill",
      align: "center",
      minWidth: 80,
      format: (value) => {
        return (
          <p style={{ margin: "0px", color: "green" }}>
            <strong>{`${value?.TotalBill} ৳`}</strong>
          </p>
        );
      },
    },
    {
      id: "payment",
      label: "Customer Payment",
      minWidth: 200,
      align: "center",
      format: (value) => {
        return (
          <div>
            <p style={{ margin: "0px", color: "green" }}>
              <strong>{`Paid: ${value?.amount} ৳`}</strong>
            </p>
            <p style={{ color: "gray", margin: "0px" }}>{value?.paymentType}</p>
            <p style={{ margin: "0px" }}>{value?.details}</p>
          </div>
        );
      },
    },
    {
      id: "prove",
      label: "Prove",
      minWidth: 30,
      align: "center",
      format: (value) => {
        return (
          <IconButton
            disabled={!value?.documentImg}
            onClick={() => openImgHandler({ image: value?.documentImg, name: "name" })}
          >
            <Icon className="text-warning" role="button" fontSize="small">
              photo
            </Icon>
          </IconButton>
        );
      },
    },
    {
      id: "customerCharge",
      label: "Due",
      align: "center",
      minWidth: 80,
      format: (value) => {
        return (
          <div>
            <p style={{ margin: "0px" }}>
              <strong style={{ color: "Salmon" }}>{value?.remainingTkPay}</strong>
              {" ৳"}
            </p>
          </div>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      minWidth: 100,
      format: (value) => {
        const STATUS = value?.status[value?.status.length - 1].status;

        if (STATUS === "CANCELED") {
          return (
            <small className="rounded bg-error elevation-z3 text-white px-2 py-2px">
              cancelled
            </small>
          );
        } else if (STATUS === "DELIVERED") {
          return (
            <small className="rounded bg-green elevation-z3 text-white px-2 py-2px">
              delivered
            </small>
          );
        } else if (STATUS === "RETURNED") {
          let hasRefund = false;
          for (let st of value?.status) {
            if (st?.status === "REFUND") {
              hasRefund = true;
            }
          }

          return (
            <>
              <small className="rounded bg-light-error elevation-z3 text-black px-2 py-2px">
                returned
              </small>
              {hasRefund && (
                <>
                  <br />
                  <small className="rounded bg-secondary elevation-z3 text-black px-2 py-2px">
                    refund
                  </small>
                </>
              )}
            </>
          );
        } else if (STATUS === "REFUND") {
          let hasReturn = false;
          for (let st of value?.status) {
            if (st?.status === "RETURNED") {
              hasReturn = true;
            }
          }
          return (
            <>
              <small className="rounded bg-secondary elevation-z3 text-black px-2 py-2px">
                refund
              </small>
              {hasReturn && (
                <>
                  <br />
                  <small className="rounded bg-light-error elevation-z3 text-black px-2 py-2px">
                    returned
                  </small>
                </>
              )}
            </>
          );
        } else {
          return (
            <TextField
              name=""
              label=""
              variant="outlined"
              size="small"
              fullWidth
              select
              value={value?.status[value?.status.length - 1].status}
              onChange={(e) => orderStatusChangeHandler(value?._id, e.target.value)}
            >
              <MenuItem value="PENDING"> Pending </MenuItem>
              <MenuItem value="HOLD"> Hold </MenuItem>
              <MenuItem value="CONFIRM"> Confirmed </MenuItem>
              <MenuItem value="PROCESSING"> Processing </MenuItem>
              <MenuItem value="PICKED"> Picked </MenuItem>
              <MenuItem value="SHIPPED"> Shipped </MenuItem>
              <MenuItem value="DELIVERED"> Delivered</MenuItem>
              <MenuItem value="CANCELED"> Cancelled </MenuItem>
            </TextField>
          );
        }
      },
    },
    {
      id: "courier",
      label: "Courier",
      align: "center",
      minWidth: 100,
      format: (value) => {
        return (
          <TextField
            name=""
            label=""
            variant="outlined"
            size="small"
            fullWidth
            select
            defaultValue={value?.name.toLowerCase()}
            onChange={(e) => courierChangedHandler(e.target.value, value?._id)}
          >
            <MenuItem value="">-- select --</MenuItem>
            {courierData.length > 0 &&
              courierData.map((data, idx) => (
                <MenuItem key={idx} value={data?.name.toLowerCase()}>
                  {data?.name.toLowerCase()}
                </MenuItem>
              ))}
          </TextField>
        );
      },
    },
    {
      id: "createdBy",
      label: "Created",
      align: "center",
      minWidth: 80,
    },
    {
      id: "adminNote",
      label: "Note",
      align: "center",
      minWidth: 90,
      format: (value) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <IconButton onClick={() => addOrderNote(value)}>
              <Icon className="text-primary" role="button" fontSize="small">
                assignment
              </Icon>
            </IconButton>
          </Box>
          <Box>
            <p className="m-0">
              <small>{`X ${value?.notes.length}`}</small>
            </p>
          </Box>
        </Box>
      ),
    },
    {
      id: "action",
      label: "Action",
      align: "center",
      minWidth: 140,
      format: (value) => {
        return (
          <div>
            <IconButton
              onClick={(e) => handleClick(e, value)}
              style={{
                backgroundColor: "#ebedec",
                color: "black",
                fontWeight: "bold",
                marginRight: "8px",
              }}
            >
              <MdMoreVert style={{ fontSize: "16px" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  width: "20ch",
                },
              }}
            >
              <MenuItem onClick={() => handleClose({ name: "view" })}>
                <ListItemIcon>
                  <FaEye style={{ fontSize: "16px", color: "#1976d2" }} />
                </ListItemIcon>
                <ListItemText>View</ListItemText>
              </MenuItem>
              {/* <MenuItem onClick={() => handleClose({ name: "update" })}>
                <ListItemIcon>
                  <FaRegEdit style={{ fontSize: "16px", color: "#1976d2" }} />
                </ListItemIcon>
                <ListItemText>update</ListItemText>
              </MenuItem> */}
              <MenuItem onClick={() => handleClose({ name: "payment" })}>
                <ListItemIcon>
                  <FaAmazonPay style={{ fontSize: "16px", color: "#1976d2" }} />
                </ListItemIcon>
                <ListItemText>Payment</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleClose({ name: "address" })}>
                <ListItemIcon>
                  <RiHomeGearLine style={{ fontSize: "16px", color: "#1976d2" }} />
                </ListItemIcon>
                <ListItemText>Address</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleClose({ name: "pdf" })}>
                <ListItemIcon>
                  <FaFilePdf style={{ fontSize: "16px", color: "#FF5733" }} />
                </ListItemIcon>
                <ListItemText>Pdf</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const singleCheckHandler = (data) => {
    setDataList(
      dataList.map((i) => {
        return i?._id === data?._id
          ? {
              ...i,
              checkStatus: !data?.checkStatus,
            }
          : i;
      })
    );
  };

  const allCheckedHandler = (checkStatus) => {
    setAllChecked(checkStatus);
    setDataList(
      dataList.map((i) => {
        return i?.isAvoid
          ? {
              ...i,
              checkStatus: false,
            }
          : {
              ...i,
              checkStatus: checkStatus,
            };
      })
    );
  };

  const selectBulkHandler = (value) => {
    setBulkSelect(value);
    setBulkActionData(dataList.filter((data) => data?.checkStatus));
    setIsOpenModal(true);
  };

  const bulkActionHandler = async () => {
    try {
      // console.log("order  hre..");
      setBulkLoading(true);
      let orders = bulkActionData.map((i) => i?._id);

      let createRes = await axios.patch(`/order/update-multiple-order-status`, {
        orders: orders,
        status: bulkselect,
        time: new Date(),
      });

      if (createRes?.data?.success) {
        setDataList(
          dataList.map((i) => {
            if (orders.includes(i?._id)) {
              let updateOrderStatus = [...i?.orderStatus, { status: bulkselect }];

              if (["CANCELED", "DELIVERED", "RETURNED", "REFUND"].includes(bulkselect)) {
                return {
                  ...i,
                  payment: createRes?.data?.data.filter((ord) => ord?._id === i?._id)[0]?.payment,
                  customerCharge: createRes?.data?.data.filter((ord) => ord?._id === i?._id)[0]
                    ?.customerCharge,
                  orderStatus: updateOrderStatus,
                  checkStatus: false,
                  isAvoid: true,
                };
              } else {
                return {
                  ...i,
                  payment: createRes?.data?.data.filter((ord) => ord?._id === i?._id)[0]?.payment,
                  customerCharge: createRes?.data?.data.filter((ord) => ord?._id === i?._id)[0]
                    ?.customerCharge,
                  orderStatus: updateOrderStatus,
                };
              }
            } else {
              return i;
            }
          })
        );
        openNotificationWithIcon(createRes?.data?.message, "success");
      }

      closeModalHandler();
      setBulkLoading(false);
    } catch (error) {
      console.log("error");
      openNotificationWithIcon(error?.response?.data?.message, "error");
      setBulkLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const courierChangedHandler = async (value, id) => {
    try {
      let res = await axios.patch(`/order/update-courier/${id}`, {
        value: value,
      });

      if (res) {
        setDataList(
          dataList.map((data) => (data?._id === id ? { ...data, courierName: value } : data))
        );

        openNotificationWithIcon(res?.data?.message, "success");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      openNotificationWithIcon(err?.response?.data?.message, "error");
    }
  };

  const closeModalHandler = () => {
    setIsOpenModal(false);
    setOpenImgData(null);
    setPaymentUpdateData(null);
    setProductsData([]);
    setOrderNoteData(null);
    setOrderAddressData(null);

    setBulkActionData(null);
    setBulkSelect("");
  };

  const openImgHandler = (data) => {
    setIsOpenModal(true);
    setOpenImgData(data);
  };

  const customerPaymentUpdate = (data) => {
    setPaymentUpdateData(data);
    setIsOpenModal(true);
  };

  const addOrderNote = (data) => {
    setOrderNoteData(data);
    setIsOpenModal(true);
  };

  const showProductsDetails = (data) => {
    setProductsData(data);
    setIsOpenModal(true);
  };

  const gotoMultipleOderHandler = () => {
    let selectedOrderData = dataList.filter((data) => data?.checkStatus);
    let orderIds = selectedOrderData.map((i) => i?.serialId);

    history.push(`/multiple-order-view?ids=${orderIds.join(",")}`);
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Order List" }]} />
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "28px",
          marginTop: "28px",
        }}
        className="mx-8"
      >
        <Button
          style={{
            backgroundColor: "#FF8E96",
            color: "white",
          }}
          variant="contained"
          size="large"
          startIcon={<IoMdAddCircle />}
          onClick={() => history.push("/create-order")}
        >
          Pos Order
        </Button>
      </Box>
      <Card className="border-radius-0 mx-8">
        <CardHeader title="Order List" />
        <div className="w-full overflow-hidden px-2 mt-4">
          {totalChecked > 0 ? (
            <Box
              sx={{
                borderBottom: "1px solid #F6F6F6",
                backgroundColor: "#FCF4F2",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                alignItems: "center",
                py: 1,
                px: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    mx: 1,
                  }}
                >
                  <TextField
                    label="Bulk Action"
                    size="small"
                    variant="outlined"
                    fullWidth
                    select
                    className="min-w-188"
                    onChange={(e) => selectBulkHandler(e.target.value)}
                    value={bulkselect}
                  >
                    <MenuItem value="" disabled>
                      --select--
                    </MenuItem>
                    <MenuItem value="PENDING"> Pending </MenuItem>
                    <MenuItem value="HOLD"> Hold </MenuItem>
                    <MenuItem value="CONFIRM"> Confirmed </MenuItem>
                    <MenuItem value="PROCESSING"> Processing </MenuItem>
                    <MenuItem value="PICKED"> Picked </MenuItem>
                    <MenuItem value="SHIPPED"> Shipped </MenuItem>
                    <MenuItem value="DELIVERED"> Delivered</MenuItem>
                    <MenuItem value="CANCELED"> Cancelled </MenuItem>
                  </TextField>
                </Box>

                <Typography
                  paragraph
                  className="ml-4 mt-2 min-w-188"
                  style={{ color: "green", fontWeight: "bold" }}
                >{`${totalChecked} product select from this page`}</Typography>
              </Box>
              <Box>
                <Button
                  color="secondary"
                  className="text-white"
                  variant="contained"
                  startIcon={<Print />}
                  onClick={gotoMultipleOderHandler}
                >
                  print all
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                borderBottom: "1px solid #F6F6F6",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                alignItems: "center",
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  // flexWrap: "wrap",
                }}
              >
                <TextField
                  label="Filter by User"
                  size="small"
                  variant="outlined"
                  fullWidth
                  select
                  className="min-w-188 mr-4"
                  onChange={(e) => {
                    setPage(0);
                    setSearchValue("");
                    setUserType(e.target.value);
                  }}
                  value={userType}
                >
                  <MenuItem value="ALL">ALL</MenuItem>
                  <MenuItem value="admin"> Pos</MenuItem>
                  <MenuItem value="customer"> Customer </MenuItem>
                  <MenuItem value="visitor"> Visitor </MenuItem>
                </TextField>
                <TextField
                  label="Filter by Status"
                  size="small"
                  variant="outlined"
                  fullWidth
                  select
                  className="min-w-188"
                  onChange={(e) => {
                    setPage(0);
                    setSearchValue("");
                    setStatusName(e.target.value);
                  }}
                  value={statusName}
                >
                  <MenuItem value="ALL">ALL</MenuItem>
                  <MenuItem value="PENDING"> Pending </MenuItem>
                  <MenuItem value="HOLD"> Hold </MenuItem>
                  <MenuItem value="CONFIRM"> Confirmed </MenuItem>
                  <MenuItem value="PROCESSING"> Processing </MenuItem>
                  <MenuItem value="PICKED"> Picked </MenuItem>
                  <MenuItem value="SHIPPED"> Shipped </MenuItem>
                  <MenuItem value="DELIVERED"> Delivered</MenuItem>
                  <MenuItem value="CANCELED"> Cancelled </MenuItem>
                  <MenuItem value="RETURNED"> Returned </MenuItem>
                  <MenuItem value="REFUND"> Refund </MenuItem>
                </TextField>
                <Typography
                  paragraph
                  className="ml-4 min-w-188"
                  style={{ color: "green", fontWeight: "bold" }}
                >{`Total Orders: ${totalData || 0}`}</Typography>
              </Box>
              <Box>
                <TextField
                  label=""
                  placeholder="Search here.."
                  size="small"
                  variant="outlined"
                  fullWidth
                  className="min-w-240"
                  onChange={(e) => {
                    setPage(0);
                    setStatusName("ALL");
                    setUserType("ALL");
                    setSearchValue(e.target.value);
                  }}
                  value={searchValue}
                />
              </Box>
            </Box>
          )}
        </div>
        <Divider />
      </Card>
      <Card className="border-radius-0 mx-8">
        {!isLoading ? (
          <div className="w-full overflow-hidden px-2">
            {rows.length > 0 && errorMsg === "" ? (
              <>
                <div
                  style={{
                    maxHeight: 800,
                    overflow: "auto",
                  }}
                >
                  <Table stickyHeader className="whitespace-pre">
                    <TableHead>
                      <TableRow>
                        {columns.map((column, idx) => (
                          <TableCell
                            key={idx}
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
                </div>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={totalData} // total data
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
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
          </div>
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
      </Card>
      <SimpleModal isShow={isOpenModal} closeModalHandler={closeModalHandler}>
        {openImgData ? (
          <Avatar
            className="border-radius-4"
            style={{ width: "100%", height: "100%" }}
            src={imageBasePath + "/" + openImgData?.image}
            alt={openImgData?.name}
          />
        ) : (
          ""
        )}

        {bulkselect && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {!bulkLoading ? (
              <>
                <Box>
                  <p>
                    <strong>{totalChecked} </strong>products are selected.
                  </p>
                  <p>
                    Are you sure<strong>{" " + bulkselect + " "}</strong>
                    selected products?
                  </p>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="mr-4"
                    onClick={bulkActionHandler}
                  >
                    Yes
                  </Button>
                  <Button variant="outlined" onClick={closeModalHandler}>
                    No
                  </Button>
                </Box>
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
          </Box>
        )}

        {orderStatusData && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box>
              {orderStatusData?.status === "CANCELED" && (
                <Typography paragraph className="ml-2 text-16 text-error">
                  Do you want to cancel the order?
                </Typography>
              )}
              {orderStatusData?.status === "DELIVERED" && (
                <Typography paragraph className="ml-2 text-16 text-green">
                  Are you delivered the order?
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                className="mr-4"
                onClick={() => {
                  setIsOpenModal(false);
                  setOrderStatusData(null);
                  updateOrderStatus(orderStatusData?.id, orderStatusData?.status);
                }}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsOpenModal(false);
                  setOrderStatusData(null);
                }}
              >
                No
              </Button>
            </Box>
          </Box>
        )}

        {productsData.length > 0 && (
          <ProductDetails productsData={productsData} closeModalHandler={closeModalHandler} />
        )}

        {orderNoteData && (
          <AddAdminNote
            orderNoteData={orderNoteData}
            closeModalHandler={closeModalHandler}
            dataList={dataList}
            setDataList={setDataList}
          />
        )}

        {paymentUpdateData && (
          <PaymentUpdate
            paymentUpdateData={paymentUpdateData}
            closeModalHandler={closeModalHandler}
            dataList={dataList}
            setDataList={setDataList}
          />
        )}

        {orderAddressData && (
          <AddressUpdate
            orderAddressData={orderAddressData}
            closeModalHandler={closeModalHandler}
            dataList={dataList}
            setDataList={setDataList}
          />
        )}
      </SimpleModal>
    </div>
  );
}
