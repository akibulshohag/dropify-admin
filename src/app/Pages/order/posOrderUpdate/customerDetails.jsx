import {
  Box,
  Card,
  CardHeader,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { Upload } from "antd";
import React from "react";
import Spinner from "../../../Shared/Spinner/Spinner";

const CustomerDetails = ({
  customerId,
  fileList,
  phone,
  setPhone,
  name,
  setName,
  details,
  setDetails,
  courierOptions,
  courier,
  setCourier,
  paymentType,
  setPaymentType,
  isInsideLocation,
  setIsInsideLocation,
  totalPayTk,
  setTotalPayTk,
  paymentDetails,
  setPaymentDetails,
  imageHandler,
  customerPageLoading,
  grandTotalBill,
}) => {
  return (
    <Card elevation={3} style={{ height: 700 }}>
      <CardHeader title="Customer Information" />
      {!customerPageLoading ? (
        <div
          style={{
            height: 650,
            overflowY: "auto",
            overflowX: "hidden",
            paddingLeft: "14px",
            paddingRight: "14px",
            paddingBottom: "4px",
          }}
        >
          <Grid container spacing={1} alignItems="center" className="mt-4 mb-1">
            <Grid item sm={4} xs={12}>
              <InputLabel>
                Phone<span style={{ color: "red" }}>*</span>
              </InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <TextField
                label=""
                placeholder="enter customer number"
                name="name"
                size="small"
                variant="outlined"
                type="number"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mb-1">
            <Grid item sm={4} xs={12}>
              <InputLabel>
                Name<span style={{ color: "red" }}>*</span>
              </InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <TextField
                label=""
                placeholder="enter customer name"
                name="name"
                size="small"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mb-1">
            <Grid item sm={4} xs={12}>
              <InputLabel>
                Address<span style={{ color: "red" }}>*</span>
              </InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                minRows={3}
                size="small"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mb-1">
            <Grid item sm={4} xs={12}>
              <InputLabel>Courier</InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <TextField
                label=""
                placeholder=""
                size="small"
                variant="outlined"
                fullWidth
                select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
              >
                <MenuItem value="">-- select courier --</MenuItem>
                {courierOptions.length > 0 &&
                  courierOptions.map((data, idx) => (
                    <MenuItem value={data?.name.toLowerCase()} key={idx}>
                      {data?.name.toLowerCase()}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mb-1">
            <Grid item sm={4} xs={12}>
              <InputLabel>
                Payment Type<span style={{ color: "red" }}>*</span>
              </InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <TextField
                label=""
                placeholder=""
                size="small"
                variant="outlined"
                fullWidth
                select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <MenuItem value="Bkash">Bkash</MenuItem>
                <MenuItem value="Nagad">Nagad</MenuItem>
                <MenuItem value="Rocket">Rocket</MenuItem>
                <MenuItem value="Cod">COD</MenuItem>
                <MenuItem value="Bank">Bank </MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mb-1">
            <Grid item sm={4} xs={12}>
              <InputLabel>
                Location<span style={{ color: "red" }}>*</span>
              </InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <TextField
                label=""
                placeholder=""
                size="small"
                variant="outlined"
                fullWidth
                select
                value={isInsideLocation}
                onChange={(e) => setIsInsideLocation(e.target.value)}
              >
                <MenuItem value="">--select one--</MenuItem>
                <MenuItem value="inside">Inside Dhaka</MenuItem>
                <MenuItem value="outside">Outside Dhaka</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mb-1">
            <Grid item sm={4} xs={12}>
              <InputLabel>Advance Pay</InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <TextField
                label=""
                placeholder=""
                type="number"
                inputProps={{ min: 0 }}
                onKeyPress={(event) => {
                  if (event?.key === "-" || event?.key === "+") {
                    event.preventDefault();
                  }
                }}
                size="small"
                variant="outlined"
                fullWidth
                value={totalPayTk}
                onChange={(e) => {
                  if (e.target.value <= grandTotalBill) {
                    setTotalPayTk(e.target.value);
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mb-1">
            <Grid item sm={4} xs={12}>
              <InputLabel>Payment Details</InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <TextField
                label=""
                placeholder=""
                size="small"
                variant="outlined"
                fullWidth
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className="mb-0">
            <Grid item sm={4} xs={12}>
              <InputLabel>Payment Image</InputLabel>
            </Grid>
            <Grid item sm={8} xs={12}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={imageHandler}
              >
                {fileList.length >= 1 ? null : (
                  <span>
                    <Icon style={{ color: "gray" }}>
                      photo_size_select_actual
                    </Icon>
                  </span>
                )}
              </Upload>
            </Grid>
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
  );
};

export default CustomerDetails;
