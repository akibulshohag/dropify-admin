import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
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
import IOSSwitch from "../../../Shared/Forms/iosSwitch";
import { FaExclamationTriangle, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import SimpleModal from "../../../Shared/SimpleModal/SimpleModal";
import Spinner from "../../../Shared/Spinner/Spinner";
import { notification } from "antd";
import { useHistory } from "react-router-dom";
import { Breadcrumb } from "../../../components";
import { IoMdAddCircle } from "react-icons/io";
import { gotoProductPage } from "../../../util/product";

export default function ProductListPage() {
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [rows, setRows] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openImgData, setOpenImgData] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categorySlug, setCategorySlug] = useState("default");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [totalChecked, setTotalChecked] = useState(0);
  const [bulkselect, setBulkSelect] = useState("");
  const [bulkActionData, setBulkActionData] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [sectionList, setSectionList] = useState([]);
  const [sectionId, setSectionId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    let fetchData = async () => {
      try {
        let res = null;
        setIsLoading(true);
        if (categorySlug !== "default") {
          res = await axios.get(
            `/product/all-productby-category/${categorySlug}?page=${
              page + 1
            }&limit=${rowsPerPage}&userType=ADMIN`
          );
        } else if (searchValue !== "") {
          res = await axios.post(
            `product/search-by-sku-or-name?page=${page + 1}&limit=${rowsPerPage}&userType=ADMIN`,
            { value: searchValue }
          );
        } else {
          res = await axios.get(
            `/product/all-products?page=${page + 1}&limit=${rowsPerPage}&userType=ADMIN`
          );
        }

        if (res?.data?.data) {
          setTotalData(res?.data?.metaData?.totalData);
          setDataList(res?.data?.data.map((i) => ({ ...i, checkStatus: false })));
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setErrorMsg(err?.response?.data?.message);
      }
    };

    fetchData();
  }, [page, rowsPerPage, categorySlug, searchValue]);

  useEffect(() => {
    if (dataList.length > 0) {
      let dataArray = [];
      let i = 0;
      for (let data of dataList) {
        if (data?.checkStatus) {
          i++;
        }
        dataArray.push({ ...data });
      }
      if (i === dataList.length) {
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

  useEffect(() => {
    let fetchData = async () => {
      try {
        const [categoryData, sectionData] = await Promise.all([
          axios.get("/category/fetch-all"),
          axios.get("/section/fetch-all"),
        ]);

        let categoryList = [];
        for (let category of categoryData?.data?.data) {
          categoryList.push({
            _id: category?._id,
            name: category?.name,
            slug: category?.slug,
          });
          for (let subCategory of category?.children) {
            categoryList.push({
              _id: subCategory?._id,
              name: "➤ " + subCategory?.name,
              slug: subCategory?.slug,
            });
          }
        }
        setCategoryOptions(categoryList);
        setSectionList(sectionData?.data?.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

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
        return {
          ...i,
          checkStatus: checkStatus,
        };
      })
    );
  };

  const deleteHandler = async () => {
    try {
      let res = await axios.delete(`/product/delete/${deleteId}`);
      setDataList(dataList.filter((i) => i?._id !== deleteId));
      openNotificationWithIcon(res?.data?.message, "success");
    } catch (error) {
      openNotificationWithIcon(error?.response?.data?.message, "error");
    }
    setDeleteId(false);
    setIsOpenModal(false);
  };

  const closeModalHandler = () => {
    setDataList(dataList.map((i) => ({ ...i, checkStatus: false })));
    setIsOpenModal(false);
    setDeleteId(false);
    setOpenImgData(null);

    setBulkActionData(null);
    setBulkSelect("");
    setSectionId("");
  };

  const openImgHandler = (data) => {
    setIsOpenModal(true);
    setOpenImgData(data);
  };

  const statusUpdateHandler = async (data) => {
    try {
      const createRes = await axios.patch(`/product/disable-or-approve`, {
        products: [data?._id],
        isOwnDisabled: !data?.isOwnDisabled,
      });

      if (createRes?.data?.success) {
        setDataList(
          dataList.map((i) => {
            return i?._id === data?._id
              ? {
                  ...i,
                  isOwnDisabled: !i.isOwnDisabled,
                }
              : i;
          })
        );
        openNotificationWithIcon(createRes?.data?.message, "success");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error");
      openNotificationWithIcon(error?.response?.data?.message, "error");
      setIsLoading(false);
    }
  };

  const featuredUpdateHandler = async (data) => {
    try {
      const createRes = await axios.patch(`/product/feature`, {
        products: [data?._id],
        isFeatured: !data?.isFeatured,
      });

      if (createRes?.data?.success) {
        setDataList(
          dataList.map((i) => {
            return i?._id === data?._id
              ? {
                  ...i,
                  isFeatured: !i.isFeatured,
                }
              : i;
          })
        );
        openNotificationWithIcon(createRes?.data?.message, "success");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error");
      openNotificationWithIcon(error?.response?.data?.message, "error");
      setIsLoading(false);
    }
  };

  const topPosUpdateHandler = async (data) => {
    try {
      const createRes = await axios.patch(`/product/update-top-pos`, {
        products: [data?._id],
        isPosSuggest: !data?.isPosSuggest,
      });

      if (createRes?.data?.success) {
        setDataList(
          dataList.map((i) => {
            return i?._id === data?._id
              ? {
                  ...i,
                  isPosSuggest: !i.isPosSuggest,
                }
              : i;
          })
        );
        openNotificationWithIcon(createRes?.data?.message, "success");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error");
      openNotificationWithIcon(error?.response?.data?.message, "error");
      setIsLoading(false);
    }
  };

  const selectBulkHandler = (value) => {
    setBulkSelect(value);
    setBulkActionData(dataList.filter((data) => data?.checkStatus));
    setIsOpenModal(true);
  };

  const bulkActionHandler = async () => {
    try {
      setBulkLoading(true);
      let products = bulkActionData.map((i) => i?._id);

      let createRes = null;
      let obj = {};
      if (bulkselect === "feature") {
        createRes = await axios.patch(`/product/feature`, {
          products: products,
          isFeatured: true,
        });
        obj = {
          isFeatured: true,
        };
      } else if (bulkselect === "nonFeature") {
        createRes = await axios.patch(`/product/feature`, {
          products: products,
          isFeatured: false,
        });
        obj = {
          isFeatured: false,
        };
      } else if (bulkselect === "publish") {
        createRes = await axios.patch(`/product/disable-or-approve`, {
          products: products,
          isOwnDisabled: false,
        });
        obj = {
          isOwnDisabled: false,
        };
      } else if (bulkselect === "unpublish") {
        createRes = await axios.patch(`/product/disable-or-approve`, {
          products: products,
          isOwnDisabled: true,
        });
        obj = {
          isOwnDisabled: true,
        };
      } else if (bulkselect === "topPos") {
        createRes = await axios.patch(`/product/update-top-pos`, {
          products: products,
          isPosSuggest: true,
        });
        obj = {
          isPosSuggest: true,
        };
      } else if (bulkselect === "notTopPos") {
        createRes = await axios.patch(`/product/update-top-pos`, {
          products: products,
          isPosSuggest: false,
        });
        obj = {
          isPosSuggest: false,
        };
      }

      if (createRes?.data?.success) {
        setDataList(
          dataList.map((i) => {
            return products.includes(i?._id)
              ? {
                  ...i,
                  checkStatus: false,
                  ...obj,
                }
              : { ...i, checkStatus: false };
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

  const selectSectionHandler = (value) => {
    setSectionId(value);
    setBulkActionData(dataList.filter((data) => data?.checkStatus));
    setIsOpenModal(true);
  };

  const sectionActionHandler = async () => {
    try {
      setBulkLoading(true);
      let products = bulkActionData.map((i) => i?._id);

      let createRes = await axios.patch(`/section/add-multiple-products`, {
        sectionId: sectionId,
        products: products,
      });

      if (createRes?.data?.success) {
        setDataList(dataList.map((i) => ({ ...i, checkStatus: false })));
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

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Product List" }]} />
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
          onClick={() => history.push("/create-product")}
        >
          Add Products
        </Button>
      </Box>
      <Card className="border-radius-0 mx-8">
        <CardHeader title="Product List" />
        <div className="w-full overflow-hidden mt-4">
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
                    <MenuItem value="feature">Feature</MenuItem>
                    <MenuItem value="nonFeature">Non-Feature</MenuItem>
                    <MenuItem value="publish">Publish</MenuItem>
                    <MenuItem value="unpublish">Unpublish</MenuItem>
                    <MenuItem value="topPos">Top Pos</MenuItem>
                    <MenuItem value="notTopPos">Non-Top Pos</MenuItem>
                  </TextField>
                </Box>

                <Box
                  sx={{
                    backgroundColor: "white",
                    mx: 1,
                  }}
                >
                  <TextField
                    label="Add to Sections"
                    size="small"
                    variant="outlined"
                    fullWidth
                    select
                    className="min-w-188"
                    onChange={(e) => selectSectionHandler(e.target.value)}
                    value={bulkselect}
                  >
                    <MenuItem value="" disabled>
                      --select--
                    </MenuItem>
                    {sectionList.length > 0 &&
                      sectionList.map((data) => (
                        <MenuItem value={data?._id}>{data?.name}</MenuItem>
                      ))}
                  </TextField>
                </Box>

                <Typography
                  paragraph
                  className="ml-4 mt-2 min-w-188"
                  style={{ color: "green", fontWeight: "bold" }}
                >{`${totalChecked} product select from this page`}</Typography>
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
                px: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Filter by Category"
                  size="small"
                  variant="outlined"
                  fullWidth
                  select
                  className="min-w-188"
                  onChange={(e) => {
                    setPage(0);
                    setSearchValue("");
                    setCategorySlug(e.target.value);
                  }}
                  value={categorySlug}
                >
                  <MenuItem value="default">ALL</MenuItem>
                  {categoryOptions.map((cat) => (
                    <MenuItem key={cat._id} value={cat?.slug}>
                      {cat?.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography
                  paragraph
                  className="ml-4 min-w-188"
                  style={{ color: "green", fontWeight: "bold" }}
                >{`Total Products: ${totalData || 0}`}</Typography>
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
                    setCategorySlug("default");
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
                        <TableCell className="min-w-50">
                          <Checkbox
                            checked={allChecked}
                            onChange={(e) => allCheckedHandler(e.target.checked)}
                          />
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
                        <TableCell className="min-w-150" align="center">
                          Category
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Total Sale
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Variation Name
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Purchase
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Sale
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Stock
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Feature
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Publish
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Top Pos
                        </TableCell>
                        <TableCell className="min-w-100" align="center">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.length > 0 &&
                        rows.map((data) => (
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
                                            <Checkbox
                                              onClick={() =>
                                                singleCheckHandler({
                                                  checkStatus: data?.checkStatus,
                                                  _id: data?._id,
                                                })
                                              }
                                              checked={data?.checkStatus}
                                            />
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
                                              src={imageBasePath + "/" + data?.galleryImage[0]}
                                              alt={data?.name}
                                              onClick={() => openImgHandler(data)}
                                            />
                                          </TableCell>
                                          <TableCell
                                            className="capitalize"
                                            align="center"
                                            rowSpan={data?.variations.length}
                                            onClick={() => gotoProductPage(data?.slug)}
                                          >
                                            {data?.name}
                                          </TableCell>
                                          <TableCell
                                            className="capitalize"
                                            align="center"
                                            rowSpan={data?.variations.length}
                                          >
                                            {data?.categories.length > 0 &&
                                              data?.categories.map((v, idx2) => (
                                                <Box
                                                  key={idx2}
                                                  sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                  }}
                                                >
                                                  <Box>
                                                    <small className="rounded bg-primary elevation-z3 text-white px-2 py-2px m-1">
                                                      {v?.name}
                                                    </small>
                                                  </Box>
                                                </Box>
                                              ))}
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
                                        {variant?.attributeOpts.map((i) => i?.name)?.join("-")}
                                      </TableCell>{" "}
                                      <TableCell className="capitalize" align="center">
                                        {`${
                                          variant?.purchaseProducts
                                            ? (
                                                variant?.purchaseProducts?.totalPrice /
                                                variant?.purchaseProducts?.totalQuantity
                                              ).toFixed(2)
                                            : 0
                                        } ৳`}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {`${variant?.sellingPrice} ৳`}
                                      </TableCell>
                                      <TableCell className="capitalize" align="center">
                                        {variant?.stock}
                                      </TableCell>
                                      {idx === 0 && (
                                        <>
                                          <TableCell
                                            className="capitalize"
                                            align="center"
                                            rowSpan={data?.variations.length}
                                          >
                                            <FormControlLabel
                                              control={
                                                <IOSSwitch
                                                  sx={{ m: 1 }}
                                                  checked={data?.isFeatured}
                                                  onClick={() =>
                                                    featuredUpdateHandler({
                                                      isFeatured: data?.isFeatured,
                                                      _id: data?._id,
                                                    })
                                                  }
                                                />
                                              }
                                              label=""
                                            />
                                          </TableCell>
                                          <TableCell
                                            className="capitalize"
                                            align="center"
                                            rowSpan={data?.variations.length}
                                          >
                                            <FormControlLabel
                                              control={
                                                <IOSSwitch
                                                  sx={{ m: 1 }}
                                                  checked={!data?.isOwnDisabled}
                                                  onClick={() =>
                                                    statusUpdateHandler({
                                                      isOwnDisabled: data?.isOwnDisabled,
                                                      _id: data?._id,
                                                    })
                                                  }
                                                />
                                              }
                                              label=""
                                            />
                                          </TableCell>
                                          <TableCell
                                            className="capitalize"
                                            align="center"
                                            rowSpan={data?.variations.length}
                                          >
                                            <FormControlLabel
                                              control={
                                                <IOSSwitch
                                                  sx={{ m: 1 }}
                                                  checked={data?.isPosSuggest}
                                                  onClick={() =>
                                                    topPosUpdateHandler({
                                                      isPosSuggest: data?.isPosSuggest,
                                                      _id: data?._id,
                                                    })
                                                  }
                                                />
                                              }
                                              label=""
                                            />
                                          </TableCell>
                                          <TableCell
                                            className="capitalize"
                                            align="center"
                                            rowSpan={data?.variations.length}
                                          >
                                            <IconButton
                                              onClick={() => {
                                                history.push(`/update-product/${data?.slug}`);
                                              }}
                                              style={{
                                                backgroundColor: "#ebedec",
                                                color: "#1976d2",
                                                marginRight: "8px",
                                              }}
                                            >
                                              <FaRegEdit style={{ fontSize: "16px" }} />
                                            </IconButton>
                                            <IconButton
                                              onClick={() => {
                                                setIsOpenModal(true);
                                                setDeleteId(data?._id);
                                              }}
                                              style={{ backgroundColor: "#ebedec", color: "red" }}
                                            >
                                              <RiDeleteBin5Line style={{ fontSize: "16px" }} />
                                            </IconButton>
                                          </TableCell>
                                        </>
                                      )}
                                    </TableRow>
                                  ))}
                              </>
                            ) : (
                              <>
                                <TableRow>
                                  <TableCell className="capitalize" align="center">
                                    <Checkbox
                                      onClick={() => singleCheckHandler(data)}
                                      checked={data?.isAvoidProduct ? true : data?.checkStatus}
                                      disabled={data?.isAvoidProduct}
                                    />
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
                                      onClick={() => openImgHandler(data)}
                                    />
                                  </TableCell>
                                  <TableCell
                                    className="capitalize"
                                    align="center"
                                    onClick={() => gotoProductPage(data?.slug)}
                                  >
                                    {data?.name}
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    {data?.categories.length > 0 &&
                                      data?.categories.map((v, idx) => (
                                        <Box
                                          key={idx}
                                          sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          <Box>
                                            <small className="rounded bg-primary elevation-z3 text-white px-2 py-2px m-1">
                                              {v?.name}
                                            </small>
                                          </Box>
                                        </Box>
                                      ))}
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    {data?.totalSell || 0}
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    -
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    {`${
                                      data?.nonVariationPurchase
                                        ? (
                                            data?.nonVariationPurchase?.totalPrice /
                                            data?.nonVariationPurchase?.totalQuantity
                                          ).toFixed(2)
                                        : 0
                                    } ৳`}
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    {`${data?.nonVariation?.sellingPrice || 0} ৳`}
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    {data?.nonVariation?.stock || 0}
                                  </TableCell>{" "}
                                  <TableCell className="capitalize" align="center">
                                    <FormControlLabel
                                      control={
                                        <IOSSwitch
                                          sx={{ m: 1 }}
                                          checked={data?.isFeatured}
                                          onClick={() =>
                                            featuredUpdateHandler({
                                              isFeatured: data?.isFeatured,
                                              _id: data?._id,
                                            })
                                          }
                                        />
                                      }
                                      label=""
                                    />
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    <FormControlLabel
                                      control={
                                        <IOSSwitch
                                          sx={{ m: 1 }}
                                          checked={!data?.isOwnDisabled}
                                          onClick={() =>
                                            statusUpdateHandler({
                                              isOwnDisabled: data?.isOwnDisabled,
                                              _id: data?._id,
                                            })
                                          }
                                        />
                                      }
                                      label=""
                                    />
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    <FormControlLabel
                                      control={
                                        <IOSSwitch
                                          sx={{ m: 1 }}
                                          checked={data?.isPosSuggest}
                                          onClick={() =>
                                            topPosUpdateHandler({
                                              isPosSuggest: data?.isPosSuggest,
                                              _id: data?._id,
                                            })
                                          }
                                        />
                                      }
                                      label=""
                                    />
                                  </TableCell>
                                  <TableCell className="capitalize" align="center">
                                    <IconButton
                                      onClick={() => {
                                        history.push(`/update-product/${data?.slug}`);
                                      }}
                                      style={{
                                        backgroundColor: "#ebedec",
                                        color: "#1976d2",
                                        marginRight: "8px",
                                      }}
                                    >
                                      <FaRegEdit style={{ fontSize: "16px" }} />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => {
                                        setIsOpenModal(true);
                                        setDeleteId(data?._id);
                                      }}
                                      style={{ backgroundColor: "#ebedec", color: "red" }}
                                    >
                                      <RiDeleteBin5Line style={{ fontSize: "16px" }} />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              </>
                            )}
                          </React.Fragment>
                        ))}
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
            src={imageBasePath + "/" + openImgData?.galleryImage[0]}
            alt={openImgData?.name}
          />
        ) : (
          ""
        )}

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

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button variant="outlined" color="primary" className="mr-4" onClick={deleteHandler}>
                Yes
              </Button>
              <Button variant="outlined" onClick={() => setIsOpenModal(false)}>
                No
              </Button>
            </Box>
          </Box>
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
                    Are you sure{" "}
                    <strong>
                      {(bulkselect === "feature" && "feature") ||
                        (bulkselect === "nonFeature" && "remove feature") ||
                        (bulkselect === "publish" && "publish") ||
                        (bulkselect === "unpublish" && "unpublish") ||
                        (bulkselect === "topPos" && "top pos") ||
                        (bulkselect === "notTopPos" && "remove top pos")}
                    </strong>{" "}
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

        {sectionId && (
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
                    Are you sure to add selected products{" "}
                    <strong>
                      {sectionList.filter((data) => data?._id === sectionId)[0]?.name}
                    </strong>{" "}
                    section?
                  </p>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="mr-4"
                    onClick={sectionActionHandler}
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
      </SimpleModal>
    </div>
  );
}
