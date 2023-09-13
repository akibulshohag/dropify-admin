import React, { useState } from "react";
import { Card, Grid, Box, CardHeader, Tabs, Tab } from "@material-ui/core";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { useEffect } from "react";
import Spinner from "../../Shared/Spinner/Spinner";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`page-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {" "}
          <span dangerouslySetInnerHTML={{ __html: children }}></span>
        </Box>
      )}
    </div>
  );
}

const PageUpdate = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [aboutUs, setAboutUs] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [returned, setReturned] = useState("");
  const [orderPolicy, setOrderPolicy] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [faq, setfaq] = useState("");
  const [securedPayment, setsecuredPayment] = useState("");

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get("/content/get-content");
        if (res?.data?.success) {
          let data = res?.data?.data;
          setAboutUs(data.aboutUs);
          setTermsAndConditions(data?.terms);
          setPrivacyPolicy(data?.privacyPolicy);
          setReturned(data?.returnRefund);
          setOrderPolicy(data?.orderPolicy);
          setShippingCharge(data?.shippingCharge);
          setfaq(data?.faq);
        }
        setIsPageLoading(false);
      } catch (err) {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "pages" }]} />
      </div>

      <Grid container>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="Pages View" />

            {!isPageLoading ? (
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  height: "auto",
                }}
              >
                <Grid container>
                  <Grid item lg={2} xs={12}>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={value}
                      onChange={handleChange}
                      sx={{ borderRight: 1, borderColor: "divider" }}
                    >
                      <Tab label="About Us" id={`page-0`} />
                      <Tab label="Terms and Conditions" id={`page-1`} />
                      <Tab label="Privacy Policy" id={`page-2`} />
                      <Tab label="Returned & Refund" id={`page-3`} />
                      <Tab label="Secured Payment" id={`page-4`} />
                      <Tab label="Shipping Charge" id={`page-5`} />
                      <Tab label="FAQ" id={`page-6`} />
                      <Tab label="Order Policy" id={`page-7`} />
                    </Tabs>
                  </Grid>
                  <Grid item lg={10} xs={12}>
                    <TabPanel value={value} index={0}>
                      {aboutUs}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      {termsAndConditions}
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      {privacyPolicy}
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      {returned}
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      {securedPayment}
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                      {shippingCharge}
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                      {faq}
                    </TabPanel>
                    <TabPanel value={value} index={7}>
                      {orderPolicy}
                    </TabPanel>
                  </Grid>
                </Grid>
              </Box>
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
