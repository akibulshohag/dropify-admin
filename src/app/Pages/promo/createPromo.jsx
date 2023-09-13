import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  TextField,
  CircularProgress,
  CardHeader,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { notification, Typography } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { DatePicker } from "antd";
import { useHistory } from "react-router-dom";
const { RangePicker } = DatePicker;

const CreatePromo = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRangeError, setDateRangeError] = useState("");
  const [discountType, setDiscountType] = useState("FLAT");
  const [dateRange, setDateRange] = useState({});

  const validationSchema = Yup.object().shape({
    promo: Yup.string().required("code is required"),
    minBuyingAmount: Yup.number()
      .required("minimum buying price is required")
      .typeError("minimum buying price is required"),
    discountPrice: Yup.number()
      .required("discount price is required")
      .typeError("discount price is required"),
  });

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (Object.keys(errors).length !== 0 && Object.keys(dateRange).length === 0) {
      setDateRangeError("Date range must be select!");
    }
    if (Object.keys(dateRange).length !== 0) {
      setDateRangeError("");
    }
  }, [errors, dateRange]);

  const formSubmitHandler = async (data) => {
    try {
      if (Object.keys(dateRange).length === 0) {
        setDateRangeError("Date range must be select!");
        return;
      }

      let obj = {
        promo: data?.promo,
        minBuyingAmount: data?.minBuyingAmount,
        discount: {
          discountType: discountType,
          discountPrice: data?.discountPrice,
        },
        startTime: dateRange?.startDate,
        endTime: dateRange?.endDate,
      };

      setIsLoading(true);
      const res = await axios.post(`/promo/create`, obj);
      if (res?.data?.success) {
        reset();
        setDateRange({});
        setDiscountType("FLAT");
        setDateRangeError("");
        openNotificationWithIcon(res?.data?.message, "success");
        history.push("/promo-list");
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
        <Breadcrumb routeSegments={[{ name: "New Promo" }]} />
      </div>

      <Grid container>
        <Grid item md={6} xs={12}>
          <Card elevation={3}>
            <CardHeader title="Create Promo Code" />

            <form className="px-4 py-6" onSubmit={handleSubmit(formSubmitHandler)}>
              <Grid container spacing={1} alignItems="center" className="mb-2">
                <Grid item sm={3} xs={12}>
                  <InputLabel>
                    Promo Code<span style={{ color: "red" }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <TextField
                    label=""
                    placeholder="promo code"
                    size="medium"
                    variant="outlined"
                    fullWidth
                    type="text"
                    InputProps={{ inputProps: { min: 0 } }}
                    name="promo"
                    {...register("promo")}
                  />
                  <Typography className="text-error" variant="caption">
                    {errors.promo?.message}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} alignItems="center" className="mb-2">
                <Grid item sm={3} xs={12}>
                  <InputLabel>
                    Min Amount<span style={{ color: "red" }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <TextField
                    type="number"
                    inputProps={{ min: 0 }}
                    onKeyPress={(event) => {
                      if (event?.key === "-" || event?.key === "+") {
                        event.preventDefault();
                      }
                    }}
                    label=""
                    placeholder="minimum amount price"
                    size="medium"
                    variant="outlined"
                    fullWidth
                    name="minBuyingAmount"
                    {...register("minBuyingAmount")}
                  />
                  <Typography className="text-error" variant="caption">
                    {errors.minBuyingAmount?.message}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} alignItems="center" className="mb-2">
                <Grid item sm={3} xs={12}>
                  <InputLabel>
                    Discount<span style={{ color: "red" }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item sm={2} xs={12}>
                  <TextField
                    label=""
                    placeholder="type"
                    size="medium"
                    variant="outlined"
                    fullWidth
                    select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <MenuItem value="FLAT">Flat</MenuItem>
                    <MenuItem value="PERCENT">Percentage</MenuItem>
                  </TextField>
                </Grid>
                <Grid item sm={1}></Grid>
                <Grid item sm={5} xs={12}>
                  <TextField
                    label=""
                    placeholder="Discount Amount"
                    size="medium"
                    variant="outlined"
                    fullWidth
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    name="discountPrice"
                    {...register("discountPrice")}
                  />
                  <Typography className="text-error" variant="caption">
                    {errors.discountPrice?.message}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} alignItems="center" className="mb-2">
                <Grid item sm={3} xs={12}>
                  <InputLabel>
                    Time Range<span style={{ color: "red" }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <RangePicker
                    style={{
                      width: "100%",
                      height: "50px",
                      borderRadius: "4px",
                    }}
                    onChange={(range) => {
                      const a = new Date(range[0].format());
                      const b = new Date(range[1].format());
                      setDateRange({
                        startDate: Math.min(a, b),
                        endDate: Math.max(a, b),
                      });
                    }}
                    showTime
                  />
                  <Typography className="text-error" variant="caption">
                    {dateRangeError}
                  </Typography>
                </Grid>
              </Grid>

              <Button
                className="mb-4 mt-2 px-12"
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginRight: "20px" }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Promo"}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreatePromo;
