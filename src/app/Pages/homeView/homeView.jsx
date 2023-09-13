import React, { useState } from "react";
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  Box,
  CircularProgress,
  CardHeader,
  Typography,
  Checkbox,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { notification } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { useEffect } from "react";
import Spinner from "../../Shared/Spinner/Spinner";

const PageUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [webOptions, setWebOptions] = useState({
    flashProduct: true,
    featureProducts: true,
    newProducts: true,
    bestProducts: true,
    categories: [],
  });

  const [mobileOptions, setMobileOptions] = useState({
    flashProduct: true,
    featureProducts: true,
    newProducts: true,
    bestProducts: true,
    categories: [],
  });

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);

        let categoryData = await axios.get("/category/fetch-all");
        setCategoryOptions(categoryData?.data?.data);

        let res = await axios.get("/home/fetch-options");
        if (res) {
          let resData = res?.data?.data;

          resData.forEach((data) => {
            let newArray = [];
            newArray[0] = data?.categories[0]?._id ? data?.categories[0]?._id : "";
            newArray[1] = data?.categories[1]?._id ? data?.categories[1]?._id : "";

            if (data?.deviceType === "web") {
              setWebOptions({
                flashProduct: data?.flashProduct,
                featureProducts: data?.featureProducts,
                newProducts: data?.newProducts,
                bestProducts: data?.bestProducts,
                categories: newArray,
              });
            } else {
              setMobileOptions({
                flashProduct: data?.flashProduct,
                featureProducts: data?.featureProducts,
                newProducts: data?.newProducts,
                bestProducts: data?.bestProducts,
                categories: newArray,
              });
            }
          });
        }
        setIsPageLoading(false);
      } catch (err) {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let obj = {
        forWeb: { ...webOptions, categories: webOptions?.categories.filter((i) => i !== "") },
        forMobile: {
          ...mobileOptions,
          categories: mobileOptions?.categories.filter((i) => i !== ""),
        },
      };

      setIsLoading(true);
      const res = await axios.patch(`/home/update-options`, obj);
      if (res?.data?.success) {
        openNotificationWithIcon(res?.data?.message, "success");
      } else {
        openNotificationWithIcon(res?.data?.message, "error");
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
        <Breadcrumb routeSegments={[{ name: "home view" }]} />
      </div>

      <Grid container>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="Home View" />

            {!isPageLoading ? (
              <div>
                <form className="px-4" onSubmit={formSubmitHandler}>
                  <Grid container spacing={3} className="my-4">
                    <Grid item lg={6} xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" className="mb-2">
                            Web Home
                          </Typography>
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() =>
                                  setWebOptions({
                                    ...webOptions,
                                    flashProduct: !webOptions?.flashProduct,
                                  })
                                }
                                checked={webOptions?.flashProduct}
                              />
                            }
                            label={"Flash Products"}
                          />
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() =>
                                  setWebOptions({
                                    ...webOptions,
                                    featureProducts: !webOptions?.featureProducts,
                                  })
                                }
                                checked={webOptions?.featureProducts}
                              />
                            }
                            label={"Feature Products"}
                          />
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() =>
                                  setWebOptions({
                                    ...webOptions,
                                    newProducts: !webOptions?.newProducts,
                                  })
                                }
                                checked={webOptions?.newProducts}
                              />
                            }
                            label={"New Arrival Products"}
                          />
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() =>
                                  setWebOptions({
                                    ...webOptions,
                                    bestProducts: !webOptions?.bestProducts,
                                  })
                                }
                                checked={webOptions?.bestProducts}
                              />
                            }
                            label={"Best deal Products"}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox checked={webOptions?.categories[0] ? true : false} />
                            }
                            label=""
                          />
                          <TextField
                            select
                            name="parentId"
                            label=""
                            variant="outlined"
                            size="small"
                            className="min-w-150 max-w-150"
                            onChange={(e) => {
                              setWebOptions({
                                ...webOptions,
                                categories: [e.target.value, webOptions?.categories[1]],
                              });
                            }}
                            value={webOptions?.categories[0]}
                          >
                            <MenuItem value="">--select one--</MenuItem>
                            {categoryOptions.map((p) => (
                              <MenuItem key={p?._id} value={p._id}>
                                {p?.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox checked={webOptions?.categories[1] ? true : false} />
                            }
                            label=""
                          />
                          <TextField
                            select
                            name="parentId"
                            label=""
                            variant="outlined"
                            size="small"
                            className="min-w-150 max-w-150"
                            onChange={(e) => {
                              setWebOptions({
                                ...webOptions,
                                categories: [webOptions?.categories[0], e.target.value],
                              });
                            }}
                            value={webOptions?.categories[1]}
                          >
                            <MenuItem value="">--select one--</MenuItem>
                            {categoryOptions.map((p) => (
                              <MenuItem key={p?._id} value={p._id}>
                                {p?.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" className="mb-2">
                            Mobile Home
                          </Typography>
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() =>
                                  setMobileOptions({
                                    ...mobileOptions,
                                    flashProduct: !mobileOptions?.flashProduct,
                                  })
                                }
                                checked={mobileOptions?.flashProduct}
                              />
                            }
                            label={"Flash Products"}
                          />
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() =>
                                  setMobileOptions({
                                    ...mobileOptions,
                                    featureProducts: !mobileOptions?.featureProducts,
                                  })
                                }
                                checked={mobileOptions?.featureProducts}
                              />
                            }
                            label={"Feature Products"}
                          />
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() =>
                                  setMobileOptions({
                                    ...mobileOptions,
                                    newProducts: !mobileOptions?.newProducts,
                                  })
                                }
                                checked={mobileOptions?.newProducts}
                              />
                            }
                            label={"New Arrival Products"}
                          />
                        </Box>
                        <Box>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={() =>
                                  setMobileOptions({
                                    ...mobileOptions,
                                    bestProducts: !mobileOptions?.bestProducts,
                                  })
                                }
                                checked={mobileOptions?.bestProducts}
                              />
                            }
                            label={"Best deal Products"}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox checked={mobileOptions?.categories[0] ? true : false} />
                            }
                            label=""
                          />
                          <TextField
                            select
                            name="parentId"
                            label=""
                            variant="outlined"
                            size="small"
                            className="min-w-150 max-w-150"
                            onChange={(e) => {
                              setMobileOptions({
                                ...mobileOptions,
                                categories: [e.target.value, mobileOptions?.categories[1]],
                              });
                            }}
                            value={mobileOptions?.categories[0]}
                          >
                            <MenuItem value="">--select one--</MenuItem>
                            {categoryOptions.map((p) => (
                              <MenuItem key={p?._id} value={p._id}>
                                {p?.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox checked={mobileOptions?.categories[1] ? true : false} />
                            }
                            label=""
                          />
                          <TextField
                            select
                            name="parentId"
                            label=""
                            variant="outlined"
                            size="small"
                            className="min-w-150 max-w-150"
                            onChange={(e) => {
                              setMobileOptions({
                                ...mobileOptions,
                                categories: [mobileOptions?.categories[0], e.target.value],
                              });
                            }}
                            value={mobileOptions?.categories[1]}
                          >
                            <MenuItem value="">--select one--</MenuItem>
                            {categoryOptions.map((p) => (
                              <MenuItem key={p?._id} value={p._id}>
                                {p?.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} className="mt-4">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        type="submit"
                      >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update"}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
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
    </div>
  );
};

export default PageUpdate;
