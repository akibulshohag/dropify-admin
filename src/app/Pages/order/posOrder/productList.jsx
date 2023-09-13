import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  styled,
  TextField,
  Typography,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon, ShoppingCart } from "@material-ui/icons";
import { CardActions, Pagination } from "@mui/material";
import axios from "../../../../axios";
import imageBasePath from "../../../../config";
import { Scrollbar } from "react-scrollbars-custom";
import Spinner from "../../../Shared/Spinner/Spinner";
import { v4 as uuidv4 } from "uuid";
import { gotoProductPage } from "../../../util/product";
import { IoMdFlash } from "react-icons/io";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ProductListPage = ({ cartProducts, setCartProducts }) => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [expandId, setExpandId] = useState("");
  const [totalPage, setTatalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event, value) => {
    setPage(value);
  };

  const productSelectHandler = (data) => {
    let isExit = false;
    cartProducts.forEach((obj) => {
      let objUid = obj?.uid;
      delete obj?.uid;
      if (obj?.productId === data?.productId && obj?.variantId === data?.variantId) {
        isExit = true;
      }
      obj.uid = objUid;
    });

    if (!isExit) {
      setCartProducts([{ ...data, uid: uuidv4() }, ...cartProducts]);
    }
  };

  useEffect(() => {
    let fetchData = async () => {
      try {
        let res = null;
        setIsLoading(true);
        if (searchValue !== "") {
          res = await axios.post(
            `product/search-by-sku-or-name?page=${page}&limit=6&userType=ADMIN`,
            { value: searchValue }
          );
        } else {
          res = await axios.get(`/product/pos-products?page=${page}&limit=6`);
        }

        if (res?.data?.success) {
          setProductList(res?.data?.data);
          setTatalPage(res?.data?.metaData?.totalPage);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setErrorMsg(err?.response?.data?.message);
      }
    };

    fetchData();
  }, [page, searchValue]);

  const handleExpandClick = (id) => {
    setExpanded(!expanded);
    if (!expanded) {
      setExpandId(id);
    } else {
      setExpandId("");
    }
  };

  return (
    <Card elevation={3} style={{ height: 700 }}>
      <CardHeader title="Product Information" />

      <Grid container className="my-3">
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <TextField
            placeholder="Search by Product Name or SKU"
            label=""
            variant="outlined"
            size="small"
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Grid>
      </Grid>

      <div
        style={{
          height: 520,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Scrollbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {!isLoading ? (
              <>
                {productList.length > 0 && errorMsg === "" ? (
                  <>
                    {productList.map((product) => (
                      <Box
                        sx={{
                          m: 1,
                          width: 150,
                        }}
                        key={product?._id}
                      >
                        <Card className="elevation-z3" style={{ minHeight: 240 }}>
                          <CardMedia
                            component="img"
                            height="100"
                            image={imageBasePath + "/" + product?.galleryImage[0]}
                            alt={product?.name}
                          />
                          <CardContent className="p-2">
                            <Typography paragraph className="mb-0 text-12 text-gray">
                              {product?.sku}
                            </Typography>
                            <Typography
                              paragraph
                              className="mb-0"
                              onClick={() => gotoProductPage(product?.slug)}
                            >
                              {product?.name.length > 15
                                ? product?.name.slice(0, 15) + ".."
                                : product?.name}
                            </Typography>
                            {!product?.isVariant ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box>
                                  <Typography paragraph className="m-0 text-error">
                                    {"৳ " +
                                      (product?.isFlashDeal
                                        ? product?.nonVariation?.flashPrice
                                        : product?.nonVariation?.sellingPrice) +
                                      "/="}
                                  </Typography>
                                </Box>
                                <Box>
                                  {product?.isFlashDeal && (
                                    <IoMdFlash className="text-secondary text-18" />
                                  )}
                                </Box>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box>
                                  <Typography paragraph className="m-0 text-error">
                                    {"৳ " +
                                      (product?.variations.length > 0 && product?.isFlashDeal
                                        ? product?.variations[0]?.flashPrice
                                        : product?.variations[0]?.sellingPrice) +
                                      "/="}
                                  </Typography>
                                </Box>
                                <Box>
                                  {product?.isFlashDeal && (
                                    <IoMdFlash className="text-secondary text-18" />
                                  )}
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                          <CardActions disableSpacing>
                            {product?.isVariant ? (
                              <Typography paragraph className="m-0">
                                select here..
                              </Typography>
                            ) : (
                              <IconButton
                                onClick={() => {
                                  productSelectHandler({
                                    productId: product?._id,
                                    slug: product?.slug,
                                    name: product?.name,
                                    isVariant: false,
                                    variantId: "",
                                    variantName: "",
                                    price: product?.isFlashDeal
                                      ? product?.nonVariation?.flashPrice
                                      : product?.nonVariation?.sellingPrice || 0,
                                    subTotal: product?.isFlashDeal
                                      ? product?.nonVariation?.flashPrice
                                      : product?.nonVariation?.sellingPrice || 0,
                                    quantity: 1,
                                    stock: product?.nonVariation?.stock,
                                    images: product?.galleryImage,
                                  });
                                }}
                                disabled={product?.nonVariation?.stock > 0 ? false : true}
                              >
                                <ShoppingCart />
                              </IconButton>
                            )}
                            {product?.isVariant ? (
                              <ExpandMore
                                expand={expanded && expandId === product?._id}
                                onClick={() => handleExpandClick(product?._id)}
                              >
                                <ExpandMoreIcon />
                              </ExpandMore>
                            ) : (
                              <Typography>
                                stock: <strong>{product?.nonVariation?.stock}</strong>
                              </Typography>
                            )}
                          </CardActions>
                          <Collapse
                            in={expanded && expandId === product?._id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <CardContent className="p-0">
                              <Table className="whitespace-pre">
                                <TableBody>
                                  {product?.variations.map((variant, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="capitalize" align="left">
                                        <span>
                                          {variant?.attributeOpts?.map((i) => i?.name).join("-")}
                                        </span>
                                        <br />
                                        <span className="text-error">
                                          {"৳ " +
                                            (product?.isFlashDeal
                                              ? variant?.flashPrice
                                              : variant?.sellingPrice) +
                                            "/="}
                                        </span>
                                        <br />
                                        <span>{"St.(" + variant?.stock + ")"}</span>
                                      </TableCell>
                                      <TableCell className="capitalize" align="left">
                                        <IconButton
                                          onClick={() => {
                                            productSelectHandler({
                                              productId: product?._id,
                                              slug: product?.slug,
                                              name: product?.name,
                                              isVariant: true,
                                              variantId: variant?._id,
                                              variantName: variant?.attributeOpts
                                                ?.map((i) => i?.name)
                                                .join("-"),
                                              quantity: 1,
                                              price: product?.isFlashDeal
                                                ? variant?.flashPrice
                                                : variant?.sellingPrice || 0,
                                              subTotal: product?.isFlashDeal
                                                ? variant?.flashPrice
                                                : variant?.sellingPrice || 0 || 0,
                                              stock: variant?.stock,
                                              images: product?.galleryImage,
                                            });
                                          }}
                                          disabled={variant?.stock > 0 ? false : true}
                                        >
                                          <ShoppingCart />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Collapse>
                        </Card>
                      </Box>
                    ))}
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
        </Scrollbar>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box>
          <Pagination count={totalPage} size="small" page={page} onChange={handleChange} />
        </Box>
      </Box>
    </Card>
  );
};

export default ProductListPage;
