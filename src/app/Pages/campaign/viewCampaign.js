import React, { useEffect, useState } from "react";
import {
  // Button,
  Card,
  Grid,
  CardHeader,
  Typography,
  TableCell,
  TableRow,
  Table,
  TableHead,
  TableBody,
  Box,
  Avatar,
  Button,
} from "@material-ui/core";
import { Divider, notification } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { useParams } from "react-router-dom";
import SimpleModal from "../../Shared/SimpleModal/SimpleModal";
import { FaExclamationTriangle, FaRegEdit } from "react-icons/fa";
import imageBasePath from "../../../config";
import Spinner from "../../Shared/Spinner/Spinner";
import moment from "moment";
import { useHistory } from "react-router-dom";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const ViewCampaign = () => {
  const { campaignId } = useParams();
  const history = useHistory();

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [name, setName] = useState();
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [createdData, setCreatedDate] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  useEffect(() => {
    let fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get(`/campaign/single-details-fetch/${campaignId}`);
        if (res?.data?.success) {
          setDescription(res?.data?.data?.description);
          setName(res?.data?.data?.name);
          setCost(res?.data?.data?.cost);
          setDataList(res?.data?.data?.products);
          setCreatedDate(res?.data?.data?.createdAt);
        }
        setIsPageLoading(false);
      } catch (err) {
        setIsPageLoading(false);
        openNotificationWithIcon(err?.response?.data?.message, "error");
      }
    };
    fetchData();
  }, [campaignId]);

  const closeModalHandler = () => {
    setDeleteId(false);
    setIsOpenModal(false);
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "View Campaign" }]} />
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "28px",
          marginTop: "28px",
        }}
      >
        <Button
          style={{
            backgroundColor: "#FF8E96",
            color: "white",
          }}
          variant="contained"
          size="large"
          startIcon={<FaRegEdit />}
          onClick={() => history.push(`/update-campaign/${campaignId}`)}
        >
          Update Campaign
        </Button>
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="View Campaign" />

            {!isPageLoading ? (
              <div className="px-4 py-6">
                <Grid container spacing={1} alignItems="center" className="mb-2">
                  {/* <Grid item lg={4} xs={12} className="mb-8">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          mb: 2,
                        }}
                      >
                        <InputLabel className="mb-2 text-black">
                          Campaign Name<span style={{ color: "red" }}>*</span>
                        </InputLabel>
                        <TextField
                          type="text"
                          label=""
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Box>
                      <Box
                        sx={{
                          mb: 2,
                        }}
                      >
                        <InputLabel className="mb-2 text-black">Description</InputLabel>
                        <TextField
                          type="text"
                          label=""
                          variant="outlined"
                          size="small"
                          fullWidth
                          multiline
                          minRows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </Box>
                      <Box
                        sx={{
                          mb: 2,
                        }}
                      >
                        <InputLabel className="mb-2 text-black">Campaign Cost</InputLabel>
                        <TextField
                          type="number"
                          label=""
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                        />
                      </Box>
                    </Box>
                  </Grid> */}

                  <div className="viewer__order-info px-4 mb-4 flex justify-between">
                    <div>
                      <h5 className="mb-4">Campaign Details</h5>
                      <p className="mb-2">
                        <strong>{name}</strong>
                      </p>
                      <p className="mb-2">{description}</p>
                      <p className="mb-2">
                        <strong>Cost: </strong> {cost} tk
                      </p>
                      <p className="mb-2">
                        <strong>Created: </strong> {moment(createdData).format("lll")}
                      </p>
                    </div>
                  </div>
                  <Grid item xs={12} className="mb-4">
                    <Box>
                      <Box>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DateTimePicker
                            margin="none"
                            id="start-date"
                            label="Start date"
                            inputVariant="standard"
                            type="text"
                            autoOk={true}
                            // value={start || ""}
                            fullWidth
                            // onChange={(date) => handleDateChange(date, "start")}
                          />
                        </MuiPickersUtilsProvider>
                      </Box>
                      <Box>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DateTimePicker
                            margin="none"
                            id="start-date"
                            label="Start date"
                            inputVariant="standard"
                            type="text"
                            autoOk={true}
                            // value={start || ""}
                            fullWidth
                            // onChange={(date) => handleDateChange(date, "start")}
                          />
                        </MuiPickersUtilsProvider>
                      </Box>
                      <Box>
                        <Button type="submit">Filter</Button>
                      </Box>
                    </Box>
                  </Grid>

                  {dataList.length > 0 && (
                    <Grid item xs={12} className="mb-4">
                      <Divider />
                      <Typography variant="h5" className="text-center text-green mb-6">
                        {`Campaign Products (${dataList.length})`}
                      </Typography>
                      <div
                        style={{
                          maxHeight: 800,
                          minWidth: 300,
                          overflow: "auto",
                        }}
                      >
                        <Table stickyHeader className="whitespace-pre">
                          <TableHead>
                            <TableRow>
                              <TableCell className="min-w-50" align="center">
                                #
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                SKU
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Image
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Title
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Total Sale
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Variation Name
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Sale
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Stock
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Unit Price
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Sale Qty
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Sale Price
                              </TableCell>
                              <TableCell className="min-w-100" align="center">
                                Revenue
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dataList.length > 0 &&
                              dataList.map((data, index) => (
                                <React.Fragment key={data?._id}>
                                  {data?.isVariant ? (
                                    <>
                                      {data?.variations.length > 0 &&
                                        data?.variations.map((variant, idx) => (
                                          <TableRow key={idx}>
                                            {idx === 0 && (
                                              <>
                                                <TableCell
                                                  className="capitalize"
                                                  align="center"
                                                  rowSpan={data?.variations.length}
                                                >
                                                  {index + 1}
                                                </TableCell>
                                                <TableCell
                                                  className="capitalize"
                                                  align="center"
                                                  rowSpan={data?.variations.length}
                                                >
                                                  {data?.sku}
                                                </TableCell>
                                                <TableCell
                                                  className="capitalize"
                                                  align="center"
                                                  rowSpan={data?.variations.length}
                                                >
                                                  <Avatar
                                                    className="border-radius-4"
                                                    style={{ cursor: "pointer", width: "58px" }}
                                                    src={
                                                      imageBasePath + "/" + data?.galleryImage[0]
                                                    }
                                                    alt={data?.name}
                                                    //   onClick={() => openImgHandler(data)}
                                                  />
                                                </TableCell>
                                                <TableCell
                                                  className="capitalize"
                                                  align="center"
                                                  rowSpan={data?.variations.length}
                                                >
                                                  {data?.name}
                                                </TableCell>
                                                <TableCell
                                                  className="capitalize"
                                                  align="center"
                                                  rowSpan={data?.variations.length}
                                                >
                                                  {data?.totalSell || 0}
                                                </TableCell>
                                              </>
                                            )}
                                            <TableCell className="capitalize" align="center">
                                              {variant?.attributeOpts
                                                .map((i) => i?.name)
                                                ?.join("-")}
                                            </TableCell>
                                            <TableCell className="capitalize" align="center">
                                              {`${variant?.sellingPrice} ৳`}
                                            </TableCell>
                                            <TableCell className="capitalize" align="center">
                                              {variant?.stock}
                                            </TableCell>
                                            <TableCell className="capitalize" align="center">
                                              {`${
                                                variant?.purchaseDetails
                                                  ? (
                                                      variant?.purchaseDetails?.totalPrice /
                                                      variant?.purchaseDetails?.totalQuantity
                                                    ).toFixed(2)
                                                  : 0
                                              } ৳`}
                                            </TableCell>
                                            <TableCell className="capitalize" align="center">
                                              {variant?.saleDetails?.totalSaleQty || 0}
                                            </TableCell>
                                            <TableCell className="capitalize" align="center">
                                              {variant?.saleDetails?.totalSalePrice || 0}
                                            </TableCell>{" "}
                                            <TableCell className="capitalize" align="center">
                                              {variant?.saleDetails?.totalSalePrice -
                                                (variant?.purchaseDetails?.totalPrice /
                                                  variant?.purchaseDetails?.totalQuantity) *
                                                  variant?.saleDetails?.totalSaleQty || 0}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                    </>
                                  ) : (
                                    <TableRow>
                                      <TableCell className="capitalize" align="center">
                                        {index + 1}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {data?.sku}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        <Avatar
                                          className="border-radius-4"
                                          style={{ cursor: "pointer", width: "58px" }}
                                          src={imageBasePath + "/" + data?.galleryImage[0]}
                                          alt={data?.name}
                                          // onClick={() => openImgHandler(data)}
                                        />
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {data?.name}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {data?.totalSell || 0}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        -
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {`${data?.nonVariation?.sellingPrice} ৳`}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {data?.nonVariation?.stock}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {`${
                                          data?.nonVariation?.purchaseDetails
                                            ? (
                                                data?.nonVariation?.purchaseDetails?.price /
                                                data?.nonVariation?.purchaseDetails?.quantity
                                              ).toFixed(2)
                                            : 0
                                        } ৳`}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {data?.nonVariation?.saleDetails?.quantity || 0}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {data?.nonVariation?.saleDetails?.price || 0}
                                      </TableCell>{" "}
                                      <TableCell className="capitalize" align="center">
                                        {data?.nonVariation?.saleDetails?.price -
                                          (data?.nonVariation?.purchaseDetails?.price /
                                            data?.nonVariation?.purchaseDetails?.quantity) *
                                            data?.nonVariation?.saleDetails?.quantity || 0}
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Grid>
                  )}
                </Grid>
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
        </Grid>
      </Grid>

      <SimpleModal isShow={isOpenModal} closeModalHandler={closeModalHandler}>
        {deleteId ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FaExclamationTriangle className="text-secondary text-32" />
              <Typography paragraph className="ml-2 text-16">
                Are you sure you want to delete these?
              </Typography>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </SimpleModal>
    </div>
  );
};

export default ViewCampaign;
