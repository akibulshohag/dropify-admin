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
} from "@material-ui/core";
import { notification } from "antd";
import { Breadcrumb } from "../../components";
import axios from "../../../axios";
import { Upload } from "antd";
import imageBasePath from "../../../config";
import Spinner from "../../Shared/Spinner/Spinner";
import { convertImageToBase64 } from "../../util/convertImageToBase64";
import { CompactPicker, SketchPicker } from "react-color";

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setinstagramLink] = useState("");
  const [address, setaddress] = useState("");
  const [youtube, setyoutube] = useState("");
  const [twitter, settwitter] = useState("");
  const [tiktok, settiktok] = useState("");
  const [fileError, setFileError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [renderMe, setrenderMe] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get("/content/site-profile");
        if (res) {
          let data = res?.data?.data;
          setEmail(data?.contact?.email);
          setPhone(data?.contact?.phone);
          setFacebookLink(data?.social?.facebook);
          setinstagramLink(data?.social?.instagram);
          setyoutube(data?.social?.youtube);
          settwitter(data?.social?.twitter);
          settiktok(data?.social?.tiktok);
          if (data?.logo) {
            setFileList([
              {
                url: imageBasePath + "/" + data?.logo,
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
      if (fileError) return;

      let baseImg = "";
      if (selectedFile) {
        baseImg = await convertImageToBase64(selectedFile);
      } else if (fileList.length > 0) {
        baseImg = fileList[0].url.split(imageBasePath + "/")[1];
      }

      let obj = {
        contact: {
          address: address,
          email: email,
          phone: phone
        },
        logo:baseImg,
        social: {
          facebook: facebookLink,
          instagram: instagramLink,
          youtube: youtube,
          twitter: twitter,
          tiktok: tiktok
        }
      };

      setIsLoading(true);
      const res = await axios.post(`/content/site-profile/update`, obj);
      if (res?.data?.success) {
        setFileError("");
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

  const imageHandler = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (
      newFileList[0]?.originFileObj.type === "image/jpeg" ||
      newFileList[0]?.originFileObj.type === "image/jpg" ||
      newFileList[0]?.originFileObj.type === "image/png"
    ) {
      setSelectedFile(newFileList[0]?.originFileObj);
      setFileError("");
    } else {
      setFileError("Image must be (jpeg, jpg or png) format!");
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "Profile" }]} />
      </div>

      <Grid container>
        <Grid item md={6} xs={12}>
          <Card elevation={3}>
            <CardHeader title="Update Site Profile" />

            {!isPageLoading ? (
              <form className="px-4 py-6" onSubmit={formSubmitHandler}>
                <Grid container spacing={3}>
                  <Grid item sm={8} xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography className="mb-2">Site Logo</Typography>
                      <Upload listType="picture-card" fileList={fileList} onChange={imageHandler}>
                        {fileList.length >= 1 ? null : (
                          <span>
                            <Icon style={{ color: "gray" }}>photo_size_select_actual</Icon>
                          </span>
                        )}
                      </Upload>

                      <p style={{ color: "red" }}>
                        <small>{fileError}</small>
                      </p>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Email</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Phone</InputLabel>
                      <TextField
                        name="name"
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 6 }}>
                      <InputLabel className="mb-2 text-black">Address</InputLabel>
                      <TextField
                        name="name"
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={address}
                        onChange={(e) => setaddress(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Facebook Link</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={facebookLink}
                        onChange={(e) => setFacebookLink(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Instagram Link</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={instagramLink}
                        onChange={(e) => setinstagramLink(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Youtube Link</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={youtube}
                        onChange={(e) => setyoutube(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Twitter Link</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={twitter}
                        onChange={(e) => settwitter(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel className="mb-2 text-black">Tiktok Link</InputLabel>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={tiktok}
                        onChange={(e) => settiktok(e.target.value)}
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

export default Profile;
