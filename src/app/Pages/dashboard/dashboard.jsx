import React, { useEffect, useState } from "react";
import StatCard3 from "./shared/StatCard3";
import StatCards2 from "./shared/StatCards2";
// import ComparisonChart2 from "./shared/ComparisonChart2";
// import GaugeProgressCard from "./shared/GuageProgressCard";
// import StatCards from "./shared/StatCards";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { Box, Button, Card, Divider } from "@material-ui/core";
import axios from "../../../axios";
import Spinner from "../../Shared/Spinner/Spinner";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataList, setDataList] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let obj = {
          startTime: new Date(),
          endTime: new Date(),
        };
        let res = await axios.post(`admin/order-history`, obj);
        console.log(res);
        if (res?.data?.success) {
          console.log(res);
          setDataList(res?.data?.data);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isReset]);

  const filterHander = async () => {
    try {
      setIsLoading(true);
      let obj = {
        startTime: startTime,
        endTime: endTime,
      };
      let res = await axios.post(`admin/order-history`, obj);
      console.log(res);
      if (res?.data?.success) {
        console.log(res);
        setDataList(res?.data?.data);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="analytics m-sm-30">
      <Card className="mb-4">
        <Box
          sx={{
            borderBottom: "1px solid #F6F6F6",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            py: 3,
            px: 2,
          }}
          elevation={3}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ mr: 1 }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="min-w-188"
                    label="Start Date"
                    inputVariant="standard"
                    type="text"
                    autoOk={true}
                    variant="outlined"
                    size="small"
                    value={startTime}
                    onChange={(t) => setStartTime(t)}
                  />
                </MuiPickersUtilsProvider>
              </Box>
              <Box sx={{ mr: 1 }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="min-w-188"
                    label="End Date"
                    inputVariant="standard"
                    type="text"
                    autoOk={true}
                    variant="outlined"
                    size="small"
                    value={endTime}
                    onChange={(t) => setEndTime(t)}
                  />
                </MuiPickersUtilsProvider>
              </Box>
              <Box sx={{ my: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  className="mr-4 text-white"
                  size="small"
                  onClick={filterHander}
                >
                  Filter
                </Button>
                <Button
                  variant="contained"
                  color="muted"
                  size="small"
                  onClick={() => {
                    setIsReset(!isReset);
                    setStartTime(new Date());
                    setEndTime(new Date());
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
      {!isLoading ? (
        <>
          <StatCards2 dataList={dataList} />
          <Divider className="my-4" />
          <StatCard3 orderDataList={dataList?.orderData} />
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
    </div>
  );
};

export default DashboardPage;
