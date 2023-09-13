import React, { useState } from "react";
import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@material-ui/core";
import { notification } from "antd";
import axios from "../../../../../axios";
import { useEffect } from "react";

const AddressUpdate = ({ orderAddressData, closeModalHandler, dataList, setDataList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (orderAddressData) {
      setAddress(orderAddressData?.address);
    }
  }, [orderAddressData]);

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const formSubmitHandler = async () => {
    try {
      setIsLoading(true);

      let obj = {
        address: address,
      };

      let res = await axios.patch(`/order/update-address/${orderAddressData?._id}`, obj);

      if (res) {
        setDataList(
          dataList.map((data) =>
            data?._id === orderAddressData?._id
              ? {
                  ...data,
                  deliveryAddress: res?.data?.data?.deliveryAddress,
                }
              : data
          )
        );

        closeModalHandler();
        openNotificationWithIcon(res?.data?.message, "success");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      openNotificationWithIcon(err?.response?.data?.message, "error");
    }
  };

  return (
    <div>
      <p className="m-0">
        ID: <strong className="text-secondary">{" " + orderAddressData?.serialId}</strong>
      </p>
      <Typography className="mb-4 text-center text-primary" variant="h6">
        Customer Address
      </Typography>

      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} className="mb-2">
          <TextField
            label="Address"
            placeholder=""
            size="small"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Grid>

        <Box sx={{ display: "flex", mt: 2 }}>
          <Button
            className="mr-4"
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={formSubmitHandler}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update"}
          </Button>
          <Button variant="outlined" onClick={closeModalHandler}>
            Cancel
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

export default AddressUpdate;
