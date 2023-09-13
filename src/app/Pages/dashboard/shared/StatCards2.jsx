import React from "react";
import { Grid, Card, Icon, Fab } from "@material-ui/core";
import { BsPeopleFill, BsCart4 } from "react-icons/bs";
import { FaRegMoneyBillAlt } from "react-icons/fa";

const StatCards2 = ({ dataList }) => {
  return (
    <Grid container spacing={3} className="mb-6">
      <Grid item xs={12} md={3}>
        <Card elevation={3} className="p-4">
          <div className="flex items-center">
            <Fab size="medium" className="bg-light-green circle-44 box-shadow-none">
              <BsPeopleFill className="text-green" />
            </Fab>
            <h5 className="font-medium text-green m-0 ml-3">Active Customer</h5>
          </div>
          <div className="pt-4 flex items-center">
            <h2 className="m-0 text-muted flex-grow">{dataList?.totalCustomers || 0}</h2>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card elevation={3} className="p-4">
          <div className="flex items-center">
            <Fab
              size="medium"
              className="bg-light-primary circle-44 box-shadow-none overflow-hidden"
            >
              <BsCart4 className="text-primary" />
            </Fab>
            <h5 className="font-medium text-primary m-0 ml-3">Total Products</h5>
          </div>
          <div className="pt-4 flex items-center">
            <h2 className="m-0 text-muted flex-grow">{dataList?.totalProducts || 0}</h2>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card elevation={3} className="p-4">
          <div className="flex items-center">
            <Fab size="medium" className="bg-light-secondary circle-44 box-shadow-none">
              <FaRegMoneyBillAlt className="text-secondary" />
            </Fab>
            <h5 className="font-medium text-secondary m-0 ml-3">Total Revenue</h5>
          </div>
          <div className="pt-4 flex items-center">
            <h2 className="m-0 text-muted flex-grow">{`${dataList?.totalRevenue || 0} TK`}</h2>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card elevation={3} className="p-4">
          <div className="flex items-center">
            <Fab size="medium" className="bg-light-error circle-44 box-shadow-none overflow-hidden">
              <Icon className="text-error">star_outline</Icon>
            </Fab>
            <h5 className="font-medium text-error m-0 ml-3">Total Refund</h5>
          </div>
          <div className="pt-4 flex items-center">
            <h2 className="m-0 text-muted flex-grow">{`${dataList?.totalRefund || 0} Tk`}</h2>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatCards2;
