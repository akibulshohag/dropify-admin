import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  Icon,
  TextField,
  Box,
  CircularProgress,
  CardHeader,
  Typography,
  InputLabel,
  FormControlLabel,
} from "@material-ui/core";
import { notification } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { Upload } from "antd";
import imageBasePath from "../../../config";
import Spinner from "../../Shared/Spinner/Spinner";
import IOSSwitch from "../../Shared/Forms/iosSwitch";
import { convertImageToBase64 } from "../../util/convertImageToBase64";

const PopupImage = () => {
  const [webSelectedFile, setWebSelectedFile] = useState();
  const [webFileList, setWebFileList] = useState([]);
  const [mobileSelectedFile, setMobileSelectedFile] = useState();
  const [mobileFileList, setMobileFileList] = useState([]);
  const [webFileError, setWebFileError] = useState("");
  const [mobileFileError, setMobileFileError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isShowWeb, setisShowWeb] = useState(false);
  const [isShowMobile, setisShowMobile] = useState(false);
  const [renderMe, setrenderMe] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get("/content/get-all-popups");
        if (res?.data?.success) {
          let data = res?.data?.data;
          setisShowWeb(data?.web?.isActive);
          setisShowMobile(data?.mobile?.isActive);
          if (data?.web?.image) {
            setWebFileList([
              {
                url: imageBasePath + "/" + data?.web?.image,
              },
            ]);
          }
          if (data?.mobile?.image) {
            setMobileFileList([
              {
                url: imageBasePath + "/" + data?.mobile?.image,
              },
            ]);
          }
        }
        setIsPageLoading(false);
      } catch (err) {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, [renderMe]);

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // if (webFileError) return;
      // if (mobileFileError) return;

      let webBaseImg = "";
      if (webSelectedFile) {
        webBaseImg = await convertImageToBase64(webSelectedFile);
      } else if (webFileList.length > 0) {
        webBaseImg = webFileList[0].url.split(imageBasePath + "/")[1];
      }

      let mobileBaseImg = "";
      if (mobileSelectedFile) {
        mobileBaseImg = await convertImageToBase64(mobileSelectedFile);
      } else if (mobileFileList.length > 0) {
        mobileBaseImg = mobileFileList[0].url.split(imageBasePath + "/")[1];
      }

      let obj = {
        data:{
          web:{
            image:webBaseImg,
            isActive:isShowWeb
          },
          mobile:{
            image:mobileBaseImg,
            isActive:isShowMobile
          }
        }
      };

      setIsLoading(true);
      const res = await axios.post(`/content/update-web-popup`, obj);
      if (res?.data?.success) {
        setWebFileError("");
        setMobileFileError("");
        setrenderMe(!renderMe)
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

  const webImageHandler = ({ fileList: newFileList }) => {
    setWebFileList(newFileList);
    if (
      newFileList[0]?.originFileObj.type === "image/jpeg" ||
      newFileList[0]?.originFileObj.type === "image/jpg" ||
      newFileList[0]?.originFileObj.type === "image/png"
    ) {
      setWebSelectedFile(newFileList[0]?.originFileObj);
      setWebFileError("");
    } else {
      setWebFileError("Image must be (jpeg, jpg or png) format!");
    }
  };

  const mobileImageHandler = ({ fileList: newFileList }) => {
    setMobileFileList(newFileList);
    if (
      newFileList[0]?.originFileObj.type === "image/jpeg" ||
      newFileList[0]?.originFileObj.type === "image/jpg" ||
      newFileList[0]?.originFileObj.type === "image/png"
    ) {
      setMobileSelectedFile(newFileList[0]?.originFileObj);
      setMobileFileError("");
    } else {
      setMobileFileError("Image must be (jpeg, jpg or png) format!");
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "PopupImage" }]} />
      </div>

      <Grid container>
        <Grid item md={6} xs={12}>
          <Card elevation={3}>
            <CardHeader title="Pop Up Images" />

            {!isPageLoading ? (
              <form className="px-4 py-6" onSubmit={formSubmitHandler}>
                <Grid container spacing={3}>
                  <Grid item sm={8} xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography className="mb-2">Image For Web (700 x 400)</Typography>
                      <Upload
                        listType="picture-card"
                        fileList={webFileList}
                        onChange={webImageHandler}
                      >
                        {webFileList.length >= 1 ? null : (
                          <span>
                            <Icon style={{ color: "gray" }}>photo_size_select_actual</Icon>
                          </span>
                        )}
                      </Upload>

                      <p style={{ color: "red" }}>
                        <small>{webFileError}</small>
                      </p>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            onClick={() => setisShowWeb(!isShowWeb)}
                            checked={isShowWeb}
                          />
                        }
                        label={isShowWeb ? `Show` : `Hide`}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography className="mb-2">Image For Mobile (300 x 300)</Typography>
                      <Upload
                        listType="picture-card"
                        fileList={mobileFileList}
                        onChange={mobileImageHandler}
                      >
                        {mobileFileList.length >= 1 ? null : (
                          <span>
                            <Icon style={{ color: "gray" }}>photo_size_select_actual</Icon>
                          </span>
                        )}
                      </Upload>

                      <p style={{ color: "red" }}>
                        <small>{mobileFileError}</small>
                      </p>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            onClick={() => setisShowMobile(!isShowMobile)}
                            checked={isShowMobile}
                          />
                        }
                        label={isShowMobile ? `Show` : `Hide`}
                      />
                    </Box>
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
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Update"}
                </Button>
              </form>
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

export default PopupImage;
