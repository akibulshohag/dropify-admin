import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  Grid,
  TextField,
  Box,
  CircularProgress,
  CardHeader,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { notification } from "antd";
import {
  Breadcrumb,
  // RichTextEditor
} from "../../components";
import axios from "../../../axios";
import { useEffect } from "react";
import Spinner from "../../Shared/Spinner/Spinner";

import { Editor } from "@tinymce/tinymce-react";

const PageUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("aboutUs");
  const [description, setDescription] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [terms, setterms] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [returnRefund, setreturnRefund] = useState("");
  const [orderPolicy, setOrderPolicy] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [faq, setfaq] = useState("");
  const [securedPayment, setsecuredPayment] = useState("");
  const editorRef = useRef(null);

  const openNotificationWithIcon = (message, type) => {
    notification[type]({
      message,
    });
  };

  const log = () => {
    if (editorRef.current) {
      let value = editorRef.current.getContent();
      setDescription(value);
      if (currentPage === "aboutUs") {
        setAboutUs(value);
      } else if (currentPage === "terms") {
        setterms(value);
      } else if (currentPage === "privacyPolicy") {
        setPrivacyPolicy(value);
      } else if (currentPage === "returnRefund") {
        setreturnRefund(value);
      } else if (currentPage === "orderPolicy") {
        setOrderPolicy(value);
      } else if (currentPage === "shippingCharge") {
        setShippingCharge(value);
      } else if (currentPage === "securedPayment") {
        setsecuredPayment(value);
      } else if (currentPage === "faq") {
        setfaq(value);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        let res = await axios.get("/content/get-content");
        if (res?.data?.success) {
          let data = res?.data?.data;
          setDescription(data?.aboutUs);
          setAboutUs(data?.aboutUs);
          setterms(data?.terms);
          setPrivacyPolicy(data?.privacyPolicy);
          setreturnRefund(data?.returnRefund);
          setOrderPolicy(data?.orderPolicy);
          setsecuredPayment('');
          setShippingCharge(data?.shippingCharge)
          setfaq(data?.faq)
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
        pageName:currentPage,
        data:description
      };

      setIsLoading(true);
      const res = await axios.post(`/content/update-page`, obj);
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

  useEffect(() => {
    if (currentPage === "aboutUs") {
      setDescription(aboutUs);
    } else if (currentPage === "terms") {
      setDescription(terms);
    } else if (currentPage === "privacyPolicy") {
      setDescription(privacyPolicy);
    } else if (currentPage === "returnRefund") {
      setDescription(returnRefund);
    } else if (currentPage === "orderPolicy") {
      setDescription(orderPolicy);
    } else if (currentPage === "faq") {
      setDescription(faq);
    } else if (currentPage === "shippingCharge") {
      setDescription(shippingCharge);
    } else if (currentPage === "securedPayment") {
      setDescription(securedPayment);
    }
  }, [currentPage, aboutUs, privacyPolicy, terms, orderPolicy, returnRefund,faq,shippingCharge,securedPayment]);


  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: "update-pages" }]} />
      </div>

      <Grid container>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title="Update Pages" />

            {!isPageLoading ? (
              <form className="px-4 py-6" onSubmit={formSubmitHandler}>
                <Grid container spacing={3}>
                  <Grid item lg={4} xs={12}>
                    <InputLabel className="mb-2 text-black">Select Page</InputLabel>
                    <TextField
                      name=""
                      label=""
                      variant="outlined"
                      size="small"
                      fullWidth
                      select
                      value={currentPage}
                      onChange={(e) => setCurrentPage(e.target.value)}
                    >
                      <MenuItem value="aboutUs"> About Us </MenuItem>
                      <MenuItem value="terms"> Terms And Conditions </MenuItem>
                      <MenuItem value="privacyPolicy"> Privacy Policy </MenuItem>
                      <MenuItem value="returnRefund"> Return & Refund </MenuItem>
                      <MenuItem value="orderPolicy"> Order Policy </MenuItem>
                      <MenuItem value="faq"> FAQ </MenuItem>
                      <MenuItem value="securedPayment"> Secured Payment </MenuItem>
                      <MenuItem value="shippingCharge"> Shipping Charge </MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel className="mb-2 text-black">Update Page Details</InputLabel>
                    {/* <RichTextEditor
                      className="mb-4 border-none"
                      content={description}
                      handleContentChange={(content) => contentChangeHandler(content)}
                      placeholder="write here..."
                    /> */}
                    <Editor
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      onBlur={() => log()}
                      // onChange={(e) => log(e.target.value)}
                      initialValue={description}
                      // value={content}
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: ["image", "table", "searchreplace", "wordcount", "autolink"],
                        toolbar:
                          "undo redo | formatselect | " +
                          "bold italic backcolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        image_title: true,

                        automatic_uploads: true,

                        file_picker_types: "image",

                        file_picker_callback: (cb, value, meta) => {
                          const input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*");

                          input.addEventListener("change", (e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.addEventListener("load", () => {
                              const id = "blobid" + new Date().getTime();
                              const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                              const base64 = reader.result.split(",")[1];
                              const blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);

                              /* call the callback and populate the Title field with the file name */
                              cb(blobInfo.blobUri(), {
                                title: file.name,
                              });
                            });
                            reader.readAsDataURL(file);
                          });

                          input.click();
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  className="mt-8 px-12"
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

export default PageUpdate;
